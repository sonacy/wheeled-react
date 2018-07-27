import { TOP_BLUR, TOP_CHANGE, TOP_CLICK, TOP_FOCUS, TOP_INPUT, TOP_KEY_DOWN, TOP_KEY_UP, TOP_SELECTION_CHANGE } from "./dom-event-types"
import { getNodeFromInstance } from "../dom/dom-component-tree"
import { isEventSupported } from "./dom-event-utils"
import * as inputValueTracking from '../dom/input-value-track'
import { accumulateTwoPhaseDispatches } from "./event-propagation";
import { enqueueStateRestore } from "./controlled-component";

const supportedInputTypes = {
  color: true,
  date: true,
  datetime: true,
  'datetime-local': true,
  email: true,
  month: true,
  number: true,
  password: true,
  range: true,
  search: true,
  tel: true,
  text: true,
  time: true,
  url: true,
  week: true
}

const eventTypes = {
  change: {
    phasedRegistrationNames: {
      bubbled: 'onChange',
      captured: 'onChangeCapture'
    },
    dependencies: [
      TOP_BLUR,
      TOP_CHANGE,
      TOP_CLICK,
      TOP_FOCUS,
      TOP_INPUT,
      TOP_KEY_DOWN,
      TOP_KEY_UP,
      TOP_SELECTION_CHANGE
    ]
  }
}

function shouldUseChangeEvent(elem) {
  const nodeName = elem.nodeName && elem.nodeName.toLowerCase()
  return (nodeName === 'select' || (nodeName === 'input' && elem.type === 'file'))
}

function isTextInputElement(elem) {
  const nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase()
  if (nodeName === 'input') {
    return !!supportedInputTypes[elem.type]
  }

  if (nodeName === 'textarea') return true

  return false
}

function shouldUseClickEvent(elem) {
  const nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase()
  return (
    nodeName && nodeName === 'input' && (elem.type === 'checkbox' || elem.type === 'radio')
  )
}

function getTargetInstForChangeEvent(topLevelType, targetInst) {
  if (topLevelType === TOP_CHANGE) {
    return targetInst
  }
}

function getInstIfValueChanged(targetInst) {
  const targetNode = getNodeFromInstance(targetInst)
  if (inputValueTracking.updateValueIfChanged(targetNode)) {
    return targetInst
  }
}

function getTargetInstForInputOrChangeEvent(topLevelType, targetInst) {
  if (topLevelType === TOP_CHANGE || topLevelType === TOP_INPUT) {
    return getInstIfValueChanged(targetInst)
  }
}

function getTargetInstForClickEvent(topLevelType, targetInst) {
  if (topLevelType === TOP_CLICK) {
    return getInstIfValueChanged(targetInst)
  }
}

function handleControlledInputBlur(node) {
  let state = node._wrapperState
  if (!state || !state.controlled || node.type !== 'number') return
  setDefaultValue(node, 'number', node.value)
}

function setDefaultValue(node, type, value) {
  if (
    type !== 'number' ||
    node.ownerDocument.activeElement !== node
  ) {
    if (value == null) {
      node.defaultValue = '' + node._wrapperState.initialValue
    } else if (node.defaultValue !== '' + value) {
      node.defaultValue = '' + value
    }
  }
}

// not supported for ie 9
let isInputEventSupported = isEventSupported('input') && (!document.documentMode || document.documentMode > 9)

const changeEventPlugin = {
  eventTypes,
  _isInputEventSupported: isInputEventSupported,
  extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    const targetNode = targetInst ? getNodeFromInstance(targetInst) : window
    let getTargetInstFunc, handleEventFunc
    // 1. select input type=file
    if (shouldUseChangeEvent(targetNode)) {
      getTargetInstFunc = getTargetInstForChangeEvent
    } else if (isTextInputElement(targetNode)) { // 2. input textarea
      getTargetInstFunc = getTargetInstForInputOrChangeEvent
      // if (isInputEventSupported) {
      //   // 2.1 支持input事件
      // } else {
      //   // 2.2 不支持input事件
      // }
    } else if (shouldUseClickEvent(targetInst)) {
      // 3. radio checkbox
      getTargetInstFunc = getTargetInstForClickEvent
    }

    // TODO ie polyfill

    if (getTargetInstFunc) {
      const inst = getTargetInstFunc(topLevelType, targetInst)
      if (inst) {
        enqueueStateRestore(nativeEventTarget)
        accumulateTwoPhaseDispatches(nativeEvent)
        return nativeEvent
      }
    }

    if (topLevelType === TOP_BLUR) {
      handleControlledInputBlur(targetNode)
    }
  }
}

export default changeEventPlugin
