import { FunctionalComponent, IndeterminateComponent, ClassComponent, HostRoot, HostComponent, HostText } from "../utils/type-of-work"
import { processUpdateQueue } from './update-queue'
import { DidCapture, NoEffect, PerformedWork } from "../utils/type-of-side-effect"
import ReactCurrentOwner from '../current-owner'
import { constructClassInstance, mountClassInstance } from './fiber-class-component'
import { shouldSetTextContent } from '../dom/dom-host-config'
import { mountChildFibers, reconcileChildFibers } from './child-fiber'

export function reconcileChildrenAtExpirationTime(
  current,
  workInProgress,
  nextChildren,
  renderExpirationTime
) {
  if (current === null) {
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderExpirationTime
    )
  } else {
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderExpirationTime
    )
  }
}

function memorizeProps(workInProgress, nextProps) {
  workInProgress.memorizedProps = nextProps
}

function memorizeState(workInProgress, nextState) {
  workInProgress.memorizedState = nextState
}

function updateClassComponent(current, workInProgress, renderExpirationTime) {
  // TODO hasContext
  let hasContext = false
  let shouldUpdate
  if (current === null) {
    if (workInProgress.stateNode === null) {
      // instance component
      constructClassInstance(
        workInProgress,
        workInProgress.pendingProps,
        renderExpirationTime
      )
      mountClassInstance(workInProgress, renderExpirationTime)
      shouldUpdate = true
    } else {
      // TODO reuse the component instance
    }
  } else {
    // TODO udpate component process
  }
  return finishClassComponent(current, workInProgress, shouldUpdate, hasContext, renderExpirationTime)
}

function finishClassComponent(current, workInProgress, shouldUpdate, hasContext, renderExpirationTime) {
  // TODO ref
  const didCaptureError = (workInProgress.effectTag & DidCapture) !== NoEffect

  if (!shouldUpdate && !didCaptureError) {
    // TODO bailout
    return
  }

  const ctor = workInProgress.type
  const instance = workInProgress.stateNode

  ReactCurrentOwner.current = workInProgress

  // TODO error

  let nextChildren = instance.render()
  // react devtool reads this flag
  workInProgress.effectTag |= PerformedWork
  if (current !== null && didCaptureError) {
    // TODO why?
  }

  reconcileChildrenAtExpirationTime(
    current,
    workInProgress,
    nextChildren,
    renderExpirationTime
  )

  memorizeState(workInProgress, instance.state)
  memorizeProps(workInProgress, instance.props)

  // TODO context provider

  return workInProgress.child
}

function updateHostRoot(current, workInProgress, renderExpirationTime) {
  // TODO pushHostRootContext
  let updateQueue = workInProgress.updateQueue
  if (updateQueue !== null) {
    const nextProps = workInProgress.pendingProps
    const prevState = workInProgress.memorizedState
    const prevChildren = prevState !== null ? prevState.element : null
    // ensure workInProgress.updateQueue !== current.updateQueue
    // run the update queue, get the result for baseState, and set effect
    processUpdateQueue(
      workInProgress,
      updateQueue,
      nextProps,
      null,
      renderExpirationTime
    )
    const nextState = workInProgress.memorizedState
    const nextChildren = nextState.element
    if (nextChildren === prevChildren) {
      // TODO bailout
    }
    reconcileChildrenAtExpirationTime(current, workInProgress, nextChildren, workInProgress.expirationTime)
    return workInProgress.child
  }
}

function updateHostComponent(current, workInProgress, renderExpirationTime) {
  // TODO context
  const type = workInProgress.type
  const memorizedProps = workInProgress.memorizedProps
  const nextProps = workInProgress.pendingProps
  const prevProps = current !== null ? current.memorizedProps : null

  // TODO contextChange or hidden

  let nextChildren = nextProps.children
  const isDirecTextChild = shouldSetTextContent(type, nextProps)

  if (isDirecTextChild) {
    // avoid anothing Text Fiber
    nextChildren = null
  }
  // TODO switching from a direct text child to a normal child, contentReset

  // TODO ref

  // TODO check for offscreen

  reconcileChildrenAtExpirationTime(
    current,
    workInProgress,
    nextChildren,
    workInProgress.expirationTime
  )
  memorizeProps(workInProgress, nextProps)
  return workInProgress.child
}

function updateHostText(current, workInProgress) {
  const nextProps = workInProgress.pendingProps
  memorizeProps(workInProgress, nextProps)
  return null
}

function beginWork(current, workInProgress, renderExpirationTime) {
  switch (workInProgress.tag) {
    case IndeterminateComponent:
      // TODO
      break
    case FunctionalComponent:
      // TODO
      break
    case ClassComponent:
      return updateClassComponent(
        current,
        workInProgress,
        renderExpirationTime
      )
      break
    case HostRoot:
      return updateHostRoot(
        current,
        workInProgress,
        renderExpirationTime
      )
      break
    case HostComponent:
      return updateHostComponent(
        current,
        workInProgress,
        renderExpirationTime
      )
      break
    case HostText:
      return updateHostText(
        current,
        workInProgress
      )
      break
    default:
      console.log('unknow tag: ', workInProgress.tag)
      break
  }
}

export { beginWork }
