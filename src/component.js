import ReactNoopUpdateQueue from './noop-update-queue'

const emptyObject = {}

class Component {
  constructor(props, context, updater) {
    this.props = props
    this.context = context
    this.refs = emptyObject
    this.updater = updater || ReactNoopUpdateQueue
  }

  isReactComponent() {}

  setState(partialState, callback) {
    this.updater.enqueueSetState(this, partialState, callback, 'setState')
  }

  forceUpdate(callback) {
    this.updater.enqueueForceUpdate(this, callback, 'forceUpdate')
  }
}

export { Component }
