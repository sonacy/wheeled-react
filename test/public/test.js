(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
'use strict';

var REACT_ELEMENT_TYPE = Symbol.for('react.element');
var REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');

var ReactCurrentOwner = {
  current: null
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var RESERVED_PROPS = {
  key: true,
  ref: true
};

var ReactElement = function ReactElement(type, key, ref, owner, props) {
  classCallCheck(this, ReactElement);

  this.$$typeof = REACT_ELEMENT_TYPE;
  this.type = type;
  this.key = key;
  this.ref = ref;
  this.props = props;
  this._owner = owner;
};

function createElement(type, config, children) {
  var key = null;
  var ref = null;
  var props = {};
  var propName = void 0;
  if (config != null) {
    key = config.key ? '' + config.key : null;
    ref = config.ref || null;
    for (propName in config) {
      if (config.hasOwnProperty(propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childArray.length; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  return new ReactElement(type, key, ref, ReactCurrentOwner.current, props);
}

/**
 * abstract for a update queue
 */
var ReactNoopUpdateQueue = {
  isMounted: function isMounted(publicInstance) {
    return false;
  },
  enqueueForceUpdate: function enqueueForceUpdate(publicInstance, callback, callerName) {
    console.warn(publicInstance, 'forceUpdate');
  },
  enqueueReplaceState: function enqueueReplaceState(publicInstance, completeState, callback, callerName) {
    console.warn(publicInstance, 'replaceState');
  },
  enqueueSetState: function enqueueSetState(publicInstance, partialState, callback, callerName) {
    console.warn(publicInstance, 'setState');
  }
};

var emptyObject = {};

var Component = function () {
  function Component(props, context, updater) {
    classCallCheck(this, Component);

    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
  }

  createClass(Component, [{
    key: 'isReactComponent',
    value: function isReactComponent() {}
  }, {
    key: 'setState',
    value: function setState(partialState, callback) {
      this.updater.enqueueSetState(this, partialState, callback, 'setState');
    }
  }, {
    key: 'forceUpdate',
    value: function forceUpdate(callback) {
      this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
    }
  }]);
  return Component;
}();

// Don't change these two values. They're used by React Dev Tools.
var NoEffect = /*              */0;
var PerformedWork = /*         */1;

// You can change the rest (and add more).
var Placement = /*             */2;
var Update = /*                */4;
var PlacementAndUpdate = /*    */6;
var Deletion = /*              */8;
var Callback = /*              */32;
var DidCapture = /*            */64;
var Snapshot = /*              */256;

var Incomplete = /*            */512;

// Max 31 bit integer. The max integer size in V8 for 32-bit systems.
// Math.pow(2, 30) - 1
// 0b111111111111111111111111111111
var MAX_SIGNED_31_BIT_INT = 1073741823;

var NoWork = 0;
var Sync = 1;
var Never = MAX_SIGNED_31_BIT_INT;

var UNIT_SIZE = 10;
var MAGIC_NUMBER_OFFSET = 2;

function msToExpirationTime(ms) {
  return (ms / UNIT_SIZE | 0) + MAGIC_NUMBER_OFFSET;
}

var IndeterminateComponent = 0; // Before we know whether it is functional or class
var FunctionalComponent = 1;
var ClassComponent = 2;
var HostRoot = 3; // Root of a host tree. Could be nested inside another node.
var HostPortal = 4; // A subtree. Could be an entry point to a different renderer.
var HostComponent = 5;
var HostText = 6;
var Fragment = 10;

var NoContext = 0;
var AsyncMode = 1;
var StrictMode = 2;

var FiberNode = function FiberNode(tag, pendingProps, key, mode) {
  classCallCheck(this, FiberNode);

  // instance
  this.tag = tag;
  this.key = key;
  this.type = null;
  this.stateNode = null;

  // fiber
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  this.pendingProps = pendingProps;
  this.memorizedProps = null;
  this.updateQueue = null;
  this.memorizedState = null;

  this.mode = mode;

  // effects
  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  this.expirationTime = NoWork;

  this.alternate = null;
};

var createFiber = function createFiber(tag, pendingProps, key, mode) {
  return new FiberNode(tag, pendingProps, key, mode);
};

var createHostRootFiber = function createHostRootFiber(isAsync) {
  var mode = isAsync ? AsyncMode | StrictMode : NoContext;
  return createFiber(HostRoot, null, null, mode);
};

function createWorkInProgress(current, pendingProps, expirationTime) {
  var workInProgress = current.alternate;
  if (workInProgress === null) {
    workInProgress = createFiber(current.tag, pendingProps, current.key, current.mode);
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    workInProgress.pendingProps = pendingProps;
    workInProgress.effectTag = NoEffect;
    workInProgress.nextEffect = null;
    workInProgress.lastEffect = null;
    workInProgress.firstEffect = null;
  }

  workInProgress.child = current.child;
  workInProgress.memorizedProps = current.memorizedProps;
  workInProgress.memorizedState = current.memorizedState;
  workInProgress.updateQueue = current.updateQueue;
  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;
  workInProgress.ref = current.ref;

  return workInProgress;
}

function shouldConstruct(Component) {
  return !!(Component.prototype && Component.prototype.isReactComponent);
}

function createFiberFromText(content, mode, expirationTime) {
  var fiber = createFiber(HostText, content, null, mode);
  fiber.expirationTime = expirationTime;
  return fiber;
}

function createFiberFromElement(element, mode, expirationTime) {
  var fiber = void 0;
  var type = element.type;
  var key = element.key;
  var pendingProps = element.props;

  var fiberTag = void 0;
  if (typeof type === 'function') {
    // component
    fiberTag = shouldConstruct(type) ? ClassComponent : IndeterminateComponent;
  } else if (typeof type === 'string') {
    fiberTag = HostComponent;
  }

  // TODO frament and so on

  fiber = createFiber(fiberTag, pendingProps, key, mode);
  fiber.type = type;
  fiber.expirationTime = expirationTime;
  return fiber;
}

function createFiberRoot(containerInfo, isAsync, hydrate) {
  var uninitializedFiber = createHostRootFiber(isAsync);
  var root = {
    current: uninitializedFiber,
    containerInfo: containerInfo,
    pendingChildren: null,

    earliestPendingTime: NoWork,
    latestPendingTime: NoWork,
    earliestSuspendedTime: NoWork,
    latestSuspendedTime: NoWork,
    latestPingedTime: NoWork,

    didError: false,

    pendingCommitExpirationTime: NoWork,
    finishedWork: null,
    context: null,
    pendingContext: null,
    hydrate: hydrate,
    nextExpirationTimeToWorkOn: NoWork,
    expirationTime: NoWork,
    firstBatch: null,
    nextScheduledRoot: null
  };
  uninitializedFiber.stateNode = root;
  return root;
}

var now = void 0;
if ((typeof performance === 'undefined' ? 'undefined' : _typeof(performance)) === 'object' && typeof performance.now === 'function') {
  now = function now() {
    return performance.now();
  };
} else {
  now = function now() {
    return Date.now();
  };
}

var UpdateState = 0;
var ReplaceState = 1;
var ForceUpdate = 2;
var CaptureUpdate = 3;

var hasForceUpdate = false;

function createUpdateQueue(baseState) {
  var queue = {
    expirationTime: NoWork,
    baseState: baseState,
    firstUpdate: null,
    lastUpdate: null,
    firstCaptureUpdate: null,
    lastCaptureUpdate: null,
    firstEffect: null,
    lastEffect: null,
    firstCaptureEffect: null,
    lastCaptureEffect: null
  };
  return queue;
}

function cloneUpdateQueue(currentQueue) {
  var queue = {
    expirationTime: currentQueue.expirationTime,
    baseState: currentQueue.baseState,
    firstUpdate: currentQueue.firstUpdate,
    lastUpdate: currentQueue.lastUpdate,
    firstCaptureUpdate: null,
    lastCaptureUpdate: null,
    firstEffect: null,
    lastEffect: null,
    firstCaptureEffect: null,
    lastCaptureEffect: null
  };
  return queue;
}

function appendUpdateToQueue(queue, update, expirationTime) {
  if (queue.lastUpdate === null) {
    queue.firstUpdate = queue.lastUpdate = update;
  } else {
    queue.lastUpdate.next = update;
    queue.lastUpdate = update;
  }

  if (queue.expirationTime === NoWork || queue.expirationTime > expirationTime) {
    queue.expirationTime = expirationTime;
  }
}

function createUpdate(expirationTime) {
  return {
    expirationTime: expirationTime,
    tag: UpdateState,
    payload: null,
    callback: null,
    next: null,
    nextEffect: null
  };
}

function enqueueUpdate(fiber, update, expirationTime) {
  var alternate = fiber.alternate;
  var queue1 = void 0;
  var queue2 = void 0;
  if (alternate === null) {
    queue1 = fiber.updateQueue;
    queue2 = null;
    if (queue1 === null) {
      queue1 = fiber.updateQueue = createUpdateQueue(fiber.memorizedState);
    }
  } else {
    // two fibers
    queue1 = fiber.updateQueue;
    queue2 = alternate.updateQueue;
    if (queue1 === null) {
      if (queue2 === null) {
        queue1 = fiber.updateQueue = createUpdateQueue(fiber.memorizedState);
        queue2 = alternate.updateQueue = createUpdateQueue(alternate.memorizedState);
      } else {
        queue1 = fiber.updateQueue = cloneUpdateQueue(queue2);
      }
    } else {
      if (queue2 === null) {
        queue2 = fiber.updateQueue = cloneUpdateQueue(queue1);
      }
    }
  }

  if (queue2 === null || queue1 === queue2) {
    appendUpdateToQueue(queue1, update, expirationTime);
  } else {
    if (queue1.lastUpdate === null || queue2.lastUpdate === null) {
      appendUpdateToQueue(queue1, update, expirationTime);
      appendUpdateToQueue(queue2, update, expirationTime);
    } else {
      appendUpdateToQueue(queue1, update, expirationTime);
      queue2.lastUpdate = update;
    }
  }
}

function ensureWorkInProgressQueueIsAClone(workInProgress, queue) {
  var current = workInProgress.alternate;
  if (current !== null) {
    if (queue === current.updateQueue) {
      queue = workInProgress.updateQueue = cloneUpdateQueue(queue);
    }
  }
  return queue;
}

function getStateFromUpdate(workInProgress, queue, update, prevState, nextProps, instance) {
  switch (update.tag) {
    case ReplaceState:
      // TODO
      break;
    case CaptureUpdate:
      // TODO
      break;
    case UpdateState:
      var payload = update.payload;
      var partialState = void 0;
      if (typeof payload === 'function') {
        partialState = payload.call(instance, prevState, nextProps);
      } else {
        partialState = payload;
      }
      if (partialState === null || partialState === undefined) return prevState;
      return Object.assign({}, prevState, partialState);
      break;
    case ForceUpdate:
      // TODO
      break;
    default:
      return prevState;
      break;
  }
}

function processUpdateQueue(workInProgress, queue, props, instance, renderExpirationTime) {
  hasForceUpdate = false;

  if (queue.expirationTime === NoWork || queue.expirationTime > renderExpirationTime) {
    return;
  }

  queue = ensureWorkInProgressQueueIsAClone(workInProgress, queue);

  var newBaseState = queue.baseState;
  var newFirstUpdate = null;
  var newExpirationTime = NoWork;

  var update = queue.firstUpdate;
  var resultState = newBaseState;

  while (update !== null) {
    var updateExpirationTime = update.expirationTime;
    if (updateExpirationTime > renderExpirationTime) ; else {
      resultState = getStateFromUpdate(workInProgress, queue, update, resultState, props, instance);
      var callback = update.callback;
      if (callback !== null) {
        workInProgress.effectTag |= Callback;
        update.nextEffect = null;
        if (queue.lastEffect === null) {
          queue.firstEffect = queue.lastEffect = update;
        } else {
          // ????
          queue.lastEffect.nextEffect = update;
          queue.lastEffect = update;
        }
      }
    }
    update = update.next;
  }

  // TODO capture update
  var newFirstCapturedUpdate = null;

  {
    queue.lastUpdate = null;
  }
  {
    queue.firstCaptureUpdate = null;
  }
  {
    newBaseState = resultState;
  }
  queue.baseState = newBaseState;
  queue.firstUpdate = newFirstUpdate;
  queue.firstCaptureEffect = newFirstCapturedUpdate;
  queue.expirationTime = newExpirationTime;
  workInProgress.memorizedState = resultState;
}

function resetHasForceUpdateBeforeProcessing() {
  hasForceUpdate = false;
}

function checkHasForceUpdateAfterProcessing() {
  return hasForceUpdate;
}

function get$1(key) {
  return key._reactInternalFiber;
}

function set$1(key, value) {
  key._reactInternalFiber = value;
}

var classComponentUpdater = {
  isMounted: function isMounted(inst) {
    // TODO
  },
  enqueueForceUpdate: function enqueueForceUpdate(inst, callback) {
    // TODO
  },
  enqueueReplaceState: function enqueueReplaceState(inst, payload, callback) {
    // TODO
  },
  enqueueSetState: function enqueueSetState(inst, payload, callback) {
    var fiber = get$1(inst);
    var currentTime = requestCurrentTime();
    var expirationTime = computeExpirationForFiber(currentTime, fiber);
    var update = createUpdate(expirationTime);
    update.payload = payload;
    if (callback !== null && callback !== undefined) {
      update.callback = callback;
    }

    enqueueUpdate(fiber, update, expirationTime);
    scheduleWork(fiber, expirationTime);
  }
};

function adoptClassInstance(workInProgress, instance) {
  instance.updater = classComponentUpdater;
  workInProgress.stateNode = instance;
  set$1(instance, workInProgress);
}

function constructClassInstance(workInProgress, props, renderExpirationTime) {
  var ctor = workInProgress.type;
  // TODO context
  var context = {};
  var instance = new ctor(props, context);
  var state = workInProgress.memorizedState = instance.state !== null && instance.state !== undefined ? instance.state : null;
  adoptClassInstance(workInProgress, instance);
  // TODO cache unmasked context
  return instance;
}

function mountClassInstance(workInProgress, renderExpirationTime) {
  var ctor = workInProgress.type;
  var instance = workInProgress.stateNode;
  var props = workInProgress.pendingProps;

  instance.props = props;
  instance.state = workInProgress.memorizedState;
  instance.ref = {};
  instance.context = {}; // TODO maskedContext

  var updateQueue = workInProgress.updateQueue;
  if (updateQueue !== null) {
    processUpdateQueue(workInProgress, updateQueue, props, instance, renderExpirationTime);
    instance.state = workInProgress.memorizedState;
  }

  var getDerivedStateFromProps = ctor.getDerivedStateFromProps;
  if (typeof getDerivedStateFromProps === 'function') {
    applyDerivedStateFromProps(workInProgress, getDerivedStateFromProps, props);
    instance.state = workInProgress.memorizedState;
  }

  if (typeof instance.componentDidMount === 'function') {
    workInProgress.effectTag |= Update;
  }
}

function applyDerivedStateFromProps(workInProgress, getDerivedStateFromProps, nextProps) {
  var prevState = workInProgress.memorizedState;

  var partialState = getDerivedStateFromProps(nextProps, prevState);
  var memorizedState = partialState === null || partialState === undefined ? prevState : Object.assign({}, prevState, partialState);
  workInProgress.memorizedState = memorizedState;
  var updateQueue = workInProgress.updateQueue;
  if (updateQueue !== null && updateQueue.expirationTime === NoWork) {
    updateQueue.baseState = memorizedState;
  }
}

function updateClassInstance(current, workInProgress, renderExpirationTime) {
  var ctor = workInProgress.type;
  var instance = workInProgress.stateNode;

  var oldProps = workInProgress.memorizedProps;
  var newProps = workInProgress.pendingProps;
  instance.props = oldProps;

  // TODO context

  var getDerivedStateFromProps = ctor.getDerivedStateFromProps;

  resetHasForceUpdateBeforeProcessing();

  var oldState = workInProgress.memorizedState;
  var newState = instance.state = oldState;
  var updateQueue = workInProgress.updateQueue;
  if (updateQueue !== null) {
    processUpdateQueue(workInProgress, updateQueue, newProps, instance, renderExpirationTime);
    newState = workInProgress.memorizedState;
  }

  if (oldProps === newProps && oldState === newState && !checkHasForceUpdateAfterProcessing() && !false /*hasContextChanged()*/) {
      if (typeof instance.componentDidUpdate === 'function') {
        if (oldProps !== current.memorizedProps || oldState !== current.memorizedState) {
          workInProgress.effectTag |= Update;
        }
      }

      if (typeof instance.getSnapshotBeforeUpdate === 'function') {
        if (oldProps !== current.memorizedProps || oldState !== current.memorizedState) {
          workInProgress.effectTag |= Snapshot;
        }
      }

      return false;
    }

  if (typeof getDerivedStateFromProps === 'function') {
    applyDerivedStateFromProps(workInProgress, getDerivedStateFromProps, newProps);
    newState = workInProgress.memorizedState;
  }

  var shouldUpdate = checkHasForceUpdateAfterProcessing() || checkShouldComponentUpdate(workInProgress, oldProps, newProps, oldState, newState
  // newContext
  );

  if (shouldUpdate) {
    if (typeof instance.componentDidUpdate === 'function') {
      workInProgress.effectTag |= Update;
    }

    if (typeof instance.getSnapshotBeforeUpdate === 'function') {
      workInProgress.effectTag |= Snapshot;
    }
  } else {
    if (typeof instance.componentDidUpdate === 'function') {
      if (oldProps !== current.memorizedProps || oldState !== current.memorizedState) {
        workInProgress.effectTag |= Update;
      }
    }

    if (typeof instance.getSnapshotBeforeUpdate === 'function') {
      if (oldProps !== current.memorizedProps || oldState !== current.memorizedState) {
        workInProgress.effectTag |= Snapshot;
      }
    }

    workInProgress.memorizedProps = newProps;
    workInProgress.memorizedState = newState;
  }

  instance.props = newProps;
  instance.state = newState;
  return shouldUpdate;
}

function checkShouldComponentUpdate(workInProgress, oldProps, newProps, oldState, newState) {
  var instance = workInProgress.stateNode;
  var ctor = workInProgress.type;
  if (typeof instance.shouldComponentUpdate === 'function') {
    var shouldUpdate = instance.shouldComponentUpdate(newProps, newState);
    return shouldUpdate;
  }

  // TODO purecomponent
  return true;
}

var randomKey = Math.random().toString(36).slice(2);
var internalInstanceKey = '__reactInternalInstance$' + randomKey;
var internalEventHandlersKey = '__reactEventHandlers$' + randomKey;

function precacheFiberNode(hostInst, node) {
  node[internalInstanceKey] = hostInst;
}

function updateFiberProps(node, props) {
  node[internalEventHandlersKey] = props;
}

function getFiberCurrentPropsFromNode(node) {
  return node[internalEventHandlersKey] || null;
}

function getNodeFromInstance(inst) {
  if (inst.tag === HostComponent || inst.tag === HostText) {
    return inst.stateNode;
  }
}

function getInstanceFromNode(node) {
  var inst = node[internalInstanceKey];
  if (inst) {
    if (inst.tag === HostComponent || inst.tag === HostText) {
      return inst;
    }
  }
  return null;
}

function getClosestInstanceFromNode(node) {
  if (node[internalInstanceKey]) {
    return node[internalInstanceKey];
  }

  while (!node[internalInstanceKey]) {
    if (node.parentNode) {
      node = node.parentNode;
    } else {
      return null;
    }
  }

  var inst = node[internalInstanceKey];
  if (inst) {
    if (inst.tag === HostComponent || inst.tag === HostText) {
      return inst;
    }
  }
  return null;
}

var ReactDOMComponentTree = /*#__PURE__*/Object.freeze({
  precacheFiberNode: precacheFiberNode,
  updateFiberProps: updateFiberProps,
  getFiberCurrentPropsFromNode: getFiberCurrentPropsFromNode,
  getNodeFromInstance: getNodeFromInstance,
  getInstanceFromNode: getInstanceFromNode,
  getClosestInstanceFromNode: getClosestInstanceFromNode
});

var eventPluginOrder = void 0;
var namesToPlugins = {};

var plugins = [];
var registrationNameModules = {};
var registrationNameDependencies = {};

function injectEventPluginOrder(injectedEventPluginOrder) {
  eventPluginOrder = Array.prototype.slice.call(injectedEventPluginOrder);
  recomputePluginOrdering();
}

function injectEventPluginsByName(injectedNamesToPlugins) {
  var isOrderingDirty = false;
  for (var name in injectedNamesToPlugins) {
    if (!injectedNamesToPlugins.hasOwnProperty(name)) continue;

    var module = injectedNamesToPlugins[name];

    if (!namesToPlugins.hasOwnProperty(name) || namesToPlugins[name] !== module) {
      namesToPlugins[name] = module;
      isOrderingDirty = true;
    }
  }

  if (isOrderingDirty) recomputePluginOrdering();
}

function recomputePluginOrdering() {
  if (!eventPluginOrder) return;

  for (var name in namesToPlugins) {
    var module = namesToPlugins[name];
    var index = eventPluginOrder.indexOf(name);
    if (plugins[index]) continue;
    plugins[index] = module;
    var publishedEvents = module.eventTypes;
    for (var eventName in publishedEvents) {
      publishEventForPlugin(publishedEvents[eventName], module, eventName);
    }
  }
}

function publishEventForPlugin(dispatchConfig, pluginModule, eventName) {

  var phasedRegistrationNames = dispatchConfig.phasedRegistrationNames;

  if (phasedRegistrationNames) {
    for (var phaseName in phasedRegistrationNames) {
      if (phasedRegistrationNames.hasOwnProperty(phaseName)) {
        var phasedRegistrationName = phasedRegistrationNames[phaseName];
        publishRegistationName(phasedRegistrationName, pluginModule, eventName);
      }
    }
  } else if (dispatchConfig.registrationName) {
    publishRegistationName(dispatchConfig.registrationName, pluginModule, eventName);
  }
}

function publishRegistationName(registrationName, pluginModule, eventName) {
  registrationNameModules[registrationName] = pluginModule;
  registrationNameDependencies[registrationName] = pluginModule.eventTypes[eventName].dependencies;
}

// TODO vendors for animation
var TOP_ABORT = 'abort';
var TOP_ANIMATION_END = 'animationend';
var TOP_ANIMATION_ITERATION = 'animationiteration';
var TOP_ANIMATION_START = 'animationstart';
var TOP_BLUR = 'blur';
var TOP_CAN_PLAY = 'canplay';
var TOP_CAN_PLAY_THROUGH = 'canplaythrough';

var TOP_CANCEL = 'cancel';
var TOP_CHANGE = 'change';
var TOP_CLICK = 'click';
var TOP_CLOSE = 'close';
var TOP_CONTEXT_MENU = 'contextmenu';
var TOP_COPY = 'copy';
var TOP_CUT = 'cut';
var TOP_DOUBLE_CLICK = 'dblclick';
var TOP_DRAG = 'drag';
var TOP_DRAG_END = 'dragend';
var TOP_DRAG_ENTER = 'dragenter';
var TOP_DRAG_EXIT = 'dragexit';
var TOP_DRAG_LEAVE = 'dragleave';
var TOP_DRAG_OVER = 'dragover';
var TOP_DRAG_START = 'dragstart';
var TOP_DROP = 'drop';
var TOP_DURATION_CHANGE = 'durationchange';
var TOP_EMPTIED = 'emptied';
var TOP_ENCRYPTED = 'encrypted';
var TOP_ENDED = 'ended';
var TOP_ERROR = 'error';
var TOP_FOCUS = 'focus';
var TOP_GOT_POINTER_CAPTURE = 'gotpointercapture';
var TOP_INPUT = 'input';
var TOP_INVALID = 'invalid';
var TOP_KEY_DOWN = 'keydown';
var TOP_KEY_PRESS = 'keypress';
var TOP_KEY_UP = 'keyup';
var TOP_LOAD = 'load';
var TOP_LOAD_START = 'loadstart';
var TOP_LOADED_DATA = 'loadeddata';
var TOP_LOADED_METADATA = 'loadedmetadata';
var TOP_LOST_POINTER_CAPTURE = 'lostpointercapture';
var TOP_MOUSE_DOWN = 'mousedown';
var TOP_MOUSE_MOVE = 'mousemove';
var TOP_MOUSE_OUT = 'mouseout';
var TOP_MOUSE_OVER = 'mouseover';
var TOP_MOUSE_UP = 'mouseup';
var TOP_PASTE = 'paste';
var TOP_PAUSE = 'pause';
var TOP_PLAY = 'play';
var TOP_PLAYING = 'playing';
var TOP_POINTER_CANCEL = 'pointercancel';
var TOP_POINTER_DOWN = 'pointerdown';
var TOP_POINTER_MOVE = 'pointermove';
var TOP_POINTER_OUT = 'pointerout';
var TOP_POINTER_OVER = 'pointerover';
var TOP_POINTER_UP = 'pointerup';
var TOP_PROGRESS = 'progress';
var TOP_RATE_CHANGE = 'ratechange';
var TOP_RESET = 'reset';
var TOP_SCROLL = 'scroll';
var TOP_SEEKED = 'seeked';
var TOP_SEEKING = 'seeking';
var TOP_SELECTION_CHANGE = 'selectionchange';
var TOP_STALLED = 'stalled';
var TOP_SUBMIT = 'submit';
var TOP_SUSPEND = 'suspend';
var TOP_TIME_UPDATE = 'timeupdate';
var TOP_TOGGLE = 'toggle';
var TOP_TOUCH_CANCEL = 'touchcancel';
var TOP_TOUCH_END = 'touchend';
var TOP_TOUCH_MOVE = 'touchmove';
var TOP_TOUCH_START = 'touchstart';
var TOP_TRANSITION_END = 'transitionend';
var TOP_VOLUME_CHANGE = 'volumechange';
var TOP_WAITING = 'waiting';
var TOP_WHEEL = 'wheel';

var mediaEventTypes = [TOP_ABORT, TOP_CAN_PLAY, TOP_CAN_PLAY_THROUGH, TOP_DURATION_CHANGE, TOP_EMPTIED, TOP_ENCRYPTED, TOP_ENDED, TOP_ERROR, TOP_LOADED_DATA, TOP_LOADED_METADATA, TOP_LOAD_START, TOP_PAUSE, TOP_PLAY, TOP_PLAYING, TOP_PROGRESS, TOP_RATE_CHANGE, TOP_SEEKED, TOP_SEEKING, TOP_STALLED, TOP_SUSPEND, TOP_TIME_UPDATE, TOP_VOLUME_CHANGE, TOP_WAITING];

function getEventTarget(nativeEvent) {
  var target = nativeEvent.target || nativeEvent.srcElement || window;
  // TODO svg TEXT_NODE
  return target.nodeType === 3 ? target.parentNode : target;
}

function accumulateInto(current, next) {
  if (current == null) return next;

  if (Array.isArray(current)) {
    if (Array.isArray(next)) {
      current.push.apply(current, next);
      return current;
    }

    current.push(next);
    return current;
  }

  if (Array.isArray(next)) {
    return [current].concat(next);
  }

  return [current, next];
}

function forEachAccumulate(arr, cb, scope) {
  if (Array.isArray(arr)) {
    arr.forEach(cb, scope);
  } else {
    cb.call(scope, arr);
  }
}

function isEventSupported(eventName, capture) {
  var isSupported = eventName in document;
  if (!isSupported) {
    var element = document.createElement('div');
    element.setAttribute(eventName, 'return;');
    isSupported = typeof element[eventName] === 'function';
  }

  return isSupported;
}

function getParent(inst) {
  do {
    inst = inst.return;
  } while (inst && inst.tag !== HostComponent);
  if (inst) return inst;
  return null;
}

function traverseTwoPhase(inst, fn, arg) {
  var path = [];
  while (inst) {
    path.push(inst);
    inst = getParent(inst);
  }

  var i = void 0;
  for (i = path.length; i-- > 0;) {
    fn(path[i], 'captured', arg);
  }
  for (i = 0; i < path.length; i++) {
    fn(path[i], 'bubbled', arg);
  }
}

var getFiberCurrentPropsFromNode$1 = null;
var getNodeFromInstance$1 = null;
var getInstanceFromNode$1 = null;

var injection = {
  injectComponentTree: function injectComponentTree(Injected) {
    getInstanceFromNode$1 = Injected.getInstanceFromNode;
    getNodeFromInstance$1 = Injected.getNodeFromInstance;
    getFiberCurrentPropsFromNode$1 = Injected.getFiberCurrentPropsFromNode;
  }
};

function executeDispatchesInOrder(event) {
  if (event) {
    var dispatchListeners = event._dispatchListeners;
    var dispatchInstances = event._dispatchInstances;
    if (Array.isArray(dispatchListeners)) {
      for (var i = 0; i < dispatchListeners.length; i++) {
        executeDispatch(event, dispatchListeners[i], dispatchInstances[i]);
      }
    } else if (dispatchListeners) {
      executeDispatch(event, dispatchListeners, dispatchInstances);
    }

    event._dispatchInstances = null;
    event._dispatchListeners = null;
  }
}

function executeDispatch(event, listener, inst) {
  listener.call(inst, event);
}

var eventQueue = null;

var injection$1 = {
  injectEventPluginOrder: injectEventPluginOrder,
  injectEventPluginsByName: injectEventPluginsByName
};

function extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
  var events = null;
  for (var i = 0; i < plugins.length; i++) {
    var plugin = plugins[i];
    if (plugin) {
      var extractedEvents = plugin.extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
      if (extractedEvents) {
        events = accumulateInto(events, extractedEvents);
      }
    }
  }
  return events;
}

function runEventInBatch(events) {
  if (events !== null) {
    eventQueue = accumulateInto(eventQueue, events);
  }

  var processingEventQueue = eventQueue;
  eventQueue = null;

  if (!processingEventQueue) return;

  forEachAccumulate(processingEventQueue, executeDispatchesInOrder);
}

function runExtractedEventsInBatch(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
  var events = extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
  runEventInBatch(events);
}

function getListener(inst, registrationName) {
  var stateNode = inst.stateNode;
  if (!stateNode) return null;
  var props = getFiberCurrentPropsFromNode(stateNode);
  if (!props) return null;
  return props[registrationName];
}

function accumulateDirectionalDispatches(inst, phase, event) {
  var listener = getListener(inst, event.dispatchConfig.phasedRegistrationNames[phase]);
  if (listener) {
    event._dispatchListeners = accumulateInto(event._dispatchListeners, listener);
    event._dispatchInstances = accumulateInto(event._dispatchInstances, inst);
  }
}

function accumulateTwoPhaseDispatchesSingle(event) {
  if (event && event.dispatchConfig.phasedRegistrationNames) {
    traverseTwoPhase(event._targetInst, accumulateDirectionalDispatches, event);
  }
}

function accumulateTwoPhaseDispatches(events) {
  forEachAccumulate(events, accumulateTwoPhaseDispatchesSingle);
}

var interactiveEventTypeNames = [[TOP_BLUR, 'blur'], [TOP_CANCEL, 'cancel'], [TOP_CLICK, 'click'], [TOP_CLOSE, 'close'], [TOP_CONTEXT_MENU, 'contextMenu'], [TOP_COPY, 'copy'], [TOP_CUT, 'cut'], [TOP_DOUBLE_CLICK, 'doubleClick'], [TOP_DRAG_END, 'dragEnd'], [TOP_DRAG_START, 'dragStart'], [TOP_DROP, 'drop'], [TOP_FOCUS, 'focus'], [TOP_INPUT, 'input'], [TOP_INVALID, 'invalid'], [TOP_KEY_DOWN, 'keyDown'], [TOP_KEY_PRESS, 'keyPress'], [TOP_KEY_UP, 'keyUp'], [TOP_MOUSE_DOWN, 'mouseDown'], [TOP_MOUSE_UP, 'mouseUp'], [TOP_PASTE, 'paste'], [TOP_PAUSE, 'pause'], [TOP_PLAY, 'play'], [TOP_POINTER_CANCEL, 'pointerCancel'], [TOP_POINTER_DOWN, 'pointerDown'], [TOP_POINTER_UP, 'pointerUp'], [TOP_RATE_CHANGE, 'rateChange'], [TOP_RESET, 'reset'], [TOP_SEEKED, 'seeked'], [TOP_SUBMIT, 'submit'], [TOP_TOUCH_CANCEL, 'touchCancel'], [TOP_TOUCH_END, 'touchEnd'], [TOP_TOUCH_START, 'touchStart'], [TOP_VOLUME_CHANGE, 'volumeChange']];
var nonInteractiveEventTypeNames = [[TOP_ABORT, 'abort'], [TOP_ANIMATION_END, 'animationEnd'], [TOP_ANIMATION_ITERATION, 'animationIteration'], [TOP_ANIMATION_START, 'animationStart'], [TOP_CAN_PLAY, 'canPlay'], [TOP_CAN_PLAY_THROUGH, 'canPlayThrough'], [TOP_DRAG, 'drag'], [TOP_DRAG_ENTER, 'dragEnter'], [TOP_DRAG_EXIT, 'dragExit'], [TOP_DRAG_LEAVE, 'dragLeave'], [TOP_DRAG_OVER, 'dragOver'], [TOP_DURATION_CHANGE, 'durationChange'], [TOP_EMPTIED, 'emptied'], [TOP_ENCRYPTED, 'encrypted'], [TOP_ENDED, 'ended'], [TOP_ERROR, 'error'], [TOP_GOT_POINTER_CAPTURE, 'gotPointerCapture'], [TOP_LOAD, 'load'], [TOP_LOADED_DATA, 'loadedData'], [TOP_LOADED_METADATA, 'loadedMetadata'], [TOP_LOAD_START, 'loadStart'], [TOP_LOST_POINTER_CAPTURE, 'lostPointerCapture'], [TOP_MOUSE_MOVE, 'mouseMove'], [TOP_MOUSE_OUT, 'mouseOut'], [TOP_MOUSE_OVER, 'mouseOver'], [TOP_PLAYING, 'playing'], [TOP_POINTER_MOVE, 'pointerMove'], [TOP_POINTER_OUT, 'pointerOut'], [TOP_POINTER_OVER, 'pointerOver'], [TOP_PROGRESS, 'progress'], [TOP_SCROLL, 'scroll'], [TOP_SEEKING, 'seeking'], [TOP_STALLED, 'stalled'], [TOP_SUSPEND, 'suspend'], [TOP_TIME_UPDATE, 'timeUpdate'], [TOP_TOGGLE, 'toggle'], [TOP_TOUCH_MOVE, 'touchMove'], [TOP_TRANSITION_END, 'transitionEnd'], [TOP_WAITING, 'waiting'], [TOP_WHEEL, 'wheel']];

var eventTypes = {};
var topLevelEventsToDispatchConfig = {};

function addEventTypeNameToConfig(_ref, isInteractive) {
  var _ref2 = slicedToArray(_ref, 2),
      topEvent = _ref2[0],
      event = _ref2[1];

  var capitalizedEvent = event[0].toUpperCase() + event.slice(1);
  var onEvent = 'on' + capitalizedEvent;
  var type = {
    phasedRegistrationNames: {
      bubbled: onEvent,
      captured: onEvent + 'Capture'
    },
    dependencies: [topEvent],
    isInteractive: isInteractive
  };

  eventTypes[event] = type;
  topLevelEventsToDispatchConfig[topEvent] = type;
}

interactiveEventTypeNames.forEach(function (tuple) {
  return addEventTypeNameToConfig(tuple, true);
});
nonInteractiveEventTypeNames.forEach(function (tuple) {
  return addEventTypeNameToConfig(tuple, false);
});

var SimpleEventPlugin = {
  eventTypes: eventTypes,
  isInteractiveTopLevelEventType: function isInteractiveTopLevelEventType(topLevelType) {
    var config = topLevelEventsToDispatchConfig[topLevelType];
    return config !== undefined && config.isInteractive === true;
  },
  extractEvents: function extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    var dispatchConfig = topLevelEventsToDispatchConfig[topLevelType];
    if (!dispatchConfig) return null;
    nativeEvent.dispatchConfig = dispatchConfig;
    nativeEvent._targetInst = targetInst;
    accumulateTwoPhaseDispatches(nativeEvent);
    return nativeEvent;
  }
};

var CALLBACK_BOOKKEEPING_POOL_SIZE = 10;
var callbackBookkeepingPool = [];

function getTopLevelCallbackBookKeeping(topLevelType, nativeEvent, targetInst) {
  if (callbackBookkeepingPool.length) {
    var instance = callbackBookkeepingPool.pop();
    instance.topLevelType = topLevelType;
    instance.nativeEvent = nativeEvent;
    instance.targetInst = targetInst;
    return instance;
  }

  return {
    topLevelType: topLevelType,
    nativeEvent: nativeEvent,
    targetInst: targetInst,
    ancestors: []
  };
}

function releaseTopLevelCallbackBookKeeping(instance) {
  instance.topLevelType = null;
  instance.nativeEvent = null;
  instance.targetInst = null;
  instance.ancestors.length = 0;
  if (callbackBookkeepingPool.length < CALLBACK_BOOKKEEPING_POOL_SIZE) {
    callbackBookkeepingPool.push(instance);
  }
}

function findRootContainerNode(inst) {
  while (inst.return) {
    inst = inst.return;
  }
  if (inst.tag !== HostRoot) return null;
  return inst.stateNode.containerInfo;
}

function handleTopLevel(bookKeeping) {
  var targetInst = bookKeeping.targetInst;

  var ancestor = targetInst;
  do {
    if (!ancestor) {
      bookKeeping.ancestors.push(ancestor);
      break;
    }
    var root = findRootContainerNode(ancestor);
    if (!root) break;
    bookKeeping.ancestors.push(ancestor);
    ancestor = getClosestInstanceFromNode(root);
  } while (ancestor);

  for (var i = 0; i < bookKeeping.ancestors.length; i++) {
    targetInst = bookKeeping.ancestors[i];
    runExtractedEventsInBatch(bookKeeping.topLevelType, targetInst, bookKeeping.nativeEvent, getEventTarget(bookKeeping.nativeEvent));
  }
}

function trapBubbledEvent(topLevelType) {
  var dispatch = SimpleEventPlugin.isInteractiveTopLevelEventType(topLevelType) ? dispatchInteractiveEvent : dispatchEvent;

  document.addEventListener(topLevelType, dispatch.bind(null, topLevelType), false);
}

function trapCapturedEvent(topLevelType) {
  var dispatch = SimpleEventPlugin.isInteractiveTopLevelEventType(topLevelType) ? dispatchInteractiveEvent : dispatchEvent;

  document.addEventListener(topLevelType, dispatch.bind(null, topLevelType), true);
}

function dispatchInteractiveEvent(topLevelType, nativeEvent) {
  interactiveUpdates(dispatchEvent, topLevelType, nativeEvent);
}

function dispatchEvent(topLevelType, nativeEvent) {
  // console.log(topLevelType, nativeEvent.target)
  // if (topLevelType === 'dblclick') debugger

  var target = getEventTarget(nativeEvent);
  var inst = getClosestInstanceFromNode(target);
  // TODO isMounted eg: img onload maybe get an event before committing

  var bookKeeping = getTopLevelCallbackBookKeeping(topLevelType, nativeEvent, inst);

  try {
    batchedUpdates(handleTopLevel, bookKeeping);
  } finally {
    releaseTopLevelCallbackBookKeeping(bookKeeping);
  }
}

var alreadyListenTo = {};
var reactTopListenerCounter = 0;

var topListenersIDKey = '_reactListenersID' + ('' + Math.random()).slice(2);

function getListeningForDocument() {
  if (!Object.prototype.hasOwnProperty.call(document, topListenersIDKey)) {
    document[topListenersIDKey] = reactTopListenerCounter++;
    alreadyListenTo[document[topListenersIDKey]] = {};
  }

  return alreadyListenTo[document[topListenersIDKey]];
}

function listenTo(registrationName) {
  var isListening = getListeningForDocument();
  var dependencies = registrationNameDependencies[registrationName];
  for (var i = 0; i < dependencies.length; i++) {
    var dependency = dependencies[i];

    if (!(isListening.hasOwnProperty(dependency) && isListening[dependency])) {
      switch (dependency) {
        case TOP_SCROLL:
          trapCapturedEvent(TOP_SCROLL);
          break;
        case TOP_FOCUS:
        case TOP_BLUR:
          trapCapturedEvent(TOP_FOCUS);
          trapCapturedEvent(TOP_BLUR);
          isListening[TOP_BLUR] = true;
          isListening[TOP_FOCUS] = true;
          break;
        case TOP_CANCEL:
        case TOP_CLOSE:
          if (isEventSupported(dependency)) {
            trapCapturedEvent(dependency);
          }
          break;
        case TOP_INVALID:
        case TOP_SUBMIT:
        case TOP_RESET:
          break;
        default:
          var isMediaEvent = mediaEventTypes.indexOf(dependency) !== -1;
          if (!isMediaEvent) {
            trapBubbledEvent(dependency);
          }
          break;
      }
      isListening[dependency] = true;
    }
  }
}

function isControlled(props) {
  var useChecked = props.type === 'checkbox' || props.type === 'radio';
  return useChecked ? props.checked != null : props.value != null;
}

function setDefaultValue(node, type, value) {
  if (type !== 'number' || node.ownerDocument.activeElement !== node) {
    if (value == null) {
      node.defaultValue = '' + node._wrapperState.initialValue;
    } else if (node.defaultValue !== '' + value) {
      node.defaultValue = '' + value;
    }
  }
}

function updateChecked(element, props) {
  var checked = props.checked;
  if (checked === false) {
    element.removeAttribute('checked');
  } else {
    element.setAttribute('checked', checked);
  }
}

function updateWrapper(element, props) {
  updateChecked(element, props);

  var value = getSafeValue(props.value);

  if (value != null) {
    if (props.type === 'number') {
      if (value === 0 && element.value === '' || element.value != value) {
        element.value = '' + value;
      }
    } else if (element.value !== '' + value) {
      element.value = '' + value;
    }
  }

  if (props.hasOwnProperty('value')) {
    setDefaultValue(element, props.type, value);
  } else if (props.hasOwnProperty('defaultValue')) {
    setDefaultValue(element, props.type, getSafeValue(props.defaultValue));
  }

  if (props.checked == null && props.defaultChecked != null) {
    element.defaultChecked = !!props.defaultChecked;
  }
}

function getHostProps(element, props) {
  var checked = props.checked;
  var node = element;
  var hostProps = Object.assign({}, props, {
    defaultChecked: undefined,
    defaultValue: undefined,
    value: undefined,
    checked: checked != null ? checked : node._wrapperState.initialChecked
  });
  return hostProps;
}

function initWrapperState(element, props) {
  var node = element;
  var defaultValue = props.defaultValue == null ? '' : props.defaultValue;
  node._wrapperState = {
    initialChecked: props.checked != null ? props.checked : props.defaultChecked,
    initialValue: getSafeValue(props.value != null ? props.value : defaultValue),
    controlled: isControlled(props)
  };
}

function getSafeValue(value) {
  switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
    case 'boolean':
    case 'number':
    case 'string':
    case 'object':
    case 'undefined':
      return value;
    default:
      return '';
  }
}

function postMountWrapper(element, props) {
  var node = element;
  if (props.hasOwnProperty('value') || props.hasOwnProperty('defaultValue')) {
    var initialValue = '' + node._wrapperState.initialValue;
    var currentVlaue = node.value;

    if (initialValue !== currentVlaue) {
      node.value = initialValue;
    }

    node.defaultValue = initialValue;
  }

  var name = node.name;
  if (name !== '') {
    node.name = '';
  }
  node.defaultChecked = !node.defaultChecked;
  node.defaultChecked = !!node._wrapperState.initialChecked;
  if (name !== '') {
    node.name = name;
  }
}

function track(node) {
  if (getTracker(node)) return;

  node._valueTracker = trackValueOnNode(node);
}

function getTracker(node) {
  return node._valueTracker;
}

function detachTracker(node) {
  node._valueTracker = null;
}

function isCheckable(elem) {
  var type = elem.type;
  var nodeName = elem.nodeName;
  return nodeName && nodeName.toLowerCase() === 'input' && (type === 'checkbox' || type === 'radio');
}

function trackValueOnNode(node) {
  var valueField = isCheckable(node) ? 'checked' : 'value';
  var descriptor = Object.getOwnPropertyDescriptor(node.constructor.prototype, valueField);
  var currentValue = '' + node[valueField];

  if (node.hasOwnProperty(valueField) || typeof descriptor === 'undefined' || typeof descriptor.get !== 'function' || typeof descriptor.set !== 'function') return;

  var _get = descriptor.get,
      _set = descriptor.set;

  Object.defineProperty(node, valueField, {
    configurable: true,
    get: function get() {
      return _get.call(this);
    },
    set: function set(value) {
      currentValue = '' + value;
      _set.call(this, value);
    }
  });

  // IE bug
  Object.defineProperty(node, valueField, {
    enumerable: descriptor.enumerable
  });

  var tracker = {
    getValue: function getValue() {
      return currentValue;
    },
    setValue: function setValue(value) {
      currentValue = '' + value;
    },
    stopTracking: function stopTracking() {
      detachTracker(node);
      delete node[valueField];
    }
  };

  return tracker;
}

function getValueFromNode(node) {
  var value = '';
  if (!node) return value;
  if (isCheckable(node)) {
    value = node.checked ? 'true' : 'false';
  } else {
    value = node.value;
  }
  return value;
}

function updateValueIfChanged(node) {
  if (!node) return false;
  var tracker = getTracker(node);
  if (!tracker) return true;

  var lastValue = tracker.getValue();
  var nextValue = getValueFromNode(node);

  if (nextValue !== lastValue) {
    tracker.setValue(nextValue);
    return true;
  }
  return false;
}

var DANGEROUSLY_SET_INNER_HTML = 'dangerouslySetInnerHTML';
var SUPPRESS_CONTENT_EDITABLE_WARNING = 'suppressContentEditableWarning';
var SUPPRESS_HYDRATION_WARNING = 'suppressHydrationWarning';
var AUTOFOCUS = 'autoFocus';
var CHILDREN = 'children';
var STYLE = 'style';
var HTML = '__html';

function trapClickOnNonInteractiveElement(node) {
  node.onclick = noop;
}

function setInitialProperties(domElement, tag, rawProps) {
  var props = void 0;
  switch (tag) {
    case 'iframe':
    case 'object':
      trapBubbledEvent(TOP_LOAD, domElement);
      props = rawProps;
      break;
    case 'video':
    case 'audio':
      for (var i = 0; i < mediaEventTypes.length; i++) {
        trapBubbledEvent(mediaEventTypes[i], domElement);
      }
      props = rawProps;
      break;
    case 'source':
      trapBubbledEvent(TOP_ERROR, domElement);
      props = rawProps;
      break;
    case 'img':
    case 'image':
    case 'link':
      trapBubbledEvent(TOP_ERROR, domElement);
      trapBubbledEvent(TOP_LOAD, domElement);
      props = rawProps;
      break;
    case 'form':
      trapBubbledEvent(TOP_RESET, domElement);
      trapBubbledEvent(TOP_SUBMIT, domElement);
      props = rawProps;
      break;
    case 'detail':
      trapBubbledEvent(TOP_TOGGLE, domElement);
      props = rawProps;
      break;
    case 'input':
      initWrapperState(domElement, rawProps);
      props = getHostProps(domElement, rawProps);
      trapBubbledEvent(TOP_INVALID, domElement);
      listenTo('onChange');
      break;
    case 'option':
    case 'select':
    case 'textarea':
    // TODO
    default:
      props = rawProps;
      break;
  }
  // TODO validate props
  setInitialDOMProperties(tag, domElement, props);

  switch (tag) {
    case 'input':
      track(domElement);
      postMountWrapper(domElement, rawProps);
      break;
    case 'textarea':
    case 'select':
    case 'option':
    // TODO
    default:
      if (typeof props.onClick === 'function') {
        trapClickOnNonInteractiveElement(domElement);
      }
      break;
  }
}

function setInitialDOMProperties(tag, domElement, nextProps) {
  for (var propKey in nextProps) {
    if (!nextProps.hasOwnProperty(propKey)) continue;

    var nextProp = nextProps[propKey];

    if (propKey === STYLE) {
      for (var styleName in nextProp) {
        if (!nextProp.hasOwnProperty(styleName)) continue;
        // TODO check style value , eg: add px to number value
        domElement.style[styleName] = nextProp[styleName];
      }
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
      var nextHTML = nextProp ? nextProp[HTML] : undefined;
      if (nextHTML != null) {
        domElement.innerHTML = nextHTML;
      }
    } else if (propKey === CHILDREN) {
      // TODO if domElement has children
      if (typeof nextProp === 'string') {
        if (tag !== 'textarea' || nextProp !== '') {
          domElement.textContent = nextProp;
        }
      } else if (typeof nextProp === 'number') {
        domElement.textContent = nextProp;
      }
    } else if (propKey === SUPPRESS_CONTENT_EDITABLE_WARNING || propKey === SUPPRESS_HYDRATION_WARNING) ; else if (propKey === AUTOFOCUS) ; else if (registrationNameModules.hasOwnProperty(propKey)) {
      listenTo(propKey);
    } else if (nextProp != null) {
      var name = propKey;
      if (name === 'className') {
        name = 'class';
      } else if (name === 'htmlFor') {
        name = 'for';
      }
      var value = nextProp;
      if (name === 'checked') {
        domElement[name] = value;
        continue;
      }
      if (value === null) {
        domElement.removeAttribute(name);
      } else {
        // TODO boolean
        domElement.setAttribute(name, value);
      }
    }
  }
}

function noop() {}

function diffProperties(domElement, tag, lastRawProps, nextRawProps) {
  var updatePayload = null;

  var lastProps = void 0;
  var nextProps = void 0;

  switch (tag) {
    case 'input':
      lastProps = getHostProps(domElement, lastRawProps);
      nextProps = getHostProps(domElement, nextRawProps);
      updatePayload = [];
      break;
    // TODO option select textarea
    default:
      lastProps = lastRawProps;
      nextProps = nextRawProps;
      if (typeof lastProps.onClick === 'function' && typeof nextProps.onClick === 'function') {
        trapClickOnNonInteractiveElement(domElement);
      }
      break;
  }

  if (typeof lastProps.onClick !== 'function' && typeof nextProps.onClick === 'function') {
    // safari bubble delegate problem
    domElement.onclick = noop;
  }

  // TODO valid props

  var propKey = void 0;

  for (propKey in lastProps) {
    if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) || lastProps[propKey] == null) {
      continue;
    }

    if (propKey === STYLE) ; else if (registrationNameModules.hasOwnProperty(propKey)) {
      if (!updatePayload) {
        updatePayload = [];
      }
    } else {
      (updatePayload = updatePayload || []).push(propKey, null);
    }
  }

  for (propKey in nextProps) {
    var nextProp = nextProps[propKey];
    var lastProp = lastProps != null ? lastProps[propKey] : undefined;

    if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp || nextProp == null && lastProp == null) {
      continue;
    }
    if (propKey === STYLE) ; else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
      var nextHtml = nextProp ? nextProp[HTML] : undefined;
      var lastHtml = lastProp ? lastProp[HTML] : undefined;
      if (nextHtml != null) {
        if (lastHtml !== nextHtml) {
          (updatePayload = updatePayload || []).push(propKey, '' + nextHtml);
        }
      }
    } else if (propKey === CHILDREN) {
      if (lastProp !== nextProp && (typeof nextProp === 'string' || typeof nextProp === 'number')) {
        (updatePayload = updatePayload || []).push(propKey, '' + nextProp);
      }
    } else if (registrationNameModules.hasOwnProperty(propKey)) {
      if (nextProp !== null) {
        listenTo(propKey);
      }
      if (!updatePayload && lastProp !== nextProp) {
        updatePayload = [];
      }
    } else {
      (updatePayload = updatePayload || []).push(propKey, nextProp);
    }
  }

  return updatePayload;
}

