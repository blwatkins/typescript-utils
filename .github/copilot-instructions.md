# Copilot Instructions

## Project Overview

This repository contains `@blwat/utils`, a growing ESM-first TypeScript utility package for reusable number, random, and string helpers.

The package source is maintained in `src/`, bundled to `_dist/` with `tsdown`, and documented through TypeDoc output plus manually maintained GitHub Pages release docs under `docs/`.

## Tech Stack

- TypeScript source compiled and bundled for ESM distribution
- Node.js runtime support aligned with `package.json` engines (`^22.22.0 || >=24`)
- `tsdown` for package builds and declaration output
- `Vitest` for unit testing
- `ESLint` for JavaScript and TypeScript linting
- `TypeDoc` for API documentation generation
- Jekyll-based `docs/` site content for published project and release documentation

## Development and Validation

Primary development work happens in `src/` and corresponding tests under `test/`.

Repository validation is centered on the existing npm workflow: install with `npm ci`, lint with `npm run lint:all`, build with `npm run build`, and run the test suite with `npm run test`.

### Development Status

The package is currently in an alpha release line and exports grouped utility modules from `src/number`, `src/random`, and `src/string`.

The random module currently includes deterministic seeded-random utilities under `src/random/seeded-random`, with matching tests and release documentation maintained alongside the source updates.

### Validation Steps

- Install dependencies with `npm ci`.
- Run lint checks with `npm run lint:all`.
- Build with `npm run build`.
- Run tests with `npm run test`.

## npm Scripts

- `npm run lint:js` — lint repository files with `eslint.config.js.mjs`
- `npm run lint:ts` — lint repository files with `eslint.config.ts.mjs`
- `npm run lint:all` — run both lint configurations
- `npm run build` — bundle the package and emit declaration files with `tsdown`
- `npm run test` — run the Vitest suite once
- `npm run test:watch` — run Vitest in watch mode
- `npm run test:ui` — run the Vitest UI
- `npm run test:coverage` — run Vitest with V8 coverage reporting
- `npm run docs` — generate API documentation with TypeDoc
- `npm run prepack` — build the package before packing or publishing

## GitHub Actions CI

| Workflow file | Name | Trigger | Description |
|---|---|---|---|
| `codeql.yml` | CodeQL | Push/PR to `main`, monthly schedule | Runs CodeQL security analysis for `actions`, `javascript-typescript`, and `ruby` |
| `gh-pages-jekyll.yml` | Deploy GitHub Pages with Jekyll | Push to `main`, manual | Builds and deploys the `docs/` directory to GitHub Pages |
| `npm-publish.yml` | npm Package Publish | Manual (`workflow_dispatch`) | Lints, builds, tests, then publishes to npm; requires `release_tag` input and uses `id-token: write` trusted publishing permissions |
| `npm-test.yml` | npm Lint, Build, and Test | Push/PR to `main`, manual | Runs lint, build, and tests across supported Node.js versions |

## Security and Dependency Management

- GitHub Actions runs CodeQL analysis for `actions`, `javascript-typescript`, and `ruby`.
- Dependabot is configured for monthly updates to npm dependencies, GitHub Actions workflows, and Bundler dependencies under `docs/`.
- The npm publish workflow uses npm Trusted Publishing with GitHub OIDC (`id-token: write`) instead of a committed registry token.
- The package currently declares no runtime dependencies in `package.json`; the toolchain is maintained through `devDependencies`.

## Development Guidelines

Keep changes scoped to existing files unless a task explicitly requires scaffolding project code.

### TypeScript Conventions

- The package is ESM-only (`"type": "module"`), so keep imports/exports compatible with Node.js ESM resolution.
- Public exports flow through module index files such as `src/index.ts`, `src/number/index.ts`, `src/random/index.ts`, and `src/string/index.ts`.
- API documentation entry points stay module-scoped (`src/number/index.ts`, `src/random/index.ts`, `src/string/index.ts`) rather than pointing TypeDoc at the root package entry point.

#### tsdown Build Output

This project uses `tsdown` to bundle and emit declaration files. When the output format is `esm`, tsdown emits format-specific file extensions: `.mjs` for the bundle and `.d.mts` for the declaration file, regardless of whether the source files use the `.ts` or `.mts` extension. The `types`, `module`, `main`, and `exports` fields in `package.json` should always reference these `.mjs`/`.d.mts` paths (e.g., `./_dist/index.mjs` and `./_dist/index.d.mts`).

#### Static Classes

Static utility classes must:
- Have a `private constructor()` that throws an `Error` to prevent instantiation
- Include a JSDoc `@throws` on the constructor documenting the instantiation error
- Expose public static getters or methods only

## Code Style

#### Code Style Preferences and Conventions
- Prefer `if`/`else` blocks over ternary operators for conditional logic.
- Prefer `@returns` (not `@return`) in TSDoc comments.

#### Formatting Rules

