export function track(node) {
  if (getTracker(node)) return

  node._valueTracker = trackValueOnNode(node)
}

function getTracker(node) {
  return node._valueTracker
}

function detachTracker(node) {
  node._valueTracker = null
}

function isCheckable(elem) {
  const type = elem.type
  const nodeName = elem.nodeName
  return (
    nodeName && nodeName.toLowerCase() === 'input' && (
      type === 'checkbox' || type === 'radio'
    )
  )
}

function trackValueOnNode(node) {
  const valueField = isCheckable(node) ? 'checked' : 'value'
  const descriptor = Object.getOwnPropertyDescriptor(node.constructor.prototype, valueField)
  let currentValue = '' + node[valueField]

  if (node.hasOwnProperty(valueField) ||
    typeof descriptor === 'undefined' ||
    typeof descriptor.get !== 'function' ||
    typeof descriptor.set !== 'function'
  ) return

  const {get, set} = descriptor
  Object.defineProperty(node, valueField, {
    configurable: true,
    get: function() {
      return get.call(this)
    },
    set: function(value) {
      currentValue = '' + value
      set.call(this, value)
    }
  })

  // IE bug
  Object.defineProperty(node, valueField, {
    enumerable: descriptor.enumerable
  })

  const tracker = {
    getValue() {
      return currentValue
    },
    setValue(value) {
      currentValue = '' + value
    },
    stopTracking() {
      detachTracker(node)
      delete node[valueField]
    }
  }

  return tracker
}

function getValueFromNode(node) {
  let value = ''
  if (!node) return value
  if (isCheckable(node)) {
    value = node.checked ? 'true': 'false'
  } else {
    value = node.value
  }
  return value
}

export function updateValueIfChanged(node) {
  if (!node) return false
    const tracker = getTracker(node)
    if (!tracker) return true

    const lastValue = tracker.getValue()
    const nextValue = getValueFromNode(node)

    if (nextValue !== lastValue) {
      tracker.setValue(nextValue)
      return true
    }
    return false
}
