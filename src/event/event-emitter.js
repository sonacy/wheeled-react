import { registrationNameDependencies } from "./registry"
import { mediaEventTypes, TOP_SCROLL, TOP_FOCUS, TOP_BLUR, TOP_CANCEL, TOP_CLOSE, TOP_INVALID, TOP_SUBMIT, TOP_RESET } from "./dom-event-types"
import { trapBubbledEvent, trapCapturedEvent } from './dom-event-listener'
import { isEventSupported } from "./dom-event-utils";

const alreadyListenTo = {}
let reactTopListenerCounter = 0

const topListenersIDKey = '_reactListenersID' + ('' + Math.random()).slice(2)

function getListeningForDocument() {
  if (!Object.prototype.hasOwnProperty.call(document, topListenersIDKey)) {
    document[topListenersIDKey] = reactTopListenerCounter++
    alreadyListenTo[document[topListenersIDKey]] = {}
  }

  return alreadyListenTo[document[topListenersIDKey]]
}

export function listenTo (registrationName) {
  const isListening = getListeningForDocument()
  const dependencies = registrationNameDependencies[registrationName]
  for (let i = 0; i < dependencies.length; i++) {
    const dependency = dependencies[i]

    if(!(isListening.hasOwnProperty(dependency) && isListening[dependency])) {
      switch (dependency) {
        case TOP_SCROLL:
          trapCapturedEvent(TOP_SCROLL)
          break
        case TOP_FOCUS:
        case TOP_BLUR:
          trapCapturedEvent(TOP_FOCUS)
          trapCapturedEvent(TOP_BLUR)
          isListening[TOP_BLUR] = true
          isListening[TOP_FOCUS] = true
          break
        case TOP_CANCEL:
        case TOP_CLOSE:
          if (isEventSupported(dependency)) {
            trapCapturedEvent(dependency)
          }
          break
        case TOP_INVALID:
        case TOP_SUBMIT:
        case TOP_RESET:
          break
        default:
          const isMediaEvent = mediaEventTypes.indexOf(dependency) !== -1
          if (!isMediaEvent) {
            trapBubbledEvent(dependency)
          }
          break
      }
      isListening[dependency] = true
    }
  }
}
