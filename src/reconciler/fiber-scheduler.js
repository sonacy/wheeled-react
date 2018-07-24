import {msToExpirationTime, NoWork, Never, Sync} from './fiber-expiration-time'
import { now } from '../scheduler'
import { AsyncMode } from './type-of-mode'
import { HostRoot, ClassComponent } from '../utils/type-of-work'
import { createWorkInProgress } from './fiber'
import ReactCurrentOwner from '../current-owner'
import { beginWork } from './fiber-begin-work'
import { Incomplete, NoEffect, PerformedWork, Placement, Update, Deletion, PlacementAndUpdate, Callback } from '../utils/type-of-side-effect'
import { completeWork } from './fiber-complete-work'
import { commitPlacement, commitLifeCycles, commitWork} from './fiber-commit-work'
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
      // TODO
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

let firstScheduledRoot = null
let lastScheduledRoot = null

let isRendering = false
let nextFlushedRoot = null
let nextFlushedExpirationTime = NoWork
let lowestPendingInteractiveExpirationTime = NoWork
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
        }
        // TODO fist root and last root and else
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

function performWork(minExpirationTime, dl) {
  deadline = dl
  findHighestPriorityRoot()
  if (deadline) {
    // TODO
  } else {
    while (nextFlushedRoot !== null &&
      nextFlushedExpirationTime !== NoWork
      && (minExpirationTime === NoWork ||
        minExpirationTime >= nextFlushedExpirationTime)) {
      performWorkOnRoot(nextFlushedRoot, nextFlushedExpirationTime, true)
      findHighestPriorityRoot()
    }
  }

  deadline = null

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
    // TODO flush async work
  }

  isRendering = false
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
    // TODO async work
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
  // TODO snapshot
}

function commitAllHostEffects() {
  while (nextEffect !== null) {
    const effectTag = nextEffect.effectTag

    // TODO contentreset
    // TODO ref

    const primaryEffectTag = effectTag & (Placement | Update | Deletion)
    switch (primaryEffectTag) {
      case Placement:
        commitPlacement(nextEffect)
        nextEffect.effectTag &= ~Placement
        break
      case PlacementAndUpdate:
        // TODO
        break
      case Update:
        const current = nextEffect.alternate
        commitWork(current, nextEffect)
        break
      case Deletion:
        // TODO
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

    // TODO ref

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
      // TODO
    }
  } else {
    // TODO
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
    // scheduleCallbackWithExpirationTime(expirationTime)
  }
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

export {requestCurrentTime, computeExpirationForFiber, scheduleWork, unbatchedUpdates, batchedUpdates, interactiveUpdates}
