import {createHostRootFiber} from './fiber'
import {NoWork} from './fiber-expiration-time'

export function createFiberRoot(containerInfo, isAsync, hydrate) {
  const uninitializedFiber = createHostRootFiber(isAsync)
  const root = {
    current: uninitializedFiber,
    containerInfo: containerInfo,
    pendingChildren: null,

    earliestPendingTime: NoWork,
    latestPendingTime: NoWork,
    earliestSuspendedTime: NoWork,
    latestSuspendedTime: NoWork,
    latestPingedTime: NoWork,

    didError: false,

    pendingCommitExpirationTime: NoWork,
    finishedWork: null,
    context: null,
    pendingContext: null,
    hydrate,
    nextExpirationTimeToWorkOn: NoWork,
    expirationTime: NoWork,
    firstBatch: null,
    nextScheduledRoot: null,
  }
  uninitializedFiber.stateNode = root
  return root
}
