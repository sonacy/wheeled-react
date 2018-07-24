import { HostComponent, HostText } from '../utils/type-of-work'

const randomKey = Math.random().toString(36).slice(2)
const internalInstanceKey = '__reactInternalInstance$' + randomKey
const internalEventHandlersKey = '__reactEventHandlers$' + randomKey

export function precacheFiberNode(hostInst, node) {
  node[internalInstanceKey] = hostInst
}

export function updateFiberProps(node, props) {
  node[internalEventHandlersKey] = props
}

export function getFiberCurrentPropsFromNode(node) {
  return node[internalEventHandlersKey] || null
}

export function getNodeFromInstance(inst) {
  if (inst.tag === HostComponent || inst.tag === HostText) {
    return inst.stateNode
  }
}

export function getInstanceFromNode(node) {
  const inst = node[internalInstanceKey]
  if (inst) {
    if (inst.tag === HostComponent || inst.tag === HostText) {
      return inst
    }
  }
  return null
}

export function getClosestInstanceFromNode(node) {
  if (node[internalInstanceKey]) {
    return node[internalInstanceKey]
  }

  while (!node[internalInstanceKey]) {
    if (node.parentNode) {
      node = node.parentNode
    } else {
      return null
    }
  }

  const inst = node[internalInstanceKey]
  if (inst) {
    if (inst.tag === HostComponent || inst.tag === HostText) {
      return inst
    }
  }
  return null
}
