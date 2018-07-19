import { NoWork } from "./fiber-expiration-time"
import { Callback } from "../utils/type-of-side-effect"

export const UpdateState = 0
export const ReplaceState = 1
export const ForceUpdate = 2
export const CaptureUpdate = 3

export function createUpdateQueue(baseState) {
  const queue = {
    expirationTime: NoWork,
    baseState,
    firstUpdate: null,
    lastUpdate: null,
    firstCaptureUpdate: null,
    lastCaptureUpdate: null,
    firstEffect: null,
    lastEffect: null,
    firstCaptureEffect: null,
    lastCaptureEffect: null,
  }
  return queue
}

function cloneUpdateQueue(currentQueue) {
  const queue = {
    expirationTime: currentQueue.expirationTime,
    baseState: currentQueue.baseState,
    firstUpdate: currentQueue.firstUpdate,
    lastUpdate: currentQueue.lastUpdate,
    firstCaptureUpdate: null,
    lastCaptureUpdate: null,
    firstEffect: null,
    lastEffect: null,
    firstCaptureEffect: null,
    lastCaptureEffect: null,
  }
  return queue
}

function appendUpdateToQueue(queue, update, expirationTime) {
  if (queue.lastUpdate === null) {
    queue.firstUpdate = queue.lastUpdate = update
  } else {
    queue.lastUpdate.next = update
    queue.lastUpdate = update
  }

  if (queue.expirationTime === NoWork || queue.expirationTime > expirationTime) {
    queue.expirationTime = expirationTime
  }
}

export function createUpdate(expirationTime) {
  return {
    expirationTime,
    tag: UpdateState,
    payload: null,
    callback: null,
    next: null,
    nextEffect: null
  }
}

export function enqueueUpdate(fiber, update, expirationTime) {
  const alternate = fiber.alternate
  let queue1
  let queue2
  if (alternate === null) {
    queue1 = fiber.updateQueue
    queue2 = null
    if (queue1 === null) {
      queue1 = fiber.updateQueue = createUpdateQueue(fiber.memorizedState)
    }
  } else {
    // two fibers
    queue1 = fiber.updateQueue
    queue2 = alternate.updateQueue
    if (queue1 === null) {
      if (queue2 === null) {
        queue1 = fiber.updateQueue = createUpdateQueue(fiber.memorizedState)
        queue2 = alternate.updateQueue = createUpdateQueue(alternate.memorizedState)
      } else {
        queue1 = fiber.updateQueue = cloneUpdateQueue(queue2)
      }
    } else {
      if (queue2 === null) {
        queue2 = fiber.updateQueue = cloneUpdateQueue(queue1)
      } else {
        // both hava an update queue
      }
    }
  }

  if (queue2 === null || queue1 === queue2) {
    appendUpdateToQueue(queue1, update, expirationTime)
  } else {
    if (queue1.lastUpdate === null || queue2.lastUpdate === null) {
      appendUpdateToQueue(queue1, update, expirationTime)
      appendUpdateToQueue(queue2, update, expirationTime)
    } else {
      appendUpdateToQueue(queue1, update, expirationTime)
      queue2.lastUpdate = update
    }
  }
}

function ensureWorkInProgressQueueIsAClone(workInProgress, queue) {
  const current = workInProgress.alternate
  if (current !== null) {
    if (queue === current.updateQueue) {
      queue = workInProgress.updateQueue = cloneUpdateQueue(queue)
    }
  }
  return queue
}

function getStateFromUpdate(workInProgress, queue, update, prevState, nextProps, instance) {
  switch (update.tag) {
    case ReplaceState:
      // TODO
      break
    case CaptureUpdate:
      // TODO
      break
    case UpdateState:
      const payload = update.payload
      let partialState
      if (typeof payload === 'function') {
        partialState = payload.call(instance, prevState, nextProps)
      } else {
        partialState = payload
      }
      if (partialState === null || partialState === undefined) return prevState
      return Object.assign({}, prevState, partialState)
      break
    case ForceUpdate:
      // TODO
      break
    default:
      return prevState
      break
  }
}

export function processUpdateQueue(
  workInProgress,
  queue,
  props,
  instance,
  renderExpirationTime
) {
  // TODO hasForceUpdate = false

  if (queue.expirationTime === NoWork || queue.expirationTime > renderExpirationTime) {
    return
  }

  queue = ensureWorkInProgressQueueIsAClone(workInProgress, queue)

  let newBaseState = queue.baseState
  let newFirstUpdate = null
  let newExpirationTime = NoWork

  let update = queue.firstUpdate
  let resultState = newBaseState

  while (update !== null) {
    const updateExpirationTime = update.expirationTime
    if (updateExpirationTime > renderExpirationTime) {
      // TODO no sufficient priority , skip this update
    } else {
      resultState = getStateFromUpdate(
        workInProgress,
        queue,
        update,
        resultState,
        props,
        instance
      )
      const callback = update.callback
      if (callback !== null) {
        workInProgress.effectTag |= Callback
        update.nextEffect = null
        if (queue.lastEffect === null) {
          queue.firstEffect = queue.lastEffect = update
        } else {
          // ????
          queue.lastEffect.nextEffect = update
          queue.lastEffect = update
        }
      }
    }
    update = update.next
  }

  // TODO capture update
  let newFirstCapturedUpdate = null

  if (newFirstUpdate === null) {
    queue.lastUpdate = null
  }
  if (newFirstCapturedUpdate === null) {
    queue.firstCaptureUpdate = null
  } else {
    workInProgress.effectTag |= Callback
  }
  if (newFirstUpdate === null && newFirstCapturedUpdate === null) {
    newBaseState = resultState
  }
  queue.baseState = newBaseState
  queue.firstUpdate = newFirstUpdate
  queue.firstCaptureEffect = newFirstCapturedUpdate
  queue.expirationTime = newExpirationTime
  workInProgress.memorizedState = resultState
}
