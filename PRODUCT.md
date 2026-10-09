# Relation Sync

## Intent

Maintain inverse frontmatter links between existing Obsidian notes while preserving unrelated properties and note bodies. The first successful use should be a preview on two notes, followed by explicit activation of automatic sync.

## Supported languages and roles

English and Italian are the supported interface languages and preset catalogs. Both property vocabularies are available independently of the interface language. Synonyms identify the same role; generated inverses use neutral canonical names and never infer a person's gender. Existing synonyms are preserved.

Italian kinship names with ambiguous meanings require explicit roles, such as `nipoti di nonni` and `nipoti di zii`. Legacy source-role phrases ending in `of` or `di` retain their direction through aliases.

## Safety and verification

New installations start paused. Manual sync previews missing inverses and preserves existing relations. Pair editing validates a draft before saving. Settings migration retires exact stock presets from other languages while preserving custom mappings and safety settings. Undo is limited to the latest link-write batch in the current plugin session; renames are outside that batch.

Tests cover the sync engine, presets, settings migration, parsing and frontmatter operations. Visual checks and representative Obsidian vault flows remain separate verification gates. `plans/usability-report-2026-10-08.md` records the earlier audit against commit `249eb6a`; its findings describe that snapshot.
