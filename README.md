# Agar.io

[![Build Status](https://travis-ci.org/remarkablegames/Agar.io.svg?branch=master)](https://travis-ci.org/remarkablegames/Agar.io)

An [Agar.io](https://agar.io/) clone. See [demo](https://agarlo.herokuapp.com/).

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/lang/en/docs/install/)

## Installation

Clone repository:

```sh
$ git clone https://github.com/remarkablegames/Agar.io.git
```

Install dependencies:

```sh
$ yarn
```

## Usage

Compile files in watch mode and run development server:

```sh
$ yarn dev
```

Remove build files:

```sh
$ yarn clean
```

Build production files:

```sh
$ yarn build
```

Run production server:

```sh
$ yarn start
```

## Readings

- Fast-Paced Multiplayer
  - [Client-Server Game Architecture](https://www.gabrielgambetta.com/client-server-game-architecture.html)
  - [Client-Side Prediction and Server Reconciliation](https://www.gabrielgambetta.com/client-side-prediction-server-reconciliation.html)
  - [Entity Interpolation](https://www.gabrielgambetta.com/entity-interpolation.html)
  - [Lag Compensation](https://www.gabrielgambetta.com/lag-compensation.html)
- Multiplayer Platformer
  - [Naive Implementation](https://antriel.com/post/online-platformer-1/)
  - [Authoritative Server](https://antriel.com/post/online-platformer-3/)
  - [Entity Interpolation](https://antriel.com/post/online-platformer-5/)
- [Real Time Multiplayer in HTML5](http://buildnewgames.com/real-time-multiplayer/)

## Contributors

[![Ben Budnevich](https://avatars.githubusercontent.com/u/2293095?s=50)](https://github.com/benox3) &nbsp;&nbsp;
[![remarkablemark](https://avatars.githubusercontent.com/u/10594555?s=50)](https://github.com/remarkablemark)

## License

[MIT](LICENSE)
