let eventPluginOrder
const namesToPlugins = {}

export const plugins = []
export const eventNameDispatchConfigs = {}
export const registrationNameModules = {}
export const registrationNameDependencies = {}

export function injectEventPluginOrder(injectedEventPluginOrder) {
  eventPluginOrder = Array.prototype.slice.call(injectedEventPluginOrder)
  recomputePluginOrdering()
}

export function injectEventPluginsByName(injectedNamesToPlugins) {
  let isOrderingDirty = false
  for (const name in injectedNamesToPlugins) {
    if (!injectedNamesToPlugins.hasOwnProperty(name)) continue

    const module = injectedNamesToPlugins[name]

    if (!namesToPlugins.hasOwnProperty(name) || namesToPlugins[name] !== module) {
      namesToPlugins[name] = module
      isOrderingDirty = true
    }
  }

  if (isOrderingDirty) recomputePluginOrdering()
}

function recomputePluginOrdering() {
  if (!eventPluginOrder) return

  for (const name in namesToPlugins) {
    const module = namesToPlugins[name]
    const index = eventPluginOrder.indexOf(name)
    if (plugins[index]) continue
    plugins[index] = module
    const publishedEvents = module.eventTypes
    for (const eventName in publishedEvents) {
      publishEventForPlugin(
        publishedEvents[eventName],
        module,
        eventName
      )
    }
  }
}

function publishEventForPlugin(dispatchConfig, pluginModule, eventName) {
  eventNameDispatchConfigs[eventName] = dispatchConfig

  const phasedRegistrationNames = dispatchConfig.phasedRegistrationNames

  if (phasedRegistrationNames) {
    for (const phaseName in phasedRegistrationNames) {
      if (phasedRegistrationNames.hasOwnProperty(phaseName)) {
        const phasedRegistrationName = phasedRegistrationNames[phaseName]
        publishRegistationName(
          phasedRegistrationName,
          pluginModule,
          eventName
        )
      }
    }
  } else if (dispatchConfig.registrationName) {
    publishRegistationName(
      dispatchConfig.registrationName,
      pluginModule,
      eventName
    )
  }
}

function publishRegistationName(registrationName, pluginModule, eventName) {
  registrationNameModules[registrationName] = pluginModule
  registrationNameDependencies[registrationName] = pluginModule.eventTypes[eventName].dependencies
}
