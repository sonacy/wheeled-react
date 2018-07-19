import {NoEffect} from '../utils/type-of-side-effect'
import {NoWork} from './fiber-expiration-time'
import {HostRoot, HostText, ClassComponent, IndeterminateComponent, HostComponent} from '../utils/type-of-work'
import {AsyncMode, StrictMode, NoContext} from './type-of-mode'

class FiberNode {
  constructor(tag, pendingProps, key, mode) {
    // instance
    this.tag = tag
    this.key = key
    this.type = null
    this.stateNode = null

    // fiber
    this.return = null
    this.child = null
    this.sibling = null
    this.index = 0

    this.ref = null

    this.pendingProps = pendingProps
    this.memorizedProps = null
    this.updateQueue = null
    this.memorizedState = null

    this.mode = mode

    // effects
    this.effectTag = NoEffect
    this.nextEffect = null

    this.firstEffect = null
    this.lastEffect = null

    this.expirationTime = NoWork

    this.alternate = null
  }
}

const createFiber = function(tag, pendingProps, key, mode) {
  return new FiberNode(tag, pendingProps, key, mode)
}

export const createHostRootFiber = (isAsync) => {
  let mode = isAsync ? AsyncMode | StrictMode : NoContext
  return createFiber(HostRoot, null, null, mode)
}

export function createWorkInProgress(current, pendingProps, expirationTime) {
  let workInProgress = current.alternate
  if (workInProgress === null) {
    workInProgress = createFiber(current.tag, pendingProps, current.key, current.mode)
    workInProgress.type = current.type
    workInProgress.stateNode = current.stateNode
    workInProgress.alternate = current
    current.alternate = workInProgress
  } else {
    workInProgress.pendingProps = pendingProps
    workInProgress.effectTag = NoEffect
    workInProgress.nextEffect = null
    workInProgress.lastEffect = null
    workInProgress.firstEffect = null
  }

  workInProgress.child = current.child
  workInProgress.memorizedProps = current.memorizedProps
  workInProgress.memorizedState = current.memorizedState
  workInProgress.updateQueue = current.updateQueue
  workInProgress.sibling = current.sibling
  workInProgress.index = current.index
  workInProgress.ref = current.ref

  return workInProgress
}

function shouldConstruct(Component) {
  return !!(Component.prototype && Component.prototype.isReactComponent)
}

export function createFiberFromText(content, mode, expirationTime) {
  const fiber = createFiber(HostText, content, null, mode)
  fiber.expirationTime = expirationTime
  return fiber
}

export function createFiberFromElement(element, mode, expirationTime) {
  let fiber
  const type =element.type
  const key = element.key
  let pendingProps = element.props

  let fiberTag
  if (typeof type === 'function') {
    // component
    fiberTag = shouldConstruct(type) ? ClassComponent : IndeterminateComponent
  } else if (typeof type === 'string') {
    fiberTag = HostComponent
  }

  // TODO frament and so on

  fiber = createFiber(fiberTag, pendingProps, key, mode)
  fiber.type = type
  fiber.expirationTime = expirationTime
  return fiber
}
