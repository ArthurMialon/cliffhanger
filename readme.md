# >\_ Cliffhanger

Cliffhanger is a simple module here to help you create your own CLI with TypeScript.

## Features

- TypeScript based
- Easy to setup and use
- Available plugins
- Easy to test with unit or integration test
- Create your own plugins easily

- [Check examples](https://github.com/ArthurMialon/cliffhanger/tree/master/examples)

## Install

```sh
yarn add @cliffhanger/core

# OR

npm install @cliffhanger/core
```

## Example

```sh
$ my-command greet --name=john
> ✅ Hello john
```

```ts
import { Namespace } from "@cliffhange-hub/core"

import Cliffhanger from "@cliffhange-hub/core"

import { Plugins } from "@cliffhange-hub/core"

// Create a command, we call this a namespace
const greet: Namespace = {
  name: "greet",
  usage: 'greet --name="your name"',
  description: "My super personal CLI",
  plugins: [Plugins.help],
  options: [
    {
      title: "name",
      description: "Your name",
      shorthand: ["n"],
      defaultValue: "awesome developer"
    }
  ],
  run: ({ name }) => {
    return Cliffhanger.log.success("Hello", name)
  }
}

// Set your command in a a globale namespace
const CLI = {
  name: "example",
  description: "My super personal CLI",
  expose: [greet],
  plugins: [help],
  run: () => {
    return Cliffhanger.log.success("An awesome CLI created with Cliffhanger")
  }
}

const [, , ...args] = process.argv

// Run !
Cliffhanger.execute.init(CLI, args
```

## Documentation

In progress

- [ ] Create a static website
- [ ] Create a Mardown documentation
- [ ] Improve TSDoc setup

## Todo

### Examples

- [x] Create example directory

### Build

- [x] Setup build
- [ ] What about using lerna to deploy multiples packages and plugins

### Installation

- [ ] provide a way to install a CLI without npm

### Ci

- [ ] Automatic Release to GitHub
- [ ] Automatic Release to GitHub Packages
- [ ] Automatic Release to NPM
- [ ] Automatic tag on merge on master
- [ ] Automatic beta on merge on next
- [x] Release first version to npm

### Core

- [x] Add jest testing
- [ ] Add test to examples to prevent breaking changes
- [x] Create a hook system
- [x] Improve Runners and accept more options (raw, hooks result etc..)
- [ ] Flags validator
- [ ] Imrove runner parameters
  - from big objects to spread arguments
- [ ] Add the full asked command in raws
- [ ] Global flags

### Plugins System

- [x] Add a global plugin to enhance every sub commands
- [ ] Generate api from Namespace to use it programatically (how to handle response ?)
- [ ] Automatically generate types too

### Plugin Ideas

- [ ] Setup GitHub API
- [ ] With debug plugins
- [ ] Get Git context (via NodeGit)
- [ ] Get KubeCtl context
- [ ] Commander and interactive prompt plugin

```

```
