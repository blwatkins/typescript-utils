---
title: "Demonstrated Portfolio Skills"
layout: post
author:
  - Brittni Watkins
  - Claude Code
  - GitHub Copilot
date: 2026-05-27
modified_date: 2026-07-15
toc: true
---

## About This Page

This page is a technical record of the skills, tools, and engineering practices represented in the TypeScript Utilities project.

## Project Overview

TypeScript Utilities (`@blwatkins/utils`) is a toolkit of TypeScript and JavaScript utilities for number checks, string checks, random number and element selection, deterministic seeded pseudorandom number generation, and a discriminator-based type guard registry.
The repository is maintained at [blwatkins/typescript-utils](https://github.com/blwatkins/typescript-utils), and it is built with TypeScript and tsdown.

## At a Glance

- **Project Type:** TypeScript utility library package
- **Primary Language:** TypeScript
- **Primary Runtime:** Node.js
- **Build Pipeline:** tsdown
- **Quality Controls:** ESLint
- **Automation:** GitHub Actions
- **Dependency Automation:** Dependabot
- **Security Analysis:** CodeQL via GitHub Actions
- **Documentation Pattern:** TypeDoc and Jekyll (GitHub Pages)

## Skills and Tooling Inventory

- **Languages:** [TypeScript](https://www.typescriptlang.org/), [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript), [Markdown](https://www.markdownguide.org/), [YAML](https://yaml.org/)
- **Runtime:** [Node.js](https://nodejs.org/en)
- **Libraries:** [TypeBox](https://sinclairzx81.github.io/typebox/)
- **Testing:** [Vitest](https://vitest.dev/)
- **Build / Bundling:** [tsdown](https://tsdown.dev/)
- **Code Quality:** [ESLint](https://eslint.org/)
- **Documentation:** [TypeDoc](https://typedoc.org/)
- **Site Generation:** [Bundler](https://bundler.io/), [Jekyll](https://jekyllrb.com/), [Liquid](https://shopify.github.io/liquid/), [Minima](https://github.com/jekyll/minima)
- **Dependency Management:** [npm](https://www.npmjs.com/)
- **Versioning & Platform:** [Git](https://git-scm.com/), [GitHub](https://github.com/)
- **Automation:** [GitHub Actions](https://github.com/features/actions)
- **Hosting & Deployment:** [GitHub Pages](https://docs.github.com/en/pages), [npm package registry](https://www.npmjs.com/), [GitHub package registry](https://docs.github.com/en/packages)
- **Code Analysis / Security:** [CodeQL](https://codeql.github.com/)
- **Dependency Automation:** [Dependabot](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-version-updates)
- **Development Utilities:** [npm CLI](https://docs.npmjs.com/cli)
- **Environment Configuration:** Node.js version pinning via `.node-version`, plus Ruby version pinning for the Jekyll/Bundler docs site via `docs/.ruby-version`
- **Development Environments:** [WebStorm](https://www.jetbrains.com/webstorm/), [Visual Studio Code](https://code.visualstudio.com/)
- **AI-Assisted Development:** [GitHub Copilot](https://github.com/features/copilot), [Claude Code](https://code.claude.com/docs/en/overview)

## Capability Record

- Implements reusable static utility classes for string and number type checks to improve consistency across consuming code.
- Provides a static discriminator registry with TypeBox schema validation to enable runtime type narrowing and reusable type guard generation for discriminated union patterns.
- Provides a static `Random` class for generating random numbers, booleans, and selecting random elements from arrays, with a configurable underlying random function to enable use with seeded generators or custom sources.
- Provides typed weighted random selection via `WeightedElementUtility` and `WeightedList`, using discriminator-validated element objects and a cumulative-weight selection strategy, enabling non-uniform random sampling from explicit probability distributions.
- Provides a deterministic seeded pseudorandom number generator (xoshiro128**) with synchronous (FNV-1a) and asynchronous (SHA-256 via Web Crypto API) seed-hashing strategies, enabling reproducible random sequences from string seeds.
- Uses explicit package export and type declaration mappings to improve compatibility for ESM consumers and TypeScript tooling.
- Applies strict TypeScript compiler settings and type-aware lint rules to improve early detection of implementation defects.
- Validates behavior with scenario-driven and shared-fixture Vitest suites to improve confidence in utility correctness across input classes.
- Automates lint, build, and test checks in GitHub Actions to improve change reliability before merge and release.
- Produces API documentation and publishes a docs site workflow to improve discoverability and maintenance of project knowledge.
- Runs CodeQL and Dependabot automation to improve baseline security and dependency hygiene over time.

## Detailed Technical Notes

Each technical claim below is backed by a source link to the corresponding implementation or workflow configuration in the project repository.

### ESM package contract and artifact layout

The package is configured as ESM and publishes built artifacts from `_dist`, including declaration files and a scoped export map.
The build pipeline generates those outputs from `src/index.ts` using tsdown.

**Evidence:**

- [package.json](https://github.com/blwatkins/typescript-utils/blob/main/package.json)
- [tsdown.config.ts](https://github.com/blwatkins/typescript-utils/blob/main/tsdown.config.ts)

### Utility module composition and re-export boundaries

The public entry point re-exports domain modules, and each domain module re-exports dedicated types and classes.
This keeps the package API small while still allowing clear internal organization by domain.

**Evidence:**

- [src/index.ts](https://github.com/blwatkins/typescript-utils/blob/main/src/index.ts)
- [src/random/index.ts](https://github.com/blwatkins/typescript-utils/blob/main/src/random/index.ts)
- [src/random/seeded-random/index.ts](https://github.com/blwatkins/typescript-utils/blob/main/src/random/seeded-random/index.ts)

### String and number type-guard utilities

`StringUtility` and `NumberUtility` provide static runtime type guards, such as non-empty and single-line trimmed string checks and positive-integer checks, so consuming code gets both TypeScript narrowing and JavaScript-safe runtime validation from a single call.

**Evidence:**

- [src/string/string-utility.ts](https://github.com/blwatkins/typescript-utils/blob/main/src/string/string-utility.ts)
- [src/number/number-utility.ts](https://github.com/blwatkins/typescript-utils/blob/main/src/number/number-utility.ts)

### Discriminator-based type guard registry

`DiscriminatorRegistry` maintains a static map of unique discriminator values to validator functions, returning a reusable `TypeGuard<T>` for each registration and enforcing discriminator shape and uniqueness at registration time.
The `Discriminated` type and its TypeBox schema define the minimal shape required for a registry-validated object, and `Discriminators` centralizes the discriminator string constants used across the package, such as the one backing `WeightedElement`.

**Evidence:**

- [src/discriminator/discriminator-registry.ts](https://github.com/blwatkins/typescript-utils/blob/main/src/discriminator/discriminator-registry.ts)
- [src/discriminator/discriminated.ts](https://github.com/blwatkins/typescript-utils/blob/main/src/discriminator/discriminated.ts)
- [src/discriminator/discriminators.ts](https://github.com/blwatkins/typescript-utils/blob/main/src/discriminator/discriminators.ts)

### Random number generation and weighted element selection

The `Random` class centralizes random number, boolean, and array-element selection behind a swappable random number source (defaulting to `Math.random`), enabling deterministic testing and drop-in use of the package's own seeded pseudorandom number generator.
`WeightedElementUtility` builds on the discriminator registry to validate `WeightedElement` and `WeightedList` objects at runtime and performs non-uniform random selection using a cumulative-weight strategy.

**Evidence:**

- [src/random/random.ts](https://github.com/blwatkins/typescript-utils/blob/main/src/random/random.ts)
- [src/random/weighted-element/weighted-element.ts](https://github.com/blwatkins/typescript-utils/blob/main/src/random/weighted-element/weighted-element.ts)
- [src/random/weighted-element/weighted-element-utility.ts](https://github.com/blwatkins/typescript-utils/blob/main/src/random/weighted-element/weighted-element-utility.ts)

### Deterministic seeded pseudorandom number generation

`SeededRandomNumberGenerator` implements the xoshiro128** algorithm over a validated 128-bit state to produce a reproducible, uniformly distributed sequence of floats.
`RandomNumberGeneratorFactory` derives that initial state from a string seed and optional namespace, using either a synchronous FNV-1a hash (with an optional version selecting the hashing offsets) or an asynchronous SHA-256 hash via the Web Crypto API, giving callers reproducible sequences without managing raw generator state themselves.

**Evidence:**

- [src/random/seeded-random/seeded-random-number-generator.ts](https://github.com/blwatkins/typescript-utils/blob/main/src/random/seeded-random/seeded-random-number-generator.ts)
- [src/random/seeded-random/random-number-generator-factory.ts](https://github.com/blwatkins/typescript-utils/blob/main/src/random/seeded-random/random-number-generator-factory.ts)

### Strict typing and lint enforcement model

TypeScript is configured with strict checks, including implicit-type and unused-code protections, to enforce predictable typing behavior.
JavaScript and TypeScript lint configurations apply recommended and stricter rule sets for syntax safety and style consistency.

**Evidence:**

- [tsconfig.json](https://github.com/blwatkins/typescript-utils/blob/main/tsconfig.json)
- [eslint.config.js.mjs](https://github.com/blwatkins/typescript-utils/blob/main/eslint.config.js.mjs)
- [eslint.config.ts.mjs](https://github.com/blwatkins/typescript-utils/blob/main/eslint.config.ts.mjs)

### Test strategy and scenario-driven fixtures

The project uses Vitest for repeatable unit testing, including compile-time type checking of test files.
Shared test input fixtures and scenario builders in `test/utils` support scenario-driven test suites and validation across modules.

**Evidence:**

- [vitest.config.ts](https://github.com/blwatkins/typescript-utils/blob/main/vitest.config.ts)
- [test/utils/input/string-inputs.ts](https://github.com/blwatkins/typescript-utils/blob/main/test/utils/input/string-inputs.ts)
- [test/utils/test-case/scenarios/random-number-generator-factory-scenarios.ts](https://github.com/blwatkins/typescript-utils/blob/main/test/utils/test-case/scenarios/random-number-generator-factory-scenarios.ts)

### CI verification gates

Lint, build, and test scripts are wired into local and CI workflows via `package.json`.
The primary CI workflow runs `npm ci`, lint, build, and tests across supported Node.js release lines before changes are accepted.

**Evidence:**

- [package.json scripts](https://github.com/blwatkins/typescript-utils/blob/main/package.json)
- [npm-test.yml](https://github.com/blwatkins/typescript-utils/blob/main/.github/workflows/npm-test.yml)

### Documentation generation and GitHub Pages publishing path

API docs are generated with TypeDoc, while the documentation site is built from `docs/` using a Jekyll workflow and deployed to GitHub Pages.
Release-specific docs are stored under a versioned directory structure in `docs/releases/...`.

**Evidence:**

- [typedoc.json](https://github.com/blwatkins/typescript-utils/blob/main/typedoc.json)
- [gh-pages-jekyll.yml](https://github.com/blwatkins/typescript-utils/blob/main/.github/workflows/gh-pages-jekyll.yml)
- [docs/index.md](https://github.com/blwatkins/typescript-utils/blob/main/docs/index.md)
- [docs/releases directory](https://github.com/blwatkins/typescript-utils/tree/main/docs/releases)

### Security scanning and dependency update automation

Security analysis is automated with a dedicated CodeQL workflow covering Actions and repository code languages.
Dependency updates are automated with Dependabot for npm, GitHub Actions, and Bundler ecosystems, and package publishing uses trusted publishing permissions.

**Evidence:**

- [codeql.yml](https://github.com/blwatkins/typescript-utils/blob/main/.github/workflows/codeql.yml)
- [dependabot.yml](https://github.com/blwatkins/typescript-utils/blob/main/.github/dependabot.yml)
- [package-publish.yml](https://github.com/blwatkins/typescript-utils/blob/main/.github/workflows/package-publish.yml)

## Current Gaps / Future Improvements

- The package is currently in an alpha release line; additional utility domains and API surface are still being developed.
- Tests currently focus on unit-level utility behavior; higher-level integration or consumer-facing examples are not yet part of the verification strategy.
- Release documentation under `docs/releases/...` is maintained manually, which can increase maintenance overhead as release volume grows.
