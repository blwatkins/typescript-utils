# Copilot Instructions

## Project Overview

- Package name: `@brittni/utils`
- Language: TypeScript (ESM)
- Current utilities are organized by domain under `src/` (for example, `src/string` and `src/number`) and re-exported through `src/index.ts`.
- Tests are located under `test/` and run with Vitest.

## Development and Validation

- Install dependencies with `npm ci`.
- Run lint checks with `npm run lint:all`.
- Build with `npm run build`.
- Run tests with `npm run test`.

## Documentation and GitHub Pages

- API docs are generated with TypeDoc (`npm run docs`) using `typedoc.json`.
- Package documentation files in the GitHub Pages versioned directory structure under `docs/releases/...` are generated and updated manually.
- Do not assume any automated workflow or pipeline updates package documentation files in `docs/releases/...`.

## Coding Preferences

- Prefer `if`/`else` blocks over ternary operators for conditional logic.
- Prefer `@returns` (not `@return`) in TSDoc comments.
