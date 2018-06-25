import {NoEffect} from '../utils/type-of-side-effect'
import {NoWork} from './fiber-expiration-time'
import {HostRoot} from '../utils/type-of-work'
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
    this.udpateQueue = null
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

export const createHostRootFiber(isAsync) {
  let mode = isAsync ? AsyncMode | StrictMode : NoContext
  return createFiber(HostRoot, null, null, mode)
}