- Keep formatting compatible with the repository ESLint configurations in `eslint.config.js.mjs` and `eslint.config.ts.mjs`.
- Do not introduce formatting-only tooling or workflow changes unless the task explicitly requires them.

### Documentation Comment Preferences

When writing or reviewing code, follow these documentation standards for maximum compatibility:

- **Use `@returns` instead of `@return`**: Always use `@returns` in documentation comments for compatibility with documentation generators.
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
- **Separate annotation groups with blank lines**: Add a blank line between groups of TSDoc annotations, unless consecutive tags do not include additional information, such as `@private`, `@protected`, `@public`, `@async`, or `@override`.

**Annotation Order:**
Place annotations in the following order for consistency and readability:

1. `@remarks`
1. `@see`
1. `@param`
1. `@returns`
1. `@throws`
1. `@default`
1. `@example`
1. `@readonly`
1. `@private`
1. `@protected`
1. `@public`
1. `@abstract`
1. `@override`
1. `@deprecated`
1. `@since`
1. `@category`

Include other relevant tags (such as `@template`, `@type`) after the above, as appropriate for the context.

### File Headers

All source files must include the MIT License copyright header at the top:

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

- `src/` — package source code
- `test/` — Vitest test suites and shared test inputs/scenarios
- `docs/` — GitHub Pages site content and manually maintained release documentation
- `_dist/` — build output generated by `npm run build`
- `_doc/` — TypeDoc output generated by `npm run docs`
- `.github/workflows/` — CI, publishing, documentation, and analysis workflows

## Documentation and GitHub Pages

- `README.md` and `docs/index.md` should stay in sync for shared content, but they are not expected to be identical. Expected differences include Jekyll front matter, file-specific introductory or heading sections, footer or copyright text, and internal link differences. Any addition, removal, or update to shared sections must be applied consistently to both files.

### TypeDoc Configuration

- API docs are generated with TypeDoc (`npm run docs`) using `typedoc.json`.
- TypeDoc entry points are intentionally pointed to module-level index files (e.g., `./src/hello-world/index.ts`) rather than the root package entry point (e.g., `./src/index.ts`). This is done purposefully to maintain module-level organization in the generated documentation output. Do not change TypeDoc entry points to the root package entry point.

### Release Documentation

- Release documentation organized in `docs/releases/...` is maintained manually and not generated by any automated process.
- Release docs follow the directory structure: `docs/releases/v{major}.x/v{major}.{minor}.x/v{version-prefix}.x/{full-version}/doc/`, where `{version-prefix}` includes the major, minor, patch, and any pre-release type identifier (e.g., `v0.1.0-alpha` for versions like `v0.1.0-alpha.0`).

### Portfolio Skills Page
- The portfolio skills page for this repository lives at `docs/portfolio-skills.md` and is published through the Jekyll site under `docs/`.

### Jekyll Build
- The Jekyll build uses the `jekyll-relative-links` plugin (configured in `docs/_config.yml`), which automatically converts relative `.md` links in `docs/` markdown files to their rendered `.html` paths. For example, `./portfolio-skills.md` in `docs/index.md` resolves to `portfolio-skills.html` on the published site. Use `.md` relative links within `docs/` source files; the build process will convert them correctly.

## Portfolio Page Generation and Maintenance

The guidance in this section applies only when `docs/portfolio-skills.md` is present or intentionally being created.

Use the following prompt template when generating or updating the `docs/portfolio-skills.md` page — for example, when a new project is started, when key dependencies or tooling change, or when the project's capabilities, functionality, or implementation evolve.

### Prompt Template

````markdown
You are generating/updating a technical portfolio page documenting a software project, template, starter, or implementation, following a specific evidence-based structure.

## Context

Project Name: [PROJECT_NAME]
Project Repository: [GITHUB_REPO_URL]
Target Ref for Evidence Links: [TARGET_REF, e.g., main or the active branch]
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

5. **Skills and Tooling Inventory** (categorized lists)
   - Languages
   - Runtime & Frameworks (or similar category)
   - Key libraries and middleware
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
   - Environment Management
   - Development Environments
   - AI-Assisted Development

   Link each tool/language to its official documentation.
   Keep categories semantically precise: do not group unrelated concerns together (for example, CI automation, deployment/hosting, code analysis/security, and dependency automation should usually remain separate).

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
     - If claiming "output to directory X", link config/build files, not just example files
     - If claiming "TypeScript configuration", link `tsconfig.*`, ESLint config, or build config files, not just `.ts` source files
     - If describing current project behavior, prefer evidence that reflects the current runtime/configured implementation path, not only an illustrative or older example
     - If a claim spans multiple concerns, link all relevant files needed to support it
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
- All links use the full GitHub repo URL with `/blob/[TARGET_REF]/` path format for files
- Use `/tree/[TARGET_REF]/` for directory links when appropriate
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
   - `[TARGET_REF]` → `main` or the branch/ref you want evidence links to point to
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

For each claim in technical notes, verify linked evidence **directly supports** it.

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
