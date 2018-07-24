import { registrationNameDependencies } from "./registry"
import { mediaEventTypes } from "./dom-event-types"
import { trapBubbledEvent } from './dom-event-listener'

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
      // TODO some special events
      const isMediaEvent = mediaEventTypes.indexOf(dependency) !== -1
      if (!isMediaEvent) {
        trapBubbledEvent(dependency)
      }
      isListening[dependency] = true
    }
  }
}
