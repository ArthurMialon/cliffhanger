import { Namespace, Plugin } from "src/types"

/**
 * Enhance a Namespace by running Plugins on it.
 *
 * @param namespace - Namespace to run
 * @param globalPlugins - Parents plugins
 * @returns namespace - Enhance namespace with plugins
 */
export default (namespace: Namespace, globalPlugins: Plugin[] = []) => {
  const plugins = globalPlugins.concat(namespace.plugins || [])

  return plugins.reduce((acc: Namespace, plugin) => plugin(acc), namespace)
}
