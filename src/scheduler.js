let now
if (typeof performance === 'object' && typeof performance.now === 'function') {
  now = function() {
    return performance.now()
  }
} else {
  now = function() {
    return Date.now()
  }
}

export {now}
