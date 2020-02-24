export interface BuildedFlags {
  [key: string]: any
}

export type Flags = {
  [key: string]: any
}

export interface RunnerParams {
  options: Flags
  rawFlags: Flags
  subCommand?: string
}

export type RunnerWithFlags = (arg0: RunnerParams) => Promise<any> | any
export type RunnerWithoutFlags = () => Promise<any> | any

export type Runner = RunnerWithFlags | RunnerWithoutFlags

export type Plugin = (n: Namespace) => Namespace

export type Hook = Runner

export interface Hooks {
  after?: Hook
  before?: Hook
}

export interface Option {
  title: string
  description: string
  shorthand?: string[]
  defaultValue: any
}

export interface Namespace {
  name: string
  usage?: string
  description: string
  options?: Option[]
  plugins?: Plugin[]
  globalPlugins?: Plugin[]
  acceptSubCommand?: boolean
  expose?: Array<Namespace>
  run: Runner
}
