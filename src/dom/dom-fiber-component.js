import { registrationNameModules } from '../event/registry.js'
import { listenTo } from '../event/event-emitter.js'
import { trapBubbledEvent } from '../event/dom-event-listener.js'
import { TOP_LOAD, mediaEventTypes, TOP_ERROR, TOP_RESET, TOP_SUBMIT, TOP_TOGGLE, TOP_INVALID } from '../event/dom-event-types.js'
import * as ReactDOMFiberInput from '../dom/dom-fiber-input'
import * as InputValueTracker from '../dom/input-value-track'

const DANGEROUSLY_SET_INNER_HTML = 'dangerouslySetInnerHTML'
const SUPPRESS_CONTENT_EDITABLE_WARNING = 'suppressContentEditableWarning'
const SUPPRESS_HYDRATION_WARNING = 'suppressHydrationWarning'
const AUTOFOCUS = 'autoFocus'
const CHILDREN = 'children'
const STYLE = 'style'
const HTML = '__html'

function trapClickOnNonInteractiveElement(node) {
  node.onclick = noop
}

export function setInitialProperties(domElement, tag, rawProps) {
  let props
  switch (tag) {
    case 'iframe':
    case 'object':
      trapBubbledEvent(TOP_LOAD, domElement)
      props = rawProps
      break
    case 'video':
    case 'audio':
      for(let i = 0; i < mediaEventTypes.length; i++) {
        trapBubbledEvent(mediaEventTypes[i], domElement)
      }
      props = rawProps
      break
    case 'source':
      trapBubbledEvent(TOP_ERROR, domElement)
      props = rawProps
      break
    case 'img':
    case 'image':
    case 'link':
      trapBubbledEvent(TOP_ERROR, domElement)
      trapBubbledEvent(TOP_LOAD, domElement)
      props = rawProps
      break
    case 'form':
      trapBubbledEvent(TOP_RESET, domElement)
      trapBubbledEvent(TOP_SUBMIT, domElement)
      props = rawProps
      break
    case 'detail':
      trapBubbledEvent(TOP_TOGGLE, domElement)
      props = rawProps
      break
    case 'input':
      ReactDOMFiberInput.initWrapperState(domElement, rawProps)
      props = ReactDOMFiberInput.getHostProps(domElement, rawProps)
      trapBubbledEvent(TOP_INVALID, domElement)
      listenTo('onChange')
      break
    case 'option':
    case 'select':
    case 'textarea':
    // TODO
    default:
      props = rawProps
      break
  }
  // TODO validate props
  setInitialDOMProperties(
    tag,
    domElement,
    props
  )

  switch (tag) {
    case 'input':
      InputValueTracker.track(domElement)
      ReactDOMFiberInput.postMountWrapper(domElement, rawProps)
      break
    case 'textarea':
    case 'select':
    case 'option':
    // TODO
    default:
      if (typeof props.onClick === 'function') {
        trapClickOnNonInteractiveElement(domElement)
      }
      break
  }
}

function setInitialDOMProperties(tag, domElement, nextProps) {
  for (const propKey in nextProps) {
    if (!nextProps.hasOwnProperty(propKey)) continue

    const nextProp = nextProps[propKey]

    if (propKey === STYLE) {
      for (let styleName in nextProp) {
        if (!nextProp.hasOwnProperty(styleName)) continue
        // TODO check style value , eg: add px to number value
        domElement.style[styleName] = nextProp[styleName]
      }
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
      const nextHTML = nextProp ? nextProp[HTML] : undefined
      if (nextHTML != null) {
        domElement.innerHTML = nextHTML
      }
    } else if (propKey === CHILDREN) {
      // TODO if domElement has children
      if (typeof nextProp === 'string') {
        if (tag !== 'textarea' || nextProp !== '') {
          domElement.textContent = nextProp
        }
      } else if (typeof nextProp === 'number') {
        domElement.textContent = nextProp
      }
    } else if (registrationNameModules.hasOwnProperty(propKey)) {
      listenTo(propKey)
    } else if (nextProp != null) {
      let name = propKey === 'className' ? 'class' : propKey
      let value = nextProp
      if (value === null) {
        domElement.removeAttribute(name)
      } else {
        // TODO boolean
        domElement.setAttribute(name, value)
      }
    }
  }
}

function noop() {}

export function diffProperties(domElement, tag, lastRawProps, nextRawProps) {
  let updatePayload = null
  // TODO controlled component

  let lastProps = lastRawProps
  let nextProps = nextRawProps
  if (typeof lastProps.onClick !== 'function' && typeof nextProps.onClick === 'function') {
    // safari bubble delegate problem
    domElement.onclick = noop
  }

  // TODO valid props

  let propKey
  let styleName
  let styleUpdates = null

  for (propKey in lastProps) {
    if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) || lastProps[propKey] == null) {
      continue
    }

    if (propKey === STYLE) {
      // TODO
    } else if (registrationNameModules.hasOwnProperty(propKey)) {
      if (!updatePayload) {
        updatePayload = []
      }
    } else {
      (updatePayload = updatePayload || []).push(propKey, null)
    }
  }

  for (propKey in nextProps) {
    const nextProp = nextProps[propKey]
    const lastProp = lastProps != null ? lastProps[propKey] : undefined

    if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp || (nextProp == null && lastProp == null)) {
      continue
    }
    if (propKey === STYLE) {
      // TODO
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
      const nextHtml = nextProp ? nextProp[HTML] : undefined
      const lastHtml = lastProp ? lastProp[HTML] : undefined
      if (nextHtml != null) {
        if (lastHtml !== nextHtml) {
          (updatePayload = updatePayload || []).push(propKey, '' + nextHtml)
        }
      }
    } else if (propKey === CHILDREN) {
      if (lastProp !== nextProp && (typeof nextProp === 'string' || typeof nextProp === 'number')) {
        (updatePayload = updatePayload || []).push(propKey, '' + nextProp)
      }
    } else if (registrationNameModules.hasOwnProperty(propKey)) {
      if (nextProp !== null) {
        listenTo(propKey)
      }
      if (!updatePayload && lastProp !== nextProp) {
        updatePayload = []
      }
    } else {
      (updatePayload = updatePayload || []).push(propKey, nextProp)
    }
  }

  if (styleUpdates) {
    (updatePayload = updatePayload || []).push(STYLE, styleUpdates)
  }

  return updatePayload
}

export function updateProperties(domElement, updatePayload, tag, lastRawProps, nextRawProps) {
  // TODO udate check for input radio

  updateDOMProperties(domElement, updatePayload)

  // TODO controlled tag eg: input textarea slelect
}

function updateDOMProperties(domElement, updatePayload) {
  for(let i = 0; i < updatePayload.length; i += 2) {
    const propKey = updatePayload[i]
    const propValue = updatePayload[i + 1]
    if (propKey === STYLE) {
      // TODO setValueForStyles
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
      domElement.innerHTML = propValue
    } else if (propKey === CHILDREN) {
      // TODO optimize for get firstchild and set nodevalue is faster
      domElement.textContent = propValue
    } else {
      // others
    }
  }
}
