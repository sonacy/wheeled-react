import * as DOMRenderer from './reconciler/fiber-reconciler'

class ReactWork {
  constructor() {
    this._callbacks = null
    this._didCommit = false
    this._onCommit = this._onCommit.bind(this)
  }

  then(onCommit) {
    if (this._didCommit) {
      onCommit()
      return
    }

    let callbacks = this._callbacks
    if (callbacks === null) {
      callbacks = this._callbacks = []
    }
    callbacks.push(onCommit)
  }

  _onCommit() {
    if (this._didCommit) return
    this._didCommit = true
    const callbacks = this._callbacks
    if (callbacks === null) return
    // TODO: Error handling
    for (let i = 0; i < callbacks.length; i++) {
      const callback = callbacks[i]
      callback()
    }
  }
}

class ReactRoot{
  constructor(container, isAsync, hydrate) {
    const root = DOMRenderer.createContainer(container, isAsync, hydrate)
    this._internalRoot = root
  }

  render(children, callback) {
    const root = this._internalRoot
    const work = new ReactWork()
    callback = callback === undefined ? null : callback
    if (callback !== null) {
      work.then(callback)
    }
    DOMRenderer.updateContainer(children, root, null, work._onCommit)
    return work
  }
  unmount(callback) {
    const root = this._internalRoot
    const work = new ReactWork()
    callback = callback === undefined ? null : callback
    if (callback !== null) {
      work.then(callback)
    }
    DOMRenderer.updateContainer(null, root, null, work._onCommit)
    return work
  }
  legacy_renderSubTreeIntoContainer(parentComponent, children, callback) {
    const root = this._internalRoot
    const work = new ReactWork()
    callback = callback === undefined ? null : callback
    if (callback !== null) {
      work.then(callback)
    }
    DOMRenderer.updateContainer(children, root, parentComponent, work._onCommit)
    return work
  }
  createBatch() {}
}

function legacyCreateRootFromDOMContainer(container, forceHydrate) {
  if (!forceHydrate) {
    let rootSibling
    while ((rootSibling = container.lastChild)) {
      container.removeChild(rootSibling)
    }
  }
  const isAsync = false
  return new ReactRoot(container, isAsync, forceHydrate)
}

function legacyRenderSubTreeIntoContainer(parentComponent, children, container, forceHydrate, callback) {
  let root = container._reactRootContainer
  if (!root) {
    // 第一次渲染
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container, forceHydrate)

    if (typeof callback === 'function') {
      const originalCallback = callback
      callback = function () {
        // 第一次渲染时就是null
        const instance = DOMRenderer.getPublicRootInstance(root._internalRoot)
        originalCallback.call(instance)
      }
    }

    // 初始化渲染
    DOMRenderer.unbatchedUpdates(() => {
      if (parentComponent != null) {
        root.legacy_renderSubTreeIntoContainer(
          parentComponent,
          children,
          callback
        )
      } else {
        root.render(children, callback)
      }
    })
  } else {
    // 非第一次渲染
    if (typeof callback === 'function') {
      const originalCallback = callback
      callback = function () {
        // 第一次渲染时就是null
        const instance = DOMRenderer.getPublicRootInstance(root._internalRoot)
        originalCallback.call(instance)
      }
    }

    if (parentComponent != null) {
      root.legacy_renderSubTreeIntoContainer(
        parentComponent,
        children,
        callback
      )
    } else {
      root.render(children, callback)
    }
  }

  return DOMRenderer.getPublicRootInstance(root._internalRoot)
}

const ReactDom = {
  render(element, container, callback) {
    return legacyRenderSubTreeIntoContainer(
      null,
      element,
      container,
      false,
      callback
    )
  },
  unstable_renderSubtreeIntoContainer(parentComponent, element, container, callback) {
    return legacyRenderSubTreeIntoContainer(
      parentComponent,
      element,
      container,
      false,
      callback
    )
  }
}

export default ReactDom