function updateProperties(domElement, updatePayload, tag, lastRawProps, nextRawProps) {
  if (tag === 'input' && nextRawProps.type === 'radio' && nextRawProps.name !== null) {
    updateChecked(domElement, nextRawProps);
  }

  updateDOMProperties(domElement, updatePayload);

  switch (tag) {
    case 'input':
      updateWrapper(domElement, nextRawProps);
      break;
    // TODO textarea select
  }
}

function updateDOMProperties(domElement, updatePayload) {
  for (var i = 0; i < updatePayload.length; i += 2) {
    var propKey = updatePayload[i];
    var propValue = updatePayload[i + 1];
    if (propKey === STYLE) ; else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
      domElement.innerHTML = propValue;
    } else if (propKey === CHILDREN) {
      // TODO optimize for get firstchild and set nodevalue is faster
      domElement.textContent = propValue;
    } else {
      var name = propKey;
      if (name === 'className') {
        name = 'class';
      } else if (name === 'htmlFor') {
        name = 'for';
      }
      var value = propValue;
      if (name === 'checked') {
        domElement[name] = value;
        continue;
      }
      if (value === null) {
        domElement.removeAttribute(name);
      } else {
        // TODO boolean
        domElement.setAttribute(name, value);
      }
    }
  }
}

function shouldSetTextContent(type, props) {
  return type === 'textarea' || typeof props.children === 'string' || typeof props.children === 'number' || _typeof(props.dangerouslySetInnerHTML) === 'object' && props.dangerouslySetInnerHTML !== null && typeof props.dangerouslySetInnerHTML.__html === 'string';
}

