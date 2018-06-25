/**
 * abstract for a update queue
 */
const ReactNoopUpdateQueue = {
  isMounted(publicInstance) {
    return false
  },
  enqueueForceUpdate(publicInstance, callback, callerName) {
    console.warn(publicInstance, 'forceUpdate')
  },
  enqueueReplaceState(publicInstance, completeState, callback, callerName) {
    console.warn(publicInstance, 'replaceState')
  },
  enqueueSetState(publicInstance, partialState, callback, callerName) {
    console.warn(publicInstance, 'setState')
  }
}

export default ReactNoopUpdateQueue
