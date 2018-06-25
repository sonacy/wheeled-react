import { REACT_ELEMENT_TYPE } from './utils/symbols'
import CurrentOwner from './current-owner'

const RESERVED_PROPS = {
  key: true,
  ref: true
}

class ReactElement{
  constructor(type, key, ref, owner, props) {
    this.$$typeof = REACT_ELEMENT_TYPE
    this.type = type
    this.key = key
    this.ref = ref
    this.props = props
    this._owner = owner
  }
}

export function createElement(type, config, children) {
  let key = config.key ? '' + config.key : null
  let ref = config.ref || null
  const props = {}
  let propName
  if (config != null) {
    for(propName in config) {
      if (config.hasOwnProperty(propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName]
      }
    }

    const childrenLength = arguments.length - 2
    if (childrenLength === 1) {
      props.children = children
    } else if (childrenLength > 1) {
      const childArray = Array(childrenLength)
      for(let i = 0; i < childArray.length; i++) {
        childArray[i] = arguments[i + 2]
      }
      props.children = childArray
    }

    if (type && type.defaultProps) {
      const defaultProps = type.defaultProps
      for(propName in defaultProps) {
        if(props[propName] === undefined) {
          props[propName] = defaultProps[propName]
        }
      }
    }
  }

  return new ReactElement(type, key, ref, CurrentOwner.current, props)
}
