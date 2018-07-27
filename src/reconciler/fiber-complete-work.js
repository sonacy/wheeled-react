import { FunctionalComponent, ClassComponent, HostRoot, HostComponent, HostText, HostPortal } from "../utils/type-of-work"
import { createTextInstance, createInstance, appendInitialChild, finalizeInitialChildren } from '../dom/dom-host-config'
import { diffProperties } from "../dom/dom-fiber-component";
import { Update } from "../utils/type-of-side-effect";

function appendAllChildren(parent, workInProgress) {
  let node = workInProgress.child
  while (node !== null) {
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(parent, node.stateNode)
    } else if (node.tag === HostPortal) {

    } else if (node.child !== null) {
      node.child.return = node
      node = node.child
      continue
    }

    if (node === workInProgress) return
    while (node.sibling === null) {
      if (node.return === null || node.return === workInProgress) return
      node = node.return
    }
    node.sibling.return = node.return
    node = node.sibling
  }
}

let updateHostComponent = function(
  current,
  workInProgress,
  updatePayload,
  type,
  oldProps,
  newProps
) {
  workInProgress.updateQueue = updatePayload
  if (updatePayload) {
    workInProgress.effectTag |= Update
  }
}

function markUpdate(workInProgress) {
  workInProgress.effectTag |= Update
}

export function completeWork(current, workInProgress, renderExpirationTime) {
  const newProps = workInProgress.pendingProps
  switch (workInProgress.tag) {
    case FunctionalComponent:
      break
    case ClassComponent:
      // TODO context provider
      break
    case HostRoot:
      // TODO pop context
      break
    case HostComponent:
      // TODO context
      const type = workInProgress.type
      if (current && workInProgress.stateNode != null) {
        const oldProps = current.memorizedProps
        const instance = workInProgress.stateNode
        // TODO context
        const updatePayload = diffProperties(instance, type, oldProps, newProps)
        updateHostComponent(
          current,
          workInProgress,
          updatePayload,
          type,
          oldProps,
          newProps
        )
        // TODO ref
      } else {
        let instance = createInstance(
          type,
          newProps,
          workInProgress
        )

        appendAllChildren(instance, workInProgress)

        if (finalizeInitialChildren(instance, type, newProps)) {
          markUpdate(workInProgress)
        }
        workInProgress.stateNode = instance
        // TODO ref
      }
      break
    case HostText:
      let newText = newProps
      if (current && workInProgress.stateNode != null) {
        // TODO compare
      } else {
        workInProgress.stateNode = createTextInstance(
          newText,
          workInProgress
        )
      }
      break
    // TODO others
    default:
      console.log('likely a bug, ', workInProgress)
  }
  return null
}
