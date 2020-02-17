import { Option } from "src/types"

export default (options: Option[]) =>
  options.map(option => [
    (option.shorthand || [])
      .map(x => `-${x}`)
      .concat(`--${option.title}`)
      .join(", "),
    option.description
  ])
