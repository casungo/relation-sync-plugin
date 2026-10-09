# Relation Sync for Obsidian

Relation Sync maintains inverse links between note properties. Add a parent to one note, and the plugin adds the child to the parent's note. It changes frontmatter, never note bodies, and does not create missing notes.

The interface and presets support **English and Italian**. Both sets of property names are available independently of Obsidian's interface language. New installations start with automatic sync paused.

[Guida in italiano](README.it.md)

## First use

1. Create two Markdown notes, `Alex` and `Morgan`.
2. In `Alex`, add a property named `mother` with a link to Morgan. In Obsidian's Properties editor, enter `[[Morgan]]` as text or a list item. In YAML, quote the link:

   ```yaml
   ---
   mother: "[[Morgan]]"
   ---
   ```

3. Open **Settings → Relation Sync → Preview current note**, or use the command of the same name. The preview shows which note and property will change and lists missing or excluded targets.
4. Apply the change. Morgan now contains:

   ```yaml
   ---
   child: "[[Alex]]"
   ---
   ```

5. Check the result, then enable **Automatic sync** to handle future edits. Use the manual preview to reconcile links that were already present before enabling the plugin or while it was paused.

Back up or version your vault before applying changes across many notes. **Vault tools and presets → Sync entire vault** previews missing inverses across the vault. It preserves existing relations. Running it again on unchanged, consistent notes produces no changes.

## Neutral inverses and synonyms

Plain property names describe the role of the **linked person**. For example, `mother` on Alex's note points to Alex's mother. Synonyms do not determine the inverse person's gender.

| Property you write | Inverse added to the linked note |
| --- | --- |
| `parent`, `mother`, `mom`, `mum`, `father`, `dad` | `child` |
| `child`, `children`, `son`, `daughter` | `parent` |
| `genitore`, `madre`, `mamma`, `padre`, `papà`, `papa`, `babbo` | `figli` |
| `figli`, `figlio`, `figlia`, `figlie` | `genitore` |
| `brother`, `sister` | `sibling` |
| `fratello`, `sorella` | `fratelli e sorelle` |
| `wife`, `husband` | `spouse` |
| `moglie`, `marito` | `coniuge` |

Existing inverse synonyms are recognized and preserved. If Luca already links to Maria under `mamma`, adding `figli: "[[Luca]]"` on Maria does not add a redundant `genitore` property on Luca.

When an additional link needs a new inverse, the plugin writes the main neutral name. It never adds a father to a `mother` property that already points to someone else.

Older phrases ending in `of` or `di` describe the **source person's role**, so their direction differs from plain names. `Child of` and `Figlio di` point to a parent; `Mother of` and `Madre di` point to a child. These forms remain recognized through aliases.

Italian `nipote` can mean grandchild or niece/nephew. Use explicit properties `nipoti di nonni` or `nipoti di zii`. The legacy `Nipote di` form retains its former grandparent direction; the plugin does not infer kinship from names or note contents.

## Custom pairs

Choose **Add pair**, enter the source property and inverse property, and optionally add comma-separated synonyms for each side. A pair is bidirectional, so you need to define it once. Both sides may have the same name for symmetric relations such as `friend ↔ friend`.

The editor validates a draft before saving it. An incomplete draft does not interrupt existing synchronization. Conflicting enabled names or aliases cannot be saved or enabled through the editor. Imports are also validated before they are accepted.

## Values and changes

Use quoted wiki links, including in YAML lists:

```yaml
---
parent:
  - "[[People/Morgan]]"
  - "[[Taylor|Tay]]"
---
```

Single values and lists work. Aliases and headings in links are supported. Unrelated frontmatter and non-string list items are preserved. Removing or replacing a relation during automatic sync removes the corresponding inverse. Renaming a synonym while keeping the same target preserves the relation.

Excluded paths apply to both source and destination notes. Targets must be existing Markdown notes. When a previously missing target becomes indexed while automatic sync is active, its inverse is retried. The current-note preview can also be used to retry manually.

## Inspect and undo

The **Relations** panel shows the active note's links, the sync state, and whether inverses are present, missing or excluded. It offers links to configuration and the current-note preview.

**Recent sync log** contains up to 200 changes in the current plugin session, with full note paths. **Undo last sync** previews the latest recorded write batch before reversing it. A later batch with changes replaces the undo batch. Restarting or disabling the plugin clears the in-memory history.

Undo reverses the plugin's recorded link changes; it is not a vault backup or a full document history. Renaming notes is outside this undo. Relation Sync's rename handler updates only configured relation fields; Obsidian may separately update links according to its own settings.

**Reset relation pairs** replaces the pairs while preserving automatic sync and excluded paths. It does not remove relation properties from notes.

## Upgrading from the eight-language presets

The plugin replaces unmodified bundled presets with the English and Italian catalog. Exact old presets in other languages are removed from settings. Custom mappings, automatic sync and exclusions are preserved; note content is never rewritten by this migration.

New role groups are enabled when their legacy names were enabled. A new preset that conflicts with a custom mapping stays off. Review the updated catalog after the migration notice: grouped synonyms now share one switch, rather than separate switches for each spelling. Edited pairs that no longer match an old preset remain custom pairs, regardless of their language.

## Install

In Obsidian, open **Settings → Community plugins → Browse**, search for `Relation Sync`, install and enable it.

For manual installation, copy `main.js`, `manifest.json` and `styles.css` from a release into `.obsidian/plugins/relation-sync/` in your vault, then reload Obsidian and enable the plugin.

## Development

```sh
npm install
npm test
npm run lint
npm run build
```

`npm run dev` watches the TypeScript source. Tests cover neutral aliases, inverse removals, target changes, bulk idempotence, exclusions, missing targets, cancellation, undo and settings migration. Browser and real-vault verification are separate from these tests.

[Report an issue](https://github.com/casungo/relation-sync-plugin/issues) with your Obsidian version and a minimal example without private notes. See [CONTRIBUTING.md](CONTRIBUTING.md).
