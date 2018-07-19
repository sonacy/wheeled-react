# wheeled-react

> purpose for learn react (v16.4.1)

## ReactDom.render

- 1.babel jsx React.createElement (ReactElement.js)
- 2.ReactDOM.render => legacyRenderSubtreeIntoContainer
- 3.root = container._reactRootContainer = legacyCreateRootFromContainer 创建root对象
  - new ReactRoot() => DOMRenderer.createContainer() => createFiberRoot => createHostRootFiber => createFiber
- 3.2root.render => ReactRoot.prototype.render => 创建ReactWork then(callback) => DOMRenderer.updateContainer() => 计算时间 currentTime expirationTime => updateContainerAtExpirationTime => scheduleRootUpdate
  - createUpdate enqueueUpdate(fiber updateQueue 初始化)
    - 只创建current的updateQueue
  - scheduleWork(workLoop commit)
    - requestWork => performSyncWork => performWork => 循环 performWorkOnRoot findHighestPriorityRoot(设置nextFlushedRoot))
      - finishWork = renderRoot  生成fiber tree 然后生成dom tree
        - createWorkInProgress 根据root current fiber 创建 workinprogress fiber
        - 循环 workloop
          - 循环 nextUnitWork = performUnitOfWork 都在workInProgress
            -1. (host root fiber => App component fiber) next = beginwork => HostRoot => updateHostRoot => processUpdateQueue 克隆一个updateQueue给WorkInProgress Fiber, 确保不指向同一个 => reconcileChildren => reconcileChildrenAtExpirationTime => reconcileChildFibers => 根据child类型是object placeSingleChild(reconcileSingleElement()) => createFiberFromElement => App component fiber
            -2. (App component fiber => div host fiber) next = beginwork => classComponent => updateClassComponent => constructClassInstance 实例化component mountClassInstance() 处理getDerivedStateFromProps生命周期函数 => finishClassComponent => nextChildren = instance.render() => reconcileChildrenAtExpirationTime => mountChildFibers => 根据child类型是object placeSingleChild(reconcileSingleElement()) => createFiberFromElement => div host fiber
            -3. (div host fiber => header host fiber) next = beginwork => HostComponent => updateHostComponent => reconcileChildrenAtExpirationTime => mountChildFibers => 根据child类型是Array => reconcileChildrenArray => 遍历生成child fiber createChildFiber => 返回第一个child fiber 并设置sibling
            -4. (header host fiber => img host fiber) next = beginwork => HostComponent => updateHostComponent => reconcileChildrenAtExpirationTime => mountChildFibers => 根据child类型是Array => reconcileChildrenArray => 遍历生成child fiber createChildFiber => 返回第一个child fiber 并设置sibling
            -5. (img host fiber => h1 host fiber, 生成img dom) next = beginwork => HostComponent => updateHostComponent => reconcileChildrenAtExpirationTime => mountChildFibers => 根据child类型是undefined => deleteRemainingChildren 返回null => 因为next === null, 执行completeUnitOfWork => 循环处理
              -1.completeWork img fiber => workInProgress.tag = HostComponent => createInstance=>createElement=>document.createElement('img'),appendAllChildren,finalizeIntialChildren=>setInitialProperties=>遍历node.setAttribute(name, value)
              -2.有sibling 返回sibling h1 host fiber
            -6. (h1 host fiber => p host fiber, 生成h1 dom, header dom, appendChild) next = beginwork => HostComponent => updateHostComponent => reconcileChildrenAtExpirationTime => mountChildFibers => 根据child类型是null => deleteRemainingChildren => null => 因为next === null, 执行completeUnitOfWork => 循环处理
              -1.completeWork => h1 host fiber => HostComponent => createInstance=>createElement=>document.createElement('h1'),appendAllChildren,finalizeIntialChildren=>setInitialProperties=>遍历node.setAttribute(name, value) children是string,设置textContent=children
              -2.sibling===null, node=node.return, completeWork => header host fiber => HostComponent => createInstance=>createElement=>document.createElement('header'),appendAllChildren=>遍历parent.appendChild(child),finalizeIntialChildren=>setInitialProperties=>遍历node.setAttribute(name, value)
              -3.sibling=p host fiber , 返回
            -7. (p host fiber => text fiber) next = beginwork => HostComponent => updateHostComponent => reconcileChildrenAtExpirationTime => mountChildFibers => 根据child类型是Array => reconcileChildrenArray => 遍历生成child fiber createChildFiber => 返回第一个child fiber 并设置sibling
            -8. (text fiber => code host fiber, 生成text dom node) next = beginwork => HostText => null => completeUnitOfWork => text fiber => HostText => createtTextInstance => document.createTextNode(value) => 返回sibling code host fiber
            -9. (code host fiber => text fiber, 生成code dom) next = beginwork => HostComponent => updateHostComponent => reconcileChildrenAtExpirationTime => mountChildFibers => 根据child类型是null => deleteRemainingChildren 返回null => 因为next === null, 执行completeUnitOfWork => completeWork => HostComponent => createInstance => createElement => document.createElement('code'),appendAllChildren,finalizeIntialChildren=>setInitialProperties=>遍历node.setAttribute(name, value) children是string,设置textContent=children => 返回sibling text fiber
            -10. (text fiber => null) next = beginwork => HostText => null => completeUnitOfWork
              -1.completeWork => text fiber => HostText => createtTextInstance => document.createTextNode(value)
              -2.没有sibling, node=node.return , p host fiber, completeWork => Host Component => createInstance => createElement => document.createElement('p'),appendAllChildren=>遍历添加子dom,finalizeIntialChildren=>setInitialProperties=>遍历node.setAttribute(name, value)
              -3.没有sibling, node=node.return , div host fiber, completeWork => Host Component => createInstance => createElement => document.createElement('div'),appendAllChildren=>遍历添加子dom,finalizeIntialChildren=>setInitialProperties=>遍历node.setAttribute(name, value)
              -4.没有sibling, node=node.return, App component fiber, completework => ClassComponent => null
              -5.没有sibling, node=node.return, root fiber, completework => HostRoot => null
      - completeRoot => commitRoot => prepareForCommit 保存selection状态 => commitBeforeMutationLifecycles getSnapshotBeforeUpdate生命周期函数 => commitAllHostEffects 执行Placement 插入到文档操作 => resetAfterCommit 恢复selection状态 => commitAllLifeCycles componentDidMount生命周期函数

## apenddix

- root fiber 的stateNode 就是root 也就是初始生成的一个对象 对象的current又指向了root fiber
- component fiber 的stateNode 就是component实例对象
- host fiber 的stateNode 就是dom的实例对象
