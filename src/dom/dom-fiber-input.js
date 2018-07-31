function isControlled(props) {
  const useChecked = props.type === 'checkbox' || props.type === 'radio'
  return useChecked ? props.checked != null : props.value != null
}

export function setDefaultValue(node, type, value) {
  if (
    type !== 'number' ||
    node.ownerDocument.activeElement !== node
  ) {
    if (value == null) {
      node.defaultValue = '' + node._wrapperState.initialValue
    } else if (node.defaultValue !== '' + value) {
      node.defaultValue = '' + value
    }
  }
}

export function updateChecked(element, props) {
  const checked = props.checked
  if (checked === false) {
    element.removeAttribute('checked')
  } else {
    element.setAttribute('checked', checked)
  }
}

export function updateWrapper(element, props) {
  updateChecked(element, props)

  const value = getSafeValue(props.value)

  if (value != null) {
    if (props.type === 'number') {
      if ( (value === 0 && element.value === '') || element.value != value) {
        element.value = '' + value
      }
    } else if (element.value !== '' + value) {
      element.value = '' + value
    }
  }

  if (props.hasOwnProperty('value')) {
    setDefaultValue(element, props.type, value)
  } else if (props.hasOwnProperty('defaultValue')) {
    setDefaultValue(element, props.type, getSafeValue(props.defaultValue))
  }

  if (props.checked == null && props.defaultChecked != null) {
    element.defaultChecked = !!props.defaultChecked
  }
}

export function getHostProps(element, props) {
  const checked = props.checked
  const node = element
  const hostProps = Object.assign({}, props, {
    defaultChecked: undefined,
    defaultValue: undefined,
    value: undefined,
    checked: checked != null ? checked: node._wrapperState.initialChecked
  })
  return hostProps
}

export function initWrapperState(element, props) {
  const node = element
  const defaultValue = props.defaultValue == null ? '' : props.defaultValue
  node._wrapperState = {
    initialChecked: props.checked != null ? props.checked : props.defaultChecked,
    initialValue: getSafeValue(props.value != null ? props.value : defaultValue),
    controlled: isControlled(props)
  }
}

function getSafeValue(value) {
  switch (typeof value) {
    case 'boolean':
    case 'number':
    case 'string':
    case 'object':
    case 'undefined':
      return value
    default:
      return ''
  }
}

export function postMountWrapper(element, props) {
  const node = element
  if (props.hasOwnProperty('value') || props.hasOwnProperty('defaultValue')) {
    const initialValue = '' + node._wrapperState.initialValue
    const currentVlaue = node.value

    if (initialValue !== currentVlaue) {
      node.value = initialValue
    }

    node.defaultValue = initialValue
  }

  const name = node.name
  if (name !== '') {
    node.name = ''
  }
  node.defaultChecked = !node.defaultChecked
  node.defaultChecked = !!node._wrapperState.initialChecked
  if (name !== '') {
    node.name = name
  }
}
