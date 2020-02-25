import { Namespace, Plugin } from "src/types"

/**
 * Enhance a Namespace by running Plugins on it and its sub commands.
 * See it as a recursive compose function
 *
 * @param namespace - Namespace to run
 * @param parentPlugins - Parents plugins
 * @returns namespace - Enhance namespace with plugins
 */
const withPlugins = (
  namespace: Namespace,
  globalPlugins: Plugin[] = []
): Namespace => {
  globalPlugins = globalPlugins.concat(...(namespace.globalPlugins || []))

  const plugins = namespace.plugins || []

  const pluggedNamespace: Namespace = [...globalPlugins, ...plugins].reduce(
    (acc, plugin) => plugin(acc),
    namespace
  )

  const exposed = pluggedNamespace.expose?.map(expose =>
    withPlugins(expose, globalPlugins)
  )

  pluggedNamespace.expose = exposed

  return pluggedNamespace
}

export default withPlugins