function createTextInstance(text, internalInstanceHandle) {
  var textNode = document.createTextNode(text);
  precacheFiberNode(internalInstanceHandle, textNode);
  return textNode;
}

function createInstance(type, props, internalInstanceHandle) {
  var domElement = document.createElement(type);
  precacheFiberNode(internalInstanceHandle, domElement);
  updateFiberProps(domElement, props);
  return domElement;
}

function appendInitialChild(parent, child) {
  parent.appendChild(child);
}

function finalizeInitialChildren(domElement, type, props) {
  setInitialProperties(domElement, type, props);
  return shouldAutoFocusHostComponent(type, props);
}

function commitMount(domElement, type, newProps, internalInstanceHandle) {
  if (shouldAutoFocusHostComponent(type, newProps)) {
    domElement.focus();
  }
}

function shouldAutoFocusHostComponent(type, props) {
  switch (type) {
    case 'button':
    case 'input':
    case 'select':
    case 'textarea':
      return !!props.autoFocus;
  }
  return false;
}

function commitUpdate(domElement, updatePayload, type, oldProps, newProps, internalInstanceHandle) {
  updateFiberProps(domElement, newProps);
  updateProperties(domElement, updatePayload, type, oldProps, newProps);
}

function cloneChildFibers(current, workInProgress) {
  if (workInProgress.child === null) return;

  var currentChild = workInProgress.child;
  var newChild = createWorkInProgress(currentChild, currentChild.pendingProps, currentChild.expirationTime);
  workInProgress.child = newChild;

  newChild.return = workInProgress;
  while (currentChild.sibling !== null) {
    currentChild = currentChild.sibling;
    newChild = newChild.sibling = createWorkInProgress(currentChild, currentChild.pendingProps, currentChild.expirationTime);
    newChild.return = workInProgress;
  }
  newChild.sibling = null;
}

