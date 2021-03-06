import {msToExpirationTime, NoWork, Never, Sync, computeAsyncExpiration, computeInteractiveExpiration, expirationTimeToMs} from './fiber-expiration-time'
import { now } from '../scheduler'
import { AsyncMode } from './type-of-mode'
import { HostRoot, ClassComponent } from '../utils/type-of-work'
import { createWorkInProgress } from './fiber'
import ReactCurrentOwner from '../current-owner'
import { beginWork } from './fiber-begin-work'
import { Incomplete, NoEffect, PerformedWork, Placement, Update, Deletion, PlacementAndUpdate, Callback, Snapshot, Ref } from '../utils/type-of-side-effect'
import { completeWork } from './fiber-complete-work'
import { commitPlacement, commitLifeCycles, commitWork, commitDeletion, commitAttachRef, commitDetachRef} from './fiber-commit-work'
import { markPendingPriorityLevel, markCommittedPriorityLevels } from './fiber-pending-priority'

let expirationContext = NoWork

let isWorking = false
let nextUnitOfWork = null
let nextRoot = null
let nextRenderExpirationTime = NoWork
let isCommitting = false
let nextEffect = null

function scheduleWorkToRoot(fiber, expirationTime) {
  // update expirationTime
  let node = fiber
  do {
    const alternate = node.alternate
    if (node.expirationTime === NoWork || node.expirationTime > expirationTime) {
      node.expirationTime = expirationTime
      if (alternate !== null && (alternate.expirationTime === NoWork || alternate.expirationTime > expirationTime)) {
        alternate.expirationTime = expirationTime
      }
    } else if (alternate !== null && (alternate.expirationTime === NoWork || alternate.expirationTime > expirationTime)) {
      alternate.expirationTime = expirationTime
    }
    if (node.return === null && node.tag === HostRoot) {
      return node.stateNode
    }
    node = node.return
  } while (node !== null)
  return null
}

function computeExpirationForFiber(currentTime, fiber) {
  let expirationTime
  if (expirationContext !== NoWork) {
    expirationTime = expirationContext
  } else if (isWorking) {
    if (isCommitting) {
      expirationTime = Sync
    } else {
      expirationTime = nextRenderExpirationTime
    }
  } else {
    if (fiber.mode & AsyncMode) {
      if (isBatchingInteractiveUpdates) {
        expirationTime = computeInteractiveExpiration(currentTime)
      } else {
        expirationTime = computeAsyncExpiration(currentTime)
      }

      if (nextRoot !== null && expirationTime === nextRenderExpirationTime) {
        expirationTime += 1
      }
    } else {
      expirationTime = Sync
    }
  }

  if (isBatchingInteractiveUpdates) {
    if (lowestPendingInteractiveExpirationTime === NoWork || expirationTime > lowestPendingInteractiveExpirationTime) {
      lowestPendingInteractiveExpirationTime = expirationTime
    }
  }

  return expirationTime
}

function scheduleWork(fiber, expirationTime) {
  const root = scheduleWorkToRoot(fiber, expirationTime)
  if (root === null) return
  if (!isWorking && nextRenderExpirationTime !== NoWork && expirationTime < nextRenderExpirationTime) {
    resetStack()
  }
  markPendingPriorityLevel(root, expirationTime)
  if (!isWorking || isCommitting || nextRoot !== root) {
    const rootExpirationTime = root.expirationTime
    requestWork(root, rootExpirationTime)
  }
  if (nestedUpdateCount > NESTED_UPDATE_LIMIT) {
    nestedUpdateCount = 0
    console.warn('Maximum update depth exceeded.')
  }
}

function deferredUpdates(fn) {
  const currentTime = requestCurrentTime()
  const previousExpirationContext = expirationContext
  expirationContext = computeAsyncExpiration(currentTime)
  try {
    return fn()
  } finally {
    expirationContext = previousExpirationContext
  }
}

function syncUpdates(fn, a, b, c, d) {
  const previousExpirationContext = expirationContext
  expirationContext = Sync
  try {
    return fn(a, b, c, d)
  } finally {
    expirationContext = previousExpirationContext
  }
}

