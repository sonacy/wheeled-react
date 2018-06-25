import { createElement } from './element'
import { Component } from './component.js'
import ReactDom from './dom'

export default {
  createElement,
  Component,
  render: ReactDom.render
}
