import { Namespace, Plugin } from "src/types"

import { init } from "./index"

import withPlugins from "./plugin"
import buildOptions from "./option"
import getRunInfo from "./info"

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
      expect(run).toHaveBeenCalledWith({
        options: {},
        rawFlags: {},
        subCommand: null
      })
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
      expect(run).toHaveBeenCalledWith({
        options: {
          name: "my_default_name"
        },
        rawFlags: {},
        subCommand: null
      })
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
      expect(run).toHaveBeenCalledWith({
        options: {
          name: "my_name"
        },
        rawFlags: {
          name: "my_name"
        },
        subCommand: null
      })
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
      expect(run).toHaveBeenCalledWith({
        options: {},
        rawFlags: {
          name: "my_name"
        },
        subCommand: null
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
      expect(run).toHaveBeenCalledWith({
        options: {},
        rawFlags: {},
        subCommand: "hello"
      })
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
      expect(run).toHaveBeenCalledWith({
        options: {
          name: "my_name"
        },
        rawFlags: {
          name: "my_name"
        },
        subCommand: "hello"
      })
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

  describe("Execute Plugins", () => {
    it("should not enhance namespace with any plugin", () => {
      const run = jest.fn()

      const namespace: Namespace = {
        name: "test",
        description: "test desc",
        run
      }

      const enhance = withPlugins(namespace, [])

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

      const enhance = withPlugins(namespace, [])

      expect(enhance.run).toBe(run2)
      expect(enhance.name).toBe("test-enhanced")
    })

    it("should enhance namespace and exposed with plugins", () => {
      const run = jest.fn()
      const run2 = jest.fn()

      const testPlugin: Plugin = n => ({
        ...n,
        name: n.name + "-enhanced",
        run: run2
      })

      const subNamespace: Namespace = {
        name: "test",
        description: "test desc",
        plugins: [testPlugin],
        run
      }

      const namespace: Namespace = {
        name: "test",
        description: "test desc",
        expose: [subNamespace],
        plugins: [testPlugin],
        run
      }

      const enhance = withPlugins(namespace, [])

      expect(enhance.run).toBe(run2)
      expect(enhance.name).toBe("test-enhanced")
      expect(enhance.expose?.length).toBe(1)

      if (enhance.expose && enhance.expose.length > 1) {
        expect(enhance.expose[0].name).toBe("test-enhanced")
        expect(enhance.expose[0].run).toBe(run2)
      }
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
        globalPlugins: [testPlugin],
        run
      }

      const enhance = withPlugins(namespace)

      expect(enhance.run).toBe(run2)
      expect(enhance.name).toBe("test-enhanced-enhanced")
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

      expect(buildOptions(namespace, flags)).toEqual({
        options: {},
        rawFlags: flags
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
        rawFlags: flags
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
        rawFlags: {
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
        rawFlags: {
          hello: "world"
        }
      })
    })
  })

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
})
