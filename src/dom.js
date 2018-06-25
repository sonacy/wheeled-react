import * as DOMRenderer from './reconciler/fiber-reconciler'

class ReactRoot{
  constructor(container, isAsync, hydrate) {
    const root = DOMRenderer.createContainer(container, isAsync, hydrate)
    this._internalRoot = root
  }

  render(children, callback) {}
  unmount(callback) {}
  legacy_renderSubTreeIntoContainer(parentComponent, children, callback) {}
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
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container, forceHydrate)
  }
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
