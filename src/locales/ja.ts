import type { LocaleDefinition } from "./types";

/**
 * 🇯🇵 日本語のローカライズ定義。
 */
export const ja: LocaleDefinition = {
  code: "ja",

  strings: {
    pluginTitle: "Relation Sync",
    pluginDescription:
      "逆関係のペアを定義します。ノートのフロントマターに " +
      '「forward: [[Target]]」と書くと、プラグインがターゲットのフロントマターに' +
      '「inverse: [[Source]]」を自動的に追加します。',

    resetToDefaults: "デフォルトに戻す",
    resetToDefaultsDesc:
      "すべてのカスタマイズを削除し、組み込みの関係セットを復元します。",
    resetToDefaultsButton: "デフォルトに戻す",
    resetConfirm:
      "現在のすべての関係が組み込みのデフォルトに置き換わります。\n\n続行しますか？",
    resetNotice: "RelationSync: 関係がデフォルトにリセットされました。",

    syncVault: "保管庫全体を同期",
    syncVaultDesc:
      "保管庫内のすべてのファイルで逆関係を再計算して追加します。",
    syncVaultButton: "一括同期を実行",
    syncNotice: (count) => `RelationSync: ${count} 件のノートで同期が完了しました。`,

    filterRelations: "関係をフィルタリング",
    searchPlaceholder: "検索… (例: 友達, friend, ex)",

    addPairButton: "+ ペアを追加",

    pairsTotal: (count) => `合計 ${count} ペア`,
    pairsShown: (visible, total) => `${total} ペア中 ${visible} ペアを表示`,

    forwardPlaceholder: "順方向 (例: の友達)",
    inversePlaceholder: "逆方向 (例: の友達)",
    removePairTooltip: "このペアを削除",

    noSearchResults: "検索条件に一致する関係が見つかりません。",
    noRelations: '関係が定義されていません。「+ ペアを追加」をクリックして作成してください。',

    showAllLanguages: "すべての言語を表示",
    showAllLanguagesDesc:
      "オフの場合、設定されている言語に一致する関係のみが表示されます。オンにするとすべて表示されます。",

    catFamily: "👨‍👩‍👧‍👦 家族",
    catRomantic: "💕 恋愛",
    catFriendship: "🤝 友情・社会",
    catProfessional: "💼 職業",
    catEducation: "🎓 教育",
    catCreative: "🎨 クリエイティブ",
    catMisc: "🔗 その他",
    catCustom: "📦 カスタム",
  },

  categories: {
    family: [
      { forward: "の子", inverse: "の親" },
      { forward: "の親", inverse: "の子" },
      { forward: "の息子", inverse: "の父" },
      { forward: "の娘", inverse: "の母" },
      { forward: "の父", inverse: "の子" },
      { forward: "の母", inverse: "の子" },
      { forward: "の妻", inverse: "の夫" },
      { forward: "の夫", inverse: "の妻" },
      { forward: "の兄", inverse: "の弟" },
      { forward: "の弟", inverse: "の兄" },
      { forward: "の姉", inverse: "の妹" },
      { forward: "の妹", inverse: "の姉" },
      { forward: "の孫", inverse: "の祖父母" },
      { forward: "の祖父", inverse: "の孫" },
      { forward: "の祖母", inverse: "の孫" },
      { forward: "のいとこ", inverse: "のいとこ" },
      { forward: "の甥", inverse: "の伯父・叔父" },
      { forward: "の姪", inverse: "の伯母・叔母" },
    ],
    romantic: [
      { forward: "の彼氏", inverse: "の彼女" },
      { forward: "の彼女", inverse: "の彼氏" },
      { forward: "の婚約者", inverse: "の婚約者" },
      { forward: "の元恋人", inverse: "の元恋人" },
    ],
    friendship: [
      { forward: "の友達", inverse: "の友達" },
      { forward: "の親友", inverse: "の親友" },
      { forward: "の味方", inverse: "の味方" },
      { forward: "の敵", inverse: "の敵" },
    ],
    professional: [
      { forward: "の同僚", inverse: "の同僚" },
      { forward: "の上司", inverse: "の部下" },
      { forward: "の部下", inverse: "の上司" },
      { forward: "のマネージャー", inverse: "の被管理者" },
      { forward: "の助手", inverse: "の被支援者" },
    ],
    education: [
      { forward: "の先生", inverse: "の生徒" },
      { forward: "の生徒", inverse: "の先生" },
      { forward: "の師匠", inverse: "の弟子" },
      { forward: "の弟子", inverse: "の師匠" },
    ],
    creative: [
      { forward: "のコラボレーター", inverse: "のコラボレーター" },
      { forward: "のインスピレーション", inverse: "のインスピレーション" },
    ],
    misc: [
      { forward: "のメンバー", inverse: "の所属先" },
      { forward: "の作者", inverse: "の作品" },
    ],
  },
};
