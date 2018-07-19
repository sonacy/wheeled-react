import * as ReactInstanceMap from '../utils/instance-map'
import { processUpdateQueue } from './update-queue'
import { Update } from '../utils/type-of-side-effect'

const classComponentUpdater = {
  isMounted(inst) {
    // TODO
  },
  enqueueForceUpdate(inst, callback) {
    // TODO
  },
  enqueueReplaceState(inst, payload, callback) {
    // TODO
  },
  enqueueSetState(inst, payload, callback) {
    // TODO
  }
}

function adoptClassInstance(workInProgress, instance) {
  instance.updater = classComponentUpdater
  workInProgress.stateNode = instance
  ReactInstanceMap.set(instance, workInProgress)
}

export function constructClassInstance(
  workInProgress,
  props,
  renderExpirationTime
) {
  const ctor = workInProgress.type
  // TODO context
  const context = {}
  const instance = new ctor(props, context)
  const state = workInProgress.memorizedState = (instance.state !== null && instance.state !== undefined) ? instance.state : null
  adoptClassInstance(workInProgress, instance)
  // TODO cache unmasked context
  return instance
}

export function mountClassInstance(workInProgress, renderExpirationTime) {
  const ctor = workInProgress.type
  const instance = workInProgress.stateNode
  const props = workInProgress.pendingProps
  const context = {} // TODO unmaskedContext

  instance.props = props
  instance.state = workInProgress.memorizedState
  instance.ref = {}
  instance.context = {} // TODO maskedContext

  let updateQueue = workInProgress.updateQueue
  if (updateQueue !== null) {
    processUpdateQueue(
      workInProgress,
      updateQueue,
      props,
      instance,
      renderExpirationTime
    )
    instance.state = workInProgress.memorizedState
  }

  const getDerivedStateFromProps = ctor.getDerivedStateFromProps
  if (typeof getDerivedStateFromProps === 'function') {
    // TODO run getDerivedStateFromProps
  }

  // TODO old api componentWillMount

  if (typeof instance.componentDidMount === 'function') {
    workInProgress.effectTag |= Update
  }
}
