import { createElement } from './element'
import { Component } from './component.js'
import { createRef } from './ref'
import ReactDom from './dom'

export default {
  createElement,
  Component,
  createRef,
  render: ReactDom.render
}