function ChildReconciler(shouldTrackSideEffects) {

  function createChild(returnFiber, newChild, expirationTime) {
    // text
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      var created = createFiberFromText('' + newChild, returnFiber.mode, expirationTime);
      created.return = returnFiber;
      return created;
    }
    // react element
    if ((typeof newChild === "undefined" ? "undefined" : _typeof(newChild)) === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          var _created = createFiberFromElement(newChild, returnFiber.mode, expirationTime);
          // TODO ref
          _created.return = returnFiber;
          return _created;
          break;
        // TODO portal
      }
    }
    // TODO array
    return null;
  }

  function placeChild(newFiber, lastPlacedIndex, newIndex) {
    newFiber.index = newIndex;
    if (!shouldTrackSideEffects) return lastPlacedIndex;
    var current = newFiber.alternate;
    if (current !== null) {
      var oldIndex = current.index;
      if (oldIndex < lastPlacedIndex) {
        newFiber.effectTag = Placement;
        return lastPlacedIndex;
      } else {
        return oldIndex;
      }
    } else {
      newFiber.effectTag = Placement;
      return lastPlacedIndex;
    }
  }

  function placeSingleChild(newFiber) {
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      newFiber.effectTag = Placement;
    }
    return newFiber;
  }

  function useFiber(fiber, pendingProps, expirationTime) {
    var clone = createWorkInProgress(fiber, pendingProps, expirationTime);
    clone.index = 0;
    clone.sibling = null;
    return clone;
  }

  function reconcileSingleElement(returnFiber, currentFirstChild, element, expirationTime) {
    var key = element.key;
    var child = currentFirstChild;

    while (child !== null) {
      if (child.key === key) {
        if (child.tag === Fragment ? element.type === REACT_FRAGMENT_TYPE : child.type === element.type) {
          deleteRemainingChildren(returnFiber, child.sibling);
          var existing = useFiber(child, element.type === REACT_FRAGMENT_TYPE ? element.props.children : element.props, expirationTime);
          // TODO ref
          existing.return = returnFiber;
          return existing;
        } else {
          deleteRemainingChildren(returnFiber, child);
        }
      } else {
        deleteChild(returnFiber, child);
      }
      child = child.sibling;
    }

    if (element.type === REACT_FRAGMENT_TYPE) ; else {
      var created = createFiberFromElement(element, returnFiber.mode, expirationTime);
      // TODO ref
      created.return = returnFiber;
      return created;
    }
  }

  function reconcileSingleTextNode() {
    // TODO
  }

  function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, expirationTime) {
    var resultingFirstFiber = null;
    var previousNewFiber = null;
    var oldFiber = currentFirstChild;
    var lastPlacedIndex = 0;
    var newIdx = 0;
    var nextOldFiber = null;

    for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
      if (oldFiber.index > newIdx) {
        nextOldFiber = oldFiber;
        oldFiber = null;
      } else {
        nextOldFiber = oldFiber.sibling;
      }

      var newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx], expirationTime);

      if (newFiber === null) {
        if (oldFiber === null) {
          oldFiber = nextOldFiber;
        }
        break;
      }

      if (shouldTrackSideEffects) {
        if (oldFiber && newFiber.alternate === null) {
          deleteChild(returnFiber, oldFiber);
        }

        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {
          resultingFirstFiber = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
        oldFiber = nextOldFiber;
      }
    }

    if (newIdx === newChildren.length) {
      deleteRemainingChildren(returnFiber, oldFiber);
      return resultingFirstFiber;
    }

    if (oldFiber === null) {
      for (; newIdx < newChildren.length; newIdx++) {
        var _newFiber = createChild(returnFiber, newChildren[newIdx], expirationTime);

        if (!_newFiber) continue;

        lastPlacedIndex = placeChild(_newFiber, lastPlacedIndex, newIdx);

        if (previousNewFiber === null) {
          resultingFirstFiber = _newFiber;
        } else {
          previousNewFiber.sibling = _newFiber;
        }
        previousNewFiber = _newFiber;
      }

      return resultingFirstFiber;
    }

    var existingChildren = mapRemainingChildren(returnFiber, oldFiber);

    for (; newIdx < newChildren.length; newIdx++) {
      var _newFiber2 = updateFromMap(existingChildren, returnFiber, newIdx, newChildren[newIdx], expirationTime);
      if (_newFiber2) {
        if (shouldTrackSideEffects) {
          if (_newFiber2.alternate !== null) {
            existingChildren.delete(_newFiber2.key === null ? newIdx : _newFiber2.key);
          }
        }

        lastPlacedIndex = placeChild(_newFiber2, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {
          resultingFirstFiber = _newFiber2;
        } else {
          previousNewFiber.sibling = _newFiber2;
        }
        previousNewFiber = _newFiber2;
      }
    }

    if (shouldTrackSideEffects) {
      existingChildren.forEach(function (child) {
        return deleteChild(returnFiber, child);
      });
    }

    return resultingFirstFiber;
  }

  function updateFromMap(existingChildren, returnFiber, newIdx, newChild, expirationTime) {
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      var matchedFiber = existingChildren.get(newIdx) || null;
      return updateTextNode(returnFiber, matchedFiber, '' + newChild, expirationTime);
    }

    if ((typeof newChild === "undefined" ? "undefined" : _typeof(newChild)) === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          {
            var _matchedFiber = existingChildren.get(newChild.key === null ? newIdx : newChild.key) || null;
            if (newChild.type === REACT_FRAGMENT_TYPE) ;
            return updateElement(returnFiber, _matchedFiber, newChild, expirationTime);
          }
        // TODO portal
      }

      // TODO newchild is array cause it is fragment
    }

    return null;
  }

  function mapRemainingChildren(returnFiber, currentFirstChild) {
    var existingChildren = new Map();
    var existingChild = currentFirstChild;
    while (existingChild !== null) {
      if (existingChild.key !== null) {
        existingChildren.set(existingChild.key, existingChild);
      } else {
        existingChildren.set(existingChild.index, existingChild);
      }
      existingChild = existingChild.sibling;
    }

    return existingChildren;
  }

  function updateTextNode(returnFiber, current, textContent, expirationTime) {
    if (current === null || current.tag !== HostText) {
      var created = createFiberFromText(textContent, returnFiber.mode, expirationTime);
      created.return = returnFiber;
      return created;
    } else {
      var existing = useFiber(current, textContent, expirationTime);
      existing.return = returnFiber;
      return existing;
    }
  }

  function updateElement(returnFiber, current, element, expirationTime) {
    if (current !== null && current.type === element.type) {
      var existing = useFiber(current, element.props, expirationTime);
      existing.return = returnFiber;
      return existing;
    } else {
      var created = createFiberFromElement(element, returnFiber.mode, expirationTime);
      // TODO ref
      created.return = returnFiber;
      return created;
    }
  }

  function updateSlot(returnFiber, oldFiber, newChild, expirationTime) {
    var key = oldFiber !== null ? oldFiber.key : null;

    if (typeof newChild === 'string' || typeof newChild === 'number') {
      if (key !== null) return null;
      return updateTextNode(returnFiber, oldFiber, '' + newChild, expirationTime);
    }

    if ((typeof newChild === "undefined" ? "undefined" : _typeof(newChild)) === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          if (newChild.key === key) {
            if (newChild.type === REACT_FRAGMENT_TYPE) ;
            return updateElement(returnFiber, oldFiber, newChild, expirationTime);
          } else {
            return null;
          }
        // TODO portal type
      }

      // TODO array
    }
    return null;
  }

  function deleteRemainingChildren(returnFiber, currentFirstChild) {
    if (!shouldTrackSideEffects) {
      return null;
    }

    var childToDelete = currentFirstChild;
    while (childToDelete !== null) {
      deleteChild(returnFiber, childToDelete);
      childToDelete = childToDelete.sibling;
    }
    return null;
  }

  function deleteChild(returnFiber, childToDelete) {
    if (!shouldTrackSideEffects) return;
    var last = returnFiber.lastEffect;
    if (last !== null) {
      last.nextEffect = childToDelete;
      returnFiber.lastEffect = childToDelete;
    } else {
      returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
    }
    childToDelete.nextEffect = null;
    childToDelete.effectTag = Deletion;
  }

  function reconcileChildFibers(returnFiber, currentFirstChild, newChild, expirationTime) {
    // TODO fragment

    var isObject = (typeof newChild === "undefined" ? "undefined" : _typeof(newChild)) === 'object' && newChild !== null;
    // react element
    if (isObject) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstChild, newChild, expirationTime));
          break;
      }
    }
    // text
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      return placeSingleChild(reconcileSingleTextNode(returnFiber, currentFirstChild, '' + newChild, expirationTime));
    }

    // array
    if (Array.isArray(newChild)) {
      return reconcileChildrenArray(returnFiber, currentFirstChild, newChild, expirationTime);
    }

    // TODO iterator fn

    // TODO unknow object warn

    return deleteRemainingChildren(returnFiber, currentFirstChild);
  }

  return reconcileChildFibers;
}

var reconcileChildFibers = ChildReconciler(true);
var mountChildFibers = ChildReconciler(false);

function reconcileChildrenAtExpirationTime(current, workInProgress, nextChildren, renderExpirationTime) {
  if (current === null) {
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren, renderExpirationTime);
  } else {
    workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren, renderExpirationTime);
  }
}

