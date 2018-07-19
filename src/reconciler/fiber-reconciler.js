import {createFiberRoot} from './fiber-root'
import { requestCurrentTime, computeExpirationForFiber, scheduleWork, unbatchedUpdates } from './fiber-scheduler'
import { emptyContextObjext } from './fiber-context'
import { createUpdate, enqueueUpdate } from './update-queue'
import { HostComponent } from '../utils/type-of-work';

function getContextForSubtree(parentComponent) {
  if (!parentComponent) {
    return emptyContextObjext
  }
}

function scheduleRootUpdate(current, element, expirationTime, callback) {
  const update = createUpdate(expirationTime)
  update.payload = {element}
  callback = callback === undefined ? null : callback
  if (callback !== null) update.callback = callback
  enqueueUpdate(current, update, expirationTime)
  scheduleWork(current, expirationTime)
  return expirationTime
}

export function createContainer(container, isAsync, hydrate) {
  return createFiberRoot(container, isAsync, hydrate)
}

export function getPublicRootInstance(container) {
  const containerFiber = container.current
  if (!containerFiber.child) {
    return null
  }
  return containerFiber.child.stateNode
}

export function updateContainerAtExpirationTime(element, container, parentComponent, expirationTime, callback) {
  const current = container.current
  const context = getContextForSubtree(parentComponent)
  if (container.context === null) {
    container.context = context
  } else {
    container.pendingContext = context
  }
  return scheduleRootUpdate(current, element, expirationTime, callback)
}

export function updateContainer(element, container, parentComponent, callback) {
  const current = container.current
  const currentTime = requestCurrentTime()
  const expirationTime = computeExpirationForFiber(currentTime, current)
  return updateContainerAtExpirationTime(element, container, parentComponent, expirationTime, callback)
}

export {
  unbatchedUpdates
}
