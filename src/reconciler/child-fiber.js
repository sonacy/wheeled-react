import { REACT_ELEMENT_TYPE, REACT_FRAGMENT_TYPE } from "../utils/symbols"
import { Placement, Deletion } from "../utils/type-of-side-effect"
import { createFiberFromElement, createFiberFromText, createWorkInProgress } from './fiber'
import { Fragment, HostText } from "../utils/type-of-work";

export function cloneChildFibers(current, workInProgress) {
  if (workInProgress.child === null) return

  let currentChild = workInProgress.child
  let newChild = createWorkInProgress(
    currentChild,
    currentChild.pendingProps,
    currentChild.expirationTime
  )
  workInProgress.child = newChild

  newChild.return = workInProgress
  while (currentChild.sibling !== null) {
    currentChild = currentChild.sibling
    newChild = newChild.sibling = createWorkInProgress(
      currentChild,
      currentChild.pendingProps,
      currentChild.expirationTime
    )
    newChild.return = workInProgress
  }
  newChild.sibling = null
}

function coerceRef(returnFiber, current, element) {
  let mixdRef = element.ref
  // warn for ref is not a function or object
  return mixdRef
}

function ChildReconciler(shouldTrackSideEffects) {

  function createChild(returnFiber, newChild, expirationTime) {
    // text
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      const created = createFiberFromText(
        '' + newChild,
        returnFiber.mode,
        expirationTime
      )
      created.return = returnFiber
      return created
    }
    // react element
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          const created = createFiberFromElement(
            newChild,
            returnFiber.mode,
            expirationTime
          )
          created.ref = coerceRef(returnFiber, null, newChild)
          created.return = returnFiber
          return created
          break
        // TODO portal
      }
    }
    // TODO array
    return null
  }

  function placeChild(newFiber, lastPlacedIndex, newIndex) {
    newFiber.index = newIndex
    if (!shouldTrackSideEffects) return lastPlacedIndex
    const current = newFiber.alternate
    if (current !== null) {
      const oldIndex = current.index
      if (oldIndex < lastPlacedIndex) {
        newFiber.effectTag = Placement
        return lastPlacedIndex
      } else {
        return oldIndex
      }
    } else {
      newFiber.effectTag = Placement
      return lastPlacedIndex
    }
  }

  function placeSingleChild(newFiber) {
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      newFiber.effectTag = Placement
    }
    return newFiber
  }

  function useFiber(fiber, pendingProps, expirationTime) {
    const clone = createWorkInProgress(fiber, pendingProps, expirationTime)
    clone.index = 0
    clone.sibling = null
    return clone
  }

  function reconcileSingleElement(returnFiber, currentFirstChild, element, expirationTime) {
    const key = element.key
    let child = currentFirstChild

    while (child !== null) {
      if (child.key === key) {
        if (child.tag === Fragment ? element.type === REACT_FRAGMENT_TYPE : child.type === element.type) {
          deleteRemainingChildren(returnFiber, child.sibling)
          const existing = useFiber(
            child,
            element.type === REACT_FRAGMENT_TYPE ? element.props.children : element.props,
            expirationTime
          )
          existing.ref = coerceRef(returnFiber, child, element)
          existing.return = returnFiber
          return existing
        } else {
          deleteRemainingChildren(returnFiber, child)
        }
      } else {
        deleteChild(returnFiber, child)
      }
      child = child.sibling
    }

    if (element.type === REACT_FRAGMENT_TYPE) {
      // TODO fragment
    } else {
      const created = createFiberFromElement(
        element,
        returnFiber.mode,
        expirationTime
      )
      created.ref = coerceRef(returnFiber, currentFirstChild, element)
      created.return = returnFiber
      return created
    }
  }

  function reconcileSingleTextNode(returnFiber, currentFirstChild, textContent, expirationTime) {
    if (currentFirstChild !== null && currentFirstChild.tag === HostText) {
      deleteRemainingChildren(returnFiber, currentFirstChild.sibling)
      const existing = useFiber(currentFirstChild, textContent, expirationTime)
      existing.return = returnFiber
      return existing
    }

    deleteRemainingChildren(returnFiber, currentFirstChild)
    const created = createFiberFromText(
      textContent,
      returnFiber.mode,
      expirationTime
    )
    created.return = returnFiber
    return created
  }

  function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, expirationTime) {
    let resultingFirstFiber = null
    let previousNewFiber = null
    let oldFiber = currentFirstChild
    let lastPlacedIndex = 0
    let newIdx = 0
    let nextOldFiber = null

    for(; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
      if (oldFiber.index > newIdx) {
        nextOldFiber = oldFiber
        oldFiber = null
      } else {
        nextOldFiber = oldFiber.sibling
      }

      const newFiber = updateSlot(
        returnFiber,
        oldFiber,
        newChildren[newIdx],
        expirationTime
      )

      if (newFiber === null) {
        if (oldFiber === null) {
          oldFiber = nextOldFiber
        }
        break
      }

      if (shouldTrackSideEffects) {
        if (oldFiber && newFiber.alternate === null) {
          deleteChild(returnFiber, oldFiber)
        }

        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx)
        if (previousNewFiber === null) {
          resultingFirstFiber = newFiber
        } else {
          previousNewFiber.sibling = newFiber
        }
        previousNewFiber = newFiber
        oldFiber = nextOldFiber
      }
    }

    if (newIdx === newChildren.length) {
      deleteRemainingChildren(returnFiber, oldFiber)
      return resultingFirstFiber
    }

    if (oldFiber === null) {
      for(; newIdx < newChildren.length; newIdx++) {
        const newFiber = createChild(
          returnFiber,
          newChildren[newIdx],
          expirationTime
        )

        if (!newFiber) continue

        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx)

        if (previousNewFiber === null) {
          resultingFirstFiber = newFiber
        } else {
          previousNewFiber.sibling = newFiber
        }
        previousNewFiber = newFiber
      }

      return resultingFirstFiber
    }

    const existingChildren = mapRemainingChildren(returnFiber, oldFiber)

    for(; newIdx < newChildren.length; newIdx++) {
      const newFiber = updateFromMap(
        existingChildren,
        returnFiber,
        newIdx,
        newChildren[newIdx],
        expirationTime
      )
      if (newFiber) {
        if (shouldTrackSideEffects) {
          if (newFiber.alternate !== null) {
            existingChildren.delete(newFiber.key === null ? newIdx : newFiber.key)
          }
        }

        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx)
        if (previousNewFiber === null) {
          resultingFirstFiber = newFiber
        } else {
          previousNewFiber.sibling = newFiber
        }
        previousNewFiber = newFiber
      }
    }

    if (shouldTrackSideEffects) {
      existingChildren.forEach(child => deleteChild(returnFiber, child))
    }

    return resultingFirstFiber
  }

  function updateFromMap(existingChildren, returnFiber, newIdx, newChild, expirationTime) {
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      const matchedFiber = existingChildren.get(newIdx) || null
      return updateTextNode(
        returnFiber,
        matchedFiber,
        '' + newChild,
        expirationTime
      )
    }

    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          const matchedFiber = existingChildren.get(newChild.key === null ? newIdx : newChild.key) || null
          if (newChild.type === REACT_FRAGMENT_TYPE) {
            // TODO frament
          }
          return updateElement(
            returnFiber,
            matchedFiber,
            newChild,
            expirationTime
          )
        }
        // TODO portal
      }

      // TODO newchild is array cause it is fragment
    }

    return null
  }

  function mapRemainingChildren(returnFiber, currentFirstChild) {
    const existingChildren = new Map()
    let existingChild = currentFirstChild
    while (existingChild !== null) {
      if (existingChild.key !== null) {
        existingChildren.set(existingChild.key, existingChild)
      } else {
        existingChildren.set(existingChild.index, existingChild)
      }
      existingChild = existingChild.sibling
    }

    return existingChildren
  }

  function updateTextNode(returnFiber, current, textContent, expirationTime) {
    if (current === null || current.tag !== HostText) {
      const created = createFiberFromText(
        textContent,
        returnFiber.mode,
        expirationTime
      )
      created.return = returnFiber
      return created
    } else {
      const existing = useFiber(current, textContent, expirationTime)
      existing.return = returnFiber
      return existing
    }
  }

  function updateElement(returnFiber, current, element, expirationTime) {
    if (current !== null && current.type === element.type) {
      const existing = useFiber(current, element.props, expirationTime)
      existing.ref = coerceRef(returnFiber, current, element)
      existing.return = returnFiber
      return existing
    } else {
      const created = createFiberFromElement(element, returnFiber.mode, expirationTime)
      created.ref = coerceRef(returnFiber, current, element)
      created.return = returnFiber
      return created
    }
  }

  function updateSlot(returnFiber, oldFiber, newChild, expirationTime) {
    const key = oldFiber !== null ? oldFiber.key : null

    if (typeof newChild === 'string' || typeof newChild === 'number') {
      if (key !== null) return null
      return updateTextNode(
        returnFiber,
        oldFiber,
        '' + newChild,
        expirationTime
      )
    }

    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          if (newChild.key === key) {
            if (newChild.type === REACT_FRAGMENT_TYPE) {
              // TODO frament
            }
            return updateElement(
              returnFiber,
              oldFiber,
              newChild,
              expirationTime
            )
          } else {
            return null
          }
        // TODO portal type
      }

      // TODO array
    }
    return null
  }

  function deleteRemainingChildren(returnFiber, currentFirstChild) {
    if (!shouldTrackSideEffects) {
      return null
    }

    let childToDelete = currentFirstChild
    while (childToDelete !== null) {
      deleteChild(returnFiber, childToDelete)
      childToDelete = childToDelete.sibling
    }
    return null
  }

  function deleteChild(returnFiber, childToDelete) {
    if (!shouldTrackSideEffects) return
    const last = returnFiber.lastEffect
    if (last !== null) {
      last.nextEffect = childToDelete
      returnFiber.lastEffect = childToDelete
    } else {
      returnFiber.firstEffect = returnFiber.lastEffect = childToDelete
    }
    childToDelete.nextEffect = null
    childToDelete.effectTag = Deletion
  }

  function reconcileChildFibers(
    returnFiber,
    currentFirstChild,
    newChild,
    expirationTime
  ) {
    // TODO fragment

    const isObject = typeof newChild === 'object' && newChild !== null
    // react element
    if (isObject) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(
              returnFiber,
              currentFirstChild,
              newChild,
              expirationTime
            )
          )
          break
      }
    }
    // text
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      return placeSingleChild(
        reconcileSingleTextNode(
          returnFiber,
          currentFirstChild,
          '' + newChild,
          expirationTime
        )
      )
    }

    // array
    if (Array.isArray(newChild)) {
      return reconcileChildrenArray(
        returnFiber,
        currentFirstChild,
        newChild,
        expirationTime
      )
    }

    // TODO iterator fn

    // TODO unknow object warn

    return deleteRemainingChildren(returnFiber, currentFirstChild)
  }

  return reconcileChildFibers
}

export const reconcileChildFibers = ChildReconciler(true)
export const mountChildFibers = ChildReconciler(false)
