const DANGEROUSLY_SET_INNER_HTML = 'dangerouslySetInnerHTML'
const SUPPRESS_CONTENT_EDITABLE_WARNING = 'suppressContentEditableWarning'
const SUPPRESS_HYDRATION_WARNING = 'suppressHydrationWarning'
const AUTOFOCUS = 'autoFocus'
const CHILDREN = 'children'
const STYLE = 'style'
const HTML = '__html'

export function setInitialProperties(domElement, tag, rawProps) {
  // TODO init event binding
  // TODO validate props
  setInitialDOMProperties(
    tag,
    domElement,
    rawProps
  )
  // TODO form tag tracking
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
    // TODO event prop
  }
}
