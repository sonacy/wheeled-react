export let getFiberCurrentPropsFromNode = null
export let getNodeFromInstance = null
export let getInstanceFromNode = null

export const injection = {
  injectComponentTree: function(Injected) {
    getInstanceFromNode = Injected.getInstanceFromNode
    getNodeFromInstance = Injected.getNodeFromInstance
    getFiberCurrentPropsFromNode = Injected.getFiberCurrentPropsFromNode
  }
}

export function executeDispatchesInOrder(event) {
  if (event) {
    const dispatchListeners = event._dispatchListeners
    const dispatchInstances = event._dispatchInstances
    if (Array.isArray(dispatchListeners)) {
      for(let i = 0; i < dispatchListeners.length; i++) {
        executeDispatch(
          event,
          dispatchListeners[i],
          dispatchInstances[i]
        )
      }
    } else if (dispatchListeners) {
      executeDispatch(event, dispatchListeners, dispatchInstances)
    }

    event._dispatchInstances = null
    event._dispatchListeners = null
  }
}

function executeDispatch(event, listener, inst) {
  listener.apply(null, event)
}
