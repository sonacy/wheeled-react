import { precacheFiberNode, updateFiberProps } from './dom-component-tree'
import { setInitialProperties, updateProperties } from './dom-fiber-component'

export function shouldSetTextContent(type, props) {
  return (
    type === 'textarea' ||
    typeof props.children === 'string' ||
    typeof props.children === 'number' ||
    (typeof props.dangerouslySetInnerHTML === 'object' &&
      props.dangerouslySetInnerHTML !== null &&
      typeof props.dangerouslySetInnerHTML.__html === 'string')
  )
}

export function createTextInstance(text, internalInstanceHandle) {
  const textNode = document.createTextNode(text)
  precacheFiberNode(internalInstanceHandle, textNode)
  return textNode
}

export function createInstance(type, props, internalInstanceHandle) {
  const domElement = document.createElement(type)
  precacheFiberNode(internalInstanceHandle, domElement)
  updateFiberProps(domElement, props)
  return domElement
}

export function appendInitialChild(parent, child) {
  parent.appendChild(child)
}

export function finalizeInitialChildren(domElement, type, props) {
  setInitialProperties(domElement, type, props)
  return shouldAutoFocusHostComponent(type, props)
}

function shouldAutoFocusHostComponent(type, props) {
  switch (type) {
    case 'button':
    case 'input':
    case 'select':
    case 'textarea':
      return !!props.autoFocus
  }
  return false
}


export function appendChild(parent, child) {
  parent.appendChild(child)
}

export function commitUpdate(domElement, updatePayload, type, oldProps, newProps, internalInstanceHandle) {
  updateFiberProps(domElement, newProps)
  updateProperties(domElement, updatePayload, type, oldProps, newProps)
}
