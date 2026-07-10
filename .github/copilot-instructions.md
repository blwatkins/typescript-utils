# Copilot Instructions

## Project Overview

This repository contains `@blwatkins/utils`, a growing toolkit of reusable TypeScript and JavaScript utilities for number checks, string checks, random number and element selection (including weighted selection), deterministic seeded pseudorandom number generation, and a discriminator-based type guard registry.

## Companion Instruction Files

This repository maintains a companion `CLAUDE.md` at the repository root alongside this file.
The two documents serve overlapping audiences and should stay consistent: when you update guidance in `.github/copilot-instructions.md` that also applies to `CLAUDE.md`, mirror the change there, and vice versa.
`CLAUDE.md` is intentionally a concise pointer to this file; this file remains the canonical, detailed source of conventions.

## Tech Stack

- **Language:** TypeScript (targeting ES2022)
- **Runtime:** Node.js (^22.22.0 || >=24)
- **Package manager:** npm
- **Build:** tsdown (ESM output to `_dist/`)
- **Test:** Vitest (coverage via V8, output to `_coverage/`)
- **Documentation:** TypeDoc (output to `_doc/`)
- **Dependencies:** `typebox` (runtime/production dependency)
- **Site Generation:** Jekyll
- **Hosting & Deployment:** GitHub Pages, npm package registry, and GitHub package registry

## Development and Validation

Primary development work happens in `src/` and corresponding tests under `test/`.
Shared test fixtures and scenario helpers live under `test/utils`.
Vitest also type-checks test files at run time (in addition to executing them), configured via the `typecheck` block in `vitest.config.ts` against `tsconfig.vitest.json`.

### Development Status

The package is currently in an alpha release line and exports grouped utility modules from `src/discriminator`, `src/number`, `src/random`, and `src/string`.

### Validation Steps

- Install dependencies with `npm ci`.
- Run lint checks with `npm run lint:all`.
- Build with `npm run build`.
- Run tests with `npm test`.

### Link Verification During Review

As part of pull request review, verify that repository and package links (for example in `README.md`, `package.json`, or other project metadata) match the current repository and package coordinates.

## Pre-Merge and Release Review

Complete the following steps before merging a branch to a release branch or to `main`.

### 1. Validation

