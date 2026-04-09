import type { LocaleDefinition } from "./types";

/**
 * 🇨🇳 中文本地化定义。
 */
export const zh: LocaleDefinition = {
  code: "zh",

  strings: {
    pluginTitle: "Relation Sync",
    pluginDescription:
      "定义逆关系对。当你在一个笔记的 frontmatter 中写下 " +
      "「forward: [[Target]]」时，插件会自动在目标的 frontmatter 中" +
      "添加「inverse: [[Source]]」。",

    resetToDefaults: "恢复默认设置",
    resetToDefaultsDesc: "删除所有自定义更改并恢复内置的关系集。",
    resetToDefaultsButton: "恢复默认设置",
    resetConfirm: "这将用内置默认值替换你当前所有的关系。\n\n是否继续？",
    resetNotice: "RelationSync: 关系已恢复为默认设置。",

    syncVault: "同步整个仓库",
    syncVaultDesc: "重新计算并添加仓库中每个文件的所有逆关系。",
    syncVaultButton: "运行全局同步",
    syncNotice: (count) => `RelationSync: ${count} 个笔记同步完成。`,

    exportPairs: "导出关系对",
    exportPairsDesc:
      "将所有当前关系对保存为仓库根目录下的 JSON 文件。",
    exportPairsButton: "导出为 JSON",
    importPairs: "导入关系对",
    importPairsDesc:
      "从 JSON 文件导入关系对（与现有对合并）。",
    importPairsButton: "从 JSON 导入",
    importSuccess: (count) => `RelationSync: 已导入 ${count} 对关系。`,
    importError: "导入失败 — 文件无效或无法读取。",

    excludePaths: "排除路径",
    excludePathsDesc:
      "同步时要忽略的文件夹或文件路径，用逗号分隔（如 Templates, 归档）。",
    excludePathsPlaceholder: "Templates, 归档, 日记",

    filterRelations: "筛选关系",
    searchPlaceholder: "搜索…（例如：朋友, friend, ex）",

    addPairButton: "+ 添加关系对",

    pairsTotal: (count) => `共 ${count} 对关系`,
    pairsShown: (visible, total) => `显示 ${total} 对中的 ${visible} 对`,

    forwardPlaceholder: "正向（例如：的朋友）",
    inversePlaceholder: "反向（例如：的朋友）",
    removePairTooltip: "删除此关系对",
    togglePairTooltip: "启用 / 禁用此关系对",

    noSearchResults: "未找到匹配你的搜索的关系。",
    noRelations: "未定义关系。点击「+ 添加关系对」来创建一个。",

    showAllLanguages: "显示所有语言",
    showAllLanguagesDesc: "关闭时，仅显示与你的语言匹配的关系。开启后显示全部。",

    catFamily: "👨‍👩‍👧‍👦 家庭",
    catRomantic: "💕 浪漫",
    catFriendship: "🤝 友谊与社交",
    catProfessional: "💼 职业",
    catEducation: "🎓 教育",
    catCreative: "🎨 创意",
    catMisc: "🔗 其他",
    catCustom: "📦 自定义",
  },

  categories: {
    family: [
      { forward: "的孩子", inverse: "的父母" },
      { forward: "的父母", inverse: "的孩子" },
      { forward: "的儿子", inverse: "的父亲" },
      { forward: "的父亲", inverse: "的儿子" },
      { forward: "的女儿", inverse: "的母亲" },
      { forward: "的母亲", inverse: "的女儿" },
      { forward: "的妻子", inverse: "的丈夫" },
      { forward: "的丈夫", inverse: "的妻子" },
      { forward: "的哥哥", inverse: "的弟弟" },
      { forward: "的弟弟", inverse: "的哥哥" },
      { forward: "的姐姐", inverse: "的妹妹" },
      { forward: "的妹妹", inverse: "的姐姐" },
      { forward: "的孙子/女", inverse: "的祖父母" },
      { forward: "的祖父", inverse: "的孙子/女" },
      { forward: "的祖母", inverse: "的孙子/女" },
      { forward: "的堂/表亲", inverse: "的堂/表亲" },
      { forward: "的侄子", inverse: "的伯/叔/舅" },
      { forward: "的侄女", inverse: "的姑/姨" },
    ],
    romantic: [
      { forward: "的男友", inverse: "的女友" },
      { forward: "的女友", inverse: "的男友" },
      { forward: "的未婚夫/妻", inverse: "的未婚夫/妻" },
      { forward: "的前任", inverse: "的前任" },
    ],
    friendship: [
      { forward: "的朋友", inverse: "的朋友" },
      { forward: "的好友", inverse: "的好友" },
      { forward: "的盟友", inverse: "的盟友" },
      { forward: "的敌人", inverse: "的敌人" },
    ],
    professional: [
      { forward: "的同事", inverse: "的同事" },
      { forward: "的老板", inverse: "的员工" },
      { forward: "的员工", inverse: "的老板" },
      { forward: "的经理", inverse: "的下属" },
      { forward: "的助手", inverse: "的协助对象" },
    ],
    education: [
      { forward: "的老师", inverse: "的学生" },
      { forward: "的学生", inverse: "的老师" },
      { forward: "的导师", inverse: "的学徒" },
      { forward: "的学徒", inverse: "的导师" },
    ],
    creative: [
      { forward: "的合作者", inverse: "的合作者" },
      { forward: "的灵感来源", inverse: "的灵感来源" },
    ],
    misc: [
      { forward: "的成员", inverse: "的所属组织" },
      { forward: "的创作者", inverse: "的作品" },
    ],
  },
};
