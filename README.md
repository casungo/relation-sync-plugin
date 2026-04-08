# Relation Sync — Obsidian Plugin

Automatically keeps **inverse relations** in sync across your vault's frontmatter.

Write `son of: "[[John]]"` in a note and the plugin instantly adds `son: "[[YourNote]]"` in John's note. Remove the link and the inverse is cleaned up too.

Ships with **50+ built-in relation pairs** covering family relationships in both **English** and **Italian** — and you can add any custom pair you need.

---

## How It Works

In **Alice.md**:
```yaml
---
daughter of: "[[Bob]]"
---
```

The plugin automatically adds in **Bob.md**:
```yaml
---
daughter: "[[Alice]]"
---
```

If you remove the link from Alice, the inverse in Bob is removed as well.

### Multiple Values

Use YAML arrays for multiple relations:
```yaml
---
parent of:
  - "[[Alice]]"
  - "[[Charlie]]"
---
```

Both Alice and Charlie will receive `child of: "[[YourNote]]"` in their frontmatter.

---

## Built-in Relation Pairs

### English

| Forward Key | Inverse Key |
|---|---|
| `child of` | `child` |
| `child` | `child of` |
| `son of` | `son` |
| `son` | `son of` |
| `daughter of` | `daughter` |
| `daughter` | `daughter of` |
| `parent of` | `child of` |
| `father of` | `child of` |
| `mother of` | `child of` |
| `wife of` | `husband of` |
| `husband of` | `wife of` |
| `spouse of` | `spouse of` |
| `brother of` | `brother of` |
| `sister of` | `sister of` |
| `sibling of` | `sibling of` |
| `grandchild of` | `grandchild` |
| `grandchild` | `grandchild of` |
| `grandparent of` | `grandchild of` |
| `grandfather of` | `grandchild of` |
| `grandmother of` | `grandchild of` |
| `uncle of` | `nephew of` |
| `aunt of` | `niece of` |
| `nephew of` | `uncle of` |
| `niece of` | `aunt of` |
| `cousin of` | `cousin of` |

### Italiano

| Chiave | Inverso |
|---|---|
| `figlio di` | `figlio` |
| `figlio` | `figlio di` |
| `figlia di` | `figlia` |
| `figlia` | `figlia di` |
| `genitore di` | `figlio di` |
| `padre di` | `figlio di` |
| `madre di` | `figlio di` |
| `moglie di` | `marito di` |
| `marito di` | `moglie di` |
| `coniuge di` | `coniuge di` |
| `fratello di` | `fratello di` |
| `sorella di` | `sorella di` |
| `nipote di` | `nipote` |
| `nipote` | `nipote di` |
| `nonno di` | `nipote di` |
| `nonna di` | `nipote di` |
| `zio di` | `nipote di` |
| `zia di` | `nipote di` |
| `cugino di` | `cugino di` |
| `cugina di` | `cugina di` |

All pairs are fully **customizable** in *Settings → Relation Sync*. Add, remove, or edit any pair.

---

## Installation

### Manual

1. Download `main.js`, `manifest.json`, and `styles.css` (if present) from the latest release
2. Create the folder `.obsidian/plugins/relation-sync/` in your vault
3. Copy the files into that folder
4. Restart Obsidian and enable the plugin in *Settings → Community Plugins*

### BRAT (Beta Reviewers Auto-update Tester)

1. Install [BRAT](https://github.com/TfTHacker/obsidian42-brat) if you haven't
2. Add this repo URL in BRAT settings
3. Enable the plugin

---

## Configuration

Open *Settings → Relation Sync* to:

- **View and edit** all relation pairs (forward ↔ inverse)
- **Add custom pairs** for any domain (not just family trees!)
- **Run a global sync** to re-compute inverse relations across the entire vault

---

## Global Sync

The **"Run global sync"** button in settings re-scans all notes and ensures every inverse relation is present. Useful after:

- First installing the plugin on an existing vault
- Adding new relation pairs to cover existing notes
- Recovering from manual edits that broke symmetry

---

## Build From Source

```bash
npm install
npm run build
```

Copy `main.js` and `manifest.json` to `.obsidian/plugins/relation-sync/` in your vault.

### Development

```bash
npm run dev
```

Starts esbuild in watch mode — rebuilds automatically on save.

---

## Technical Notes

- **Debounced writes**: rapid edits are batched (300ms) to avoid I/O storms
- **Loop guard**: files written by the plugin don't re-trigger the sync cycle
- **Automatic cleanup**: removing a link removes the inverse in the target
- **Case-insensitive**: `Son Of` and `son of` match the same relation
- **Compatible with Obsidian 1.4+** (uses `frontmatterLinks` from the metadata cache)

---

## License

MIT