Run the full [Validation Steps](#validation-steps) and confirm everything passes cleanly:

### 2. Portfolio Skills Page (`docs/portfolio-skills.md`)

Review `docs/portfolio-skills.md` against the current repository state. If anything changed:

- Update any section where capabilities, tooling, or the skills inventory changed
- Bump `modified_date` to today; do not change the original `date`
- Evidence links must always point to the `main` branch

Refer to the ["Portfolio Page Generation and Maintenance" section](#portfolio-page-generation-and-maintenance) for the full review checklist.

### 3. Instruction File Sync

Verify that `CLAUDE.md` and `.github/copilot-instructions.md` are consistent with each other and reflect the current project state:

- Guidance shared between the two files is mirrored
- The Development Status section accurately lists all modules exported by the package
- Any new tooling, conventions, or workflows introduced on the branch are documented

### 4. `package.json` Keywords

Review the `keywords` array in `package.json`:

- Keywords should cover all major utility domains and notable features exported by the package
- Add new keywords when a new utility domain or notable feature is introduced
- Remove keywords for capabilities that no longer exist

### 5. GitHub Repository Topics

Verify that the topics on the GitHub repository ([blwatkins/typescript-utils](https://github.com/blwatkins/typescript-utils)) reflect the current capabilities.
Topics should align with `package.json` keywords where appropriate.
Request the current topics to be updated, if necessary.
Provide any topic change suggestions to the project maintainers and any accepted changes will be updated manually.

### 6. Branch Changes Code Review

Review all source changes for convention compliance and code quality.

#### Convention Compliance

- New source files follow the static class pattern (private constructor, `@throws` on constructor, public static members only)
- All public/exported members have complete JSDoc per the documentation comment conventions in this file
- Copyright year headers are present and accurate (see "File Headers" section)
- `README.md` and `docs/index.md` are in sync for any shared content changes
- Test coverage is complete and meaningful for all new or changed public API surface

#### Code Quality

- **Correctness** — implementations behave exactly as documented; edge cases are handled; patterns (e.g., regex) match precisely what they claim to match
- **API consistency** — new methods and classes follow the naming conventions and structural patterns of existing ones; the public surface is intuitive alongside what is already exported
- **Efficiency** — utility functions avoid unnecessary computation (e.g., no redundant regex compilation, no unnecessary copies or iterations)
- **Backward compatibility** — no unintentional breaking changes to the published API; any intentional breaking changes are reflected in the version bump
- **Reuse and DRY** — new utilities delegate to existing ones where appropriate rather than duplicating logic
- **Runtime safety** — see the "JavaScript Consumer Safety" section for the requirement to retain runtime type guards for JavaScript consumers

#### Consistency and Pattern Observation

- **Cross-source consistency** — Compare all changed code, inline comments, and documentation (JSDoc, README, `docs/`) against each other and against implicit patterns visible in the rest of the codebase. Flag any deviation from an established pattern even if that pattern has not been explicitly documented in this file (e.g., consistent phrasing in JSDoc summaries, a structural idiom repeated across utility classes, a naming convention used throughout tests).
- **Implicit pattern detection** — When a consistent pattern is observed in the codebase that is not yet captured in this file, call it out explicitly and ask the maintainer whether it should be documented in the appropriate section of `.github/copilot-instructions.md`.

### 7. Release Readiness (for merges to `main`)

When preparing a release merge to `main`:

- Confirm the version in `package.json` is bumped appropriately
- Ensure release documentation under `docs/releases/` covers the new version
- Verify `typedoc.json` entry points include any new module-level index files
- Confirm the npm publish workflow (`package-publish.yml`) is configured correctly for the release

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

## GitHub Actions CI

| Workflow file | Name | Trigger | Description |
|---|---|---|---|
| `codeql.yml` | CodeQL | Push/PR to `main` and `release/**`, manual, monthly schedule | Runs CodeQL security analysis for `actions`, `javascript-typescript`, and `ruby` |
| `gh-pages-jekyll.yml` | Deploy GitHub Pages with Jekyll | Push to `main`, manual | Builds and deploys the `docs/` directory to GitHub Pages |
| `package-publish.yml` | npm and GitHub Package Publish | Manual (`workflow_dispatch`) | Lints, builds, tests, then publishes to npm and GitHub Packages; requires `release_tag` input and uses `id-token: write` trusted publishing permissions for the npm publish job |
| `npm-test.yml` | npm Lint, Build, and Test | Push/PR to `main` and `release/**`, manual | Runs lint, build, and tests across supported Node.js versions |

## Security and Dependency Management

- GitHub Actions runs CodeQL analysis for `actions`, `javascript-typescript`, and `ruby`.
- Dependabot is configured for monthly updates to npm dependencies, GitHub Actions workflows, and Bundler dependencies under `docs/`.
- The npm publish workflow uses npm Trusted Publishing with GitHub OIDC (`id-token: write`) instead of a committed registry token.

## Development Guidelines

Keep changes scoped to existing files unless a task explicitly requires scaffolding project code.

### TypeScript Conventions

- The package is ESM-only (`"type": "module"`), so keep imports/exports compatible with Node.js ESM resolution.
- Public exports flow through module index files. For example, `src/index.ts` re-exports from `src/number/index.ts`, which re-exports from individual utility files. This pattern is intentional to maintain clear module boundaries and organization in both source code and generated documentation.
- API documentation entry points stay module-scoped rather than pointing TypeDoc at the root package entry point.
- The project uses strict TypeScript settings (`strict`, `noImplicitAny`, `noUnusedLocals`, etc.) targeting ES2022 with `moduleResolution: bundler`.

#### tsdown Build Output

This project uses `tsdown` to bundle and emit declaration files.
When the output format is `esm`, tsdown emits format-specific file extensions: `.mjs` for the bundle and `.d.mts` for the declaration file, regardless of whether the source files use the `.ts` or `.mts` extension.
The `types`, `module`, `main`, and `exports` fields in `package.json` should always reference these `.mjs`/`.d.mts` paths (e.g., `./_dist/index.mjs` and `./_dist/index.d.mts`).

#### JavaScript Consumer Safety

This package is published as ESM and targets both TypeScript and JavaScript consumers.
Retain runtime type guards and input validation even when TypeScript's type system would catch the same issue at compile time.
JavaScript callers have no compile-time safety, so runtime checks are necessary for correctness.

#### Static Classes

Static utility classes must:
- Have a `private constructor()` that throws an `Error` to prevent instantiation
- Include a JSDoc `@throws` on the constructor documenting the instantiation error
- Expose public static getters or methods only

## Code Style

#### Code Style Preferences and Conventions

- Prefer `if`/`else` blocks over ternary operators for conditional logic.
- Prefer `@returns` (not `@return`) in TSDoc comments.
- Module-level private constants (e.g., lookup tables backing a set of public getters) use camelCase naming.
- Variable and constant names do not need to encode their type or role in a suffix (e.g., `Pattern`) unless doing so is necessary to clarify the data they hold; surrounding context is often sufficient (e.g., `regularExpressions.hexColor` versus the public `hexColorPattern` getter that exposes it).

#### Formatting Rules

- Keep formatting compatible with the repository ESLint configurations in `eslint.config.js.mjs` and `eslint.config.ts.mjs`.
- Do not introduce formatting-only tooling or workflow changes unless the task explicitly requires them.

### Documentation Comment Preferences

When writing or reviewing code, follow these documentation standards for maximum compatibility:

- **Use `@returns` instead of `@return`**: Always use `@returns` in documentation comments for compatibility with documentation generators.
- **Use `{@link ...}` syntax in `@see` tags**: Always use `{@link ClassName.method}` (or `{@link symbol}`) inside `@see` tags. Do not use bare `{ClassName.method}` without `@link`.
- **Use `@param {type} name` format**: Always specify parameter types with the format `@param {type} name` (e.g., `@param {string} hex`) rather than `@param name {type}`.
- **Always specify return types with `@returns`**: Include a type indicator in every `@returns` annotation (e.g., `@returns {boolean}`).
- **Document void returns with `@returns {void}`**: For methods that do not return a value, explicitly use `@returns {void}`.
- **Use `@returns` for getter methods**: Prefer `@returns` for getter documentation.
- **Document version with `@since`**: Add `@since` to all public/exported members.
- **Annotate abstract members with `@abstract`**: Use `@abstract` for all abstract classes, methods, and properties.
- **Annotate readonly members with `@readonly`**: Use `@readonly` for all readonly members.
- **Annotate private members with `@private`**: Use `@private` for all private members.
- **Annotate protected members with `@protected`**: Use `@protected` for all protected members.
- **Annotate overrides with `@override`**: Use `@override` for all methods that override parent class methods.
- **Enclose boolean values in backticks**: Always use backticks for `true` and `false` in documentation comments.
- **Use consistent tense and voice**: Write documentation in the present tense and active voice for clarity.
- **Document exceptions with `@throws`**: Use `@throws` to document any errors or exceptions a function may throw.
- **Document default parameter values**: Indicate default values for parameters in the `@param` annotation.
- **Document all exported symbols**: Ensure every exported class, function, interface, type, enum, and constant has a documentation comment.
- **Separate annotation groups with blank lines**: Add a blank line between groups of TSDoc annotations, unless consecutive tags do not include additional information, such as `@private`, `@protected`, `@public`, or `@override`.

**Annotation Order:**
Place annotations in the following order for consistency and readability:

1. `@remarks`
1. `@see`
1. `@param`
1. `@returns`
1. `@throws`
1. `@default`
1. `@example`
1. `@type`
1. `@readonly`
1. `@private`
1. `@protected`
1. `@public`
1. `@abstract`
1. `@override`
1. `@deprecated`
1. `@since`
1. `@category`

Include other relevant tags after the above, as appropriate for the context.

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

## Directory Structure

```
src/
  discriminator/          # Discriminated type-guard utilities and registry
  number/                 # Number utilities
  random/                 # Random number generation utilities
    seeded-random/        # Seeded random number generator utilities
    weighted-element/     # Weighted element selection utilities
  string/                 # String utilities
  index.ts                # Package entry point (re-exports all modules)
test/                     # Vitest test suites (mirrors src/ module structure)
  discriminator/          # Tests for the discriminator module
  number/                 # Tests for the number module
  random/                 # Tests for the random module
    seeded-random/        # Tests for the seeded-random module
    weighted-element/     # Tests for the weighted-element module
  string/                 # Tests for the string module
  utils/                  # Shared test fixtures and scenario helpers for use across test suites
    input/                # Shared test input fixtures
    test-case/            # Shared test-case helpers
      scenarios/          # Reusable test-case scenario definitions
docs/                     # GitHub Pages site content and manually maintained release documentation
.github/
  workflows/              # CI, publishing, documentation, and analysis workflows
_dist/                    # Build output - generated by tsdown (not committed)
_compiled/                # TypeScript outDir output - generated by tsc (not committed)
_coverage/                # Coverage output - generated by Vitest (not committed)
_doc/                     # Documentation output - generated by TypeDoc (not committed)
```

## Documentation and GitHub Pages

`README.md` and `docs/index.md` should stay in sync for shared content, but they are not expected to be identical.
Expected differences include Jekyll front matter, file-specific introductory or heading sections, footer or copyright text, and internal link differences.
Any addition, removal, or update to shared sections must be applied consistently to both files.

### TypeDoc Configuration

- API docs are generated with TypeDoc (`npm run docs`) using `typedoc.json`.
- TypeDoc entry points are intentionally pointed to module-level index files (e.g., `./src/number/index.ts`, `./src/random/index.ts`) rather than the root package entry point (e.g., `./src/index.ts`). This is done purposefully to maintain module-level organization in the generated documentation output. Do not change TypeDoc entry points to the root package entry point.

### Release Documentation

- Release documentation organized in `docs/releases/...` is maintained manually and not generated by any automated process.
- Release docs follow the directory structure: `docs/releases/v{major}.x/v{major}.{minor}.x/v{version-prefix}.x/{full-version}/doc/`, where `{version-prefix}` includes the major, minor, patch, and any pre-release type identifier (e.g., `v0.1.0-alpha` for versions like `v0.1.0-alpha.0`).

### Jekyll Build

The Jekyll build uses the `jekyll-relative-links` plugin (configured in `docs/_config.yml`), which automatically converts relative `.md` links in `docs/` markdown files to their rendered `.html` paths.
For example, `./portfolio-skills.md` in `docs/index.md` resolves to `portfolio-skills.html` on the published site.
Use `.md` relative links within `docs/` source files; the build process will convert them correctly.

## Portfolio Page Generation and Maintenance

- The portfolio skills page for this repository lives at `docs/portfolio-skills.md` and is published through the Jekyll site under `docs/`.
- Evidence links in `docs/portfolio-skills.md` should always point to the `main` branch, even when the page is updated from another branch.
- The guidance in this section applies only when `docs/portfolio-skills.md` is present or intentionally being created.

### Prompt Template

Use the following prompt template when generating or updating the `docs/portfolio-skills.md` page; for example, when a new project is started, when key dependencies or tooling change, or when the project's capabilities, functionality, or implementation evolve.

````markdown
You are generating/updating a technical portfolio page documenting a software project, template, starter, or implementation, following a specific evidence-based structure.

## Context

Project Name: [PROJECT_NAME]
Project Repository: [GITHUB_REPO_URL]
Target Ref for Evidence Links: main
Primary Language(s): [e.g., TypeScript, JavaScript, Python]
Primary Framework/Library: [e.g., Express.js, p5.js, React]
Runtime: [e.g., Node.js, Python 3.11+]
Key Technologies: [list 3-5 core tech choices]

## Structure Requirements

Generate a Markdown file with these sections in order:

1. **Front Matter** (Jekyll metadata):
   - title: "[PROJECT_NAME] - Demonstrated Portfolio Skills"
   - layout: post
   - date: [CREATION_DATE in YYYY-MM-DD]
   - modified_date: [TODAY_DATE in YYYY-MM-DD]
   - toc: true

2. **About This Page**
   - "This page is a technical record of the skills, tools, and engineering practices represented in the [PROJECT_NAME] project."
   
3. **Project Overview** (2–3 sentences)
   - What is this project and what does it help you build?
   - Link to the GitHub repository
   - Mention 2–3 key technologies

4. **At a Glance** (bulleted list)
   - Project Type
   - Primary Language
   - Primary Runtime
   - Primary Framework/Library (if applicable)
   - Rendering Library/Engine (if applicable)
   - Build Pipeline (if applicable)
   - Quality Controls (if applicable)
   - Automation (if applicable)
   - Dependency Automation (if applicable)
   - Security Analysis (if applicable)
   - Documentation Pattern (if applicable)

   Use consistent capitalization across similar projects, keep labels semantically precise, and keep tool mentions durable (avoid hardcoded versions, exact cadences, or similarly brittle operational details unless they are intentionally maintained).

5. **Skills and Tooling Inventory** (flat bulleted list with bold category labels, e.g., `- **Category:** [Tool](url), [Tool](url)`)
   - Languages
   - Runtime (or similar category)
   - Frameworks (or similar category)
   - Libraries (or similar category)
   - Testing
   - Build / Bundling
   - Code Quality
   - Documentation
   - Site Generation
   - Dependency Management
   - Versioning & Platform
   - Automation
   - Hosting & Deployment
   - Code Analysis / Security
   - Dependency Automation
   - Development Utilities
   - Environment Configuration (or similar category)
   - Development Environments
   - AI-Assisted Development

   Link each tool/language to its official documentation.
   Keep categories semantically precise: do not group unrelated concerns together (for example, CI automation, deployment/hosting, code analysis/security, and dependency automation should usually remain separate).
   Omit categories that do not apply to the project; add context-specific categories where appropriate.

6. **Capability Record** (bulleted list)
   - 5–10 bullets describing what this project demonstrates
   - Each bullet should connect implementation to engineering value
   - Use language like "...to improve [benefit]" or "...enabling [outcome]"
   - Avoid just listing tech names
   - Keep statements durable; avoid time-sensitive details

7. **Detailed Technical Notes** (subsections with evidence)
   - Begin with: "Each technical claim below is backed by a source link to the corresponding implementation or workflow configuration in the project repository."
   - Create 5–7 subsections, each with:
     - A descriptive heading (e.g., "Express app composition and middleware stack")
     - 1–2 claim sentences
     - An "Evidence:" section with direct GitHub links to source files
   - **Critical rule:** every claim must link to evidence that *directly* proves it
     - Evidence does not need to enumerate every implementation instance in the repository. A representative selection that successfully demonstrates the claim is sufficient
     - If claiming "output to directory X", link config/build files, not just example files
     - If claiming "TypeScript configuration", link `tsconfig.*`, ESLint config, or build config files, not just `.ts` source files
     - If describing current project behavior, prefer evidence that reflects the current runtime/configured implementation path, not only an illustrative or older example
     - If a claim spans multiple concerns, link relevant files needed to support it
   - Focus on implementation facts and engineering intent, not promotional phrasing

8. **Current Gaps / Future Improvements** (bulleted list)
   - 2–4 concise bullets describing what the project or template does NOT cover
   - Be honest about intentional scope limits
   - Include automation, testing, documentation, or deployment gaps where applicable
   - Avoid defensive language; treat gaps as engineering decisions or next-step opportunities

## Tone & Style Guidelines

- **Clarity:** Use precise technical language; avoid marketing speak
- **Evidence-first:** Every statement in "Detailed Technical Notes" must be traceable
- **Durability:** Generalize version/cadence claims unless you will actively maintain them
  - Good: "scheduled npm updates via Dependabot"
  - Avoid: "monthly npm updates on the 1st"
- **Balance:** Mix facts with engineering intent (why architecture choices matter)
- **Consistency:** Match capitalization, punctuation, and structure across similar portfolio and documentation pages
- **Limits:** Be clear about what the project intentionally does not include
- **Scope discipline:** Do not overstate maturity, completeness, or production-readiness unless directly supported by evidence

## Common Pitfalls to Avoid

- Claim/evidence mismatch (e.g., claiming workflow setup but only linking asset files)
- Evidence that is technically relevant but not representative of the current runtime/configured implementation
- Overstated scope (e.g., "full-stack" when really just frontend or backend)
- Time-sensitive details that will drift (hardcoded versions, exact cadences)
- Missing the "Current Gaps / Future Improvements" section
- Inconsistent tool terminology across pages (e.g., `CI/CD` vs `Automation`, `Code Analysis / Security`, `Dependency Automation`)
- Mixed inventory categories that blur automation, deployment, security, and dependency management
- Capability bullets that list technologies without explaining engineering value

## Output Format

Return the complete Markdown file ready to save as `docs/portfolio-skills.md` and publish. Ensure:
- All links use the full GitHub repo URL with `/blob/main/` path format for files
- Use `/tree/main/` for directory links when appropriate
- All code blocks and filenames use backticks
- Proper Markdown heading hierarchy (`##` for sections, `###` for subsections)
- No trailing whitespace; clean formatting
- The page reads as evidence-based, concise, and professional

## Update Mode (when `docs/portfolio-skills.md` already exists)

- Preserve any accurate, still-relevant sections and links that do not need changes
- Update only sections where repository evidence, tooling, or capabilities changed
- Keep front matter `date` from the original file; only update `modified_date`
- If prior claims cannot be supported by current evidence, rewrite or remove them
````

### How to Use This Template

1. **Customize the bracketed fields** at the top with your project's info:
   - `[PROJECT_NAME]` → actual name
   - `[GITHUB_REPO_URL]` → full URL
   - `[PRIMARY_LANGUAGE]` → language(s)
   - etc.

2. **Paste the entire prompt into Copilot** (or your IDE's inline AI assistant).

3. **Review the output** against this checklist:
   ```markdown
   - [ ] Section structure matches the portfolio page pattern
   - [ ] Overview is clear and not over-claiming scope
   - [ ] "At a Glance" is scannable and terminology is precise
   - [ ] Capability bullets explain technical value, not just tech names
   - [ ] Every technical claim has direct evidence links
   - [ ] Evidence is representative of the current implementation/configured behavior when relevant
   - [ ] Time-sensitive details are durable or intentionally maintained
   - [ ] Tooling/runtime/security wording is accurate, and inventory categories do not mix unrelated concerns
   - [ ] "Current Gaps / Future Improvements" is present and meaningful
   - [ ] Final read feels evidence-based, concise, and professional
   ```

4. **Iterate** if needed:
   - Ask Copilot to tighten claims that feel broader than the evidence
   - Ask Copilot to replace brittle details with more durable wording
   - Ask Copilot to split mixed inventory categories into more precise labels
   - Ask Copilot to add stronger evidence links where claims are currently under-supported

### Example Customization

If you were documenting a new project called `my-ml-starter`:

```text
Project Name: my-ml-starter
Project Repository: https://github.com/blwatkins/my-ml-starter
Primary Language(s): Python
Primary Framework/Library: PyTorch, Hugging Face Transformers
Runtime: Python 3.10+
Key Technologies: PyTorch, pre-trained models, Docker, GitHub Actions
```

Then paste the full template prompt with these values filled in.

## Portfolio Skills Page Review Instructions

Use the following standards for Copilot code review and any agentic Copilot sessions reviewing changes to `docs/portfolio-skills.md`.

### Reusable Summary for This Portfolio Page Pattern

These pages follow a strong, repeatable structure:

1. **Concise project framing**
2. **Scannable metadata ("At a Glance")**
3. **Skills and Tooling Inventory**
4. **Capability statements**
5. **Evidence-backed technical notes**
6. **Explicit current gaps/future improvements**

The core standard is: **every technical claim should be durable and traceable to source evidence**.

### What to Verify When Reviewing `docs/portfolio-skills.md`

#### 1) Structure and completeness

Ensure the page includes the required front matter and these sections (or equivalents):

- Required Front Matter (`title`, `layout`, `date`, `modified_date`)
- `Project Overview`
- `At a Glance`
- `Skills and Tooling Inventory`
- `Capability Record`
- `Detailed Technical Notes`
- `Current Gaps / Future Improvements`

Why: this keeps pages consistent and easy to compare across projects.

#### 2) Claim quality (accuracy + durability)

Check that claims are:

- **specific enough to be meaningful**
- **not brittle/time-sensitive unless intentionally maintained**
- **not over-claiming scope**

Good pattern:
- "scheduled updates", "multiple supported Node.js release lines"

Risky pattern:
- hardcoding exact versions/cadences unless you plan frequent updates

#### 3) Evidence alignment (most important review item)

For each claim in technical notes, verify linked evidence **directly supports** it. Evidence does not need to enumerate every implementation instance in the repository. A representative selection that successfully demonstrates the claim is sufficient.

Example rule:
- If claim says output path is `_dist/`, evidence should include configuration files (e.g. `tsdown.config.ts`, `webpack.config.mjs`) or build scripts (`package.json`), not only asset files.

Also check whether the linked evidence is **representative of the project's current implementation path** when the page describes active behavior, not just an older or illustrative example.

This is a common high-impact review issue.

#### 4) Portfolio tone calibration

Look for balance between:

- implementation facts ("what exists")
- engineering intent ("why it helps")
- honest limitations ("what's missing")

Avoid:
- overly promotional language
- absolute claims not backed by links

#### 5) Consistency across pages

When reviewing a new page, compare with existing template pages for:

- heading style/casing
- label style in `At a Glance`
- label style and format in `Skills and Tooling Inventory` (flat bulleted list with bold category labels)
- tense and sentence style
- bullet punctuation consistency
- naming conventions (`webpack` vs `Webpack`, etc.)

Consistency boosts professionalism at portfolio scale.

#### 6) Gaps section quality

A strong `Current Gaps / Future Improvements` section is:

- concise (2–4 bullets)
- concrete
- non-defensive
- aligned with evidence

Common high-value bullets:
- tests not yet implemented
- intentionally minimal architecture scope
- deployment/docs not yet covered (if true)

### Quick Review Checklist

Reuse the earlier template usage checklist as the canonical baseline review list. Use this section only for additional review-specific checks:

```markdown
- [ ] Evidence links still support the final wording after edits
- [ ] Any time-sensitive details are durable or intentionally maintained
- [ ] Terminology, casing, and punctuation are consistent with other portfolio pages
- [ ] Final read feels evidence-based, concise, and professional
```

### Common Pitfalls to Catch Early

- Claim/evidence mismatch (most frequent)
- Hardcoded version/cadence details that will drift
- "CI/CD" wording when no deployment pipeline is shown
- Overstated capability language ("production-ready" without context)
- Missing limitations section
- Evidence is technically relevant but not representative of the current runtime/configured implementation
- Mixed category labels in tooling inventory that blur automation, deployment, security, and dependency management

### One-Sentence Review Standard

When you review the next page, use this rule:

**"If a reader challenges any technical statement, can I point to an exact linked file that proves it, and is the wording likely to stay accurate over time?"**

If yes, the page is likely in good shape.
