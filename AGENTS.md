# AGENTS.md

## Project Overview

This repository contains an Obsidian community plugin that keeps inverse YAML frontmatter relations synchronized across notes. Users define relation pairs, such as a forward field and its inverse field, and the plugin updates the related note so both sides stay consistent.

The project is a TypeScript-based Obsidian plugin. Source code lives in `src/`, while the built plugin entrypoint is emitted as `main.js` for Obsidian to load.

## Core Concepts

- Relations are represented as frontmatter fields that point to other notes.
- Each configured relation can have an inverse relation.
- The sync engine updates target notes when a source note relation changes.
- The plugin must preserve user note content and avoid unnecessary frontmatter churn.
- Settings and localization are part of the user-facing surface, so copy changes should consider all supported locales.

## Important Files

- `src/main.ts`: plugin lifecycle, command registration, and integration wiring.
- `src/sync-engine.ts`: relation synchronization behavior.
- `src/settings-tab.ts`: settings UI and user configuration controls.
- `src/relation-map.ts`: default relation definitions and mapping helpers.
- `src/utils.ts`: shared parsing and formatting helpers.
- `src/types.ts`: shared TypeScript types.
- `src/locales/`: localized strings and locale wiring.
- `manifest.json`: Obsidian plugin manifest.
- `styles.css`: plugin UI styles.
- `esbuild.config.mjs`: build configuration.
- `version-bump.mjs`: release version helper.

## Development Commands

- `npm run lint`: run ESLint.
- `npm run build`: type-check and build the production plugin bundle.
- `npm run dev`: run the esbuild watcher for local development.

Run lint and build after behavior changes. For UI-only or documentation-only changes, use judgment, but prefer at least lint when TypeScript or JavaScript files changed.

## Coding Guidelines

- Follow existing TypeScript style and module boundaries.
- Keep sync behavior conservative: avoid changing unrelated frontmatter fields, formatting, or note content.
- Prefer Obsidian APIs and existing helper functions over ad hoc file parsing.
- Treat frontmatter values carefully because relations may be single values or arrays.
- Keep relation updates idempotent so repeated syncs do not duplicate links or reorder data unnecessarily.
- Avoid broad refactors unless they directly support the requested change.
- When adding user-facing strings, update locale types and relevant locale files together.

## Testing And Verification

This project primarily verifies changes through TypeScript checking, linting, and production build output. For behavior that touches note synchronization, also consider manual testing in an Obsidian vault with representative frontmatter cases:

- single relation value
- multiple relation values
- removing a relation
- renaming or changing a target
- reciprocal relation pairs
- missing or newly created target frontmatter

## Release Notes

Do not hard-code current version numbers or release state in this file. Version-specific details belong in `manifest.json`, `versions.json`, package metadata, changelogs, or release notes.

