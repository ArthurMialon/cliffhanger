import { Namespace } from "src/types"

import { init } from "./index"

describe("Init", () => {
  it("should init the CLI and run the root", async () => {
    const run = jest.fn()

    const namespace: Namespace = {
      name: "test",
      description: "test desc",
      run
    }

    await init(namespace, [])

    expect(run).toHaveBeenCalled()
    expect(run).toHaveBeenCalledWith({}, null, { flags: {} })
  })

  it("should init the CLI and run the root with default params", async () => {
    const run = jest.fn()

    const namespace: Namespace = {
      name: "test",
      description: "test desc",
      options: [
        {
          title: "name",
          description: "test option",
          defaultValue: "my_default_name"
        }
      ],
      run
    }

    await init(namespace, [])

    expect(run).toHaveBeenCalled()
    expect(run).toHaveBeenCalledWith(
      {
        name: "my_default_name"
      },
      null,
      { flags: {} }
    )
  })

  it("should init the CLI and run the root with arguments params", async () => {
    const run = jest.fn()

    const namespace: Namespace = {
      name: "test",
      description: "test desc",
      options: [
        {
          title: "name",
          description: "test option",
          defaultValue: "my_default_name"
        }
      ],
      run
    }

    await init(namespace, ["--name=my_name"])

    expect(run).toHaveBeenCalled()
    expect(run).toHaveBeenCalledWith(
      {
        name: "my_name"
      },
      null,
      {
        flags: { name: "my_name" }
      }
    )
  })

  it("should init the CLI and run the root with arguments params even without option", async () => {
    const run = jest.fn()

    const namespace: Namespace = {
      name: "test",
      description: "test desc",
      run
    }

    await init(namespace, ["--name=my_name"])

    expect(run).toHaveBeenCalled()
    expect(run).toHaveBeenCalledWith({}, null, {
      flags: { name: "my_name" }
    })
  })

  it("should init the CLI and run the root with a sub command and options", async () => {
    const run = jest.fn()

    const namespace: Namespace = {
      name: "test",
      description: "test desc",
      acceptSubCommand: true,
      run
    }

    await init(namespace, ["hello"])

    expect(run).toHaveBeenCalled()
    expect(run).toHaveBeenCalledWith({}, "hello", { flags: {} })
  })

  it("should init the CLI and run the root with a sub command", async () => {
    const run = jest.fn()

    const namespace: Namespace = {
      name: "test",
      description: "test desc",
      options: [
        {
          title: "name",
          description: "test option",
          defaultValue: "my_default_name"
        }
      ],
      acceptSubCommand: true,
      run
    }

    await init(namespace, ["hello", "--name=my_name"])

    expect(run).toHaveBeenCalled()
    expect(run).toHaveBeenCalledWith(
      {
        name: "my_name"
      },
      "hello",
      {
        flags: { name: "my_name" }
      }
    )
  })

  it("should init the CLI and return error for unknown command", async () => {
    const log = jest.fn()
    global.console = { ...console, log }

    const run = jest.fn()

    const namespace: Namespace = {
      name: "test",
      description: "test desc",
      run
    }

    await init(namespace, ["hello"])

    expect(JSON.stringify(log.mock.calls[0][1])).toEqual(
      '"\\u001b[31mcannot find command <hello> in namespace <test>\\u001b[39m"'
    )
  })
})
