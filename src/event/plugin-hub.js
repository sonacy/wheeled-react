import { injectEventPluginOrder, injectEventPluginsByName, plugins } from './registry'
import { accumulateInto, forEachAccumulate } from './dom-event-utils';
import { getFiberCurrentPropsFromNode } from '../dom/dom-component-tree';
import { executeDispatchesInOrder } from './plugin-utils';

let eventQueue = null

export const injection = {
  injectEventPluginOrder,
  injectEventPluginsByName
}

function extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
  let events = null
  for (let i = 0; i < plugins.length; i++) {
    const plugin = plugins[i]
    if (plugin) {
      const extractedEvents = plugin.extractEvents(
        topLevelType,
        targetInst,
        nativeEvent,
        nativeEventTarget
      )
      if (extractedEvents) {
        events = accumulateInto(events, extractedEvents)
      }
    }
  }
  return events
}

function runEventInBatch(events) {
  if (events !== null) {
    eventQueue = accumulateInto(eventQueue, events)
  }

  const processingEventQueue = eventQueue
  eventQueue = null

  if (!processingEventQueue) return

  forEachAccumulate(processingEventQueue, executeDispatchesInOrder)
}

export function runExtractedEventsInBatch(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
  const events = extractEvents(
    topLevelType,
    targetInst,
    nativeEvent,
    nativeEventTarget
  )
  runEventInBatch(events)
}

export function getListener(inst, registrationName) {
  let listener
  const stateNode = inst.stateNode
  if (!stateNode) return null
  const props = getFiberCurrentPropsFromNode(stateNode)
  if (!props) return null
  return props[registrationName]
}
