declare global {
  namespace NodeJS {
    interface Global {
      debug: boolean
    }
  }
}

export interface BuildedFlags {
  [key: string]: any
}

export type RunnerWithFlags = (flags: BuildedFlags) => Promise<any> | any
export type RunnerWithoutFlags = () => Promise<any> | any

export type Runner = RunnerWithFlags | RunnerWithoutFlags

export type Plugin = (n: Namespace) => Namespace

export type Hook = Runner

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
  option?: Option[]
  plugins?: Plugin[]
  globalPlugins?: Plugin[]
  hooks?: {
    after?: Hook
    before?: Hook
  }
  acceptSubCommand?: boolean
  expose?: Array<Namespace>
  run: Runner
}
