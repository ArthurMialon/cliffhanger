import { Namespace, Plugin } from "src/types"

import withPlugins from "./plugin"

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
