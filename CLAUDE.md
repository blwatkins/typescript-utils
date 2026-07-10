# CLAUDE.md

Guidance for Claude Code (and other AI assistants) when working in this repository.

## Canonical Instructions

The detailed, authoritative conventions for this project live in [`.github/copilot-instructions.md`](./.github/copilot-instructions.md); read that file first.
This document is a concise map; `.github/copilot-instructions.md` is the source of truth.

## Keep These Two Files in Sync

This repository maintains both `CLAUDE.md` and `.github/copilot-instructions.md`.
When you update guidance in one file that also applies to the other, mirror the change so the two stay consistent.
Updates to `CLAUDE.md` should be reflected, when appropriate, in `.github/copilot-instructions.md`, and vice versa.

## Project Summary

A growing toolkit of reusable TypeScript and JavaScript utilities for numbers, strings, random number generation, and discriminator type-guard helpers, published to npm.

## Common Commands

- `npm ci` — install dependencies from the lockfile.
- `npm run lint:all` — run both the JavaScript and TypeScript ESLint configurations.
- `npm run build` — bundle the package to `_dist/` with tsdown.
- `npm test` — run the Vitest suite once.
- `npm run test:coverage` — run tests with V8 coverage (output to `_coverage/`).
- `npm run docs` — generate TypeDoc API documentation to `_doc/`.

## Generated Output Directories (not committed)

`_dist/` (build), `_compiled/` (TypeScript `outDir`), `_coverage/` (coverage), and `_doc/` (TypeDoc) are generated and gitignored.

## Documentation Notes

- Keep shared content between `README.md` and `docs/index.md` consistent; expected differences
  (front matter, headings, footer/links) are documented in `.github/copilot-instructions.md`.
- The portfolio skills page (`docs/portfolio-skills.md`) and its generation/review workflow are
  described in the "Portfolio Page Generation and Maintenance" section of
  `.github/copilot-instructions.md`.
- Release documentation under `docs/releases/` is maintained manually.

## Pre-Merge and Release Review

Before merging a branch, complete these review steps (full details in the ["Pre-Merge and Release Review" section of `.github/copilot-instructions.md`](./.github/copilot-instructions.md#pre-merge-and-release-review)):

1. **Validation** — `npm ci`, `npm run lint:all`, `npm run build`, `npm test` all pass
2. **Portfolio skills page** — review `docs/portfolio-skills.md` for accuracy; update `modified_date` if content changes
3. **Instruction file sync** — `CLAUDE.md` and `copilot-instructions.md` are consistent and current
4. **`package.json` keywords** — reflect current utility domains and features
5. **GitHub repository topics** — align with `package.json` keywords
6. **Branch code review** — convention compliance (static class pattern, JSDoc completeness, copyright headers, README/docs sync, test coverage), code quality (correctness, API consistency, efficiency, backward compatibility, reuse/DRY, runtime safety), and consistency (cross-source consistency across code/comments/docs, implicit pattern detection with maintainer notification)
7. **Release readiness** (for merges to `main`) — version bump, release docs, TypeDoc entry points, publish workflow
