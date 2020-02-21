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
- [ ] Improve Runners and accept more options (raw, hooks result etc..)

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
