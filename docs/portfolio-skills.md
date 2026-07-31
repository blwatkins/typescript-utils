---
title: "Demonstrated Portfolio Skills"
layout: post
author:
  - Brittni Watkins
  - Claude Code
  - GitHub Copilot
date: 2026-05-27
modified_date: 2026-07-31
toc: true
---

## About This Page

This page is a technical record of the skills, tools, and engineering practices represented in the TypeScript Utilities project.

## Project Overview

TypeScript Utilities (`@blwatkins/utils`) is a toolkit of general-purpose TypeScript and JavaScript utilities, including validation, mathematical operations, random number generation, random selection, and type-safe guards.
The repository is maintained at [blwatkins/typescript-utils](https://github.com/blwatkins/typescript-utils), and it is built with TypeScript and tsdown.

## At a Glance

- **Project Type:** TypeScript utility library package
- **Primary Language:** TypeScript
- **Primary Runtime:** Node.js
- **Build Pipeline:** tsdown
- **Quality Controls:** ESLint, strict TypeScript compiler options
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
- **Site Generation:** [Jekyll](https://jekyllrb.com/), [Liquid](https://shopify.github.io/liquid/), [Minima](https://github.com/jekyll/minima)
- **Dependency Management:** [npm](https://www.npmjs.com/), [Bundler](https://bundler.io/)
- **Versioning & Platform:** [Git](https://git-scm.com/), [GitHub](https://github.com/)
- **Automation:** [GitHub Actions](https://github.com/features/actions)
- **Hosting & Deployment:** [GitHub Pages](https://docs.github.com/en/pages), [npm package registry](https://www.npmjs.com/), [GitHub package registry](https://docs.github.com/en/packages)
- **Code Analysis / Security:** [CodeQL](https://codeql.github.com/)
- **Dependency Automation:** [Dependabot](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-version-updates)
- **Environment Configuration:** Node.js version pinning via `.node-version`, plus Ruby version pinning for the Jekyll/Bundler docs site via `docs/.ruby-version`
- **Development Environments:** [WebStorm](https://www.jetbrains.com/webstorm/), [Visual Studio Code](https://code.visualstudio.com/)
- **AI-Assisted Development:** [GitHub Copilot](https://github.com/features/copilot), [Claude Code](https://code.claude.com/docs/en/overview)

## Capability Record

Each capability below is expanded with supporting evidence in the correspondingly named subsection of [Detailed Technical Notes](#detailed-technical-notes).

- **Version-pinned deterministic randomness** — generates reproducible pseudorandom sequences from string seeds and holds published hash versions immutable, so a given seed keeps producing the same sequence across releases and consumers can depend on that stability.
- **Documentation as an enforced contract** — treats API documentation as a build gate rather than a convention, failing lint on incomplete doc comments and failing the documentation build on unresolved links or undocumented symbols, to keep published reference material trustworthy.
- **Strict compile-time posture** — applies strict compiler settings and type-aware lint rules, and pins usable language syntax to the ECMAScript version the build targets, to catch defects and accidental syntax drift before a change reaches a release.
- **Reusable runtime type narrowing** — provides a schema-validated registry that turns a registered validator into a reusable type guard, enabling discriminated union patterns without duplicating validation logic at each call site.
- **Layered verification** — verifies behavior through type-checked test sources, shared contract suites, and continuous integration across supported Node.js release lines, to improve confidence that changes are safe across environments.
- **Runtime contract for JavaScript consumers** — pairs compile-time narrowing with runtime validation and a consistent error vocabulary, so callers without type checking receive the same input safety and the same identifiable failures as TypeScript callers.
- **Release and supply-chain integrity** — publishes through an identity-based release pipeline with automated code scanning and dependency updates, reducing both credential exposure and the manual effort of keeping the supply chain current.

## Detailed Technical Notes

Each technical claim below is backed by a source link to the corresponding implementation or workflow configuration in the project repository.

### Version-pinned deterministic randomness

`SeededRandomNumberGenerator` implements the xoshiro128** algorithm over a validated 128-bit state, and `RandomNumberGeneratorFactory` derives that state from a string seed and an optional namespace using either a synchronous FNV-1a hash across four offsets or an asynchronous SHA-256 hash that folds its 256-bit output into 128 bits so no output bits are discarded, joining namespace to seed with a NUL separator so a namespace can never collide with seed content.
`SeedVersions` holds each published set of hash offsets behind an append-only index, and its test suite pins the exact published values, so adding a new version cannot change the sequence that any previously published seed and version produce.

**Evidence:**

- [src/random/seeded-random/seeded-random-number-generator.ts](https://github.com/blwatkins/typescript-utils/blob/main/src/random/seeded-random/seeded-random-number-generator.ts)
- [src/random/seeded-random/random-number-generator-factory.ts](https://github.com/blwatkins/typescript-utils/blob/main/src/random/seeded-random/random-number-generator-factory.ts)
- [src/random/seeded-random/seed-versions.ts](https://github.com/blwatkins/typescript-utils/blob/main/src/random/seeded-random/seed-versions.ts)
- [test/random/seeded-random/seed-versions.test.ts](https://github.com/blwatkins/typescript-utils/blob/main/test/random/seeded-random/seed-versions.test.ts)

### Documentation as an enforced contract

Documentation comments on source files are lint-enforced rather than conventional: the TypeScript lint configuration applies the JSDoc rule set at error level over `src/`, requiring descriptions, parameter and return types, and `@throws` annotations, and imposing a fixed tag ordering so comment structure stays uniform across the codebase.
TypeDoc then generates the API reference with warnings treated as errors and validation enabled for undocumented symbols, invalid links, and references to non-exported types, and the generated output is published through a Jekyll site that keeps a versioned archive for each release.

**Evidence:**

- [eslint.config.ts.mjs](https://github.com/blwatkins/typescript-utils/blob/main/eslint.config.ts.mjs)
- [typedoc.json](https://github.com/blwatkins/typescript-utils/blob/main/typedoc.json)
- [gh-pages-jekyll.yml](https://github.com/blwatkins/typescript-utils/blob/main/.github/workflows/gh-pages-jekyll.yml)
- [docs/releases directory](https://github.com/blwatkins/typescript-utils/tree/main/docs/releases)

### Strict compile-time posture

TypeScript is configured with the full strict family plus `noPropertyAccessFromIndexSignature`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitOverride`, and `noImplicitReturns`, with unreachable code and unused labels rejected and library checking left enabled.
The TypeScript lint configuration layers the `recommendedTypeChecked`, `strictTypeChecked`, and `stylisticTypeChecked` rule sets on top of that, and `eslint-plugin-es-x` restricts usable syntax to ES2022 so source cannot drift past the ECMAScript version the build actually targets.

**Evidence:**

- [tsconfig.json](https://github.com/blwatkins/typescript-utils/blob/main/tsconfig.json)
- [eslint.config.ts.mjs](https://github.com/blwatkins/typescript-utils/blob/main/eslint.config.ts.mjs)
- [eslint.config.js.mjs](https://github.com/blwatkins/typescript-utils/blob/main/eslint.config.js.mjs)

### Reusable runtime type narrowing

`DiscriminatorRegistry` maps unique discriminator strings to validator functions, returns a reusable `TypeGuard<T>` for each registration, and enforces discriminator shape and uniqueness at registration time, with `Discriminated` and its TypeBox schema defining the minimum shape a registry-validated object must satisfy.
Discriminator values are namespaced by package (`@blwatkins/utils:WeightedElement`) so registrations from different packages cannot collide, and `WeightedElementUtility` demonstrates the pattern in use by registering a schema-backed validator and building `WeightedList` objects for cumulative-weight random selection.

**Evidence:**

- [src/discriminator/discriminator-registry.ts](https://github.com/blwatkins/typescript-utils/blob/main/src/discriminator/discriminator-registry.ts)
- [src/discriminator/discriminated.ts](https://github.com/blwatkins/typescript-utils/blob/main/src/discriminator/discriminated.ts)
- [src/discriminator/discriminators.ts](https://github.com/blwatkins/typescript-utils/blob/main/src/discriminator/discriminators.ts)
- [src/random/weighted-element/weighted-element.ts](https://github.com/blwatkins/typescript-utils/blob/main/src/random/weighted-element/weighted-element.ts)
- [src/random/weighted-element/weighted-element-utility.ts](https://github.com/blwatkins/typescript-utils/blob/main/src/random/weighted-element/weighted-element-utility.ts)

### Layered verification

Vitest both executes the suites and type-checks the test sources against a dedicated tsconfig, so a test that no longer type-checks fails the run rather than silently passing, and a single `validate` script chains lint, documentation generation, build, and test so the same gates can run locally before a push.
Behavior that every member of a type family must satisfy, such as the custom error contract or the static class instantiation guard, is factored into shared helpers under `test/utils` that emit their own `describe` and `test` blocks, so each family member is verified identically rather than through copied assertions, and the full suite runs with lint and build in continuous integration across multiple supported Node.js release lines.

**Evidence:**

- [vitest.config.ts](https://github.com/blwatkins/typescript-utils/blob/main/vitest.config.ts)
- [tsconfig.vitest.json](https://github.com/blwatkins/typescript-utils/blob/main/tsconfig.vitest.json)
- [package.json scripts](https://github.com/blwatkins/typescript-utils/blob/main/package.json)
- [test/utils/error/error-tests.ts](https://github.com/blwatkins/typescript-utils/blob/main/test/utils/error/error-tests.ts)
- [test/utils/static/static-class-tests.ts](https://github.com/blwatkins/typescript-utils/blob/main/test/utils/static/static-class-tests.ts)
- [npm-test.yml](https://github.com/blwatkins/typescript-utils/blob/main/.github/workflows/npm-test.yml)

### Runtime contract for JavaScript consumers

The package targets JavaScript and TypeScript consumers alike, so its static utility classes keep runtime validation even where the type system would already reject the same call: `StringUtility` returns narrowing predicates backed by Unicode-property-aware patterns compiled once at module scope, and `MathUtility` validates numeric bounds and rejects grid dimensions whose product would exceed `Number.MAX_SAFE_INTEGER` before computing an index.
A dedicated error module gives those failures a consistent vocabulary, with each custom error extending the most specific native error class for the failure it represents, setting `name` to its own class name, and exposing a static `defaultMessage`, so callers can discriminate failures by `instanceof` and by name at runtime.

**Evidence:**

- [src/string/string-utility.ts](https://github.com/blwatkins/typescript-utils/blob/main/src/string/string-utility.ts)
- [src/number/number-utility.ts](https://github.com/blwatkins/typescript-utils/blob/main/src/number/number-utility.ts)
- [src/math/math-utility.ts](https://github.com/blwatkins/typescript-utils/blob/main/src/math/math-utility.ts)
- [src/error/primitive-type-error.ts](https://github.com/blwatkins/typescript-utils/blob/main/src/error/primitive-type-error.ts)
- [src/error/value-range-error.ts](https://github.com/blwatkins/typescript-utils/blob/main/src/error/value-range-error.ts)

### Release and supply-chain integrity

The publish workflow gates both registry pushes behind a job that must install, lint, build, and test first, and the npm publish step authenticates through OIDC trusted publishing rather than a stored long-lived token, while the same workflow publishes to GitHub Packages from a single dispatch.
CodeQL analyzes the library source, the workflow definitions themselves, and the Ruby powering the documentation site on push, pull request, and a recurring schedule, and Dependabot maintains each configured package ecosystem with grouped update rules that separate production from development dependencies.

**Evidence:**

- [package-publish.yml](https://github.com/blwatkins/typescript-utils/blob/main/.github/workflows/package-publish.yml)
- [codeql.yml](https://github.com/blwatkins/typescript-utils/blob/main/.github/workflows/codeql.yml)
- [dependabot.yml](https://github.com/blwatkins/typescript-utils/blob/main/.github/dependabot.yml)

## Current Gaps / Future Improvements

- The public API surface is still expanding; utility domains are added release over release, and the package has not yet reached a stable API commitment.
- Tests currently focus on unit-level utility behavior; higher-level integration or consumer-facing examples are not yet part of the verification strategy.
- Coverage is reported on every run but not enforced by a configured threshold, so a decline in coverage would not by itself fail the build.
- Release documentation under `docs/releases/...` is maintained manually, which can increase maintenance overhead as release volume grows.
