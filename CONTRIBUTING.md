# Contributing

Thanks for your interest in improving Relation Sync. This guide covers the expected workflow for issues, pull requests, and local development.

## Reporting Issues

Before opening an issue, check whether a similar issue already exists. When reporting a bug, include:

- Obsidian version
- Relation Sync version
- Operating system
- A minimal frontmatter example that reproduces the problem
- What you expected to happen and what happened instead

Avoid sharing private vault content. Reduced examples with placeholder note names are best.

## Development Setup

1. Clone the repository.
2. Run `npm ci`.
3. Run `npm run dev` while developing.
4. Run `npm run check` before submitting changes or preparing a release. This runs lint with zero warnings, audits dependencies, runs tests, and verifies release metadata and build reproducibility.

The source code is in `src/`. Obsidian loads the built plugin from `main.js`.

## Pull Requests

Keep pull requests focused on one fix or feature. For sync behavior changes, describe the frontmatter cases you tested, especially:

- single relation value
- multiple relation values
- removing a relation
- renamed or moved target notes
- reciprocal relation pairs
- missing or newly created target frontmatter

The sync engine should avoid unnecessary frontmatter churn. Changes should preserve unrelated note content, field order where practical, and existing relation values that are outside the requested behavior.

## Localization

User-facing copy should be added to the locale system rather than hard-coded. When adding or changing settings text, notices, labels, or descriptions, update the locale types and relevant files in `src/locales/`.

## Release Changes

Do not hard-code current version numbers in documentation. Version-specific changes belong in `manifest.json`, `versions.json`, package metadata, changelogs, or release notes.

Before publishing, follow [Check before publishing](docs/review-readiness.md), including the hosted Review branch preview and Obsidian settings checks. CI and the release workflow enforce the local checks. The release workflow verifies attestations and downloaded draft assets before publishing.
