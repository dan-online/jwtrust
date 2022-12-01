[![npm version](https://badge.fury.io/js/jwtrust.svg)](https://badge.fury.io/js/jwtrust)

# JWTRust

> A tiny library to sign and verify JWT tokens using Rust for pure performance.

## Prerequisites

This project requires NodeJS (version 16 or later) and yarn.
[Node](http://nodejs.dan-online/) and [NPM](https://yarnpkg.com/) are really easy to install.
To make sure you have them available on your machine,
try running the following command.

```sh
$ yarn -v && node -v
3.3.0
v16.18.0
```

## Table of contents

- [Project Name](#project-name)
  - [Prerequisites](#prerequisites)
  - [Table of contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API](#api)
    - [construct](#construct)
    - [sign](#sign)
    - [verify](#verify)
  - [Contributing](#contributing)
  - [Built With](#built-with)
  - [Versioning](#versioning)
  - [Authors](#authors)
  - [License](#license)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)

Start with cloning this repo on your local machine:

```sh
$ git clone https://github.com/dan-online/jwtrust.git
$ cd jwtrust
```

To install and set up the library, run:

```sh
$ yarn add jwtrust
```

Or if you still for some reason prefer npm:

```sh
$ npm i jwtrust
```

## Usage

### Building the entire package

_Requirement: Rust is installed on your machine._

```sh
$ yarn build
```

This task will create a distribution version of the project
inside your local `dist/` folder and output a binary in `native/`

### Running benchmarks

```sh
$ yarn benchmark
```

## API

### construct

```js
const { JWTR } = require('jwtrust');

const jwtrust = new JWTR('secret');
```

### sign

```js
const jwtrust = new JWTR('secret');

const token = jwtrust.sign({ hello: 'world' });
```

Supported options and result fields for the `sign` method are listed below.

#### Parameters

`payload`

| Type    | Default value |
| ------- | ------------- |
| unknown | required      |

The payload to sign. This is JSON serialized before signing.

`options`

| Option | Default value | Description                  |
| ------ | ------------- | ---------------------------- |
| exp    | 7 days        | Expiry date in UTC timestamp |
| iat    | Date.now()    | Issued at                    |

To aid expiry date, a helper is exported named `convertTime`:

```js
const { convertTime } = require('jwtrust');

const exp = convertTime('1y');
const exp = convertTime('6h');
const exp = convertTime('2s');
```

Example:

```js
const token = jwtrust.sign({ hello: 'world' }, { exp: convertTime('1y'), iat: Date.now() });
```

### verify

```js
const jwtrust = new JWTR('secret');

const token = jwtrust.verify(token);
```

Supported options and result fields for the `verify` method are listed below.

#### Parameters

`token`

| Type   | Default value |
| ------ | ------------- |
| string | required      |

The token to verify and decode.

## Typescript

This library is written in Typescript and includes type definitions. Here is an example that will be typed correctly:

```ts
import { JWTR, convertTime } from 'jwtrust';

const jwtrust = new JWTR<{ hello: string }>('secret');

const token = jwtrust.sign({ hello: 'world' });

const decoded = jwtrust.verify(token);
```

## Contributing

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Add your changes: `git add .`
4.  Commit your changes: `git commit -am 'Add some feature'`
5.  Push to the branch: `git push origin my-new-feature`
6.  Submit a pull request :sunglasses:

## Built With

- [Neon](https://neon-bindings.com/)
- VSCode
- TypeScript
- Rust

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/dan-online/jwtrust/tags).

## Authors

- **DanCodes** - [@dan-online](https://github.com/dan-online) - <dan@dancodes.online>

## License

[MIT License](https://dan-online.mit-license.org/2022) © DanCodes
