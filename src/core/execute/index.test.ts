import { Namespace, Plugin } from "src/types"

import { init, execPlugins, getHooks, buildFlags } from "./index"

describe("Execute", () => {
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
      expect(run).toHaveBeenCalledWith({})
    })

    it("should init the CLI and run the root with default params", async () => {
      const run = jest.fn()

      const namespace: Namespace = {
        name: "test",
        description: "test desc",
        option: [
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
      expect(run).toHaveBeenCalledWith({ name: "my_default_name" })
    })

    it("should init the CLI and run the root with arguments params", async () => {
      const run = jest.fn()

      const namespace: Namespace = {
        name: "test",
        description: "test desc",
        option: [
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
      expect(run).toHaveBeenCalledWith({ name: "my_name" })
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
      expect(run).toHaveBeenCalledWith({ name: "my_name" })
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
      expect(run).toHaveBeenCalledWith({ subCommand: "hello" })
    })

    it("should init the CLI and run the root with a sub command", async () => {
      const run = jest.fn()

      const namespace: Namespace = {
        name: "test",
        description: "test desc",
        option: [
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
      expect(run).toHaveBeenCalledWith({ subCommand: "hello", name: "my_name" })
    })

    it("should init the CLI and return error for unknown command", async () => {
      global.console = { ...console, error: jest.fn() }

      const run = jest.fn()

      const namespace: Namespace = {
        name: "test",
        description: "test desc",
        run
      }

      await init(namespace, ["hello"])

      expect(console.error).toBeCalledWith(
        "command <hello> not found in namespace test\n"
      )
    })
  })

  describe("Execute Plugins", () => {
    it("should not enhance namespace with any plugin", () => {
      const run = jest.fn()

      const namespace: Namespace = {
        name: "test",
        description: "test desc",
        run
      }

      const enhance = execPlugins(namespace, [])

      expect(enhance).toBe(namespace)
    })

    it("should enhance namespace with its plugins", () => {
      const run = jest.fn()
      const run2 = jest.fn()

      const testPlugin: Plugin = n => ({
        ...n,
        name: n.name + "-enhanced",
        run: run2
      })

      const namespace: Namespace = {
        name: "test",
        description: "test desc",
        plugins: [testPlugin],
        run
      }

      const enhance = execPlugins(namespace, [])

      expect(enhance.run).toBe(run2)
      expect(enhance.name).toBe("test-enhanced")
    })

    it("should enhance namespace with its plugins and global ones", () => {
      const run = jest.fn()
      const run2 = jest.fn()

      const testPlugin: Plugin = n => ({
        ...n,
        name: n.name + "-enhanced",
        run: run2
      })

      const namespace: Namespace = {
        name: "test",
        description: "test desc",
        plugins: [testPlugin],
        run
      }

      const enhance = execPlugins(namespace, [testPlugin])

      expect(enhance.run).toBe(run2)
      expect(enhance.name).toBe("test-enhanced-enhanced")
    })
  })

  describe("Hooks", () => {
    it("should get default hooks", () => {
      const run = jest.fn()
      const namespace: Namespace = {
        name: "test",
        description: "test desc",
        run
      }

      const hooks = getHooks(namespace)

      const args = { test: "test" }

      expect(hooks.before(args)).toBe(args)
      expect(hooks.after(args)).toBe(args)
    })

    it("should get custom hooks", () => {
      const run = jest.fn()
      const before = jest.fn()
      const after = jest.fn()

      const namespace: Namespace = {
        name: "test",
        description: "test desc",
        hooks: { before, after },
        run
      }

      const hooks = getHooks(namespace)

      expect(hooks.before).toBe(before)
      expect(hooks.after).toBe(after)
    })
  })

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

      expect(buildFlags(namespace, flags)).toEqual({ hello: "world" })
    })

    it("should return all flags and option", () => {
      const run = jest.fn()

      const namespace: Namespace = {
        name: "test",
        description: "test desc",
        option: [
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

      expect(buildFlags(namespace, flags)).toEqual({
        hello: "world",
        name: "my_name"
      })
    })

    it("should return all flags and option with shorthand", () => {
      const run = jest.fn()

      const namespace: Namespace = {
        name: "test",
        description: "test desc",
        option: [
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

      expect(buildFlags(namespace, flags)).toEqual({
        hello: "world",
        name: "my_name",
        n: "my_name"
      })
    })

    it("should return all flags and default option values", () => {
      const run = jest.fn()

      const namespace: Namespace = {
        name: "test",
        description: "test desc",
        option: [
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

      expect(buildFlags(namespace, flags)).toEqual({
        hello: "world",
        name: "my_default_name"
      })
    })
  })

  // describe("Run Command", () => {})
})
