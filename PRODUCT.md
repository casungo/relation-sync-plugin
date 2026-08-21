# PRD — Relation Sync for Obsidian

Audit date: 2026-08-12
Status: released Obsidian plugin; compatibility evidence from current vaults is not measured here.

## Intent

- Target users: Obsidian users who keep related notes in YAML frontmatter and want inverse links maintained safely.
- Core job: define relation pairs, synchronize existing notes bidirectionally, preview changes, and undo the latest batch without hand-editing every backlink.
- Non-goals: modifying note bodies, inventing missing notes, cloud vault synchronization, or a generic graph database.

## Current maturity

### Shipped or verified in the repository

Version `1.1.6` documents automatic inverse sync, 50+ defaults, custom pairs, single/array values, bulk sync, eight locales, searchable settings, first-run backup/preview/log, pause behavior, and in-memory undo. Tests, lint, and build scripts are present.

### Real-use evidence

The plugin repository, manifest, release metadata, and behavior tests are present. No current Obsidian version/vault compatibility session was run, so real-user safety and upgrade behavior remain unverified.

## Work state

- Completed: core relation model, conservative existing-note boundaries, settings, bulk sync, and release path.
- Active: compatibility maintenance and feedback from real vaults.
- Blocked: no repository blocker observed; current Obsidian API/vault diversity needs evidence.
- Frozen/undecided: adding more default relation pairs is lower priority than safe sync/undo compatibility.

## Next action / owner decision

Collect compatibility reports from current Obsidian versions and representative vaults, prioritizing sync/preview/undo behavior over more defaults.

## Anti-slop audit

### Text

Finding: the README leads with generic marketing adjectives and emoji-heavy labels: “powerful,” “Stop manually,” “Extensive Default Library,” and “Modern Settings UI.” Evidence: [README.md](README.md#L1-L18). Impact: weakens technical credibility and hides the safety model beneath promotional language. Confidence: 90%. Suggested remediation: replace the claims with factual behavior and keep the existing safe first-run/undo explanation as the lead.

### Code

No confirmed anti-slop code defect at the threshold. The plugin’s existing-note and undo boundaries are purposeful.

### Design

Not applicable to a verified browser UI; settings UI is implemented in the plugin but was not visually audited in a running Obsidian host.

## Evidence sources

- [README.md](README.md)
- [AGENTS.md](AGENTS.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)
- `main.js`, `styles.css`, `data.json`, `test/` or test scripts, and `manifest.json`
