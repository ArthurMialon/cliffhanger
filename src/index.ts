export * from "./types"

import execute from "./core/execute"
import log from "./core/log"

import help from "./plugins/help"
import hooks from "./plugins/hooks"

export const Plugins = {
  help,
  hooks
}

export default {
  execute,
  log,
  Plugins
}
