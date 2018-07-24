import * as EventPluginHub from '../event/plugin-hub'
import * as EventPluginUtils from '../event/plugin-utils'
import Order from '../event/event-order'
import * as ReactDOMComponentTree from './dom-component-tree'
import SimpleEventPlugin from '../event/simple-event-plugin'

EventPluginHub.injection.injectEventPluginOrder(Order)
EventPluginUtils.injection.injectComponentTree(ReactDOMComponentTree)

EventPluginHub.injection.injectEventPluginsByName({
  SimpleEventPlugin
})
