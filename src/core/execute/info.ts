import { Namespace } from "src/types"

export const getExposed = (
  namespace: Namespace,
  command: string
): Namespace | null => {
  if (!namespace.expose) return null

  const exposed = namespace.expose.find(expose => expose.name === command)

  return exposed || null
}

interface PreparedNamespace {
  namespace: Namespace
  subCommand: boolean
  parent: Namespace | null
  error: boolean
  command: string | null
}

const buildPrepareNamespace = (namespace: Namespace, commands: string[]) => {
  const base: PreparedNamespace = {
    namespace,
    subCommand: false,
    parent: null,
    error: false,
    command: null
  }

  return commands.reduce(
    (prepared: PreparedNamespace, command: string): PreparedNamespace => {
      if (prepared.error) return prepared

      const exposedNamespace = getExposed(prepared.namespace, command)

      prepared.command = command

      // our current namespace doesn't expose anything or
      // does not match with the current command
      if (!exposedNamespace) {
        // Our current namespace will be call with subCommand pattern
        if (namespace.acceptSubCommand) {
          return { ...prepared, subCommand: true }
        }

        // we didn't find either expose or subCommand
        return { ...prepared, error: true }
      }

      // go in a deeper level
      return {
        ...prepared,
        parent: prepared.namespace,
        namespace: exposedNamespace
      }
    },
    base
  )
}

export default buildPrepareNamespace
