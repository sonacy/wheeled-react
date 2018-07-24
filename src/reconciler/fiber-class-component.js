import * as ReactInstanceMap from '../utils/instance-map'
import { processUpdateQueue, createUpdate, enqueueUpdate, resetHasForceUpdateBeforeProcessing, checkHasForceUpdateAfterProcessing } from './update-queue'
import { Update } from '../utils/type-of-side-effect'
import { requestCurrentTime, computeExpirationForFiber, scheduleWork } from './fiber-scheduler';

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
    const fiber = ReactInstanceMap.get(inst)
    const currentTime = requestCurrentTime()
    const expirationTime = computeExpirationForFiber(currentTime, fiber)
    const update = createUpdate(expirationTime)
    update.payload = payload
    if (callback !== null && callback !== undefined) {
      update.callback = callback
    }

    enqueueUpdate(fiber, update, expirationTime)
    scheduleWork(fiber, expirationTime)
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

export function updateClassInstance(current, workInProgress, renderExpirationTime) {
  const ctor = workInProgress.type
  const instance = workInProgress.stateNode

  const oldProps = workInProgress.memorizedProps
  const newProps = workInProgress.pendingProps
  instance.props = oldProps

  // TODO context

  // TODO lifecycle api compat componentWillReceiveProps

  resetHasForceUpdateBeforeProcessing()

  const oldState = workInProgress.memorizedState
  let newState = instance.state = oldState
  let updateQueue = workInProgress.updateQueue
  if (updateQueue !== null) {
    processUpdateQueue(workInProgress, updateQueue, newProps, instance, renderExpirationTime)
    newState = workInProgress.memorizedState
  }

  // TODO add life cycle effect

  const shouldUpdate = checkHasForceUpdateAfterProcessing() || checkShouldComponentUpdate(
    workInProgress,
    oldProps,
    newProps,
    oldState,
    newState,
    // newContext
  )

  // TODO check for life cycle

  instance.props = newProps
  instance.state = newState
  return shouldUpdate
}

function checkShouldComponentUpdate(workInProgress, oldProps, newProps, oldState, newState) {
  const instance = workInProgress.stateNode
  const ctor = workInProgress.type
  if (typeof instance.shouldComponentUpdate === 'function') {
    const shouldUpdate = instance.shouldComponentUpdate(
      newProps,
      newState
    )
    return shouldUpdate
  }

  // TODO purecomponent
  return true
}
