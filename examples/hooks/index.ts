#!/usr/bin/env node

import { Namespace } from "../../src"

import Cliffhanger from "../../src"
import hooks from "../../src/plugins/hooks"

const CLI: Namespace = {
  name: "hello",
  description: "My super personal CLI",
  plugins: [
    hooks({
      before: () => {
        Cliffhanger.log.info("Before Hook")
      },
      after: () => {
        Cliffhanger.log.info("After Hook")
      }
    })
  ],
  run: () => {
    return Cliffhanger.log.success("An awesome CLI created with Cliffhanger")
  }
}

const [, , ...args] = process.argv

Cliffhanger.execute.init(CLI, args)