function memorizeProps(workInProgress, nextProps) {
  workInProgress.memorizedProps = nextProps;
}

function memorizeState(workInProgress, nextState) {
  workInProgress.memorizedState = nextState;
}

function bailoutOnAlreadyFinishedWork(current, workInProgress) {
  cloneChildFibers(current, workInProgress);
  return workInProgress.child;
}

function updateClassComponent(current, workInProgress, renderExpirationTime) {
  // TODO hasContext
  var hasContext = false;
  var shouldUpdate = void 0;
  if (current === null) {
    if (workInProgress.stateNode === null) {
      // instance component
      constructClassInstance(workInProgress, workInProgress.pendingProps, renderExpirationTime);
      mountClassInstance(workInProgress, renderExpirationTime);
      shouldUpdate = true;
    }
  } else {
    shouldUpdate = updateClassInstance(current, workInProgress, renderExpirationTime);
  }
  return finishClassComponent(current, workInProgress, shouldUpdate, hasContext, renderExpirationTime);
}

function finishClassComponent(current, workInProgress, shouldUpdate, hasContext, renderExpirationTime) {
  // TODO ref
  var didCaptureError = (workInProgress.effectTag & DidCapture) !== NoEffect;

  if (!shouldUpdate && !didCaptureError) {
    // TODO context provider
    return bailoutOnAlreadyFinishedWork(current, workInProgress);
  }

  var ctor = workInProgress.type;
  var instance = workInProgress.stateNode;

  ReactCurrentOwner.current = workInProgress;

  // TODO error

  var nextChildren = instance.render();
  // react devtool reads this flag
  workInProgress.effectTag |= PerformedWork;

  reconcileChildrenAtExpirationTime(current, workInProgress, nextChildren, renderExpirationTime);

  memorizeState(workInProgress, instance.state);
  memorizeProps(workInProgress, instance.props);

  // TODO context provider

  return workInProgress.child;
}

function updateHostRoot(current, workInProgress, renderExpirationTime) {
  // TODO pushHostRootContext
  var updateQueue = workInProgress.updateQueue;
  if (updateQueue !== null) {
    var nextProps = workInProgress.pendingProps;
    var prevState = workInProgress.memorizedState;
    var prevChildren = prevState !== null ? prevState.element : null;
    // ensure workInProgress.updateQueue !== current.updateQueue
    // run the update queue, get the result for baseState, and set effect
    processUpdateQueue(workInProgress, updateQueue, nextProps, null, renderExpirationTime);
    var nextState = workInProgress.memorizedState;
    var nextChildren = nextState.element;
    if (nextChildren === prevChildren) {
      return bailoutOnAlreadyFinishedWork(current, workInProgress);
    }
    reconcileChildrenAtExpirationTime(current, workInProgress, nextChildren, workInProgress.expirationTime);
    return workInProgress.child;
  }
  return bailoutOnAlreadyFinishedWork(current, workInProgress);
}

function updateHostComponent(current, workInProgress, renderExpirationTime) {
  // TODO context
  var type = workInProgress.type;
  var memorizedProps = workInProgress.memorizedProps;
  var nextProps = workInProgress.pendingProps;
  var prevProps = current !== null ? current.memorizedProps : null;
  // console.log(memorizedProps === nextProps)
  // TODO contextChange or hidden

  var nextChildren = nextProps.children;
  var isDirecTextChild = shouldSetTextContent(type, nextProps);

  if (isDirecTextChild) {
    // avoid anothing Text Fiber
    nextChildren = null;
  }
  // TODO switching from a direct text child to a normal child, contentReset

  // TODO ref

  // TODO check for offscreen

  reconcileChildrenAtExpirationTime(current, workInProgress, nextChildren, workInProgress.expirationTime);
  memorizeProps(workInProgress, nextProps);
  return workInProgress.child;
}

function updateHostText(current, workInProgress) {
  var nextProps = workInProgress.pendingProps;
  memorizeProps(workInProgress, nextProps);
  return null;
}

function beginWork(current, workInProgress, renderExpirationTime) {
  switch (workInProgress.tag) {
    case IndeterminateComponent:
      // TODO
      break;
    case FunctionalComponent:
      // TODO
      break;
    case ClassComponent:
      return updateClassComponent(current, workInProgress, renderExpirationTime);
      break;
    case HostRoot:
      return updateHostRoot(current, workInProgress, renderExpirationTime);
      break;
    case HostComponent:
      return updateHostComponent(current, workInProgress, renderExpirationTime);
      break;
    case HostText:
      return updateHostText(current, workInProgress);
      break;
    default:
      console.log('unknow tag: ', workInProgress.tag);
      break;
  }
}

function appendAllChildren(parent, workInProgress) {
  var node = workInProgress.child;
  while (node !== null) {
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(parent, node.stateNode);
    } else if (node.tag === HostPortal) ; else if (node.child !== null) {
      node.child.return = node;
      node = node.child;
      continue;
    }

    if (node === workInProgress) return;
    while (node.sibling === null) {
      if (node.return === null || node.return === workInProgress) return;
      node = node.return;
    }
    node.sibling.return = node.return;
    node = node.sibling;
  }
}

var updateHostComponent$1 = function updateHostComponent(current, workInProgress, updatePayload, type, oldProps, newProps) {
  workInProgress.updateQueue = updatePayload;
  if (updatePayload) {
    workInProgress.effectTag |= Update;
  }
};

var updateHostText$1 = function updateHostText(current, workInProgress, oldText, newText) {
  if (oldText !== newText) {
    markUpdate(workInProgress);
  }
};

function markUpdate(workInProgress) {
  workInProgress.effectTag |= Update;
}

function completeWork(current, workInProgress, renderExpirationTime) {
  var newProps = workInProgress.pendingProps;
  switch (workInProgress.tag) {
    case FunctionalComponent:
      break;
    case ClassComponent:
      // TODO context provider
      break;
    case HostRoot:
      // TODO pop context
      break;
    case HostComponent:
      // TODO context
      var type = workInProgress.type;
      if (current && workInProgress.stateNode != null) {
        var oldProps = current.memorizedProps;
        var instance = workInProgress.stateNode;
        // TODO context
        var updatePayload = diffProperties(instance, type, oldProps, newProps);
        updateHostComponent$1(current, workInProgress, updatePayload, type, oldProps, newProps);
        // TODO ref
      } else {
        var _instance = createInstance(type, newProps, workInProgress);

        appendAllChildren(_instance, workInProgress);

        if (finalizeInitialChildren(_instance, type, newProps)) {
          markUpdate(workInProgress);
        }
        workInProgress.stateNode = _instance;
        // TODO ref
      }
      break;
    case HostText:
      var newText = newProps;
      if (current && workInProgress.stateNode != null) {
        var oldText = current.memorizedProps;
        updateHostText$1(current, workInProgress, oldText, newText);
      } else {
        workInProgress.stateNode = createTextInstance(newText, workInProgress);
      }
      break;
    // TODO others
    default:
      console.log('likely a bug, ', workInProgress);
  }
  return null;
}

function commitWork(current, finishedWork) {
  switch (finishedWork.tag) {
    case HostComponent:
      var instance = finishedWork.stateNode;
      if (instance !== null) {
        var newProps = finishedWork.memorizedProps;
        var oldProps = current !== null ? current.memorizedProps : newProps;
        var type = finishedWork.type;
        var updatePayload = finishedWork.updateQueue;
        finishedWork.updateQueue = null;
        if (updatePayload !== null) {
          commitUpdate(instance, updatePayload, type, oldProps, newProps, finishedWork);
        }
      }
      return;
    case HostText:
      // TODO
      return;
  }
}

function commitDeletion(current) {
  unmountHostComponent(current);
  detachFiber(current);
}

function commitNestedUnmounts(root) {
  var node = root;
  while (true) {
    commitUnmount(node);
    if (node.child !== null && node.tag !== HostPortal) {
      node.child.return = node;
      node = node.child;
      continue;
    }

    if (node === root) return;

    while (node.sibling === null) {
      if (node.return === null || node.return === root) return;

      node = node.return;
    }

    node.sibling.return = node.return;
    node = node.sibling;
  }
}

function commitUnmount(current) {
  // TODO dev tool onCommitUnmount

  switch (current.tag) {
    case ClassComponent:
      {
        // TODO detach ref
        var instance = current.stateNode;
        if (typeof instance.componentWillUnmount === 'function') {
          instance.props = current.memorizedProps;
          instance.state = current.memorizedState;
          instance.componentWillUnmount();
        }
        return;
      }
    case HostComponent:
      {
        // TODO detach ref
        return;
      }
    case HostPortal:

  }
}

function unmountHostComponent(current) {
  var node = current;

  var currentParentIsValid = false;

  var currentParent = void 0;
  var currentParentIsContainer = void 0;

  while (true) {
    if (!currentParentIsValid) {
      var parent = node.return;
      findParent: while (true) {
        switch (parent.tag) {
          case HostComponent:
            currentParent = parent.stateNode;
            currentParentIsContainer = false;
            break findParent;
          case HostRoot:
            currentParent = parent.stateNode.containerInfo;
            currentParentIsContainer = true;
            break findParent;
          case HostPortal:
            currentParent = parent.stateNode.containerInfo;
            currentParentIsContainer = true;
            break findParent;
        }
        parent = parent.return;
      }
      currentParentIsValid = true;
    }

    if (node.tag === HostComponent || node.tag === HostText) {
      commitNestedUnmounts(node);

      if (currentParentIsContainer) {
        currentParent.removeChild(node.stateNode);
      } else {
        currentParent.removeChild(node.stateNode);
      }
    } else if (node.tag === HostPortal) ; else {
      commitUnmount(node);

      if (node.child !== null) {
        node.child.return = node;
        node = node.child;
        continue;
      }
    }
    if (node === current) return;
    while (node.sibling === null) {
      if (node.return === null || node.return === current) return;
      node = node.return;
      if (node.tag === HostPortal) {
        currentParentIsValid = false;
      }
    }
    node.sibling.return = node.return;
    node = node.sibling;
  }
}

function detachFiber(current) {
  current.return = null;
  current.child = null;
  if (current.alternate !== null) {
    current.alternate.return = null;
    current.alternate.child = null;
  }
}

function commitPlacement(finishedWork) {
  var parentFiber = getHostParent(finishedWork);

  var parent = void 0;
  var isContainer = void 0;

  switch (parentFiber.tag) {
    case HostComponent:
      parent = parentFiber.stateNode;
      isContainer = false;
      break;
    case HostRoot:
      parent = parentFiber.stateNode.containerInfo;
      isContainer = true;
      break;
    case HostPortal:
      parent = parentFiber.stateNode.containerInfo;
      isContainer = true;
      break;
    default:
      console.warn('invalid host parent fiber');
      break;
  }

  // TODO contentreset

  var before = getHostSibling(finishedWork);

  var node = finishedWork;
  while (true) {
    if (node.tag === HostComponent || node.tag === HostText) {
      if (before) {
        if (isContainer) {
          parent.insertBefore(node.stateNode, before);
        } else {
          parent.insertBefore(node.stateNode, before);
        }
      } else {
        if (isContainer) {
          parent.appendChild(node.stateNode);
          // appendChildToContainer(parent, node.stateNode)
        } else {
          parent.appendChild(node.stateNode);
          // appendChild(parent, node.stateNode)
        }
      }
    } else if (node.tag === HostPortal) ; else if (node.child !== null) {
      node.child.return = node;
      node = node.child;
      continue;
    }

    if (node === finishedWork) return;

    while (node.sibling === null) {
      if (node.return === null || node.return === finishedWork) {
        return;
      }
      node = node.return;
    }

    node.sibling.return = node.return;
    node = node.sibling;
  }
}

function getHostSibling(fiber) {
  var node = fiber;
  siblings: while (true) {
    while (node.sibling === null) {
      if (node.return === null || isHostParent(node.return)) {
        return null;
      }
      node = node.return;
    }

    node.sibling.return = node.return;
    node = node.sibling;
    while (node.tag !== HostComponent && node.tag !== HostText) {
      if (node.effectTag & Placement) {
        continue siblings;
      }

      if (node.child === null || node.tag === HostPortal) {
        continue siblings;
      } else {
        node.child.return = node;
        node = node.child;
      }
    }

    if (!(node.effectTag & Placement)) {
      return node.stateNode;
    }
  }
}

function getHostParent(fiber) {
  var parent = fiber.return;
  while (parent !== null) {
    if (isHostParent(parent)) {
      return parent;
    }
    parent = parent.return;
  }
}

function isHostParent(fiber) {
  return fiber.tag === HostComponent || fiber.tag === HostRoot || fiber.tag === HostPortal;
}

function commitLifeCycles(finishedRoot, current, finishedWork, committedExpirationTime) {
  switch (finishedWork.tag) {
    case ClassComponent:
      {
        var instance = finishedWork.stateNode;
        if (finishedWork.effectTag & Update) {
          if (current === null) {
            instance.props = finishedWork.memorizedProps;
            instance.state = finishedWork.memorizedState;
            instance.componentDidMount();
          } else {
            var prevProps = current.memorizedProps;
            var prevState = current.memorizedState;
            instance.props = finishedWork.memorizedProps;
            instance.state = finishedWork.memorizedState;
            instance.componentDidUpdate(prevProps, prevState, instance.__reactInternalSnapshotBeforeUpdate);
          }
        }
        var updateQueue = finishedWork.updateQueue;
        if (updateQueue !== null) {
          instance.props = finishedWork.memorizedProps;
          instance.state = finishedWork.memorizedState;
          commitUpdateQueue(finishedWork, updateQueue, instance, committedExpirationTime);
        }
        return;
      }
    case HostRoot:
      {
        var _updateQueue = finishedWork.updateQueue;
        if (_updateQueue !== null) {
          var _instance = null;
          if (finishedWork.child !== null) {
            switch (finishedWork.child.tag) {
              case HostComponent:
                _instance = finishedWork.child.stateNode;
                break;
              case ClassComponent:
                _instance = finishedWork.child.stateNode;
                break;
            }
          }
          commitUpdateQueue(finishedWork, _updateQueue, _instance, committedExpirationTime);
        }
        return;
      }
    case HostComponent:
      {
        var _instance2 = finishedWork.stateNode;
        // first mount and autofocus update
        if (current === null && finishedWork.effectTag & Update) {
          var type = finishedWork.type;
          var props = finishedWork.memorizedProps;
          commitMount(_instance2, type, props, finishedWork);
        }
        return;
      }
  }
}

function commitUpdateQueue(finishedWork, finishedQueue, instance, renderExpirationTime) {
  // TODO captured update

  var effect = finishedQueue.firstEffect;
  finishedQueue.firstEffect = finishedQueue.lastEffect = null;
  while (effect !== null) {
    var callback = effect.callback;
    if (callback !== null) {
      effect.callback = null;
      callback.call(instance);
    }
    effect = effect.nextEffect;
  }

  // TODO cattured effect
}

function markPendingPriorityLevel(root, expirationTime) {
  root.didError = false;
  var earliestPendingTime = root.earliestPendingTime;
  if (earliestPendingTime === NoWork) {
    root.earliestPendingTime = root.latestPendingTime = expirationTime;
  } else {
    if (earliestPendingTime > expirationTime) {
      root.earliestPendingTime = expirationTime;
    } else {
      var latestPendingTime = root.latestPendingTime;
      if (latestPendingTime < expirationTime) {
        root.latestPendingTime = expirationTime;
      }
    }
  }

  findNextExpirationTimeToWorkOn(expirationTime, root);
}

function findNextExpirationTimeToWorkOn(completedExpirationTime, root) {
  var earliestPendingTime = root.earliestPendingTime;
  var earliestSuspendedTime = root.earliestSuspendedTime;
  var latestSuspendedTime = root.latestSuspendedTime;
  var latestPingedTime = root.latestPingedTime;

  var nextExpirationTimeToWorkOn = earliestPendingTime !== NoWork ? earliestPendingTime : latestPingedTime;

  if (nextExpirationTimeToWorkOn === NoWork && (completedExpirationTime === NoWork || latestSuspendedTime > completedExpirationTime)) {
    nextExpirationTimeToWorkOn = latestSuspendedTime;
  }

  var expirationTime = nextExpirationTimeToWorkOn;
  if (expirationTime !== NoWork && earliestSuspendedTime !== NoWork && earliestSuspendedTime < expirationTime) {
    expirationTime = earliestSuspendedTime;
  }

  root.nextExpirationTimeToWorkOn = nextExpirationTimeToWorkOn;
  root.expirationTime = expirationTime;
}

