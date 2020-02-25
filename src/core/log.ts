import colors from "colors/safe"

type logType = any[]

const log = {
  log: (...args: logType) => console.log(...args),
  info: (...args: logType) =>
    console.log("📫", ...args.map(a => colors.blue(a))),
  success: (...args: logType) =>
    console.log("✅", ...args.map(a => colors.green(a))),
  error: (...args: logType) =>
    console.log("❌", ...args.map(a => colors.red(a))),
  debug: (...args: logType) =>
    console.log("👨‍💻", ...args.map(a => colors.red(a))),
  ...colors
}

export default log
