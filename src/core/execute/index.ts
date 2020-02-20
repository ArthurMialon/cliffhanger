import { Namespace, Plugin } from "src/types"

import { ParsedArgs } from "minimist"
import minimist from "minimist"

/**
 * Run the full CLI and parsed argv arguments
 *
 * @remarks
 * This function will run the full CLI
 *
 * @param namespace - Namespace to run
 * @param options - Array of string like process.argv
 * @returns Might return nothing depending on the CLI execution
 */
const init = (namespace: Namespace, options: string[]) => {
  const args: ParsedArgs = minimist(options)

  return runCommand(namespace, args)
}

/**
 * Enhance a Namespace by running Plugins on it.
 *
 * @param namespace - Namespace to run
 * @returns namespace - Enhance namespace with plugins
 */
const execPlugins = (namespace: Namespace, globalPlugins: Plugin[] = []) => {
  const plugins = globalPlugins.concat(namespace.plugins || [])

  return plugins.reduce((acc: Namespace, plugin) => plugin(acc), namespace)
}

/**
 * Build flags from minimist parsing to options mapping in the namespace
 *
 * @param namespace - Namespace to run
 * @param flags - List of flags from minimise
 * @returns buildedFlags - flags object to pass to run
 */
const buildFlags = (namespace: Namespace, flags: { [key: string]: any }) =>
  (namespace.option || [])
    .map(item => {
      const fromOption = () => {
        const keys = Object.keys(flags)

        const matchKey = keys.find(k =>
          [item.title].concat(item.shorthand || []).includes(k)
        )

        return matchKey ? flags[matchKey] : null
      }

      return {
        ...item,
        value: fromOption() || item.defaultValue
      }
    })
    .reduce(
      (acc, item) => ({
        ...acc,
        [item.title]: item.value
      }),
      {}
    )

/**
 * Will pass through a namespace and trigger the associate runner
 *
 * @param namespace - Namespace to run
 * @param args - Arguments parsed from minimist
 */
const runCommand = (namespace: Namespace, args: ParsedArgs): any => {
  const { _: commands, ...flags } = args

  // setup debug mode
  if (flags["debug"]) {
    global.debug = true
  }

  const runnable = commands.reduce(
    (
      acc: {
        notFoundInNamespace: boolean
        namespace: Namespace
        askedCommand: string
        parent?: Namespace
        plugins?: Plugin[]
      },
      command
    ) => {
      const { notFoundInNamespace, namespace, plugins = [] } = acc

      acc.plugins = plugins.concat(namespace.globalPlugins || [])

      if (notFoundInNamespace) return acc

      const subCommand = namespace.expose?.find(c => c.name === command)

      if (subCommand) {
        return {
          notFoundInNamespace: false,
          namespace: execPlugins(subCommand, acc.plugins),
          askedCommand: command
        }
      }

      return {
        ...acc,
        notFoundInNamespace: true,
        askedCommand: command,
        parent: namespace
      }
    },
    {
      notFoundInNamespace: false,
      namespace: execPlugins(namespace, namespace.globalPlugins),
      askedCommand: namespace.name,
      plugins: []
    }
  )

  if (runnable.notFoundInNamespace) {
    if (runnable.parent?.acceptSubb) {
      const buildedFlags = buildFlags(runnable.namespace, flags)

      return runnable.parent.run({
        ...buildedFlags,
        subCommand: runnable.askedCommand
      })
    }

    console.error(
      `command <${runnable.askedCommand}> not found in namespace ${runnable.namespace.name}\n`
    )

    const helper = runnable.namespace.expose?.find(c => c.name === "help")

    return helper ? helper.run(flags) : null
  }

  if (!runnable.namespace.option) return runnable.namespace.run({})

  const buildedFlags = buildFlags(runnable.namespace, flags)

  return runnable.namespace.run(buildedFlags)
}

export default { runCommand, init }
