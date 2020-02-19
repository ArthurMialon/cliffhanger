export * from "./types"

import execute from "./core/execute"
import log from "./core/log"

import help from "./plugins/help"

export const Plugins = {
  help
}

export default {
  execute,
  log,
  Plugins
}
