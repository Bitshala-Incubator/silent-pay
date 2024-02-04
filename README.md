<div align="center">

<h1>SilentPay - A wallet library for silent payments</h1>

<p>A bitcoin wallet library that supports silent payments out of the box.</p>

<p>
    <a href="https://github.com/Bitshala-Incubator/silent-pay/blob/main/LICENSE"><img alt="MIT Licensed" src="https://img.shields.io/badge/License-MIT-yellow.svg"/></a>
    <a href="https://github.com/Bitshala-Incubator/silent-pay/actions/workflows/test.yml"><img alt="Tests CI Status" src="https://github.com/Bitshala-Incubator/silent-pay/actions/workflows/test.yml/badge.svg"></a>
    <a href="https://github.com/Bitshala-Incubator/silent-pay/actions/workflows/lint.yml"><img alt="Lint CI Status" src="https://github.com/Bitshala-Incubator/silent-pay/actions/workflows/lint.yml/badge.svg"></a>
    <a href="https://github.com/prettier/prettier"><img alt="Code Styled using prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"></a>
  </p>
</div>

> [!WARNING]
> This library is currently in an experimental stage and should be used with caution. It has not undergone extensive testing and may contain bugs, vulnerabilities, or unexpected behavior. Mainnet use is strictly NOT recommended.

## Table of Contents

- [About](#about)
- [Uses](#uses)
- [Architecture](#architecture)
- [Project Status](#project-status)
- [Contributing](#contributing)
  - [Developer Community](#developer-community)
- [Experimental Warning Acknowledgement](#experimental-warning-acknowledgement)

## About
Silent payments in Bitcoin is a new way to receive private payments from anyone on a single static address without on-chain linkability of payments or a need for on-chain notifications.

This library is a JavaScript/TypeScript implementation of silent payments. The library exposes core functionalities to send to a silent payment address, receive payments to a silent payment address and spend from a silent payment address.
The library also provides a simple wallet implementation that provides support for silent payments out of the box.

Read more about silent payments in [BIP 352](https://github.com/bitcoin/bips/pull/1458) and [Ruben Somsen's post](https://gist.github.com/RubenSomsen/c43b79517e7cb701ebf77eec6dbb46b8).

## Uses

- **Silent Payments:** The library provides core silent payment functionalities.
- **Wallet Integration:** The library provides a simple wallet implementation that supports silent payments.
- **Custom Wallets:** The library can be used to build custom wallets that support silent payments.
- **Research:** The library can be used to research and experiment with silent payments.
- **Education:** The library can be used to learn about silent payments and how they work.


## Architecture

The project is divided into two modules. The core module provides the core functionalities of silent payments and the wallet module provides a simple wallet that supports silent payments.

```console
├── src
│   ├── core
│   └── wallet
│       ├── db
│       └── network
└── test
```
| **Directory**        | **Description**                                                                                                  |
|----------------------|------------------------------------------------------------------------------------------------------------------|
| **`src/core`**       | Contains core library functions that are needed to support silent payment integration in a wallet.               |
| **`src/wallet`**     | Encompasses the wallet class which is responsible for all wallet-operations.                                     |
| **`src/wallet/db`**  | Exposes a db interface. Provides a file-based key value database.                                                |
| **`src/wallet/db`**  | Exposes an interface for network operations. Provides an Esplora client which implements the network interface.  |
| **`test`**           | Contains unit and integration tests.                                                                             |

## Project Status

The project is currently in a pre-alpha stage, intended for demonstration and prototyping. The wallet may have known/unknown bugs. Basic silent payments functionality works on `regtest` and `testnet` networks, but it's not recommended for `mainnet` use.

If you're interested in contributing to the project, explore the [open issues](https://github.com/Bitshala-Incubator/silent-pay/issues) and submit a PR.

## Contributing

The project is under active development by a few motivated Bitcoin devs. Any contribution for features, tests, docs and other fixes/upgrades is encouraged and welcomed. The maintainers will use the PR thread to provide reviews and suggestions, and are generally proactive at merging good contributions.

Few directions for new contributors:

- The list of [issues](https://github.com/Bitshala-Incubator/silent-pay/issues) is a good place to look for contributable tasks and open problems.

- Issues marked with [`good first issue`](https://github.com/Bitshala-Incubator/silent-pay/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) are good places to get started.

- [Tests](./test) are a good place to start gathering a contextual understanding of the codebase.

- Reviewing [open PRs](https://github.com/Bitshala-Incubator/silent-pay/pulls) are a good place to understand the codebase and the contribution process.

- Search for `TODO`s in the codebase to find in-line marked code todos and smaller improvements.

### Developer Community

The dev community lurks in a small corner of Discord [here](https://discord.gg/Rfyp2nRGj7) (say 👋, if you drop there from this readme).

Dev discussions predominantly happen via FOSS best practices, and by using Github as the Community Forum.

## Experimental Warning Acknowledgement

By using this library, you acknowledge the following:

1. **Risk of Loss of Funds:** Using this library may result in the loss of your funds. You should be aware that any funds you use with this library are at risk and could become inaccessible or irretrievable.
2. **No Guarantee of Performance:** The library may not perform as expected and may lead to unintended outcomes, including data loss, loss of funds, or other adverse effects.
3. **No Warranty:** There is no warranty provided for this library. It is distributed "as is" without any guarantees of functionality, security, or reliability.
4. **Security Considerations:** This library may contain security vulnerabilities or weaknesses that could expose your data or funds to risks. You are responsible for conducting your own security assessments and risk evaluations.
5. **Limited Documentation:** The documentation for this library may be incomplete, inaccurate, or outdated.
6. **API and Compatibility Changes:** This library is subject to frequent changes, including modifications to its API, features, or compatibility with other software. These changes may affect your ability to use the library effectively.