let firstScheduledRoot = null
let lastScheduledRoot = null

let callbackExpirationTime = NoWork
let callbackID

let isRendering = false
let nextFlushedRoot = null
let nextFlushedExpirationTime = NoWork
let lowestPendingInteractiveExpirationTime = NoWork
let deadlineDidExpire = false
let deadline = null

let isBatchingUpdates = false
let isUnbatchingUpdates = false
let isBatchingInteractiveUpdates = false

let originalStartTimeMs = now()
let currentRendererTime = msToExpirationTime(originalStartTimeMs)
let currentSchedulerTime = currentRendererTime

let nextLatestAbsoluteTimeoutMs = -1
let nextRenderDidError = false

const NESTED_UPDATE_LIMIT = 50
let nestedUpdateCount = 0

let lastCommittedRootDuringThisBatch = null

function recomputeCurrentRenderedTimer() {
  const currentTimeMs = now() - originalStartTimeMs
  currentRendererTime = msToExpirationTime(currentTimeMs)
}

function requestCurrentTime() {
  if (isRendering) {
    return currentSchedulerTime
  }
  findHighestPriorityRoot()
  if (nextFlushedExpirationTime === NoWork || nextFlushedExpirationTime === Never) {
    recomputeCurrentRenderedTimer()
    currentSchedulerTime = currentRendererTime
    return currentSchedulerTime
  }

  return currentSchedulerTime
}

function findHighestPriorityRoot() {
  let highestPriorityWork = NoWork
  let highestPriorityRoot = null

  if (lastScheduledRoot !== null) {
    let previousScheduledRoot = lastScheduledRoot
    let root = firstScheduledRoot
    while (root !== null) {
      const remainingExpirationTime = root.expirationTime
      if (remainingExpirationTime === NoWork) {
        // this root has no work , remove it from schedule
        if (root === root.nextScheduledRoot) {
          // only root from the list
          root.nextScheduledRoot = null
          firstScheduledRoot = lastScheduledRoot = null
          break
        } else if (root = firstScheduledRoot) {
          const next = root.nextScheduledRoot
          firstScheduledRoot = next
          lastScheduledRoot.nextScheduledRoot = next
          root.nextScheduledRoot = null
        } else if (root === lastScheduledRoot) {
          lastScheduledRoot = previousScheduledRoot
          lastScheduledRoot.nextScheduledRoot = firstScheduledRoot
          root.nextScheduledRoot = null
          break
        } else {
          previousScheduledRoot.nextScheduledRoot = root.nextScheduledRoot
          root.nextScheduledRoot = null
        }
      } else {
        if (highestPriorityWork === NoWork || remainingExpirationTime < highestPriorityWork) {
          highestPriorityRoot = root
          highestPriorityWork = remainingExpirationTime
        }
        if (root === lastScheduledRoot) {
          break
        }
        previousScheduledRoot = root
        root = root.nextScheduledRoot
      }
    }
  }

  nextFlushedRoot = highestPriorityRoot
  nextFlushedExpirationTime = highestPriorityWork
}

function performSyncWork() {

  performWork(Sync, null)
}

function performAsyncWork(dl) {
<<<<<<< HEAD

=======
>>>>>>> 451173ab52ba8ece61e5647cd7e8eaa2f550666b
  performWork(NoWork, dl)
}

