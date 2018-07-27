function isControlled(props) {
  const useChecked = props.type === 'checkbox' || props.type === 'radio'
  return useChecked ? props.checked !== null : props.value !== null
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
      node.value = currentVlaue
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
