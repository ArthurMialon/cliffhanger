import { Namespace, Plugin } from "src/types"

import { ParsedArgs } from "minimist"
import minimist from "minimist"

import execPlugins from "./plugin"
import buildOptions from "./option"

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
export const init = (namespace: Namespace, options: string[]) => {
  const args: ParsedArgs = minimist(options)

  return runCommand(namespace, args)
}

/**
 * Will pass through a namespace and trigger the associate runner
 *
 * @param namespace - Namespace to run
 * @param args - Arguments parsed from minimist
 */
export const runCommand = async (
  namespace: Namespace,
  args: ParsedArgs
): Promise<any> => {
  const { _: commands, ...flags } = args

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
    if (runnable.parent?.acceptSubCommand) {
      const buildedOptions = buildOptions(runnable.namespace, flags)

      const parameters = {
        ...buildedOptions,
        subCommand: runnable.askedCommand
      }

      return runnable.parent.run(parameters)
    }

    return console.error(
      `command <${runnable.askedCommand}> not found in namespace ${runnable.namespace.name}\n`
    )
  }

  const buildedOptions = buildOptions(runnable.namespace, flags)

  return runnable.namespace.run(buildedOptions)
}

export default { runCommand, init }
