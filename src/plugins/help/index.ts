import { Plugin, Namespace } from "src/types"

import log from "../../core/log"

import table from "./table"
import getExposed from "./get-expose"
import getAccepts from "./get-option"

const helpNamespace = {
  name: "help",
  description: "get more information about a command",
  run: () => null
}

const SEPARATOR = "\n"

const run = (namespace: Namespace) => () => {
  const { expose, option } = namespace

  const helpname = table({
    title: `Name: (${namespace.name})`,
    values: []
  })

  log.log(...helpname)

  const helpDescription = table({
    title: "Description:",
    values: [[`${namespace.name}: ${namespace.description}`]]
  })

  log.log(...helpDescription, SEPARATOR)

  if (namespace.usage) {
    const helpUsage = table({
      title: "Usage:",
      values: [[namespace.usage]]
    })

    log.log(...helpUsage, SEPARATOR)
  }

  if (option && option.length > 0) {
    const helpExpose = table({
      title: "Available options:",
      values: getAccepts(option)
    })

    log.log(...helpExpose, SEPARATOR)
  }

  if (expose && expose.length > 0) {
    const helpExpose = table({
      title: "Available Commands:",
      values: getExposed(expose)
    })

    log.log(...helpExpose, SEPARATOR)
  }

  // log.log(namespace)
}

const getHelpNamespace = (namespace: Namespace) => {
  return {
    ...helpNamespace,
    run: run(namespace)
  }
}

const help: Plugin = (namespace: Namespace) => {
  const expose = (namespace.expose || []).concat(getHelpNamespace(namespace))

  return {
    ...namespace,
    expose
  }
}

export default help
