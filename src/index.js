import { createElement } from './element'
import { Component } from './component.js'
import { createRef } from './ref'
import ReactDom from './dom'
import { REACT_ASYNC_MODE_TYPE, REACT_PLACEHOLDER_TYPE } from './utils/symbols'

export default {
  createElement,
  Component,
  createRef,
  render: ReactDom.render,
  unstable_AsyncMode: REACT_ASYNC_MODE_TYPE,
  Placeholder: REACT_PLACEHOLDER_TYPE,
  unstable_deferredUpdates: ReactDom.unstable_deferredUpdates,
  flushSync: ReactDom.flushSync,
  unstable_createRoot: ReactDom.unstable_createRoot
}
