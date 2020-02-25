import { Namespace } from "src/types"

import getRunInfo from "./info"

describe("Runner build", () => {
  it("should return the error on prepared Namespace with error", () => {
    const run = jest.fn()

    const ns: Namespace = {
      name: "cli",
      description: "my desc",
      run
    }

    const result = getRunInfo(ns, ["hello"])

    expect(result).toEqual({
      error: true,
      namespace: ns,
      parent: null,
      subCommand: false,
      command: "hello"
    })
  })

  it("should return the error on prepared Namespace with error 2", () => {
    const run = jest.fn()

    const subNS: Namespace = {
      name: "cli-sub-command",
      description: "my desc",
      run
    }

    const ns: Namespace = {
      name: "cli",
      description: "my desc",
      expose: [subNS],
      run
    }

    const result = getRunInfo(ns, ["hello"])

    expect(result).toEqual({
      error: true,
      namespace: ns,
      parent: null,
      subCommand: false,
      command: "hello"
    })
  })

  it("should return the right prepared Namespace", () => {
    const run = jest.fn()

    const ns: Namespace = {
      name: "cli",
      description: "my desc",
      acceptSubCommand: true,
      run
    }

    const result = getRunInfo(ns, ["hello"])

    expect(result).toEqual({
      error: false,
      namespace: ns,
      parent: null,
      subCommand: true,
      command: "hello"
    })
  })

  it("should return the right prepared Namespace", () => {
    const run = jest.fn()

    const ns: Namespace = {
      name: "cli",
      description: "my desc",
      acceptSubCommand: false,
      run
    }

    const result = getRunInfo(ns, [])

    expect(result).toEqual({
      error: false,
      namespace: ns,
      parent: null,
      subCommand: false,
      command: null
    })
  })

  it("should return the right prepared Namespace with exposed", () => {
    const run = jest.fn()

    const exposed = {
      name: "greet",
      description: "my desc",
      run
    }

    const ns: Namespace = {
      name: "cli",
      description: "my desc",
      expose: [exposed],
      run
    }

    expect(getRunInfo(ns, [])).toEqual({
      error: false,
      namespace: ns,
      parent: null,
      subCommand: false,
      command: null
    })

    expect(getRunInfo(ns, ["greet"])).toEqual({
      error: false,
      namespace: exposed,
      parent: ns,
      subCommand: false,
      command: "greet"
    })

    expect(getRunInfo(ns, ["greet", "sub-greet"])).toEqual({
      error: true,
      namespace: exposed,
      parent: ns,
      subCommand: false,
      command: "sub-greet"
    })

    expect(getRunInfo(ns, ["greet", "sub-greet", "sub-sub-greet"])).toEqual({
      error: true,
      namespace: exposed,
      parent: ns,
      subCommand: false,
      command: "sub-greet"
    })
  })
})
