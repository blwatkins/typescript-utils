# Agent Instructions

## Project Overview

This repository contains `@blwatkins/utils`, a toolkit of general-purpose TypeScript and JavaScript utilities.

## Companion Instruction Files

This file is the single source of every convention in this repository.
`CLAUDE.md` at the repository root contains a one-line `@` import of this file, which Claude Code expands into context at session start; GitHub Copilot reads this file directly.
Both agents therefore read the same instruction set: add or change a convention here, and never restate, summarize, or add one in `CLAUDE.md`.

Keep every `@`-prefixed token in this file inside backticks or a fenced block — JSDoc tags such as `@throws`, and scoped package names such as `@eslint/js` or `@stylistic/eslint-plugin`.
Claude Code skips backticked and fenced content when parsing imports, but a bare `@since` or `@eslint/js` would be read as an import directive.

## Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Package manager:** npm
- **Build:** tsdown (ESM output)
- **Test:** Vitest (coverage via V8)
- **Documentation:** TypeDoc
- **Dependencies:** `typebox` (runtime/production dependency)
- **Site Generation:** Jekyll
- **Hosting & Deployment:** GitHub Pages, npm package registry, and GitHub package registry

## npm Scripts

- `npm run lint:js` - lint repository files with `eslint.config.js.mjs`
- `npm run lint:ts` - lint repository files with `eslint.config.ts.mjs`
- `npm run lint:all` - run both lint configurations
- `npm run build` - bundle the package and emit declaration files with `tsdown`
- `npm run test` - run the Vitest suite once
- `npm run test:watch` - run Vitest in watch mode
- `npm run test:ui` - run the Vitest UI
- `npm run test:coverage` - run Vitest with V8 coverage reporting
- `npm run docs` - generate API documentation with TypeDoc
- `npm run prepack` - build the package before packing or publishing
- `npm run validate` - run lint, documentation generation, build, and tests in sequence

## GitHub Actions CI

| Workflow file | Name | Trigger | Description |
|---|---|---|---|
| `codeql.yml` | CodeQL | Push/PR to `main` and `release/**`, manual, monthly schedule | Runs CodeQL security analysis for `actions`, `javascript-typescript`, and `ruby` |
| `gh-pages-jekyll.yml` | Deploy GitHub Pages with Jekyll | Push to `main`, manual | Builds and deploys the `docs/` directory to GitHub Pages |
| `package-publish.yml` | npm and GitHub Package Publish | Manual (`workflow_dispatch`) | Runs `npm run validate` (lint, documentation generation, build, and tests), then publishes to npm and GitHub Packages; requires `release_tag` input and uses `id-token: write` trusted publishing permissions for the npm publish job |
| `npm-validate.yml` | npm Validate | Push/PR to `main` and `release/**`, manual | Runs `npm run validate` (lint, documentation generation, build, and tests) across supported Node.js versions |

## Directory Structure

```
src/
  assert/                 # Type assertion utilities
  error/                  # Custom error types
  math/                   # Math utilities
  number/                 # Number utilities
  random/                 # Random number generation utilities
    seeded-random/        # Seeded random number generator utilities
    weighted-element/     # Weighted element and weighted list selection utilities
  range/                  # Range utilities
  string/                 # String utilities
  index.ts                # Package entry point (re-exports all modules)
test/                     # Vitest test suites (mirrors src/ module structure)
  assert/                 # Tests for the assert module
  error/                  # Tests for the error module
  math/                   # Tests for the math module
  number/                 # Tests for the number module
  random/                 # Tests for the random module
    seeded-random/        # Tests for the seeded-random module
    weighted-element/     # Tests for the weighted-element module
  range/                  # Tests for the range module
  string/                 # Tests for the string module
  utils/                  # Shared test fixtures and scenario helpers for use across test suites
    assert/               # Shared contract test suites for assertion methods and type guards
    error/                # Shared contract test suites for custom error types
    input/                # Shared test input fixtures
    static/               # Shared contract test suites for static class instantiation guards
    test-case/            # Shared test-case helpers
      scenarios/          # Reusable test-case scenario definitions
docs/                     # GitHub Pages site content and manually maintained release documentation
  doc/                    # Latest release TypeDoc output, committed manually and published with the site
  releases/               # Per-version TypeDoc output, committed manually and published with the site
.github/
  workflows/              # CI, publishing, documentation, and analysis workflows
_dist/                    # Build output - generated by tsdown (not committed)
_compiled/                # TypeScript outDir output - generated by tsc (not committed)
_coverage/                # Coverage output - generated by Vitest (not committed)
_doc/                     # Documentation output - generated by TypeDoc (not committed)
```

