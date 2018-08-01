import { HostComponent, HostRoot, HostPortal, HostText, ClassComponent } from "../utils/type-of-work"
import { commitUpdate, commitMount } from "../dom/dom-host-config";
import { Update, Placement } from "../utils/type-of-side-effect";

export function commitAttachRef(finishedWork) {
  const ref = finishedWork.ref
  if (ref !== null) {
    const instance = finishedWork.stateNode
    if (typeof ref === 'function') {
      ref(instance)
    } else {
      ref.current = instance
    }
  }
}

export function commitDetachRef(current) {
  const currentRef = current.ref
  if (currentRef !== null) {
    if (typeof currentRef === 'function') {
      currentRef(null)
    } else {
      currentRef.current = null
    }
  }
}

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

export function commitDeletion(current) {
  unmountHostComponent(current)
  detachFiber(current)
}

function commitNestedUnmounts(root) {
  let node = root
  while (true) {
    commitUnmount(node)
    if (node.child !== null && node.tag !== HostPortal) {
      node.child.return = node
      node = node.child
      continue
    }

    if (node === root) return

    while (node.sibling === null) {
      if (node.return === null || node.return === root) return

      node = node.return
    }

    node.sibling.return = node.return
    node = node.sibling
  }
}

function commitUnmount(current) {
  // TODO dev tool onCommitUnmount

  switch (current.tag) {
    case ClassComponent: {
      commitDetachRef(current)
      const instance = current.stateNode
      if (typeof instance.componentWillUnmount === 'function') {
        instance.props = current.memorizedProps
        instance.state = current.memorizedState
        instance.componentWillUnmount()
      }
      return
    }
    case HostComponent: {
      commitDetachRef(current)
      return
    }
    case HostPortal: {
      // TODO
    }
  }
}

function unmountHostComponent(current) {
  let node = current

  let currentParentIsValid = false

  let currentParent
  let currentParentIsContainer

  while (true) {
    if (!currentParentIsValid) {
      let parent = node.return
      findParent: while (true) {
        switch (parent.tag) {
          case HostComponent:
            currentParent = parent.stateNode
            currentParentIsContainer = false
            break findParent
          case HostRoot:
            currentParent = parent.stateNode.containerInfo
            currentParentIsContainer = true
            break findParent
          case HostPortal:
            currentParent = parent.stateNode.containerInfo
            currentParentIsContainer = true
            break findParent
        }
        parent = parent.return
      }
      currentParentIsValid = true
    }

    if (node.tag === HostComponent || node.tag === HostText) {
      commitNestedUnmounts(node)

      if (currentParentIsContainer) {
        currentParent.removeChild(node.stateNode)
      } else {
        currentParent.removeChild(node.stateNode)
      }
    } else if (node.tag === HostPortal) {
      // TODO portal
    } else {
      commitUnmount(node)

      if (node.child !== null) {
        node.child.return = node
        node = node.child
        continue
      }

    }
    if (node === current) return
    while (node.sibling === null) {
      if (node.return === null || node.return === current) return
      node = node.return
      if (node.tag === HostPortal) {
        currentParentIsValid = false
      }
    }
    node.sibling.return = node.return
    node = node.sibling
  }
}

function detachFiber(current) {
  current.return = null
  current.child = null
  if (current.alternate !== null) {
    current.alternate.return = null
    current.alternate.child = null
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
        if (isContainer) {
          parent.insertBefore(node.stateNode, before)
        } else {
          parent.insertBefore(node.stateNode, before)
        }
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
      node.child.return = node
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
  siblings: while (true) {
    while (node.sibling === null) {
      if (node.return === null || isHostParent(node.return)) {
        return null
      }
      node = node.return
    }

    node.sibling.return = node.return
    node = node.sibling
    while (node.tag !== HostComponent && node.tag !== HostText) {
      if (node.effectTag & Placement) {
        continue siblings
      }

      if (node.child === null || node.tag === HostPortal) {
        continue siblings
      } else {
        node.child.return = node
        node = node.child
      }
    }

    if (!(node.effectTag & Placement)) {
      return node.stateNode
    }
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
