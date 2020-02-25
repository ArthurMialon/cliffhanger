import { Namespace } from "src/types"

import { ParsedArgs } from "minimist"
import minimist from "minimist"

import log from "../log"

import withPlugins from "./plugin"
import getRunInfo from "./info"
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
  const { _: command, ...flags } = args

  // Namespace and exposed with plugins
  const preparedNamespace = withPlugins(namespace)

  // Info about the namespace to run
  const runInfo = getRunInfo(preparedNamespace, command)

  // No runner has been found, command mistake
  if (runInfo.error) {
    return log.error(
      `cannot find command <${runInfo.command}> in namespace <${runInfo.namespace.name}>`
    )
  }

  // Let's build options based on namespace and plugins definitions
  const options = buildOptions(runInfo.namespace, flags)

  // Run the command
  return runInfo.namespace.run({
    ...options,
    subCommand: runInfo.subCommand ? runInfo.command : null
  })
}

export default { runCommand, init }
