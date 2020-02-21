import { Plugin, Namespace, Hooks, Runner } from "src/types"

const hooks = (hooks: Hooks = {}): Plugin => (namespace: Namespace) => {
  const enhanceRunner: Runner = async flags => {
    if (hooks.before) {
      await hooks.before(flags)
    }

    const result = await namespace.run(flags)

    if (hooks.after) {
      await hooks.after(flags)
    }

    return result
  }

  return {
    ...namespace,
    run: enhanceRunner
  }
}

export default hooks
