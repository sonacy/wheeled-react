let restoreTarget = null
let restoreQueue = null

export function enqueueStateRestore(target) {
  if (restoreTarget) {
    if (restoreQueue) {
      restoreQueue.push(target)
    } else {
      restoreQueue = [target]
    }
  } else {
    restoreTarget = target
  }
}
