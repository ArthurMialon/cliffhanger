import Table from "cli-table"
import colors from "colors/safe"

const config = {
  chars: {
    top: "",
    "top-mid": "",
    "top-left": "",
    "top-right": "",
    bottom: "",
    "bottom-mid": "",
    "bottom-left": "",
    "bottom-right": "",
    left: "",
    "left-mid": "",
    mid: "",
    "mid-mid": "",
    right: "",
    "right-mid": "",
    middle: ""
  },
  style: { "padding-left": 2, "padding-right": 1 }
}

export default ({ title, values }: { title: string; values: any }): any => {
  const table = new Table(config)

  table.push(...values)

  return [`${colors.bold(title)}\n`, table.toString().substr(1)]
}
