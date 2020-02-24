import { Namespace, Option, Flags, RunnerParams } from "src/types"

const getValueFromFlags = (option: Option, flags: Flags): any => {
  const keys = Object.keys(flags)

  const matchKey = keys.find(k =>
    [option.title].concat(option.shorthand || []).includes(k)
  )

  return matchKey ? flags[matchKey] : option.defaultValue || null
}

const addValue = (flags: Flags) => (option: Option) => ({
  ...option,
  value: getValueFromFlags(option, flags)
})

/**
 * Build options from minimist parsing to options mapping in the namespace
 *
 * @param namespace - Namespace to run
 * @param options - List of options from minimist
 * @returns buildedoptions - options object to pass to run
 */
export default (namespace: Namespace, rawFlags: Flags): RunnerParams => {
  const nsOptions = namespace.options || []

  const options = nsOptions.map(addValue(rawFlags)).reduce(
    (acc, item) => ({
      ...acc,
      [item.title]: item.value
    }),
    {}
  )

  return { options, rawFlags }
}
