import * as DOMTopLevelEventTypes from './dom-event-types'
import { accumulateTwoPhaseDispatches } from './event-propagation'

const interactiveEventTypeNames = [
  [DOMTopLevelEventTypes.TOP_BLUR, 'blur'],
  [DOMTopLevelEventTypes.TOP_CANCEL, 'cancel'],
  [DOMTopLevelEventTypes.TOP_CLICK, 'click'],
  [DOMTopLevelEventTypes.TOP_CLOSE, 'close'],
  [DOMTopLevelEventTypes.TOP_CONTEXT_MENU, 'contextMenu'],
  [DOMTopLevelEventTypes.TOP_COPY, 'copy'],
  [DOMTopLevelEventTypes.TOP_CUT, 'cut'],
  [DOMTopLevelEventTypes.TOP_DOUBLE_CLICK, 'doubleClick'],
  [DOMTopLevelEventTypes.TOP_DRAG_END, 'dragEnd'],
  [DOMTopLevelEventTypes.TOP_DRAG_START, 'dragStart'],
  [DOMTopLevelEventTypes.TOP_DROP, 'drop'],
  [DOMTopLevelEventTypes.TOP_FOCUS, 'focus'],
  [DOMTopLevelEventTypes.TOP_INPUT, 'input'],
  [DOMTopLevelEventTypes.TOP_INVALID, 'invalid'],
  [DOMTopLevelEventTypes.TOP_KEY_DOWN, 'keyDown'],
  [DOMTopLevelEventTypes.TOP_KEY_PRESS, 'keyPress'],
  [DOMTopLevelEventTypes.TOP_KEY_UP, 'keyUp'],
  [DOMTopLevelEventTypes.TOP_MOUSE_DOWN, 'mouseDown'],
  [DOMTopLevelEventTypes.TOP_MOUSE_UP, 'mouseUp'],
  [DOMTopLevelEventTypes.TOP_PASTE, 'paste'],
  [DOMTopLevelEventTypes.TOP_PAUSE, 'pause'],
  [DOMTopLevelEventTypes.TOP_PLAY, 'play'],
  [DOMTopLevelEventTypes.TOP_POINTER_CANCEL, 'pointerCancel'],
  [DOMTopLevelEventTypes.TOP_POINTER_DOWN, 'pointerDown'],
  [DOMTopLevelEventTypes.TOP_POINTER_UP, 'pointerUp'],
  [DOMTopLevelEventTypes.TOP_RATE_CHANGE, 'rateChange'],
  [DOMTopLevelEventTypes.TOP_RESET, 'reset'],
  [DOMTopLevelEventTypes.TOP_SEEKED, 'seeked'],
  [DOMTopLevelEventTypes.TOP_SUBMIT, 'submit'],
  [DOMTopLevelEventTypes.TOP_TOUCH_CANCEL, 'touchCancel'],
  [DOMTopLevelEventTypes.TOP_TOUCH_END, 'touchEnd'],
  [DOMTopLevelEventTypes.TOP_TOUCH_START, 'touchStart'],
  [DOMTopLevelEventTypes.TOP_VOLUME_CHANGE, 'volumeChange'],
]
const nonInteractiveEventTypeNames = [
  [DOMTopLevelEventTypes.TOP_ABORT, 'abort'],
  [DOMTopLevelEventTypes.TOP_ANIMATION_END, 'animationEnd'],
  [DOMTopLevelEventTypes.TOP_ANIMATION_ITERATION, 'animationIteration'],
  [DOMTopLevelEventTypes.TOP_ANIMATION_START, 'animationStart'],
  [DOMTopLevelEventTypes.TOP_CAN_PLAY, 'canPlay'],
  [DOMTopLevelEventTypes.TOP_CAN_PLAY_THROUGH, 'canPlayThrough'],
  [DOMTopLevelEventTypes.TOP_DRAG, 'drag'],
  [DOMTopLevelEventTypes.TOP_DRAG_ENTER, 'dragEnter'],
  [DOMTopLevelEventTypes.TOP_DRAG_EXIT, 'dragExit'],
  [DOMTopLevelEventTypes.TOP_DRAG_LEAVE, 'dragLeave'],
  [DOMTopLevelEventTypes.TOP_DRAG_OVER, 'dragOver'],
  [DOMTopLevelEventTypes.TOP_DURATION_CHANGE, 'durationChange'],
  [DOMTopLevelEventTypes.TOP_EMPTIED, 'emptied'],
  [DOMTopLevelEventTypes.TOP_ENCRYPTED, 'encrypted'],
  [DOMTopLevelEventTypes.TOP_ENDED, 'ended'],
  [DOMTopLevelEventTypes.TOP_ERROR, 'error'],
  [DOMTopLevelEventTypes.TOP_GOT_POINTER_CAPTURE, 'gotPointerCapture'],
  [DOMTopLevelEventTypes.TOP_LOAD, 'load'],
  [DOMTopLevelEventTypes.TOP_LOADED_DATA, 'loadedData'],
  [DOMTopLevelEventTypes.TOP_LOADED_METADATA, 'loadedMetadata'],
  [DOMTopLevelEventTypes.TOP_LOAD_START, 'loadStart'],
  [DOMTopLevelEventTypes.TOP_LOST_POINTER_CAPTURE, 'lostPointerCapture'],
  [DOMTopLevelEventTypes.TOP_MOUSE_MOVE, 'mouseMove'],
  [DOMTopLevelEventTypes.TOP_MOUSE_OUT, 'mouseOut'],
  [DOMTopLevelEventTypes.TOP_MOUSE_OVER, 'mouseOver'],
  [DOMTopLevelEventTypes.TOP_PLAYING, 'playing'],
  [DOMTopLevelEventTypes.TOP_POINTER_MOVE, 'pointerMove'],
  [DOMTopLevelEventTypes.TOP_POINTER_OUT, 'pointerOut'],
  [DOMTopLevelEventTypes.TOP_POINTER_OVER, 'pointerOver'],
  [DOMTopLevelEventTypes.TOP_PROGRESS, 'progress'],
  [DOMTopLevelEventTypes.TOP_SCROLL, 'scroll'],
  [DOMTopLevelEventTypes.TOP_SEEKING, 'seeking'],
  [DOMTopLevelEventTypes.TOP_STALLED, 'stalled'],
  [DOMTopLevelEventTypes.TOP_SUSPEND, 'suspend'],
  [DOMTopLevelEventTypes.TOP_TIME_UPDATE, 'timeUpdate'],
  [DOMTopLevelEventTypes.TOP_TOGGLE, 'toggle'],
  [DOMTopLevelEventTypes.TOP_TOUCH_MOVE, 'touchMove'],
  [DOMTopLevelEventTypes.TOP_TRANSITION_END, 'transitionEnd'],
  [DOMTopLevelEventTypes.TOP_WAITING, 'waiting'],
  [DOMTopLevelEventTypes.TOP_WHEEL, 'wheel'],
]