function performWork(minExpirationTime, dl) {
  deadline = dl
  findHighestPriorityRoot()
  if (deadline !== null) {
    recomputeCurrentRenderedTimer()
    currentSchedulerTime = currentRendererTime

    while (
      nextFlushedRoot !== null &&
      nextFlushedExpirationTime !== NoWork &&
      (minExpirationTime === NoWork || minExpirationTime >= nextFlushedExpirationTime) &&
      (!deadlineDidExpire || currentRendererTime >= nextFlushedExpirationTime)
    ) {
      performWorkOnRoot(
        nextFlushedRoot,
        nextFlushedExpirationTime,
        currentRendererTime >= nextFlushedExpirationTime
      )
      findHighestPriorityRoot()
      recomputeCurrentRenderedTimer()
      currentSchedulerTime = currentRendererTime
    }
  } else {
    while (nextFlushedRoot !== null &&
      nextFlushedExpirationTime !== NoWork
      && (minExpirationTime === NoWork ||
        minExpirationTime >= nextFlushedExpirationTime)) {
      performWorkOnRoot(nextFlushedRoot, nextFlushedExpirationTime, true)
      findHighestPriorityRoot()
    }
  }

  if (deadline !== null) {
    callbackExpirationTime = NoWork
    callbackID = null
  }

  if (nextFlushedExpirationTime !== NoWork) {
    scheduleCallbackWithExpirationTime(nextFlushedExpirationTime)
  }

  deadline = null
  deadlineDidExpire = false

  finishRendering()
}

function finishRendering() {
  nestedUpdateCount = 0
  lastCommittedRootDuringThisBatch = null
  // TODO batches and unHandled error
}

function performWorkOnRoot(root, expirationTime, isExpired) {
  isRendering = true
  if (deadline === null || isExpired) {
    let finishedWork = root.finishedWork
    if (finishedWork !== null) {
      completeRoot(root, finishedWork, expirationTime)
    } else {
      root.finishedWork = null
      // TODO if this root suspended before, clear timeout
      renderRoot(root, false, isExpired)
      finishedWork = root.finishedWork
      if (finishedWork !== null) {
        // commit
        completeRoot(root, finishedWork, expirationTime)
      }
    }
  } else {
    let finishedWork = root.finishedWork
    if (finishedWork !== null) {
      completeRoot(root, finishedWork, expirationTime)
    } else {
      root.finishedWork = null

      // TODO suspend ,clear timeout

      renderRoot(root, true, isExpired)
      finishedWork = root.finishedWork
      if (finishedWork !== null) {
        if (!shouldYield()) {
          completeRoot(root, finishedWork, expirationTime)
        } else {
          root.finishedWork = finishedWork
        }
      }
    }
  }

  isRendering = false
}

function shouldYield() {
  if (deadlineDidExpire) {
    return true
  }

  if (deadline === null || deadline.timeRemaining() > 1) {
    return false
  }

  deadlineDidExpire = true
  return true
}

function resetStack() {
  if (nextUnitOfWork !== null) {
    // TODO interuped work
  }

  nextRoot = null
  nextRenderExpirationTime = NoWork
  nextLatestAbsoluteTimeoutMs = -1
  nextRenderDidError = false
  nextUnitOfWork = null
}

function renderRoot(root, isYieldy, isExpired) {
  isWorking = true
  const expirationTime = root.nextExpirationTimeToWorkOn
  if (expirationTime !== nextRenderExpirationTime || root !== nextRoot || nextUnitOfWork === null) {
    resetStack()
    nextRoot = root
    nextRenderExpirationTime = expirationTime
    nextUnitOfWork = createWorkInProgress(
      nextRoot.current,
      null,
      nextRenderExpirationTime
    )
    root.pendingCommitExpirationTime = NoWork
  }

  do {
    try {
      workLoop(isYieldy)
    } catch (e) {
      // TODO fatal
      console.log(e)
      nestedUpdateCount++
    }
    break
  } while (true)

  // TODO didFatal

  if (nextUnitOfWork !== null) {
    // TODO still remaining work
  }

  const didCompleteRoot = true
  nextRoot = null
  root.pendingCommitExpirationTime = expirationTime
  root.finishedWork = root.current.alternate
}

function workLoop(isYieldy) {
  if (!isYieldy) {
    while (nextUnitOfWork !== null) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    }
  } else {
    while (nextUnitOfWork !== null && !shouldYield()) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    }
  }
}

function performUnitOfWork(workInProgress) {
  const current = workInProgress.alternate
  let next = beginWork(current, workInProgress, nextRenderExpirationTime)
  if (next === null) {
    next = completeUnitOfWork(workInProgress)
  }
  ReactCurrentOwner.current = null
  return next
}

