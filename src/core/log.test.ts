import log from "./log"

describe("Log", () => {
  it("should logs things", async () => {
    const logMock = jest.fn()
    global.console = { ...console, log: logMock }

    log.log("Something")

    expect(JSON.stringify(logMock.mock.calls[0])).toEqual('["Something"]')
  })

  it("should logs debug", async () => {
    const logMock = jest.fn()
    global.console = { ...console, log: logMock }

    log.debug("Debug")

    expect(JSON.stringify(logMock.mock.calls[0][1])).toEqual(
      '"\\u001b[31mDebug\\u001b[39m"'
    )
  })

  it("should logs errors", async () => {
    const logMock = jest.fn()
    global.console = { ...console, log: logMock }

    log.error("Error")

    expect(JSON.stringify(logMock.mock.calls[0][1])).toEqual(
      '"\\u001b[31mError\\u001b[39m"'
    )
  })

  it("should logs infos", async () => {
    const logMock = jest.fn()
    global.console = { ...console, log: logMock }

    log.info("Info")

    expect(JSON.stringify(logMock.mock.calls[0][1])).toEqual(
      '"\\u001b[34mInfo\\u001b[39m"'
    )
  })

  it("should logs success", async () => {
    const logMock = jest.fn()
    global.console = { ...console, log: logMock }

    log.success("Success")

    expect(JSON.stringify(logMock.mock.calls[0][1])).toEqual(
      '"\\u001b[32mSuccess\\u001b[39m"'
    )
  })
})
