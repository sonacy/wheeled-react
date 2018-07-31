import SimpleEventPlugin from './simple-event-plugin.js'
import { getEventTarget } from './dom-event-utils.js'
import { getClosestInstanceFromNode } from '../dom/dom-component-tree.js'
import { interactiveUpdates, batchedUpdates } from '../reconciler/fiber-scheduler.js'
import { HostRoot } from '../utils/type-of-work.js'
import { runExtractedEventsInBatch } from './plugin-hub.js'

const CALLBACK_BOOKKEEPING_POOL_SIZE = 10
const callbackBookkeepingPool = []

function getTopLevelCallbackBookKeeping(topLevelType, nativeEvent, targetInst) {
  if (callbackBookkeepingPool.length) {
    const instance = callbackBookkeepingPool.pop()
    instance.topLevelType = topLevelType
    instance.nativeEvent = nativeEvent
    instance.targetInst = targetInst
    return instance
  }

  return {
    topLevelType,
    nativeEvent,
    targetInst,
    ancestors: []
  }
}

function releaseTopLevelCallbackBookKeeping(instance) {
  instance.topLevelType = null
  instance.nativeEvent = null
  instance.targetInst = null
  instance.ancestors.length = 0
  if (callbackBookkeepingPool.length < CALLBACK_BOOKKEEPING_POOL_SIZE) {
    callbackBookkeepingPool.push(instance)
  }
}

function findRootContainerNode(inst) {
  while (inst.return) {
    inst = inst.return
  }
  if (inst.tag !== HostRoot) return null
  return inst.stateNode.containerInfo
}

function handleTopLevel(bookKeeping) {
  let targetInst = bookKeeping.targetInst

  let ancestor = targetInst
  do {
    if (!ancestor) {
      bookKeeping.ancestors.push(ancestor)
      break
    }
    const root = findRootContainerNode(ancestor)
    if (!root) break
    bookKeeping.ancestors.push(ancestor)
    ancestor = getClosestInstanceFromNode(root)
  } while(ancestor)

  for (let i = 0; i < bookKeeping.ancestors.length; i++) {
    targetInst = bookKeeping.ancestors[i]
    runExtractedEventsInBatch(
      bookKeeping.topLevelType,
      targetInst,
      bookKeeping.nativeEvent,
      getEventTarget(bookKeeping.nativeEvent)
    )
  }
}

export function trapBubbledEvent(topLevelType) {
  const dispatch = SimpleEventPlugin.isInteractiveTopLevelEventType(topLevelType) ? dispatchInteractiveEvent : dispatchEvent

  document.addEventListener(topLevelType, dispatch.bind(null, topLevelType), false)
}

export function trapCapturedEvent(topLevelType) {
  const dispatch = SimpleEventPlugin.isInteractiveTopLevelEventType(topLevelType) ? dispatchInteractiveEvent : dispatchEvent

  document.addEventListener(topLevelType, dispatch.bind(null, topLevelType), true)
}

function dispatchInteractiveEvent(topLevelType, nativeEvent) {
  interactiveUpdates(dispatchEvent, topLevelType, nativeEvent)
}

function dispatchEvent(topLevelType, nativeEvent) {
  // console.log(topLevelType, nativeEvent.target)
  // if (topLevelType === 'dblclick') debugger

  const target = getEventTarget(nativeEvent)
  let inst = getClosestInstanceFromNode(target)
  // TODO isMounted eg: img onload maybe get an event before committing

  const bookKeeping = getTopLevelCallbackBookKeeping(topLevelType, nativeEvent,
  inst)

  try {
    batchedUpdates(handleTopLevel, bookKeeping)
  } finally {
    releaseTopLevelCallbackBookKeeping(bookKeeping)
  }
}