function completeUnitOfWork(workInProgress) {
  while (true) {
    const current = workInProgress.alternate
    const returnFiber = workInProgress.return
    const siblingFiber = workInProgress.sibling

    if ((workInProgress.effectTag & Incomplete) === NoEffect) {
      let next = completeWork(
        current,
        workInProgress,
        nextRenderExpirationTime
      )
      resetExpirationTime(workInProgress, nextRenderExpirationTime)
      if (next !== null) return next
      // why
      if (returnFiber !== null && (returnFiber.effectTag & Incomplete) === NoEffect) {
        if (returnFiber.firstEffect === null) {
          returnFiber.firstEffect = workInProgress.firstEffect
        }
        if (workInProgress.lastEffect !== null) {
          if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = workInProgress.firstEffect
          }
          returnFiber.lastEffect = workInProgress.lastEffect
        }

        // why
        const effectTag = workInProgress.effectTag
        if (effectTag > PerformedWork) {
          if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = workInProgress
          } else {
            returnFiber.firstEffect = workInProgress
          }
          returnFiber.lastEffect = workInProgress
        }
      }

      if (siblingFiber !== null) {
        return siblingFiber
      } else if (returnFiber !== null) {
        workInProgress = returnFiber
        continue
      } else {
        return null
      }
    } else {
      // TODO async cause unCompleted effects
    }
  }
  return null
}

function resetExpirationTime(workInProgress, renderTime) {
  if (renderTime !== Never && workInProgress.expirationTime === Never) return
  let newExpirationTime = NoWork
  switch (workInProgress.tag) {
    case HostRoot:
    case ClassComponent:
      const updateQueue = workInProgress.updateQueue
      if (updateQueue !== null) {
        newExpirationTime = updateQueue.expirationTime
      }
  }

  let child = workInProgress.child
  while (child !== null) {
    if (child.expirationTime !== NoWork && (newExpirationTime === NoWork || newExpirationTime > child.expirationTime)) {
      newExpirationTime = child.expirationTime
    }
    child = child.sibling
  }

  workInProgress.expirationTime = newExpirationTime
}

function completeRoot(root, finishedWork, expirationTime) {
  // TODO async batch

  root.finishedWork = null
  if (root === lastCommittedRootDuringThisBatch) {
    nestedUpdateCount++
  } else {
    lastCommittedRootDuringThisBatch = root
    nestedUpdateCount = 0
  }

  commitRoot(root, finishedWork)
}

function commitBeforeMutationLifecycles() {
  while (nextEffect !== null) {
    const effectTag = nextEffect.effectTag
    if (effectTag & Snapshot) {
      const current = nextEffect.alternate
      commitBeforeMutationLifeCycles(current, nextEffect)
    }
    nextEffect = nextEffect.nextEffect
  }
}

function commitBeforeMutationLifeCycles(current, finishedWork) {
  switch (finishedWork.tag) {
    case ClassComponent: {
      const prevProps = current.memorizedProps
      const prevState = current.memorizedState
      const instance = finishedWork.stateNode
      instance.props = finishedWork.memorizedProps
      instance.state = finishedWork.memorizedState
      const snapshot = instance.getSnapshotBeforeUpdate(
        prevProps,
        prevState
      )
      instance.__reactInternalSnapshotBeforeUpdate = snapshot
      return
    }
  }
}

function commitAllHostEffects() {
  while (nextEffect !== null) {
    const effectTag = nextEffect.effectTag

    // TODO contentreset

    if (effectTag & Ref) {
      const current = nextEffect.alternate
      if (current !== null) {
        commitDetachRef(current)
      }
    }

    const primaryEffectTag = effectTag & (Placement | Update | Deletion)
    switch (primaryEffectTag) {
      case Placement:
        commitPlacement(nextEffect)
        nextEffect.effectTag &= ~Placement
        break
      case PlacementAndUpdate:
        commitPlacement(nextEffect)
        nextEffect.effectTag &= ~Placement
        let current = nextEffect.alternate
        commitWork(current, nextEffect)
        break
      case Update:
        current = nextEffect.alternate
        commitWork(current, nextEffect)
        break
      case Deletion:
        commitDeletion(nextEffect)
        break
    }

    nextEffect = nextEffect.nextEffect
  }
}