Update this tree in the same change that adds, removes, or renames a top-level `src/`/`test/` module directory.
Do not defer this to the ["Pre-Merge and Release Review"](#pre-merge-and-release-review) checklist — that review only runs when merging to a release branch or `main`, so a directory added and later removed within the same release cycle can otherwise go undocumented indefinitely.

## Development Guidelines

Keep changes scoped to existing files unless a task explicitly requires scaffolding project code.

### Static Classes

Static classes must:

- Have a `private constructor()` that throws an `Error` to prevent instantiation
- Include a JSDoc `@throws` on the constructor documenting the instantiation error
- Expose public static getters or methods only

### Custom Error Types

Custom error classes must:

- Live in `src/error/` and be re-exported from that module's index file
- Extend the most specific built-in error type that fits the failure (e.g., `TypeError` for invalid input types) rather than the base `Error`
- Set `this.name` to the class name in the constructor so the error is identifiable at runtime and in stack traces
- Accept an optional `message` parameter that defaults to the class's `defaultMessage`, and document the default in the constructor `@param`
- Expose a public static `defaultMessage` getter returning the default error message

Choose the error type by the kind of failure, not by the call site:

- `PrimitiveTypeError` — input fails a type check with no schema involved (e.g., not a string, not a number, not a function, not an object), including a classifying guard that folds a content rule into the type it narrows to
- `SchemaTypeError` — input is checked against an expected object schema and fails it, either because it does not satisfy the schema or because it is not an object at all
- `ValueRangeError` — input has already passed its type check, but its value falls outside what is allowed: a range, a bound, or a content rule on an already-typed value
- `StaticInstanceError` — a static class constructor was invoked

Custom error types intentionally do not expose a Node.js-style `code` property.
Consumers discriminate with `instanceof` and the error `name`; the Node.js code namespace (e.g., `ERR_INVALID_ARG_TYPE`) is reserved for Node core and would not identify this package as the source.

### Error Messages

Error messages are fixed strings. Do not interpolate a value that has not already been verified.

An assertion's failure path is precisely the path where the input has *not* been verified, so an assertion's own message never describes the input it rejected:

```typescript
// Correct.
throw new PrimitiveTypeError('Expected an array.');

// Wrong. `input` failed the check, and its type is now visible to anyone who can read the error.
throw new PrimitiveTypeError(`Expected an array, but received: ${typeof input}.`);
```

The concern is disclosure, not verbosity.
A caller that passes a secret, a token, or an internal object to a guard should not have its content or its type surface in a message that may be logged, serialized, or shown to an end user.
Interpolation is allowed where the type and/or the range of the value is already established — for example, after the value has passed a guard earlier in the same method — because there is then no unverified input to leak.

Beyond that, messages follow a consistent voice:

- **A guard taking a single unnamed input** describes the expectation rather than the argument, and refers to the argument as `Input` when it must name it at all.
- **A method with named parameters** names them exactly as the signature spells them, in their own casing, at the start of the sentence — `min must be less than or equal to max.` rather than `Min must be...` or `The minimum must be...`.
- **A message passed to a guard from a call site** names the caller's own parameter for the same reason: the call site knows what the value is called and the guard does not.
- **A static class instantiation guard** reads `<ClassName> is a static class and cannot be instantiated.`
- Every message is a complete sentence ending in a period.

### Assertions and Type Guards

Assertion methods and type guards are the package's primary surface, and they are written as matched pairs.

A **classifying guard** answers "what is this?" about an input of unknown provenance.
It takes a single `unknown` parameter and returns a type predicate: every input yields `true` or `false`, and no input makes it throw.
Where such a guard needs a check that would itself reject a bad argument, it establishes the type first, so that check is never reached with an argument it would throw on.

A **constraint guard** answers "does this value satisfy the constraint?" about parameters that are already typed.
The constraint may relate one parameter to another, bound a parameter against an internal state, or restrict its content.
It takes named parameters of concrete types, returns a plain `boolean` rather than a type predicate, and validates its arguments before checking the constraint.
An argument of the wrong type is a broken call rather than one of the answers, so it throws instead of returning `false`.

Choose the shape from the question the guard answers, not from what a call site would find convenient.
A guard that throws is not inconsistent with one that returns `false` — check which shape it is before treating the difference as a defect.

**Naming.** An `assert*` method and its `is*` guard name the same concept identically, so that the pair differs only in its prefix.
Do not encode the checked type in the member name — the `assert` or `is` prefix together with the concept already carries it, and a `Type`, `Number` or `String` suffix restates what the signature says.
Where a regular-expression getter backs a guard, it carries the same concept without the prefix.
This is the guard-pair application of the suffix guidance under ["Code Style Preferences and Conventions"](#code-style-preferences-and-conventions); where the two overlap they say the same thing.

**The optional `message` contract.** A custom `message` is used only when it passes `StringUtility.isSingleLine`; any other value, including a multi-line string, a whitespace-only string, `undefined`, a non-string, or any string that does not pass `StringUtility.isText`, falls through to the default message.
This is deliberate: an error message that carries newlines or untrimmed padding corrupts logs and stack traces, so a malformed one is discarded rather than propagated.
It is also observable behavior, asserted by the shared assertion-contract helpers under `test/utils/assert/` for the failures each guard's `message` covers.
A new `assert*` method therefore either applies this check itself or forwards `message` unchanged to a method that does; a member that delegates to another guard, including a deprecated alias delegating to its replacement, takes the second form.
Never use `message` unconditionally.

**How far `message` reaches.** A classifying pair has one failure, so `message` covers it.
A constraint pair can have multiple, and `message` covers only the constraint the pair is named for.
Argument validation runs first, inside the guard, so a caller's `message` never reaches the argument failure path.
This is deliberate rather than a gap: the caller's message describes the constraint it expected, which says nothing useful about an argument that was wrong before the constraint was checked.
Do not treat the split as a defect, and do not route `message` into the argument validation.

### Deprecation

When a member is deprecated rather than removed:

- Group deprecated members below a banner comment inside the class or module:
  `/* ******************* TODO: DEPRECATED ******************* */`
- Keep the member exported and fully functional until the removal release. A deprecated method must still satisfy its documented contract.
- Keep its test coverage until the member is removed. Do not delete a suite because a deprecated member started failing — a failing deprecated member is a defect in the current release, not dead weight.
- Deprecate the member, any private helpers that exist only to support it, and the schema or type members it depends on, in the same change.
- Mirror the grouping in the member's test suite: title its `describe` block `[DEPRECATED] <memberName>`, and group those blocks below the same deprecated banner at the end of the suite. A member tested alongside its replacement in a shared block has no separate section to group, so it needs neither.
- A deprecated member that delegates to its replacement runs the replacement's scenario arrays rather than a copy of them. Copies drift. Declare the arrays once at suite scope and pass them to both.

### TypeScript Conventions

- The package is ESM-only (`"type": "module"`), so keep imports/exports compatible with Node.js ESM resolution.
- Public exports flow through module index files. This pattern is intentional to maintain clear module boundaries and organization in both source code and generated documentation.
- API documentation entry points stay module-scoped rather than pointing TypeDoc at the root package entry point.
- The project uses strict TypeScript settings (`strict`, `noImplicitAny`, `noUnusedLocals`, etc.) with `moduleResolution: bundler`.

### JavaScript Consumer Safety

This package is published as ESM and targets both TypeScript and JavaScript consumers.
Retain runtime type guards and input validation even when TypeScript's type system would catch the same issue at compile time.
JavaScript callers have no compile-time safety, so runtime checks are necessary for correctness.

### tsdown Build Output

This project uses `tsdown` to bundle and emit declaration files.
When the output format is `esm`, tsdown emits format-specific file extensions: `.mjs` for the bundle and `.d.mts` for the declaration file, regardless of whether the source files use the `.ts` or `.mts` extension.
The `types`, `module`, `main`, and `exports` fields in `package.json` should always reference these `.mjs`/`.d.mts` paths (e.g., `./_dist/index.mjs` and `./_dist/index.d.mts`).

### File Headers

All source files must include the MIT License copyright header at the top.

**Copyright year convention:** Use the original year the file was authored. If the file is subsequently modified in a later year, expand to a range (e.g., `2024-2026`). Do not change the starting year when editing an existing file.

```typescript
/*
 * Copyright (c) <year> Brittni Watkins.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
 * AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
```

### Code Style

#### Code Style Preferences and Conventions

- Prefer `if`/`else` blocks over ternary operators for conditional logic.
- Prefer `@returns` (not `@return`) in TSDoc comments.
- Module-level private constants (e.g., lookup tables backing a set of public getters) use camelCase naming.
- Variable, constant and member names do not need to encode their type or role in a suffix; the surrounding context usually carries it. A getter returning a regular expression does not need a `Pattern` suffix, and neither does the constant backing it. Keep a suffix only where the name is genuinely ambiguous without it.
- Write every non-ASCII character in source and test source files as a Unicode escape (e.g., `\u00E9`, `\u{1F3A8}`), never as the raw character. Many non-ASCII characters are invisible or look identical to an ASCII character — a zero-width joiner, a no-break space, a Cyrillic `\u0430` — so a raw character can change behavior without being visible in a diff or a review. The one exception is the trailing emoji comment described under ["Vitest Testing"](#vitest-testing).

#### Formatting Rules

- Keep formatting compatible with the repository ESLint configurations in `eslint.config.js.mjs` and `eslint.config.ts.mjs`.
- Do not introduce formatting-only tooling or workflow changes unless the task explicitly requires them.

### Markdown Formatting

These rules apply to every Markdown file in the repository, including `README.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, and all files under `docs/`.

- Indent a list item's nested content by the width of its parent marker: 2 spaces under `- `, 3 spaces under `1. `. Under-indenting by even one space detaches the content from the list item and splits the list in two. This applies to nested lists, paragraphs, and code fences alike.
- A single file may need both widths, since the required indent comes from each item's own marker. Do not normalize a file to one indent width.
- When a fenced code block sits inside a list item, indent the opening fence to the item's content column. The closing fence's indentation does not affect nesting, so match it to the opening fence for readability rather than correctness.

### Documentation Comment Preferences

Most documentation comment conventions are enforced automatically by `eslint.config.ts.mjs`.

Do not weaken or remove these ESLint rules to work around a violation; fix the documentation comment instead.
If a legitimate case requires deviating from one of these rules, discuss the specific rule override with the maintainer rather than silently suppressing it.

#### Manual Review Instructions for Documentation Comment Preferences

The following preferences require manual review since no ESLint rule can check them automatically:

- **Use `{@link ...}` syntax in `@see` tags:** Always use `{@link ClassName.method}` (or `{@link symbol}`) inside `@see` tags. Do not use bare `{ClassName.method}` without `@link`.
- **Cite the assertion methods a member calls with `@see`:** A member that calls an `assert*` method names it in a `@see` tag, so a reader sees which guards run before the body reaches its own work. Write one tag per distinct assertion method, however many times the member calls it. Two cases carry no `@see` for an assertion the member reaches. TypeDoc does not document an ECMAScript `#private` member and cannot resolve a link to one, so a member whose assertion call is a private helper cites nothing and leaves the helper's own comment to document what it calls. A member that reaches an assertion only through another member it calls cites that member rather than the assertion behind it, so each hop documents its own calls. A deprecated member keeps whatever `@see` tags it already had; do not retrofit this to the deprecated block.
- **Order `@see` tags by call order:** Where a `@see` names a member that the documented member calls, the tags appear in the order of their first call in the body.
- **Document version with `@since`:** Add `@since` to all public/exported members.
- **Enclose boolean values in backticks:** Always use backticks for `true` and `false` in documentation comments.
- **Use consistent tense and voice:** Write documentation in the present tense and active voice for clarity.
- **Document default values:** For class fields, object properties, and module-level constants and variables that have a default or initial value, state the default via `@default` (e.g., `@default Math.random`).
- **Document default parameter values:** Indicate default values for parameters in the `@param` annotation.
- **Annotate abstract/readonly/private/protected/override members:** Use `@abstract`, `@readonly`, `@private`, `@protected`, and `@override`, respectively, matching the corresponding TypeScript modifier. `eslint.config.ts.mjs` validates these tags are well-formed where present, but does not require their presence for a given modifier.
- **Scope `@public` to class members:** Apply `@public` to public class members and constructors. Do not add `@public` to the doc comment of an exported class, interface, type, enum, or constant itself, or to interface properties — in both cases the declaration is already the visibility signal.
- **Use a consistent constructor summary:** Document constructors as `Public constructor.` or `Private constructor.`, matching the TypeScript modifier.
- **Omit a `@returns` description that only restates its type:** Where the type carries the whole meaning, the type alone is the description — an `asserts input is ...` predicate, an `input is ...` guard, `@returns {void}`, or a getter returning a bare `RegExp`. Keep a description wherever it says something the type does not, which is most methods returning a value: a `@returns {number}` that states which of several bounds is returned earns its prose. A deprecated member keeps whatever `@returns` text it already had; do not retrofit this to the deprecated block, where a later diff would read as a change to a member that is on its way out.
- **Do not prefix block tag text with a hyphen, except on `@param`:** `@param` consumes a ` - ` separator between the name and the description, so `@param {string} name - The name to greet.` and `@param {string} name The name to greet.` render identically; keep the hyphen there. On every other block tag — `@remarks`, `@returns`, `@throws`, `@deprecated` — the separator is not consumed. It reaches the comment body, where Markdown reads it as a list marker and TypeDoc renders the description as a single-item bulleted list instead of a paragraph. Write those descriptions directly after the tag (and any optional type/identifier), e.g. `@remarks This method does not enforce type checking.`, `@returns {string} The greeting.` This applies to test sources as well as `src/`.
- **State the removal version on `@deprecated`:** Every `@deprecated` tag ends with `Will be removed in v{version}.` What precedes it depends on what the consumer should do instead:
  - **Replaced within this package** — name the replacement first, as a link: `@deprecated Replaced by {@link StringUtility.assertString}. Will be removed in v0.1.0-alpha.5.`
  - **Moved to another package** — name the destination first, without a link, because TypeDoc cannot resolve a symbol outside this package and an unresolved link fails the documentation run: `@deprecated Migrated to @scope/package-name. Will be removed in v1.0.0.`
  - **Removed with no alternative** — the removal notice alone: `@deprecated Will be removed in v1.0.0.`

  Apply the tag to private helpers that exist only to support deprecated members, using the same message format.

## Documentation and GitHub Pages

`README.md` and `docs/index.md` should stay in sync for shared content, but they are not expected to be identical.
Expected differences include Jekyll front matter, file-specific introductory or heading sections, footer or copyright text, and internal link differences.
Any addition, removal, or update to shared sections must be applied consistently to both files.

### Jekyll Build

The Jekyll build uses the `jekyll-relative-links` plugin (configured in `docs/_config.yml`), which automatically converts relative `.md` links in `docs/` markdown files to their rendered `.html` paths.
For example, a relative `./page.md` link in a `docs/` page resolves to `page.html` on the published site.
Use `.md` relative links within `docs/` source files; the build process will convert them correctly.

### Front Matter Dates

Markdown pages that use `layout: post` with `date` and `modified_date` front matter render both values through `docs/_layouts/post.html` as "Published" and "Updated", respectively.
When a branch changes the content of one of these pages, bump that page's `modified_date` to the commit date and leave the original `date` unchanged.
A page whose content did not change keeps its existing `modified_date`.

### TypeDoc Configuration

- API docs are generated with TypeDoc (`npm run docs`) using `typedoc.json`.
- TypeDoc entry points are intentionally pointed to module-level index files (e.g., `./src/number/index.ts`, `./src/random/index.ts`) rather than the root package entry point (e.g., `./src/index.ts`). This is done purposefully to maintain module-level organization in the generated documentation output. Do not change TypeDoc entry points to the root package entry point.

### Release Documentation

- Release documentation organized in `docs/releases/...` is maintained manually and not generated by any automated process.
- Stable release docs follow the directory structure: `docs/releases/v{major}.x/v{major}.{minor}.x/{full-version}/doc/` (e.g., `docs/releases/v1.x/v1.0.x/v1.0.0/doc/`).
- Pre-release docs insert one additional level for the pre-release prefix: `docs/releases/v{major}.x/v{major}.{minor}.x/v{version-prefix}.x/{full-version}/doc/`, where `{version-prefix}` is the major, minor, patch, and pre-release type identifier (e.g., `v0.1.0-alpha.x` holding `v0.1.0-alpha.0`).

## Security and Dependency Management

- Dependabot is configured for monthly updates to npm dependencies, GitHub Actions workflows, and Bundler dependencies under `docs/`.
- See the [GitHub Actions CI](#github-actions-ci) table for CodeQL analysis scope and npm publish authentication details.

## Validation

### Vitest Testing

- This repository uses Vitest for testing, with coverage reporting via V8.
- Tests live in the `test/` directory, with a folder structure that mirrors the source code in `src/`.
- Shared test fixtures and scenario helpers live under `test/utils`.
- Vitest also type-checks test files at run time (in addition to executing them), configured via the `typecheck` block in `vitest.config.ts` against `tsconfig.vitest.json`.
- Cross-cutting behavior that every member of a family of types must satisfy — for example, the custom error type contract, or the static class instantiation guard — is factored into a shared helper under `test/utils/` that emits its own `describe`/`test` blocks, and is called from each suite rather than duplicated per file.
- Helper files use a `*-tests.ts` suffix (not `*.test.ts`) so Vitest does not collect them as suites directly.
- Test files carry no explanatory comments. A `describe` title states what is under test and a scenario `label` states why its inputs belong together, so a comment explaining either is bloat and a signal that the title or the label needs the work instead. The only comments a test file keeps are the deprecated banner, editor pragmas, a warning on data that must never change, such as published seed sequences, and a trailing comment on an emoji fixture entry that shows the rendered emoji and its name, since the escape sequence alone is unreadable.
- Note that Vitest's `typecheck` pass collects cases by statically parsing `describe`/`test` literals per file, so cases emitted from a shared helper are type-checked but not individually counted in the typecheck totals.

#### The Scenario Pattern

Table-driven tests are written through the scenario types under `test/utils/test-case/` rather than through ad-hoc `test.each` arrays of literals.

A `Scenario` groups a set of `inputs` that share an outcome under a `label`, with the `expected` outcome for all of them.
`buildTestCases` expands a scenario into `TestCase` objects, one per input, and a `describe.each` over the scenarios wraps a `test.each` over the cases:

```typescript
const scenarios: Scenario[] = [
    {
        label: 'Invalid type inputs',
        inputs: invalidInputs,
        expected: false
    }
];

describe.each(
    scenarios
)('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
    const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

    test.each(
        testCases
    )('%# - Input $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
        expect(MethodUnderTest(testInput)).toBe(testExpected);
    });
});
```

The label carries the reason a group of inputs belongs together, so the reason survives in the test output and a new input can be added to an existing group without restating it.

Conventions for the pattern:

- Title a `describe.each` over scenarios with `'%# - $label'`, and a `test.each` over cases with `'%# - ...$input...$expected...'`. The index prefix keeps output readable when inputs render alike.
- Draw inputs from the shared fixtures in `test/utils/input/` instead of restating literal lists, so a fixture change reaches every suite that depends on it. A fixture is named for the quality its inputs share, not for the suite that first needed it.
- When the same combination of fixtures is spread at several call sites, export the combination as its own fixture rather than repeating the spread. A combination earns a name when it corresponds to what one guard rejects, so every method behind that guard can validate against a single list.
- Name a suite's `describe` after the class under test, and group an `assert*` and `is*` pair under a `describe` named for the concept they share rather than for either method. Put the method's own `describe` inside it, so a shared scenario array has one obvious place to live.
- Before adding a block, check whether a shared scenario array already carries its inputs through the method under test. A block that restates inputs a shared array already holds adds test count without adding coverage, and has to be kept in step with that array by hand.
- Declare a scenario array once in the widest scope that needs it and reuse it across every method that shares those inputs, rather than repeating it per method.
- Derive a related set from an existing array with `filter` or `map` rather than writing a near-copy.
- Generate fixture inputs from the rule they exercise rather than listing variations by hand, when possible, and remove duplicates from the result. A generated list stays complete when the rule changes, where a hand-written list only covers the cases its author thought of.
- Use `SingleInputScenario` when a scenario describes one input rather than a set, so a `test.each` can run over the scenarios directly. It suits a case that pairs one argument combination with one expected result.
- Put a scenario set shared across files in `test/utils/test-case/scenarios/`, exported for the suites that consume it, so an edge case added once reaches every suite that runs it.
- `assert*` and `is*` methods taking a single input use the shared assertion-contract helpers under `test/utils/assert/`, which take `Scenario[]` for success and failure directly and emit their own `describe`/`test` blocks. Prefer those over hand-written scenario blocks where the method's shape fits.

##### Argument Validation

Argument validation is the most common use of the pattern, and has conventions of its own.
Here `expected` holds the error constructor the call should throw, and each input is an object naming the full argument list:

```typescript
const argumentFailureScenarios: Scenario[] = [
    {
        label: 'Invalid min argument',
        inputs: invalidInputs.map((input: unknown): { min: unknown; max: number; } => {
            return { min: input, max: defaultMax };
        }),
        expected: PrimitiveTypeError
    }
];

describe.each(
    argumentFailureScenarios
)('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
    const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

    test.each(
        testCases
    )('%# - Input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
        const args: { min: unknown; max: unknown; } = testInput as { min: unknown; max: unknown; };

        expect((): void => {
            MethodUnderTest(args.min as number, args.max as number);
        }).toThrow(testExpected);
    });
});
```

- Group the scenarios under a `describe('Argument errors')` block within the suite for the method under test.
- For a method taking several arguments, map a fixture over one argument at a time, holding the others at a valid default, and give each mapped set its own scenario (e.g. `Invalid min argument`, `Invalid max argument`). This attributes a failure to one argument rather than leaving it ambiguous.
- Assert the specific error type the package exports (e.g. `PrimitiveTypeError`, `ValueRangeError`, `SchemaTypeError`), never the built-in base type it extends. A built-in base passes for any subclass and does not pin down which failure occurred.
- Where several methods validate their arguments identically, assert the scenarios against all of them in one block rather than repeating the scenarios per method.
- A constraint guard's suite uses both mechanisms: its wrong-type inputs belong in the `Argument errors` block, and its in-type failures go through the shared assertion-contract helpers, reached by a local wrapper that adapts the argument list to the single-input shape those helpers take. A classifying guard needs no `Argument errors` block because it has no wrong-type failure to attribute. The presence or absence of that block therefore tracks which shape a guard is, and is not on its own a sign that a suite is inconsistent.
- Keep value and behavior tests — those asserting a returned value rather than a thrown error — as plain `test.each` blocks, or as their own scenarios when the inputs group meaningfully. The argument-validation conventions above do not apply to them.

### Validation Steps

Run `npm ci`, then `npm run validate`, which runs lint, documentation generation, build, and tests in sequence.
The documentation step is part of validation because TypeDoc is configured to treat warnings as errors, so an undocumented symbol or an unresolved link fails the run.
See the ["npm Scripts" section](#npm-scripts) for details on each command.

### Link Verification

As part of pull request review, verify that repository and package links (for example in `README.md`, `package.json`, or other project metadata) match the current repository and package coordinates.

## Pre-Merge and Release Review

Complete the following steps before merging a branch to a release branch or to `main`.

### 1. Validation

Run the full [Validation Steps](#validation-steps) and confirm everything passes cleanly.

### 2. Instruction File

Verify that `.github/copilot-instructions.md` reflects the current project state:

- The [Directory Structure section](#directory-structure) accurately reflects the current source layout
- The [npm Scripts](#npm-scripts) and [GitHub Actions CI](#github-actions-ci) lists match `package.json` and `.github/workflows/`, respectively
- The [Tech Stack section](#tech-stack) matches the dependencies declared in `package.json`
- The [Security and Dependency Management section](#security-and-dependency-management) matches `.github/dependabot.yml`
- Any new tooling, conventions, or workflows introduced on the branch are documented

### 3. `package.json` Keywords

Review the `keywords` array in `package.json`:

- Keywords should cover all major utility domains and notable features exported by the package
- Add new keywords when a new utility domain or notable feature is introduced
- Remove keywords for capabilities that no longer exist

### 4. Branch Code Review

Review all branch changes for convention compliance and code quality.

#### Convention Compliance

- All source code files should follow the conventions listed in the ["Development Guidelines" section](#development-guidelines) of this file.
- Copyright year headers are present and accurate (see ["File Headers" section](#file-headers)).
- `README.md` and `docs/index.md` are in sync for any shared content changes
- `modified_date` is bumped on every page whose content changed on the branch (see the ["Front Matter Dates" section](#front-matter-dates))
- Test coverage is complete and meaningful for all new or changed public API surface

#### Code Quality

- **Correctness** — implementations behave exactly as documented; edge cases are handled; patterns (e.g., regex) match precisely what they claim to match
- **API consistency** — new methods and classes follow the naming conventions and structural patterns of existing ones; the public surface is intuitive alongside what is already exported
- **Efficiency** — utility functions avoid unnecessary computation (e.g., no redundant regex compilation, no unnecessary copies or iterations)
- **Backward compatibility** — no unintentional breaking changes to the published API (check `package.json`'s current version — pre-release versions permit more flexibility here); any intentional breaking changes are reflected in the version bump
- **Reuse and DRY** — new utilities delegate to existing ones where appropriate rather than duplicating logic
- **Runtime safety** — see the "JavaScript Consumer Safety" section for the requirement to retain runtime type guards for JavaScript consumers

#### Consistency and Pattern Observation

- **Cross-source consistency** — Compare all changed code, inline comments, and documentation (JSDoc, README, `docs/`) against each other and against implicit patterns visible in the rest of the codebase. Flag any deviation from an established pattern even if that pattern has not been explicitly documented in this file (e.g., consistent phrasing in JSDoc summaries, a structural idiom repeated across utility classes, a naming convention used throughout tests).
- **Implicit pattern detection** — When a consistent pattern is observed in the codebase that is not yet captured in this file, call it out explicitly and ask the maintainer whether it should be documented in the appropriate section of `.github/copilot-instructions.md`.

### 5. Release Readiness (for merges to `main`)

When preparing a release merge to `main`:

- Confirm the version in `package.json` is bumped appropriately
- Remove any member whose `@deprecated` tag names this release as its removal version, together with the private helpers, schema or type members, and tests that exist only to support it
- Ensure release documentation under `docs/releases/` covers the new version
- Verify `typedoc.json` entry points include any new module-level index files
- Confirm the npm publish workflow (`package-publish.yml`) is configured correctly for the release
