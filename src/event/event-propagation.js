import { forEachAccumulate, accumulateInto } from "./dom-event-utils"
import { traverseTwoPhase } from "../share/tree-traversal"
import { getListener } from "./plugin-hub"

function accumulateDirectionalDispatches(inst, phase, event) {
  const listener = getListener(inst, event.dispatchConfig.phasedRegistrationNames[phase])
  if (listener) {
    event._dispatchListeners = accumulateInto(event._dispatchListeners, listener)
    event._dispatchInstances = accumulateInto(event._dispatchInstances, inst)
  }
}

function accumulateTwoPhaseDispatchesSingle(event) {
  if (event && event.dispatchConfig.phasedRegistrationNames) {
    traverseTwoPhase(event._targetInst, accumulateDirectionalDispatches, event)
  }
}

export function accumulateTwoPhaseDispatches(events) {
  forEachAccumulate(events, accumulateTwoPhaseDispatchesSingle)
}