function markCommittedPriorityLevels(root, earliestRemainingTime) {
  root.didError = false;

  if (earliestRemainingTime === NoWork) {
    // Fast path. There's no remaining work. Clear everything.
    root.earliestPendingTime = NoWork;
    root.latestPendingTime = NoWork;
    root.earliestSuspendedTime = NoWork;
    root.latestSuspendedTime = NoWork;
    root.latestPingedTime = NoWork;
    findNextExpirationTimeToWorkOn(NoWork, root);
    return;
  }

  // Let's see if the previous latest known pending level was just flushed.
  var latestPendingTime = root.latestPendingTime;
  if (latestPendingTime !== NoWork) {
    if (latestPendingTime < earliestRemainingTime) {
      // We've flushed all the known pending levels.
      root.earliestPendingTime = root.latestPendingTime = NoWork;
    } else {
      var earliestPendingTime = root.earliestPendingTime;
      if (earliestPendingTime < earliestRemainingTime) {
        // We've flushed the earliest known pending level. Set this to the
        // latest pending time.
        root.earliestPendingTime = root.latestPendingTime;
      }
    }
  }

  // Now let's handle the earliest remaining level in the whole tree. We need to
  // decide whether to treat it as a pending level or as suspended. Check
  // it falls within the range of known suspended levels.

  var earliestSuspendedTime = root.earliestSuspendedTime;
  if (earliestSuspendedTime === NoWork) {
    // There's no suspended work. Treat the earliest remaining level as a
    // pending level.
    markPendingPriorityLevel(root, earliestRemainingTime);
    findNextExpirationTimeToWorkOn(NoWork, root);
    return;
  }

  var latestSuspendedTime = root.latestSuspendedTime;
  if (earliestRemainingTime > latestSuspendedTime) {
    // The earliest remaining level is later than all the suspended work. That
    // means we've flushed all the suspended work.
    root.earliestSuspendedTime = NoWork;
    root.latestSuspendedTime = NoWork;
    root.latestPingedTime = NoWork;

    // There's no suspended work. Treat the earliest remaining level as a
    // pending level.
    markPendingPriorityLevel(root, earliestRemainingTime);
    findNextExpirationTimeToWorkOn(NoWork, root);
    return;
  }

  if (earliestRemainingTime < earliestSuspendedTime) {
    // The earliest remaining time is earlier than all the suspended work.
    // Treat it as a pending update.
    markPendingPriorityLevel(root, earliestRemainingTime);
    findNextExpirationTimeToWorkOn(NoWork, root);
    return;
  }

  // The earliest remaining time falls within the range of known suspended
  // levels. We should treat this as suspended work.
  findNextExpirationTimeToWorkOn(NoWork, root);
}

var isWorking = false;
var nextUnitOfWork = null;
var nextRoot = null;
var nextRenderExpirationTime = NoWork;
var isCommitting = false;
var nextEffect = null;

function scheduleWorkToRoot(fiber, expirationTime) {
  // update expirationTime
  var node = fiber;
  do {
    var alternate = node.alternate;
    if (node.expirationTime === NoWork || node.expirationTime > expirationTime) {
      node.expirationTime = expirationTime;
      if (alternate !== null && (alternate.expirationTime === NoWork || alternate.expirationTime > expirationTime)) {
        alternate.expirationTime = expirationTime;
      }
    } else if (alternate !== null && (alternate.expirationTime === NoWork || alternate.expirationTime > expirationTime)) {
      alternate.expirationTime = expirationTime;
    }
    if (node.return === null && node.tag === HostRoot) {
      return node.stateNode;
    }
    node = node.return;
  } while (node !== null);
  return null;
}

function computeExpirationForFiber(currentTime, fiber) {
  var expirationTime = void 0;
  if (isWorking) {
    if (isCommitting) {
      expirationTime = Sync;
    } else {
      expirationTime = nextRenderExpirationTime;
    }
  } else {
    if (fiber.mode & AsyncMode) ; else {
      expirationTime = Sync;
    }
  }

  if (isBatchingInteractiveUpdates) {
    if (lowestPendingInteractiveExpirationTime === NoWork || expirationTime > lowestPendingInteractiveExpirationTime) {
      lowestPendingInteractiveExpirationTime = expirationTime;
    }
  }

  return expirationTime;
}

function scheduleWork(fiber, expirationTime) {
  var root = scheduleWorkToRoot(fiber, expirationTime);
  if (root === null) return;
  if (!isWorking && nextRenderExpirationTime !== NoWork && expirationTime < nextRenderExpirationTime) {
    resetStack();
  }
  markPendingPriorityLevel(root, expirationTime);
  if (!isWorking || isCommitting || nextRoot !== root) {
    var rootExpirationTime = root.expirationTime;
    requestWork(root, rootExpirationTime);
  }
  if (nestedUpdateCount > NESTED_UPDATE_LIMIT) {
    nestedUpdateCount = 0;
    console.warn('Maximum update depth exceeded.');
  }
}

var firstScheduledRoot = null;
var lastScheduledRoot = null;

var isRendering = false;
var nextFlushedRoot = null;
var nextFlushedExpirationTime = NoWork;
var lowestPendingInteractiveExpirationTime = NoWork;
var deadline = null;

var isBatchingUpdates = false;
var isUnbatchingUpdates = false;
var isBatchingInteractiveUpdates = false;

var originalStartTimeMs = now();
var currentRendererTime = msToExpirationTime(originalStartTimeMs);
var currentSchedulerTime = currentRendererTime;

var NESTED_UPDATE_LIMIT = 50;
var nestedUpdateCount = 0;

var lastCommittedRootDuringThisBatch = null;

function recomputeCurrentRenderedTimer() {
  var currentTimeMs = now() - originalStartTimeMs;
  currentRendererTime = msToExpirationTime(currentTimeMs);
}

function requestCurrentTime() {
  if (isRendering) {
    return currentSchedulerTime;
  }
  findHighestPriorityRoot();
  if (nextFlushedExpirationTime === NoWork || nextFlushedExpirationTime === Never) {
    recomputeCurrentRenderedTimer();
    currentSchedulerTime = currentRendererTime;
    return currentSchedulerTime;
  }

  return currentSchedulerTime;
}

function findHighestPriorityRoot() {
  var highestPriorityWork = NoWork;
  var highestPriorityRoot = null;

  if (lastScheduledRoot !== null) {
    var root = firstScheduledRoot;
    while (root !== null) {
      var remainingExpirationTime = root.expirationTime;
      if (remainingExpirationTime === NoWork) {
        // this root has no work , remove it from schedule
        if (root === root.nextScheduledRoot) {
          // only root from the list
          root.nextScheduledRoot = null;
          firstScheduledRoot = lastScheduledRoot = null;
          break;
        }
        // TODO fist root and last root and else
      } else {
        if (highestPriorityWork === NoWork || remainingExpirationTime < highestPriorityWork) {
          highestPriorityRoot = root;
          highestPriorityWork = remainingExpirationTime;
        }
        if (root === lastScheduledRoot) {
          break;
        }
        root = root.nextScheduledRoot;
      }
    }
  }

  nextFlushedRoot = highestPriorityRoot;
  nextFlushedExpirationTime = highestPriorityWork;
}

function performSyncWork() {
  performWork(Sync, null);
}

function performWork(minExpirationTime, dl) {
  deadline = dl;
  findHighestPriorityRoot();
  if (deadline) ; else {
    while (nextFlushedRoot !== null && nextFlushedExpirationTime !== NoWork && (minExpirationTime === NoWork || minExpirationTime >= nextFlushedExpirationTime)) {
      performWorkOnRoot(nextFlushedRoot, nextFlushedExpirationTime, true);
      findHighestPriorityRoot();
    }
  }

  deadline = null;

  finishRendering();
}

function finishRendering() {
  nestedUpdateCount = 0;
  lastCommittedRootDuringThisBatch = null;
  // TODO batches and unHandled error
}

function performWorkOnRoot(root, expirationTime, isExpired) {
  isRendering = true;
  if (deadline === null || isExpired) {
    var finishedWork = root.finishedWork;
    if (finishedWork !== null) {
      completeRoot(root, finishedWork, expirationTime);
    } else {
      root.finishedWork = null;
      // TODO if this root suspended before, clear timeout
      renderRoot(root, false, isExpired);
      finishedWork = root.finishedWork;
      if (finishedWork !== null) {
        // commit
        completeRoot(root, finishedWork, expirationTime);
      }
    }
  }

  isRendering = false;
}

function resetStack() {

  nextRoot = null;
  nextRenderExpirationTime = NoWork;
  nextUnitOfWork = null;
}

function renderRoot(root, isYieldy, isExpired) {
  isWorking = true;
  var expirationTime = root.nextExpirationTimeToWorkOn;
  if (expirationTime !== nextRenderExpirationTime || root !== nextRoot || nextUnitOfWork === null) {
    resetStack();
    nextRoot = root;
    nextRenderExpirationTime = expirationTime;
    nextUnitOfWork = createWorkInProgress(nextRoot.current, null, nextRenderExpirationTime);
    root.pendingCommitExpirationTime = NoWork;
  }

  do {
    try {
      workLoop(isYieldy);
    } catch (e) {
      // TODO fatal
      console.log(e);
      nestedUpdateCount++;
    }
    break;
  } while (true);
  nextRoot = null;
  root.pendingCommitExpirationTime = expirationTime;
  root.finishedWork = root.current.alternate;
}

function workLoop(isYieldy) {
  if (!isYieldy) {
    while (nextUnitOfWork !== null) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
  }
}

function performUnitOfWork(workInProgress) {
  var current = workInProgress.alternate;
  var next = beginWork(current, workInProgress, nextRenderExpirationTime);
  if (next === null) {
    next = completeUnitOfWork(workInProgress);
  }
  ReactCurrentOwner.current = null;
  return next;
}

function completeUnitOfWork(workInProgress) {
  while (true) {
    var current = workInProgress.alternate;
    var returnFiber = workInProgress.return;
    var siblingFiber = workInProgress.sibling;

    if ((workInProgress.effectTag & Incomplete) === NoEffect) {
      var next = completeWork(current, workInProgress, nextRenderExpirationTime);
      resetExpirationTime(workInProgress, nextRenderExpirationTime);
      if (next !== null) return next;
      // why
      if (returnFiber !== null && (returnFiber.effectTag & Incomplete) === NoEffect) {
        if (returnFiber.firstEffect === null) {
          returnFiber.firstEffect = workInProgress.firstEffect;
        }
        if (workInProgress.lastEffect !== null) {
          if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = workInProgress.firstEffect;
          }
          returnFiber.lastEffect = workInProgress.lastEffect;
        }

        // why
        var effectTag = workInProgress.effectTag;
        if (effectTag > PerformedWork) {
          if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = workInProgress;
          } else {
            returnFiber.firstEffect = workInProgress;
          }
          returnFiber.lastEffect = workInProgress;
        }
      }

      if (siblingFiber !== null) {
        return siblingFiber;
      } else if (returnFiber !== null) {
        workInProgress = returnFiber;
        continue;
      } else {
        return null;
      }
    }
  }
  return null;
}

function resetExpirationTime(workInProgress, renderTime) {
  if (renderTime !== Never && workInProgress.expirationTime === Never) return;
  var newExpirationTime = NoWork;
  switch (workInProgress.tag) {
    case HostRoot:
    case ClassComponent:
      var updateQueue = workInProgress.updateQueue;
      if (updateQueue !== null) {
        newExpirationTime = updateQueue.expirationTime;
      }
  }

  var child = workInProgress.child;
  while (child !== null) {
    if (child.expirationTime !== NoWork && (newExpirationTime === NoWork || newExpirationTime > child.expirationTime)) {
      newExpirationTime = child.expirationTime;
    }
    child = child.sibling;
  }

  workInProgress.expirationTime = newExpirationTime;
}

function completeRoot(root, finishedWork, expirationTime) {
  // TODO async batch

  root.finishedWork = null;
  if (root === lastCommittedRootDuringThisBatch) {
    nestedUpdateCount++;
  } else {
    lastCommittedRootDuringThisBatch = root;
    nestedUpdateCount = 0;
  }

  commitRoot(root, finishedWork);
}

function commitBeforeMutationLifecycles() {
  while (nextEffect !== null) {
    var effectTag = nextEffect.effectTag;
    if (effectTag & Snapshot) {
      var current = nextEffect.alternate;
      commitBeforeMutationLifeCycles(current, nextEffect);
    }
    nextEffect = nextEffect.nextEffect;
  }
}

function commitBeforeMutationLifeCycles(current, finishedWork) {
  switch (finishedWork.tag) {
    case ClassComponent:
      {
        var prevProps = current.memorizedProps;
        var prevState = current.memorizedState;
        var instance = finishedWork.stateNode;
        instance.props = finishedWork.memorizedProps;
        instance.state = finishedWork.memorizedState;
        var snapshot = instance.getSnapshotBeforeUpdate(prevProps, prevState);
        instance.__reactInternalSnapshotBeforeUpdate = snapshot;
        return;
      }
  }
}

function commitAllHostEffects() {
  while (nextEffect !== null) {
    var effectTag = nextEffect.effectTag;

    // TODO contentreset
    // TODO ref

    var primaryEffectTag = effectTag & (Placement | Update | Deletion);
    switch (primaryEffectTag) {
      case Placement:
        commitPlacement(nextEffect);
        nextEffect.effectTag &= ~Placement;
        break;
      case PlacementAndUpdate:
        commitPlacement(nextEffect);
        nextEffect.effectTag &= ~Placement;
        var current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      case Update:
        current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      case Deletion:
        commitDeletion(nextEffect);
        break;
    }

    nextEffect = nextEffect.nextEffect;
  }
}

function commitAllLifeCycles(finishedRoot, committedExpirationTime) {
  while (nextEffect !== null) {
    var effectTag = nextEffect.effectTag;
    if (effectTag & (Update | Callback)) {
      var current = nextEffect.alternate;
      commitLifeCycles(finishedRoot, current, nextEffect, committedExpirationTime);
    }

    // TODO ref

    var next = nextEffect.nextEffect;
    nextEffect.nextEffect = null;
    nextEffect = next;
  }
}

function commitRoot(root, finishedWork) {
  isWorking = true;
  isCommitting = true;

  var committedExpirationTime = root.pendingCommitExpirationTime;
  root.pendingCommitExpirationTime = NoWork;
  var earliestRemainingTime = finishedWork.expirationTime;
  markCommittedPriorityLevels(root, earliestRemainingTime);

  ReactCurrentOwner.current = null;

  var firstEffect = void 0;
  if (finishedWork.effectTag > PerformedWork) {
    if (finishedWork.lastEffect !== null) {
      finishedWork.lastEffect.nextEffect = finishedWork;
      firstEffect = finishedWork.firstEffect;
    } else {
      firstEffect = finishedWork;
    }
  } else {
    firstEffect = finishedWork.firstEffect;
  }

  // TODO prepare save selection state

  // Invoke instances of getSnapshotBeforeUpdate before mutation
  nextEffect = firstEffect;
  while (nextEffect !== null) {
    try {
      commitBeforeMutationLifecycles();
    } catch (e) {
    }
  }

  // Commit all the side-effects within a tree. We'll do this in two passes.
  nextEffect = firstEffect;
  while (nextEffect !== null) {
    try {
      commitAllHostEffects();
    } catch (e) {
    }
  }

  // TODO reset  restore selection state

  // set workInProgress to current
  root.current = finishedWork;

  // perform all life-cycles and ref callbacks.
  nextEffect = firstEffect;
  while (nextEffect !== null) {
    try {
      commitAllLifeCycles(root, committedExpirationTime);
    } catch (e) {
    }
  }

  isCommitting = false;
  isWorking = false;

  // TODO onCommitRoot for react dev tool

  // TODO error boundary
}

