# Relation Sync for Obsidian

[![Release](https://img.shields.io/github/v/release/casungo/relation-sync-plugin?style=flat-square)](https://github.com/casungo/relation-sync-plugin/releases)
[![Downloads](https://img.shields.io/github/downloads/casungo/relation-sync-plugin/total?style=flat-square)](https://github.com/casungo/relation-sync-plugin/releases)

**Relation Sync** is a powerful Obsidian plugin that automates the management of bidirectional relationships within your vault's YAML frontmatter. Stop manually updating back-references; define your logic once and let the plugin handle the rest.

---

## ✨ Key Features

- **🔄 Automatic Bidirectional Syncing**: Add a relation in one note, and the inverse is instantly added to the target note.
- **📚 Extensive Default Library**: Over 50+ pre-configured relation pairs covering Family, Romantic, Professional, and Creative relationships.
- **🌍 Multi-Language Support**: Fully localized in **8 languages** (English, Italian, German, Spanish, French, Japanese, Portuguese, and Chinese).
- **🛠️ Fully Customizable**: Define your own custom relation pairs (e.g., `Villain` ↔ `Hero`, `Master` ↔ `Apprentice`).
- **📂 Multi-Value Aware**: Handles both single links and arrays of links seamlessly.
- **⚡ Bulk Sync Tool**: A specialized tool to scan and synchronize your entire vault in one click.
- **🎨 Modern Settings UI**: Grouped, searchable, and filterable interface for effortless configuration.

---

## 🚀 How It Works

Imagine you are writing about your family. You add a link to your father in your note:

```md
John Doe.md:
---
father: [[David Doe]]
---
```

**Relation Sync** will immediately detect this and update David's note:

```md
David Doe.md:
---
child: [[John Doe]]
---
```

If you later change or remove the link, the plugin updates the corresponding inverse relation automatically, ensuring your graph remains perfectly consistent.

---

## 📂 Supported Categories

The plugin comes with a rich set of defaults grouped by category:

| Category | Examples |
| :--- | :--- |
| **Family** | Parent ↔ Child, Siblings, Spouses, Cousins, Grandparents |
| **Romantic** | Partner, Lover, Sweetheart, Ex-partner |
| **Friendship** | Best Friend, Roommate, Childhood Friend |
| **Professional** | Manager ↔ Employee, Colleague, Client ↔ Provider |
| **Education** | Teacher ↔ Student, Classmate, Mentor ↔ Mentee |
| **Creative** | Collaborator, Rival, Muse |
| **Social** | Neighbor, Acquaintance, Roommate |

---

## ⚙️ Installation

### Community Plugins (Recommended)
1. Open **Settings** in Obsidian.
2. Go to **Community plugins** and click **Browse**.
3. Search for `Relation Sync`.
4. Click **Install**, then **Enable**.

### Manual Installation
1. Download the latest `main.js`, `manifest.json`, and `styles.css` from the [Releases](https://github.com/casungo/relation-sync-plugin/releases) page.
2. Create a folder named `relation-sync` in your vault's `.obsidian/plugins/` directory.
3. Move the downloaded files into that folder.
4. Reload Obsidian and enable the plugin in settings.

---

## 🛠️ Development

If you want to build the plugin yourself or contribute:

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the build process in watch mode.
4. Run `npm run build` for a production release.

---

## 🤝 Contributing & Support

- **Bugs & Features**: Please open an issue on the [GitHub repository](https://github.com/casungo/relation-sync-plugin/issues).
- **Localization**: If you'd like to help translate the plugin into more languages, contributions to the `src/locales` directory are welcome!
- **Support**: If you find this plugin useful, consider [supporting development](https://casungo.top/donate).

---

Developed with ❤️ by [casungo](https://casungo.top)