function commitAllLifeCycles(finishedRoot, committedExpirationTime) {
  while (nextEffect !== null) {
    const effectTag = nextEffect.effectTag
    if (effectTag & (Update | Callback)) {
      const current = nextEffect.alternate
      commitLifeCycles(
        finishedRoot,
        current,
        nextEffect,
        committedExpirationTime
      )
    }

    if (effectTag & Ref) {
      commitAttachRef(nextEffect)
    }

    const next = nextEffect.nextEffect
    nextEffect.nextEffect = null
    nextEffect = next
  }
}

function commitRoot(root, finishedWork) {
  isWorking = true
  isCommitting = true

  const committedExpirationTime = root.pendingCommitExpirationTime
  root.pendingCommitExpirationTime = NoWork
  const earliestRemainingTime = finishedWork.expirationTime
  markCommittedPriorityLevels(root, earliestRemainingTime)

  ReactCurrentOwner.current = null

  let firstEffect
  if (finishedWork.effectTag > PerformedWork) {
    if (finishedWork.lastEffect !== null) {
      finishedWork.lastEffect.nextEffect = finishedWork
      firstEffect = finishedWork.firstEffect
    } else {
      firstEffect = finishedWork
    }
  } else {
    firstEffect = finishedWork.firstEffect
  }

  // TODO prepare save selection state

  // Invoke instances of getSnapshotBeforeUpdate before mutation
  nextEffect = firstEffect
  while (nextEffect !== null) {
    let didError = false
    let error
    try {
      commitBeforeMutationLifecycles()
    } catch (e) {
      didError = true
      error = e
    }

    if (didError) {
      // TODO error
    }
  }

  // Commit all the side-effects within a tree. We'll do this in two passes.
  nextEffect = firstEffect
  while (nextEffect !== null) {
    let didError = false
    let error
    try {
      commitAllHostEffects()
    } catch (e) {
      didError = true
      error = e
    }

    if (didError) {
      // TODO error
    }
  }

  // TODO reset  restore selection state

  // set workInProgress to current
  root.current = finishedWork

  // perform all life-cycles and ref callbacks.
  nextEffect = firstEffect
  while (nextEffect !== null) {
    let didError = false
    let error
    try {
      commitAllLifeCycles(root, committedExpirationTime)
    } catch (e) {
      didError = true
      error = e
    }

    if (didError) {
      // TODO error
    }
  }

  isCommitting = false
  isWorking = false

  // TODO onCommitRoot for react dev tool

  // TODO error boundary
}

function addRootToSchedule(root, expirationTime) {
  if (root.nextScheduledRoot === null) {
    root.expirationTime = expirationTime
    if (lastScheduledRoot === null) {
      firstScheduledRoot = lastScheduledRoot = root
      root.nextScheduledRoot = root
    } else {
      lastScheduledRoot.nextScheduledRoot = root
      lastScheduledRoot = root
      lastScheduledRoot.nextScheduledRoot = firstScheduledRoot
    }
  } else {
    const remainingExpirationTime = root.expirationTime
    if (remainingExpirationTime === NoWork || expirationTime < remainingExpirationTime) {
      root.expirationTime = expirationTime
    }
  }
}

function requestWork(root, expirationTime) {
  addRootToSchedule(root, expirationTime)
  if (isRendering) return
  if (isBatchingUpdates) {
    if (isUnbatchingUpdates) {
      // ensure sync update
      nextFlushedRoot = root
      nextFlushedExpirationTime = Sync
      // TODO performWorkOnRoot(root, Sync, true)
    }
    return
  }

  if (expirationTime === Sync) {
    performSyncWork()
  } else {
    scheduleCallbackWithExpirationTime(expirationTime)
<<<<<<< HEAD
=======
  }
}