function addRootToSchedule(root, expirationTime) {
  if (root.nextScheduledRoot === null) {
    root.expirationTime = expirationTime;
    if (lastScheduledRoot === null) {
      firstScheduledRoot = lastScheduledRoot = root;
      root.nextScheduledRoot = root;
    }
  }
}

function requestWork(root, expirationTime) {
  addRootToSchedule(root, expirationTime);
  if (isRendering) return;
  if (isBatchingUpdates) {
    if (isUnbatchingUpdates) {
      // ensure sync update
      nextFlushedRoot = root;
      nextFlushedExpirationTime = Sync;
      // TODO performWorkOnRoot(root, Sync, true)
    }
    return;
  }

  if (expirationTime === Sync) {
    performSyncWork();
  }
}

function unbatchedUpdates(fn, a) {
  if (isBatchingUpdates && !isUnbatchingUpdates) {
    isUnbatchingUpdates = true;
    try {
      return fn(a);
    } finally {
      isUnbatchingUpdates = false;
    }
  }
  return fn(a);
}

function batchedUpdates(fn, a) {
  var previousIsBatchingUpdates = isBatchingUpdates;
  isBatchingUpdates = true;
  try {
    return fn(a);
  } finally {
    isBatchingUpdates = previousIsBatchingUpdates;
    if (!isBatchingUpdates && !isRendering) {
      performSyncWork();
    }
  }
}

function interactiveUpdates(fn, a, b) {
  if (isBatchingInteractiveUpdates) {
    return fn(a, b);
  }

  if (!isBatchingUpdates && !isRendering && lowestPendingInteractiveExpirationTime !== NoWork) {
    performWork(lowestPendingInteractiveExpirationTime, null);
    lowestPendingInteractiveExpirationTime = NoWork;
  }

  var previousIsBatchingInteractiveUpdates = isBatchingInteractiveUpdates;
  var previousIsBatchingUpdates = isBatchingUpdates;
  isBatchingInteractiveUpdates = true;
  isBatchingUpdates = true;

  try {
    return fn(a, b);
  } finally {
    isBatchingInteractiveUpdates = previousIsBatchingInteractiveUpdates;
    isBatchingUpdates = previousIsBatchingUpdates;
    if (!isBatchingUpdates && !isRendering) {
      performSyncWork();
    }
  }
}

var emptyContextObjext = {};

function getContextForSubtree(parentComponent) {
  if (!parentComponent) {
    return emptyContextObjext;
  }
}

function scheduleRootUpdate(current, element, expirationTime, callback) {
  var update = createUpdate(expirationTime);
  update.payload = { element: element };
  callback = callback === undefined ? null : callback;
  if (callback !== null) update.callback = callback;
  enqueueUpdate(current, update, expirationTime);
  scheduleWork(current, expirationTime);
  return expirationTime;
}

function createContainer(container, isAsync, hydrate) {
  return createFiberRoot(container, isAsync, hydrate);
}

function getPublicRootInstance(container) {
  var containerFiber = container.current;
  if (!containerFiber.child) {
    return null;
  }
  return containerFiber.child.stateNode;
}

function updateContainerAtExpirationTime(element, container, parentComponent, expirationTime, callback) {
  var current = container.current;
  var context = getContextForSubtree(parentComponent);
  if (container.context === null) {
    container.context = context;
  } else {
    container.pendingContext = context;
  }
  return scheduleRootUpdate(current, element, expirationTime, callback);
}

function updateContainer(element, container, parentComponent, callback) {
  var current = container.current;
  var currentTime = requestCurrentTime();
  var expirationTime = computeExpirationForFiber(currentTime, current);
  return updateContainerAtExpirationTime(element, container, parentComponent, expirationTime, callback);
}

// TODO more event types

var Order = ['SimpleEventPlugin', 'ChangeEventPlugin'];

var restoreTarget = null;
var restoreQueue = null;

function enqueueStateRestore(target) {
  if (restoreTarget) {
    if (restoreQueue) {
      restoreQueue.push(target);
    } else {
      restoreQueue = [target];
    }
  } else {
    restoreTarget = target;
  }
}

var supportedInputTypes = {
  color: true,
  date: true,
  datetime: true,
  'datetime-local': true,
  email: true,
  month: true,
  number: true,
  password: true,
  range: true,
  search: true,
  tel: true,
  text: true,
  time: true,
  url: true,
  week: true
};

var eventTypes$1 = {
  change: {
    phasedRegistrationNames: {
      bubbled: 'onChange',
      captured: 'onChangeCapture'
    },
    dependencies: [TOP_BLUR, TOP_CHANGE, TOP_CLICK, TOP_FOCUS, TOP_INPUT, TOP_KEY_DOWN, TOP_KEY_UP, TOP_SELECTION_CHANGE]
  }
};

function shouldUseChangeEvent(elem) {
  var nodeName = elem.nodeName && elem.nodeName.toLowerCase();
  return nodeName === 'select' || nodeName === 'input' && elem.type === 'file';
}

function isTextInputElement(elem) {
  var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
  if (nodeName === 'input') {
    return !!supportedInputTypes[elem.type];
  }

  if (nodeName === 'textarea') return true;

  return false;
}

function shouldUseClickEvent(elem) {
  var nodeName = elem.nodeName;
  return nodeName && nodeName.toLowerCase() === 'input' && (elem.type === 'checkbox' || elem.type === 'radio');
}

function getTargetInstForChangeEvent(topLevelType, targetInst) {
  if (topLevelType === TOP_CHANGE) {
    return targetInst;
  }
}

function getInstIfValueChanged(targetInst) {
  var targetNode = getNodeFromInstance(targetInst);
  if (updateValueIfChanged(targetNode)) {
    return targetInst;
  }
}

function getTargetInstForInputOrChangeEvent(topLevelType, targetInst) {
  if (topLevelType === TOP_CHANGE || topLevelType === TOP_INPUT) {
    return getInstIfValueChanged(targetInst);
  }
}

function getTargetInstForClickEvent(topLevelType, targetInst) {
  if (topLevelType === TOP_CLICK) {
    return getInstIfValueChanged(targetInst);
  }
}

function handleControlledInputBlur(node) {
  var state = node._wrapperState;
  if (!state || !state.controlled || node.type !== 'number') return;
  setDefaultValue(node, 'number', node.value);
}

// not supported for ie 9
var isInputEventSupported = isEventSupported('input') && (!document.documentMode || document.documentMode > 9);

var changeEventPlugin = {
  eventTypes: eventTypes$1,
  _isInputEventSupported: isInputEventSupported,
  extractEvents: function extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    var targetNode = targetInst ? getNodeFromInstance(targetInst) : window;
    var getTargetInstFunc = void 0;
    // 1. select input type=file
    if (shouldUseChangeEvent(targetNode)) {
      getTargetInstFunc = getTargetInstForChangeEvent;
    } else if (isTextInputElement(targetNode)) {
      // 2. input textarea
      getTargetInstFunc = getTargetInstForInputOrChangeEvent;
      // if (isInputEventSupported) {
      //   // 2.1 支持input事件
      // } else {
      //   // 2.2 不支持input事件
      // }
    } else if (shouldUseClickEvent(targetNode)) {
      // 3. radio checkbox
      getTargetInstFunc = getTargetInstForClickEvent;
    }

    // TODO ie polyfill

    if (getTargetInstFunc) {
      var inst = getTargetInstFunc(topLevelType, targetInst);
      if (inst) {
        nativeEvent.dispatchConfig = eventTypes$1.change;
        nativeEvent._targetInst = targetInst;
        enqueueStateRestore(nativeEventTarget);
        accumulateTwoPhaseDispatches(nativeEvent);
        return nativeEvent;
      }
    }

    if (topLevelType === TOP_BLUR) {
      handleControlledInputBlur(targetNode);
    }
  }
};

injection$1.injectEventPluginOrder(Order);
injection.injectComponentTree(ReactDOMComponentTree);

injection$1.injectEventPluginsByName({
  SimpleEventPlugin: SimpleEventPlugin,
  ChangeEventPlugin: changeEventPlugin
});

var ReactWork = function () {
  function ReactWork() {
    classCallCheck(this, ReactWork);

    this._callbacks = null;
    this._didCommit = false;
    this._onCommit = this._onCommit.bind(this);
  }

  createClass(ReactWork, [{
    key: 'then',
    value: function then(onCommit) {
      if (this._didCommit) {
        onCommit();
        return;
      }

      var callbacks = this._callbacks;
      if (callbacks === null) {
        callbacks = this._callbacks = [];
      }
      callbacks.push(onCommit);
    }
  }, {
    key: '_onCommit',
    value: function _onCommit() {
      if (this._didCommit) return;
      this._didCommit = true;
      var callbacks = this._callbacks;
      if (callbacks === null) return;
      // TODO: Error handling
      for (var i = 0; i < callbacks.length; i++) {
        var callback = callbacks[i];
        callback();
      }
    }
  }]);
  return ReactWork;
}();

var ReactRoot = function () {
  function ReactRoot(container, isAsync, hydrate) {
    classCallCheck(this, ReactRoot);

    var root = createContainer(container, isAsync, hydrate);
    this._internalRoot = root;
  }

  createClass(ReactRoot, [{
    key: 'render',
    value: function render(children, callback) {
      var root = this._internalRoot;
      var work = new ReactWork();
      callback = callback === undefined ? null : callback;
      if (callback !== null) {
        work.then(callback);
      }
      updateContainer(children, root, null, work._onCommit);
      return work;
    }
  }, {
    key: 'unmount',
    value: function unmount(callback) {
      var root = this._internalRoot;
      var work = new ReactWork();
      callback = callback === undefined ? null : callback;
      if (callback !== null) {
        work.then(callback);
      }
      updateContainer(null, root, null, work._onCommit);
      return work;
    }
  }, {
    key: 'legacy_renderSubTreeIntoContainer',
    value: function legacy_renderSubTreeIntoContainer(parentComponent, children, callback) {
      var root = this._internalRoot;
      var work = new ReactWork();
      callback = callback === undefined ? null : callback;
      if (callback !== null) {
        work.then(callback);
      }
      updateContainer(children, root, parentComponent, work._onCommit);
      return work;
    }
  }, {
    key: 'createBatch',
    value: function createBatch() {}
  }]);
  return ReactRoot;
}();

function legacyCreateRootFromDOMContainer(container, forceHydrate) {
  if (!forceHydrate) {
    var rootSibling = void 0;
    while (rootSibling = container.lastChild) {
      container.removeChild(rootSibling);
    }
  }
  var isAsync = false;
  return new ReactRoot(container, isAsync, forceHydrate);
}

function legacyRenderSubTreeIntoContainer(parentComponent, children, container, forceHydrate, callback) {
  var root = container._reactRootContainer;
  if (!root) {
    // 第一次渲染
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container, forceHydrate);

    if (typeof callback === 'function') {
      var originalCallback = callback;
      callback = function callback() {
        // 第一次渲染时就是null
        var instance = getPublicRootInstance(root._internalRoot);
        originalCallback.call(instance);
      };
    }

    // 初始化渲染
    unbatchedUpdates(function () {
      if (parentComponent != null) {
        root.legacy_renderSubTreeIntoContainer(parentComponent, children, callback);
      } else {
        root.render(children, callback);
      }
    });
  } else {
    // 非第一次渲染
    if (typeof callback === 'function') {
      var _originalCallback = callback;
      callback = function callback() {
        // 第一次渲染时就是null
        var instance = getPublicRootInstance(root._internalRoot);
        _originalCallback.call(instance);
      };
    }

    if (parentComponent != null) {
      root.legacy_renderSubTreeIntoContainer(parentComponent, children, callback);
    } else {
      root.render(children, callback);
    }
  }

  return getPublicRootInstance(root._internalRoot);
}

var ReactDom = {
  render: function render(element, container, callback) {
    return legacyRenderSubTreeIntoContainer(null, element, container, false, callback);
  },
  unstable_renderSubtreeIntoContainer: function unstable_renderSubtreeIntoContainer(parentComponent, element, container, callback) {
    return legacyRenderSubTreeIntoContainer(parentComponent, element, container, false, callback);
  }
};

var React = {
  createElement: createElement,
  Component: Component,
  render: ReactDom.render
};

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = "body {\n  margin: 0;\n  padding: 0;\n  font-family: sans-serif;\n}\n";
styleInject(css);

var TODOAPP = 'react-todos';

function getList() {
  return new Promise(function (resolve, reject) {
    try {
      var list = localStorage.getItem(TODOAPP) || JSON.stringify([]);
      resolve({
        code: 0,
        data: JSON.parse(list)
      });
    } catch (e) {
      reject({
        code: -1,
        error: e
      });
    }
  });
}

function updateItem(list) {
  return new Promise(function (resolve, reject) {
    try {
      localStorage.setItem(TODOAPP, JSON.stringify(list));
      resolve({
        code: 0
      });
    } catch (e) {
      reject({
        code: -1,
        error: e
      });
    }
  });
}

