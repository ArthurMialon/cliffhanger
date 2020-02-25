import { Namespace } from "src/types"

import buildOptions from "./option"

describe("Flags", () => {
  it("should return all flags", () => {
    const run = jest.fn()

    const namespace: Namespace = {
      name: "test",
      description: "test desc",
      run
    }

    const flags = {
      hello: "world"
    }

    expect(buildOptions(namespace, flags)).toEqual({
      options: {},
      flags
    })
  })

  it("should return all flags and option", () => {
    const run = jest.fn()

    const namespace: Namespace = {
      name: "test",
      description: "test desc",
      options: [
        {
          title: "name",
          description: "flag desc",
          defaultValue: true
        }
      ],
      run
    }

    const flags = {
      hello: "world",
      name: "my_name"
    }

    expect(buildOptions(namespace, flags)).toEqual({
      options: {
        name: "my_name"
      },
      flags
    })
  })

  it("should return all flags and option with shorthand", () => {
    const run = jest.fn()

    const namespace: Namespace = {
      name: "test",
      description: "test desc",
      options: [
        {
          title: "name",
          description: "flag desc",
          shorthand: ["n"],
          defaultValue: true
        }
      ],
      run
    }

    const flags = {
      hello: "world",
      n: "my_name"
    }

    expect(buildOptions(namespace, flags)).toEqual({
      options: {
        name: "my_name"
      },
      flags: {
        hello: "world",
        n: "my_name"
      }
    })
  })

  it("should return all flags and default option values", () => {
    const run = jest.fn()

    const namespace: Namespace = {
      name: "test",
      description: "test desc",
      options: [
        {
          title: "name",
          description: "flag desc",
          shorthand: ["n"],
          defaultValue: "my_default_name"
        }
      ],
      run
    }

    const flags = {
      hello: "world"
    }

    expect(buildOptions(namespace, flags)).toEqual({
      options: {
        name: "my_default_name"
      },
      flags: {
        hello: "world"
      }
    })
  })
})
