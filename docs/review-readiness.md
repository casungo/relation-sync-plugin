# Check before publishing

Run from a clean checkout with the committed lockfile:

```sh
npm ci
npm run check
```

The same command runs in CI and in the release workflow. It stops on any lint warning, any known dependency vulnerability at any severity, a failed test, inconsistent release metadata, or a production build that changes when rebuilt.

The ESLint configuration uses the official Obsidian recommended configuration, including its type-aware rules. Only development scripts and test doubles use Node APIs. Plugin code remains subject to the mobile API checks. Tests and scripts use the same naming patterns that the directory scanner excludes.

## Checks and evidence

| Directory check | Repository verification |
| --- | --- |
| Manifest and minimum API version | Official manifest and API lint rules, TypeScript, and version metadata checks |
| Source code warnings | Official ESLint configuration with `--max-warnings 0` |
| Dependency advisories | `npm audit --audit-level=low`, including development dependencies |
| Build verification | Production build followed by a second build; SHA-256 digests must match |
| Release provenance | Attestations for `main.js`, `manifest.json`, and `styles.css`, verified before release publication |
| Published asset integrity | Download the draft assets and compare every byte against the attested local files |
| Network patterns, behavior recommendations, and obfuscation | The directory's preview scan; ESLint and tests cannot reproduce the entire hosted scanner |

The workflow validates that the tag exactly matches `manifest.json` and `package.json`, and that `versions.json` records the current minimum app version. Tags must have three numeric components with no `v` prefix.

A release is first created as a draft. If attestation or asset verification fails, the workflow stops without publishing it. Inspect the failed run and any remaining draft before retrying; do not move an existing published tag.

## Preview the hosted review

Before tagging a release, use the entry's **Review branch** action on the Obsidian Community management page. Enter the exact branch or commit SHA you intend to release, then select **Run preview scan**. Address reported errors and warnings and repeat the scan after changing the source. A local pass does not mean the hosted review passed.

The preview scan checks source before publication. Release assets and their attestations are verified by the workflow and then scanned by the directory after publication. The hosted scanner has no documented local command or API covering all review sections.

## Settings compatibility

The settings tab implements both paths described by the official migration guide:

- Obsidian 1.13.0 and later uses `getSettingDefinitions()` for rendering and search indexing.
- Earlier supported versions use `display()`.
- Refreshes call `update()` only behind `requireApiVersion("1.13.0")`.
- Custom controls save through the plugin's `saveSettings()` hook so the sync engine and open relation panels receive changes.

Tests cover search metadata, persistence, and refresh routing. Before a release that changes settings rendering, also check both Obsidian paths in a real vault. Verify that settings are searchable on 1.13+, changes persist after reload, and the relation editor still filters, adds, edits, and removes pairs.

## Behavior recommendations

The plugin enumerates Markdown notes to snapshot relations, plan a vault-wide sync, and update links after renames. Excluded notes are skipped by the sync engine. Vault enumeration is inherent to these functions; its presence is a recommendation to understand access, not an error to conceal.

The plugin writes to the clipboard only when the user selects the report's copy action. It never reads the clipboard. Relation Sync makes no network requests. The local dependency audit concerns the installed build tools and type packages too; Obsidian itself supplies its own runtime libraries.

## Official references

- [Review checks and local lint setup](https://docs.obsidian.md/community-directory/faq)
- [Failed reviews and preview scans](https://docs.obsidian.md/community-directory/manage-entry)
- [Official ESLint configuration](https://github.com/obsidianmd/eslint-plugin)
- [Declarative settings and support for older Obsidian versions](https://docs.obsidian.md/plugins/guides/migrate-declarative-settings)