var css$1 = "html,\nbody {\n\tmargin: 0;\n\tpadding: 0;\n}\n\nbutton {\n\tmargin: 0;\n\tpadding: 0;\n\tborder: 0;\n\tbackground: none;\n\tfont-size: 100%;\n\tvertical-align: baseline;\n\tfont-family: inherit;\n\tfont-weight: inherit;\n\tcolor: inherit;\n\t-webkit-appearance: none;\n\t-moz-appearance: none;\n\t     appearance: none;\n\t-webkit-font-smoothing: antialiased;\n\t-moz-osx-font-smoothing: grayscale;\n}\n\nbody {\n\tfont: 14px 'Helvetica Neue', Helvetica, Arial, sans-serif;\n\tline-height: 1.4em;\n\tbackground: #f5f5f5;\n\tcolor: #4d4d4d;\n\tmin-width: 230px;\n\tmax-width: 550px;\n\tmargin: 0 auto;\n\t-webkit-font-smoothing: antialiased;\n\t-moz-osx-font-smoothing: grayscale;\n\tfont-weight: 300;\n}\n\n:focus {\n\toutline: 0;\n}\n\n.hidden {\n\tdisplay: none;\n}\n\n.todoapp {\n\tbackground: #fff;\n\tmargin: 130px 0 40px 0;\n\tposition: relative;\n\t-webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .2),\n\t            0 25px 50px 0 rgba(0, 0, 0, .1);\n\t        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .2),\n\t            0 25px 50px 0 rgba(0, 0, 0, .1);\n}\n\n.todoapp input::-webkit-input-placeholder {\n\tfont-style: italic;\n\tfont-weight: 400;\n\tcolor: #e6e6e6;\n}\n\n.todoapp input::-moz-placeholder {\n\tfont-style: italic;\n\tfont-weight: 400;\n\tcolor: #e6e6e6;\n}\n\n.todoapp input::input-placeholder {\n\tfont-style: italic;\n\tfont-weight: 400;\n\tcolor: #e6e6e6;\n}\n\n.todoapp h1 {\n\tposition: absolute;\n\ttop: -155px;\n\twidth: 100%;\n\tfont-size: 100px;\n\ttext-align: center;\n\tcolor: rgba(175, 47, 47, .15);\n\t-webkit-text-rendering: optimizeLegibility;\n\t-moz-text-rendering: optimizeLegibility;\n\ttext-rendering: optimizeLegibility;\n}\n\n.new-todo,\n.edit {\n\tposition: relative;\n\tmargin: 0;\n\twidth: 100%;\n\tfont-size: 24px;\n\tfont-family: inherit;\n\tfont-weight: inherit;\n\tline-height: 1.4em;\n\tborder: 0;\n\tcolor: inherit;\n\tpadding: 6px;\n\tborder: 1px solid #999;\n\t-webkit-box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, .2);\n\t        box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, .2);\n\t-webkit-box-sizing: border-box;\n\t        box-sizing: border-box;\n\t-webkit-font-smoothing: antialiased;\n\t-moz-osx-font-smoothing: grayscale;\n}\n\n.new-todo {\n\tpadding: 16px 16px 16px 60px;\n\tborder: none;\n\tbackground: rgba(0, 0, 0, .003);\n\t-webkit-box-shadow: inset 0 -2px 1px rgba(0, 0, 0, .03);\n\t        box-shadow: inset 0 -2px 1px rgba(0, 0, 0, .03);\n\tfont-weight: 400;\n}\n\n.main {\n\tposition: relative;\n\tz-index: 2;\n\tborder-top: 1px solid #e6e6e6;\n}\n\n.toggle-all {\n\twidth: 1px;\n\theight: 1px;\n\tborder: none; /* Mobile Safari */\n\topacity: 0;\n\tposition: absolute;\n\tright: 100%;\n\tbottom: 100%;\n}\n\n.toggle-all + label {\n\twidth: 60px;\n\theight: 34px;\n\tfont-size: 0;\n\tposition: absolute;\n\ttop: -52px;\n\tleft: -13px;\n\t-webkit-transform: rotate(90deg);\n\ttransform: rotate(90deg);\n}\n\n.toggle-all + label:before {\n\tcontent: '❯';\n\tfont-size: 22px;\n\tcolor: #e6e6e6;\n\tpadding: 10px 27px 10px 27px;\n}\n\n.toggle-all:checked + label:before {\n\tcolor: #737373;\n}\n\n.todo-list {\n\tmargin: 0;\n\tpadding: 0;\n\tlist-style: none;\n}\n\n.todo-list li {\n\tposition: relative;\n\tfont-size: 24px;\n\tborder-bottom: 1px solid #ededed;\n}\n\n.todo-list li:last-child {\n\tborder-bottom: none;\n}\n\n.todo-list li.editing {\n\tborder-bottom: none;\n\tpadding: 0;\n}\n\n.todo-list li.editing .edit {\n\tdisplay: block;\n\twidth: 506px;\n\tpadding: 12px 16px;\n\tmargin: 0 0 0 43px;\n}\n\n.todo-list li.editing .view {\n\tdisplay: none;\n}\n\n.todo-list li .toggle {\n\ttext-align: center;\n\twidth: 40px;\n\t/* auto, since non-WebKit browsers doesn't support input styling */\n\theight: auto;\n\tposition: absolute;\n\ttop: 0;\n\tbottom: 0;\n\tmargin: auto 0;\n\tborder: none; /* Mobile Safari */\n\t-webkit-appearance: none;\n\t-moz-appearance: none;\n\t     appearance: none;\n}\n\n.todo-list li .toggle {\n\topacity: 0;\n}\n\n.todo-list li .toggle + label {\n\t/*\n\t\tFirefox requires `#` to be escaped - https://bugzilla.mozilla.org/show_bug.cgi?id=922433\n\t\tIE and Edge requires *everything* to be escaped to render, so we do that instead of just the `#` - https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7157459/\n\t*/\n\tbackground-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23ededed%22%20stroke-width%3D%223%22/%3E%3C/svg%3E');\n\tbackground-repeat: no-repeat;\n\tbackground-position: center left;\n}\n\n.todo-list li .toggle:checked + label {\n\tbackground-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23bddad5%22%20stroke-width%3D%223%22/%3E%3Cpath%20fill%3D%22%235dc2af%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22/%3E%3C/svg%3E');\n}\n\n.todo-list li label {\n\tword-break: break-all;\n\tpadding: 15px 15px 15px 60px;\n\tdisplay: block;\n\tline-height: 1.2;\n\tfont-weight: 400;\n\t-webkit-transition: color 0.4s;\n\ttransition: color 0.4s;\n}\n\n.todo-list li.completed label {\n\tcolor: #d9d9d9;\n\ttext-decoration: line-through;\n}\n\n.todo-list li .destroy {\n\tdisplay: none;\n\tposition: absolute;\n\ttop: 0;\n\tright: 10px;\n\tbottom: 0;\n\twidth: 40px;\n\theight: 40px;\n\tmargin: auto 0;\n\tfont-size: 30px;\n\tcolor: #cc9a9a;\n\tmargin-bottom: 11px;\n\t-webkit-transition: color 0.2s ease-out;\n\ttransition: color 0.2s ease-out;\n}\n\n.todo-list li .destroy:hover {\n\tcolor: #af5b5e;\n}\n\n.todo-list li .destroy:after {\n\tcontent: '×';\n}\n\n.todo-list li:hover .destroy {\n\tdisplay: block;\n}\n\n.todo-list li .edit {\n\tdisplay: none;\n}\n\n.todo-list li.editing:last-child {\n\tmargin-bottom: -1px;\n}\n\n.footer {\n\tcolor: #777;\n\tpadding: 10px 15px;\n\theight: 20px;\n\ttext-align: center;\n\tborder-top: 1px solid #e6e6e6;\n\tfont-weight: 400;\n}\n\n.footer:before {\n\tcontent: '';\n\tposition: absolute;\n\tright: 0;\n\tbottom: 0;\n\tleft: 0;\n\theight: 50px;\n\toverflow: hidden;\n\t-webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .2),\n\t            0 8px 0 -3px #f6f6f6,\n\t            0 9px 1px -3px rgba(0, 0, 0, .2),\n\t            0 16px 0 -6px #f6f6f6,\n\t            0 17px 2px -6px rgba(0, 0, 0, .2);\n\t        box-shadow: 0 1px 1px rgba(0, 0, 0, .2),\n\t            0 8px 0 -3px #f6f6f6,\n\t            0 9px 1px -3px rgba(0, 0, 0, .2),\n\t            0 16px 0 -6px #f6f6f6,\n\t            0 17px 2px -6px rgba(0, 0, 0, .2);\n}\n\n.todo-count {\n\tfloat: left;\n\ttext-align: left;\n}\n\n.todo-count strong {\n\tfont-weight: 500;\n}\n\n.filters {\n\tmargin: 0;\n\tpadding: 0;\n\tlist-style: none;\n\tposition: absolute;\n\tright: 0;\n\tleft: 0;\n}\n\n.filters li {\n\tdisplay: inline;\n}\n\n.filters li a {\n\tcolor: inherit;\n\tmargin: 3px;\n\tpadding: 3px 7px;\n\ttext-decoration: none;\n\tborder: 1px solid transparent;\n\tborder-radius: 3px;\n}\n\n.filters li a:hover {\n\tborder-color: rgba(175, 47, 47, .1);\n}\n\n.filters li a.selected {\n\tborder-color: rgba(175, 47, 47, .2);\n}\n\n.clear-completed,\nhtml .clear-completed:active {\n\tfloat: right;\n\tposition: relative;\n\tline-height: 20px;\n\ttext-decoration: none;\n\tcursor: pointer;\n}\n\n.clear-completed:hover {\n\ttext-decoration: underline;\n}\n\n.info {\n\tmargin: 65px auto 0;\n\tcolor: #bfbfbf;\n\tfont-size: 10px;\n\ttext-shadow: 0 1px 0 rgba(255, 255, 255, .5);\n\ttext-align: center;\n}\n\n.info p {\n\tline-height: 1;\n}\n\n.info a {\n\tcolor: inherit;\n\ttext-decoration: none;\n\tfont-weight: 400;\n}\n\n.info a:hover {\n\ttext-decoration: underline;\n}\n\n/*\n\tHack to remove background from Mobile Safari.\n\tCan't use it globally since it destroys checkboxes in Firefox\n*/\n@media screen and (-webkit-min-device-pixel-ratio:0) {\n\t.toggle-all,\n\t.todo-list li .toggle {\n\t\tbackground: none;\n\t}\n\n\t.todo-list li .toggle {\n\t\theight: 40px;\n\t}\n}\n\n@media (max-width: 430px) {\n\t.footer {\n\t\theight: 50px;\n\t}\n\n\t.filters {\n\t\tbottom: 10px;\n\t}\n}\n";
styleInject(css$1);

var ToDoItem = function (_React$Component) {
  inherits(ToDoItem, _React$Component);

  function ToDoItem() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, ToDoItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = ToDoItem.__proto__ || Object.getPrototypeOf(ToDoItem)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      edit: false
    }, _this.handleChange = function (e) {
      console.log(e.target.value);
    }, _this.showEdit = function (e) {
      if (!_this.state.edit) {
        _this.setState({
          edit: true /*, () => {
                      this.inputRef.current.focus()
                     }*/ });
      }
    }, _this.toggleComplete = function (e) {
      var item = Object.assign({}, _this.props.item, {
        isCompleted: !_this.props.item.isCompleted
      });
      _this.props.changeItem(item);
    }, _this.deleteItem = function (e) {
      _this.props.delItem(_this.props.item.id);
    }, _this.stop = function (e) {
      e.stopPropagation();
    }, _this.handleSubmit = function (e) {
      var value = e.target.value;
      if (value && value !== _this.props.item.value) {
        var item = Object.assign({}, _this.props.item, {
          value: value
        });

        _this.setState({
          edit: false
        }, function () {
          _this.props.changeItem(item);
        });
      } else {
        _this.setState({
          edit: false
        });
      }
    }, _this.handleEnter = function (e) {
      if (e.keyCode === 13) {
        _this.handleSubmit(e);
      }
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  // inputRef = React.createRef()

  createClass(ToDoItem, [{
    key: 'render',
    value: function render() {
      var item = this.props.item;
      var edit = this.state.edit;

      return React.createElement(
        'li',
        { className: item.isCompleted ? 'completed' : edit ? 'editing' : '' },
        React.createElement(
          'div',
          { className: 'view', onDoubleClick: this.showEdit },
          React.createElement('input', { checked: item.isCompleted, onDoubleClick: this.stop, onChange: this.toggleComplete, className: 'toggle', type: 'checkbox' }),
          React.createElement(
            'label',
            null,
            item.value
          ),
          React.createElement('button', { onDoubleClick: this.stop, className: 'destroy', onClick: this.deleteItem })
        ),
        React.createElement('input', { /*ref={this.inputRef}*/onKeyUp: this.handleEnter, onBlur: this.handleSubmit, className: 'edit', defaultValue: item.value })
      );
    }
  }]);
  return ToDoItem;
}(React.Component);

var getHashType = function getHashType() {
  var hash = window.location.hash;
  if (hash === '#/active') return 'active';else if (hash === '#/completed') return 'completed';else return 'all';
};

var ToDoList = function (_React$Component) {
  inherits(ToDoList, _React$Component);

  function ToDoList() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, ToDoList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = ToDoList.__proto__ || Object.getPrototypeOf(ToDoList)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      list: [],
      currentValue: '',
      isAllCompleted: false,
      type: getHashType()
    }, _this.toggleComplete = function (e) {
      var list = _this.state.list.slice();
      list.forEach(function (item) {
        item.isCompleted = !_this.state.isAllCompleted;
      });
      updateItem(list).then(function (res) {
        if (res.code === 0) {
          _this.setState({
            list: list,
            isAllCompleted: !_this.state.isAllCompleted
          });
        }
      });
    }, _this.handleAdd = function (e) {
      var value = e.target.value;
      if (e.keyCode === 13 && value) {
        var list = _this.state.list.slice();
        var maxId = list.length > 0 ? list[0].id : 0;
        list.forEach(function (item) {
          if (item.id > maxId) maxId = item.id;
        });
        var item = {
          id: maxId + 1,
          value: value,
          isCompleted: false
        };
        list.push(item);

        updateItem(list).then(function (res) {
          if (res.code === 0) {
            var isAllCompleted = _this.checkForAllCompleted(list);
            _this.setState({
              list: list,
              isAllCompleted: isAllCompleted,
              currentValue: ''
            });
          }
        });
      }
    }, _this.handleChange = function (e) {
      _this.setState({
        currentValue: e.target.value
      });
    }, _this.changeItem = function (item) {
      var list = _this.state.list.slice();
      var index = list.findIndex(function (i) {
        return i.id === item.id;
      });
      list.splice(index, 1, item);

      updateItem(list).then(function (res) {
        if (res.code === 0) {
          var isAllCompleted = _this.checkForAllCompleted(list);
          _this.setState({
            list: list,
            isAllCompleted: isAllCompleted
          });
        }
      });
    }, _this.delItem = function (id) {
      var list = _this.state.list.slice();
      var index = list.findIndex(function (i) {
        return i.id === id;
      });
      list.splice(index, 1);

      updateItem(list).then(function (res) {
        if (res.code === 0) {
          var isAllCompleted = _this.checkForAllCompleted(list);
          _this.setState({
            list: list,
            isAllCompleted: isAllCompleted
          });
        }
      });
    }, _this.deleteCompleted = function () {
      var list = _this.state.list.filter(function (item) {
        return !item.isCompleted;
      });

      updateItem(list).then(function (res) {
        if (res.code === 0) {
          var isAllCompleted = _this.checkForAllCompleted(list);
          _this.setState({
            list: list,
            isAllCompleted: isAllCompleted
          });
        }
      });
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(ToDoList, [{
    key: 'checkForAllCompleted',
    value: function checkForAllCompleted(list) {
      var isAllCompleted = list && list.length > 0 ? true : false;
      list.forEach(function (item) {
        if (!item.isCompleted) isAllCompleted = false;
      });
      return isAllCompleted;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      getList().then(function (res) {
        if (res.code === 0) {
          var isAllCompleted = _this2.checkForAllCompleted(res.data);
          _this2.setState({
            list: res.data,
            isAllCompleted: isAllCompleted
          });
        }
      });
      window.onhashchange = function (e) {
        var oldType = _this2.state.type;
        var newType = getHashType();
        if (oldType !== newType) {
          _this2.setState({
            type: newType
          });
        }
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var type = this.state.type;

      var allList = this.state.list.slice();
      var activeList = allList.filter(function (item) {
        return !item.isCompleted;
      });
      var completedList = allList.filter(function (item) {
        return item.isCompleted;
      });

      var len = allList.length;
      var activeCount = activeList.length;
      var hasCompleted = completedList.length > 0;

      var list = allList;
      if (type === 'active') {
        list = activeList;
      } else if (type === 'completed') {
        list = completedList;
      }
      return React.createElement(
        'div',
        null,
        React.createElement(
          'section',
          { className: 'todoapp' },
          React.createElement(
            'header',
            { className: 'header' },
            React.createElement(
              'h1',
              null,
              'todos'
            ),
            React.createElement('input', { value: this.state.currentValue, onChange: this.handleChange, onKeyUp: this.handleAdd, className: 'new-todo', placeholder: 'What needs to be done?', autoFocus: true })
          ),
          len > 0 && React.createElement(
            'section',
            { className: 'main' },
            React.createElement('input', { checked: this.state.isAllCompleted, onChange: this.toggleComplete, id: 'toggle-all', className: 'toggle-all', type: 'checkbox' }),
            React.createElement(
              'label',
              { htmlFor: 'toggle-all' },
              'Mark all as complete'
            ),
            React.createElement(
              'ul',
              { className: 'todo-list' },
              list.map(function (item) {
                return React.createElement(ToDoItem, { key: item.id, item: item, changeItem: _this3.changeItem, delItem: _this3.delItem });
              })
            )
          ),
          len > 0 && React.createElement(
            'footer',
            { className: 'footer' },
            React.createElement(
              'span',
              { className: 'todo-count' },
              React.createElement(
                'strong',
                null,
                activeCount
              ),
              ' item',
              activeCount > 1 && 's',
              ' left'
            ),
            React.createElement(
              'ul',
              { className: 'filters' },
              React.createElement(
                'li',
                null,
                React.createElement(
                  'a',
                  { className: type === 'all' ? 'selected' : '', href: '#/' },
                  'All'
                )
              ),
              React.createElement(
                'li',
                null,
                React.createElement(
                  'a',
                  { className: type === 'active' ? 'selected' : '', href: '#/active' },
                  'Active'
                )
              ),
              React.createElement(
                'li',
                null,
                React.createElement(
                  'a',
                  { className: type === 'completed' ? 'selected' : '', href: '#/completed' },
                  'Completed'
                )
              )
            ),
            hasCompleted && React.createElement(
              'button',
              { onClick: this.deleteCompleted, className: 'clear-completed' },
              'Clear completed'
            )
          )
        ),
        React.createElement(
          'footer',
          { className: 'info' },
          React.createElement(
            'p',
            null,
            'Double-click to edit a todo'
          ),
          React.createElement(
            'p',
            null,
            'Created by ',
            React.createElement(
              'a',
              { href: 'http://github.com/sonacy' },
              'sonacy'
            )
          ),
          React.createElement(
            'p',
            null,
            'Part of ',
            React.createElement(
              'a',
              { href: 'http://todomvc.com' },
              'TodoMVC'
            )
          )
        )
      );
    }
  }]);
  return ToDoList;
}(React.Component);

React.render(React.createElement(ToDoList, null), document.getElementById('root'));
