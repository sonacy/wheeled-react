import { REACT_ELEMENT_TYPE, REACT_FRAGMENT_TYPE } from "../utils/symbols"
import { Placement } from "../utils/type-of-side-effect"
import { createFiberFromElement, createFiberFromText } from './fiber'

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
          // TODO ref
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
  }

  function placeSingleChild(newFiber) {
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      newFiber.effectTag = Placement
    }
    return newFiber
  }

  function reconcileSingleElement(returnFiber, currentFirstChild, element, expirationTime) {
    // TODO child !== null comparision

    if (element.type === REACT_FRAGMENT_TYPE) {
      // TODO fragment
    } else {
      const created = createFiberFromElement(
        element,
        returnFiber.mode,
        expirationTime
      )
      // TODO ref
      created.return = returnFiber
      return created
    }
  }

  function reconcileSingleTextNode() {
    // TODO
  }

  function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, expirationTime) {
    let resultingFirstFiber = null
    let previousNewFiber = null
    let oldFiber = currentFirstChild
    let lastPlacedIndex = 0
    let newIdx = 0

    // TODO oldFiber comparision

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
  }

  function deleteRemainingChildren() {
    if (!shouldTrackSideEffects) {
      return null
    }
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