function scheduleCallbackWithExpirationTime(expirationTime) {
  if (callbackExpirationTime !== NoWork) {
    if (expirationTime > callbackExpirationTime) {
      return
    } else {
      if (callbackID !== null) {
        cancelIdleCallback(callbackID)
      }
    }
>>>>>>> 451173ab52ba8ece61e5647cd7e8eaa2f550666b
  }

  callbackExpirationTime = expirationTime
  const currentMs = now() - originalStartTimeMs
  const expirationTimeMs = expirationTimeToMs(expirationTime)
  const timeout = expirationTimeMs - currentMs
  callbackID = requestIdleCallback(performAsyncWork, { timeout })
}

function scheduleCallbackWithExpirationTime(expirationTime) {
  if (callbackExpirationTime !== NoWork) {
    if (expirationTime > callbackExpirationTime) {
      return
    } else {
      if (callbackID !== null) {
        cancelIdleCallback(callbackID)
      }
    }
  }

  callbackExpirationTime = expirationTime
  const currentMs = now() - originalStartTimeMs
  const expirationTimeMs = expirationTimeToMs(expirationTime)
  const timeout = expirationTimeMs - currentMs
  callbackID = requestIdleCallback(performAsyncWork, { timeout })
}

function unbatchedUpdates(fn, a) {
  if (isBatchingUpdates && !isUnbatchingUpdates) {
    isUnbatchingUpdates = true
    try {
      return fn(a)
    } finally {
      isUnbatchingUpdates = false
    }
  }
  return fn(a)
}

function batchedUpdates(fn, a) {
  const previousIsBatchingUpdates = isBatchingUpdates
  isBatchingUpdates = true
  try {
    return fn(a)
  } finally {
    isBatchingUpdates = previousIsBatchingUpdates
    if (!isBatchingUpdates && !isRendering) {
      performSyncWork()
    }
  }
}

function interactiveUpdates(fn, a, b) {
  if (isBatchingInteractiveUpdates) {
    return fn(a, b)
  }

  if (!isBatchingUpdates && !isRendering && lowestPendingInteractiveExpirationTime !== NoWork) {
    performWork(lowestPendingInteractiveExpirationTime, null)
    lowestPendingInteractiveExpirationTime = NoWork
  }

  const previousIsBatchingInteractiveUpdates = isBatchingInteractiveUpdates
  const previousIsBatchingUpdates = isBatchingUpdates
  isBatchingInteractiveUpdates = true
  isBatchingUpdates = true

  try {
    return fn(a, b)
  } finally {
    isBatchingInteractiveUpdates = previousIsBatchingInteractiveUpdates
    isBatchingUpdates = previousIsBatchingUpdates
    if (!isBatchingUpdates && !isRendering) {
      performSyncWork()
    }
  }
}

function flushSync(fn, a) {
  const previousIsBatchingUpdates = isBatchingUpdates
  isBatchingUpdates = true
  try {
    return syncUpdates(fn, a)
  } finally {
    isBatchingUpdates = previousIsBatchingUpdates
    performSyncWork()
  }
}

function flushInteractiveUpdates() {
  if (!isRendering && lowestPendingInteractiveExpirationTime !== NoWork) {
    performWork(lowestPendingInteractiveExpirationTime, null)
    lowestPendingInteractiveExpirationTime = NoWork
  }
}

function flushControlled(fn) {
  const previousIsBatchingUpdates = isBatchingUpdates
  isBatchingUpdates = true
  try {
    syncUpdates(fn, a)
  } finally {
    isBatchingUpdates = previousIsBatchingUpdates
    if (!isRendering && !isBatchingUpdates) {
      performWork(Sync, null)
    }
  }
}

export {requestCurrentTime, computeExpirationForFiber, scheduleWork, unbatchedUpdates, batchedUpdates, interactiveUpdates, deferredUpdates, syncUpdates, flushSync, flushInteractiveUpdates, flushControlled}
