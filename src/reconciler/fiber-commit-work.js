import { HostComponent, HostRoot, HostPortal, HostText, ClassComponent } from "../utils/type-of-work"
import { commitUpdate, commitMount } from "../dom/dom-host-config";
import { Update } from "../utils/type-of-side-effect";

export function commitWork(current, finishedWork) {
  switch (finishedWork.tag) {
    case HostComponent:
      const instance = finishedWork.stateNode
      if (instance !== null) {
        const newProps = finishedWork.memorizedProps
        const oldProps = current !== null ? current.memorizedProps : newProps
        const type = finishedWork.type
        const updatePayload = finishedWork.updateQueue
        finishedWork.updateQueue = null
        if (updatePayload !== null) {
          commitUpdate(
            instance,
            updatePayload,
            type,
            oldProps,
            newProps,
            finishedWork
          )
        }
      }
      return
    case HostText:
      // TODO
      return
  }
}

export function commitPlacement(finishedWork) {
  const parentFiber = getHostParent(finishedWork)

  let parent
  let isContainer

  switch (parentFiber.tag) {
    case HostComponent:
      parent = parentFiber.stateNode
      isContainer = false
      break
    case HostRoot:
      parent = parentFiber.stateNode.containerInfo
      isContainer = true
      break
    case HostPortal:
      parent = parentFiber.stateNode.containerInfo
      isContainer = true
      break
    default:
      console.warn('invalid host parent fiber')
      break
  }

  // TODO contentreset

  const before = getHostSibling(finishedWork)

  let node = finishedWork
  while (true) {
    if (node.tag === HostComponent || node.tag === HostText) {
      if (before) {
        // TODO insertBefore
      } else {
        if (isContainer) {
          parent.appendChild(node.stateNode)
          // appendChildToContainer(parent, node.stateNode)
        } else {
          parent.appendChild(node.stateNode)
          // appendChild(parent, node.stateNode)
        }
      }
    } else if (node.tag === HostPortal) {

    } else if (node.child !== null) {
      node.child.return = node.return
      node = node.child
      continue
    }

    if (node === finishedWork) return

    while (node.sibling === null) {
      if (node.return === null || node.return === finishedWork) {
        return
      }
      node = node.return
    }

    node.sibling.return = node.return
    node = node.sibling
  }
}

function getHostSibling(fiber) {
  let node = fiber
  while (true) {
    while (node.sibling === null) {
      if (node.return === null || isHostParent(node.return)) {
        return null
      }
      node = node.return
    }

    // TODO find stateNode
  }
}

function getHostParent(fiber) {
  let parent = fiber.return
  while (parent !== null) {
    if (isHostParent(parent)) {
      return parent
    }
    parent = parent.return
  }
}

function isHostParent(fiber) {
  return fiber.tag === HostComponent || fiber.tag === HostRoot || fiber.tag === HostPortal
}


export function commitLifeCycles(finishedRoot, current, finishedWork, committedExpirationTime) {
  switch (finishedWork.tag) {
    case ClassComponent: {
      const instance = finishedWork.stateNode
      if (finishedWork.effectTag & Update) {
        if (current === null) {
          instance.props = finishedWork.memorizedProps
          instance.state = finishedWork.memorizedState
          instance.componentDidMount()
        } else {
          const prevProps = current.memorizedProps
          const prevState = current.memorizedState
          instance.props = finishedWork.memorizedProps
          instance.state = finishedWork.memorizedState
          instance.componentDidUpdate(
            prevProps,
            prevState,
            instance.__reactInternalSnapshotBeforeUpdate
          )
        }
      }
      const updateQueue = finishedWork.updateQueue
      if (updateQueue !== null) {
        instance.props = finishedWork.memorizedProps
        instance.state = finishedWork.memorizedState
        commitUpdateQueue(
          finishedWork,
          updateQueue,
          instance,
          committedExpirationTime
        )
      }
      return
    }
    case HostRoot: {
      const updateQueue = finishedWork.updateQueue
      if (updateQueue !== null) {
        let instance = null
        if (finishedWork.child !== null) {
          switch (finishedWork.child.tag) {
            case HostComponent:
              instance = finishedWork.child.stateNode
              break
            case ClassComponent:
              instance = finishedWork.child.stateNode
              break
          }
        }
        commitUpdateQueue(
          finishedWork,
          updateQueue,
          instance,
          committedExpirationTime
        )
      }
      return
    }
    case HostComponent: {
      const instance = finishedWork.stateNode
      // first mount and autofocus update
      if (current === null && finishedWork.effectTag & Update) {
        const type = finishedWork.type
        const props = finishedWork.memorizedProps
        commitMount(instance, type, props, finishedWork)
      }
      return
    }
  }
}

function commitUpdateQueue(finishedWork, finishedQueue, instance, renderExpirationTime) {
  // TODO captured update

  let effect = finishedQueue.firstEffect
  finishedQueue.firstEffect = finishedQueue.lastEffect = null
  while (effect !== null) {
    const callback = effect.callback
    if (callback !== null) {
      effect.callback = null
      callback.call(instance)
    }
    effect = effect.nextEffect
  }

  // TODO cattured effect
}
