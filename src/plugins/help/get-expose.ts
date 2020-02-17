import { Namespace } from "src/types"

export default (exposedNamespace: Namespace[]) =>
  exposedNamespace.map(expose => [expose.name, expose.description])
