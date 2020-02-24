#!/usr/bin/env node

import { Namespace } from "../../src"

import Cliffhanger from "../../src"

import help from "../../src/plugins/help"

const greet: Namespace = {
  name: "greet",
  usage: 'greet --name="your name"',
  description: "My super personal CLI",
  plugins: [help],
  options: [
    {
      title: "name",
      description: "Your name",
      shorthand: ["n"],
      defaultValue: "awesome developer"
    }
  ],
  run: ({ options: { name } }: any) => {
    return Cliffhanger.log.success("Hello", name)
  }
}

const CLI = {
  name: "hello",
  description: "My super personal CLI",
  expose: [greet],
  plugins: [help],
  run: () => {
    return Cliffhanger.log.success("An awesome CLI created with Cliffhanger")
  }
}

const [, , ...args] = process.argv

Cliffhanger.execute.init(CLI, args)
