import { Namespace, Option, Flags } from "src/types"

/**
 *
 * @param option - Options definitions
 * @param flags - Flags from arguments with minimist parsed
 * @returns value - value from arguments (if not, return `null`)
 */
const getValueFromFlags = (option: Option, flags: Flags): any => {
  const keys = Object.keys(flags)

  const matchKey = keys.find(k =>
    [option.title].concat(option.shorthand || []).includes(k)
  )

  return matchKey ? flags[matchKey] : option.defaultValue
}

/**
 * Merge options with flags values from arguments
 *
 * @param flags - Flags from arguments with minimist parsed
 * @param options - Options definitions
 * @returns merged values
 */
const addValue = (flags: Flags) => (option: Option) => ({
  ...option,
  value: getValueFromFlags(option, flags)
})

/**
 * Build options from minimist parsing to options mapping in the namespace
 *
 * @param namespace - Namespace to run
 * @param flags - Flags from arguments with minimist parsed
 * @returns buildedoptions - options object to pass to run
 */
export default (namespace: Namespace, rawFlags: Flags) => {
  const nsOptions = namespace.options || []

  const options = nsOptions.map(addValue(rawFlags)).reduce(
    (acc, item) => ({
      ...acc,
      [item.title]: item.value
    }),
    {}
  )

  return { options, flags: rawFlags }
}
