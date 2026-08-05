# CLAUDE.md

Guidance for Claude Code (and other AI assistants) when working in this repository.

## Canonical Instructions

The detailed, authoritative conventions for this project live in [`.github/copilot-instructions.md`](./.github/copilot-instructions.md).
Read that file before making any change to this repository, including documentation-only changes.
This document is a map of what lives there; it does not repeat its rules.

## Keep These Two Files in Sync

This repository maintains both `CLAUDE.md` and `.github/copilot-instructions.md`.
`CLAUDE.md` is a map of where guidance lives; `.github/copilot-instructions.md` holds the guidance itself.
Add or change a convention in `.github/copilot-instructions.md`.
A new convention under an existing section requires no change here.
Update `CLAUDE.md` when the map changes: a new or renamed section in `.github/copilot-instructions.md` that this file links to, or a change to the project summary, npm commands, generated output directories, or the review step list.

## Project Summary

A toolkit of general-purpose TypeScript and JavaScript utilities, including validation, mathematical operations, random number generation, random selection, and type-safe guards.

## npm Commands

See the ["npm Scripts" section of `.github/copilot-instructions.md`](./.github/copilot-instructions.md#npm-scripts) for the full list of available commands.

## Generated Output Directories (not committed)

`_dist/` (build), `_compiled/` (TypeScript `outDir`), `_coverage/` (coverage), and `_doc/` (TypeDoc) are generated and gitignored.

## Documentation Notes

- `README.md` / `docs/index.md` sync, Markdown formatting, TypeDoc, and the Jekyll build are covered in the ["Documentation and GitHub Pages"](./.github/copilot-instructions.md#documentation-and-github-pages) and ["Markdown Formatting"](./.github/copilot-instructions.md#markdown-formatting) sections of `.github/copilot-instructions.md`.
- The portfolio skills page (`docs/portfolio-skills.md`) and its generation/review workflow are described in the ["Portfolio Page Generation and Maintenance"](./.github/copilot-instructions.md#portfolio-page-generation-and-maintenance) section.
- Release documentation under `docs/releases/` is maintained manually.

## Pre-Merge and Release Review

Before merging a branch, complete these review steps (full details in the ["Pre-Merge and Release Review" section of `.github/copilot-instructions.md`](./.github/copilot-instructions.md#pre-merge-and-release-review)):

1. **Validation** — `npm ci`, then `npm run validate` (lint, docs, build, test) passes cleanly
2. **Portfolio skills page** — review `docs/portfolio-skills.md` for accuracy and currency, per the linked section
3. **Instruction file sync** — `CLAUDE.md` and `copilot-instructions.md` are consistent and current
4. **`package.json` keywords** — reflect current utility domains and features
5. **GitHub repository topics** — align with `package.json` keywords
6. **Branch code review** — convention compliance, code quality, and cross-source consistency, per the linked section
7. **Release readiness** (for merges to `main`) — version bump, deprecation removals, release docs, TypeDoc entry points, publish workflow
