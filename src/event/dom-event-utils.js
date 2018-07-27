export function getEventTarget(nativeEvent) {
  let target = nativeEvent.target || nativeEvent.srcElement || window
  // TODO svg TEXT_NODE
  return target.nodeType === 3 ? target.parentNode : target
}

export function accumulateInto(current, next) {
  if (current == null) return next

  if (Array.isArray(current)) {
    if (Array.isArray(next)) {
      current.push.apply(current, next)
      return current
    }

    current.push(next)
    return current
  }

  if (Array.isArray(next)) {
    return [current].concat(next)
  }

  return [current, next]
}

export function forEachAccumulate(arr, cb, scope) {
  if (Array.isArray(arr)) {
    arr.forEach(cb, scope)
  } else {
    cb.call(scope, arr)
  }
}

export function isEventSupported(eventName, capture) {
  const name = 'on' + eventName
  let isSupported = eventName in document
  if (!isSupported) {
    const element = document.createElement('div')
    element.setAttribute(eventName, 'return;')
    isSupported = typeof element[eventName] === 'function'
  }

  return isSupported
}
