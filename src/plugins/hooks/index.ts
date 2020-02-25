import { Plugin, Namespace, Hooks, Runner } from "src/types"

const hooks = (hooks: Hooks = {}): Plugin => (namespace: Namespace) => {
  const enhanceRunner: Runner = async (options, subCommand, flags) => {
    if (hooks.before) {
      await hooks.before(options, subCommand, flags)
    }

    const result = await namespace.run(options, subCommand, flags)

    if (hooks.after) {
      await hooks.after(options, subCommand, flags)
    }

    return result
  }

  return {
    ...namespace,
    run: enhanceRunner
  }
}

export default hooks
