# Contributing to Silent Pay
The Silent Pay project operates an open contributor model where anyone is welcome to contribute towards development in the form of peer review, testing and patches. This document explains the practical process and guidelines for contributing.

## I don't want to read this whole thing I just have a question!!!

If you have questions about how to use Silent Pay direct these to [Discord](https://discord.gg/Rfyp2nRGj7).

## What should I know before I get started?

### Project Structure

The project is divided into four modules.

```console
├── packages
│   ├── core
│   │   ├── src
│   │   └── test
│   ├── esplora
│   │   ├── src
│   │   └── test
│   ├── level
│   │   ├── src
│   │   └── test
│   └── wallet
│       ├── src
│       └── test
```
| **Directory**          | **Description**                                                                                    |
|------------------------|----------------------------------------------------------------------------------------------------|
| **`packages/core`**    | Contains core library functions that are needed to support silent payment integration in a wallet. |
| **`packages/esplora`** | Provides an Esplora client which implements the network interface.                                 |
| **`packages/level`**   | Provides a file-based key value database which implements the db interface.                        |
| **`packages/wallet`**  | Encompasses the wallet class which is responsible for all wallet-operations.                       |

### Development Environment

Make sure you have Node.js LTS version and npm (or Yarn) installed. Clone the repository and run `npm install` (or `yarn`) to get started.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

#### Before Submitting A Bug Report

- Ensure the bug was not already reported by searching on GitHub under [Issues](https://github.com/Bitshala-Incubator/silent-pay/issues).
- If you're unable to find an open issue addressing the problem, open a new one. Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample** or an **executable test case** demonstrating the expected behavior that is not occurring.

### Feature Requests

Feature requests are welcome. But take a moment to find out whether your idea fits with the scope and aims of the project. It's up to you to make a strong case to convince the project's developers of the merits of this feature. Please provide as much detail and context as possible.

### Pull Requests

- Do not include issue numbers in the PR title
- Follow the coding style (Prettier/ESLint)
- Separate unrelated changes into different PRs
- All PRs must add tests for the proposed changes
- Write meaningful commit messages

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Use description to add more context to the commit message

### TypeScript Styleguide

- The core library should only contain pure functions and should not contain classes.
- Use `const` for all variables that should not be reassigned.
- Use `readonly` for all fields that should not be mutable.
- Use PascalCase for types, interfaces and classes, camelCase for variables and functions.

### Documentation Styleguide

- Use TsDoc for documenting code 
- Use Markdown for READMEs and other documentation files
- Adding documentation is a must for every PR

### Code Review Process

The maintainers look at pull requests on a regular basis and will provide feedback. After feedback has been given, it is up to the PR author to continue the conversation or make changes.

### CI/CD

The project uses GitHub Actions for CI/CD. All PRs are required to pass the CI/CD checks before they can be merged.

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

#### Type of Issue and Pull Request

- `bug`: A bug or error
- `documentation`: Improvements or additions to documentation
- `enhancement`: New feature or request for enhancement
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `question`: Further information is requested
- `wontfix`: This will not be worked on
- `duplicate`: This issue or pull request already exists

## Getting Help

If you need help with anything related to contribution, feel free to ask questions or seek guidance from the community or maintainers.