const eventTypes = {}
const topLevelEventsToDispatchConfig = {}

function addEventTypeNameToConfig([topEvent, event], isInteractive) {
  const capitalizedEvent = event[0].toUpperCase() + event.slice(1)
  const onEvent = 'on' + capitalizedEvent
  const type = {
    phasedRegistrationNames: {
      bubbled: onEvent,
      captured: onEvent + 'Capture'
    },
    dependencies: [topEvent],
    isInteractive
  }

  eventTypes[event] = type
  topLevelEventsToDispatchConfig[topEvent] = type
}

interactiveEventTypeNames.forEach(tuple => addEventTypeNameToConfig(tuple, true))
nonInteractiveEventTypeNames.forEach(tuple => addEventTypeNameToConfig(tuple, false))

const SimpleEventPlugin = {
  eventTypes,
  isInteractiveTopLevelEventType(topLevelType) {
    const config = topLevelEventsToDispatchConfig[topLevelType]
    return config !== undefined && config.isInteractive === true
  },
  extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    const dispatchConfig = topLevelEventsToDispatchConfig[topLevelType]
    nativeEvent.dispatchConfig = dispatchConfig
    nativeEvent._targetInst = targetInst
    accumulateTwoPhaseDispatches(nativeEvent)
    return nativeEvent
  }
}

export default SimpleEventPlugin
