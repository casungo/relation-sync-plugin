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
    bulkSyncRunningNotice: "RelationSync: 一括同期を実行中...",
    bulkSyncFailedNotice: "RelationSync: 一括同期に失敗しました。",

    bulkPreviewTitle: "一括同期のプレビュー",
    bulkPreviewDesc: (changes, files) =>
      `保管庫に書き込む前に、${files} 件のノートに対する ${changes} 件の予定変更を確認してください。`,
    bulkPreviewSummary: (files, added, removed) =>
      `${files} 件のファイルが変更されます: 追加 ${added} 件、削除 ${removed} 件。`,
    bulkPreviewTruncated: (count) => `さらに ${count} 件の変更は表示されていません。`,
    confirmBulkSyncButton: "変更を適用",
    syncLogTitle: "同期ログ",
    noSyncChanges: "変更はありませんでした。",
    copyLogButton: "ログをコピー",
    copyLogNotice: "RelationSync: ログをコピーしました。",
    logFileColumn: "ファイル",
    logActionColumn: "操作",
    logKeyColumn: "キー",
    logLinkColumn: "Link",
    cancelButton: "キャンセル",
    confirmButton: "確認",
    openRelationsPanel: "関係パネルを開く",
    syncEnabled: "自動同期",
    syncEnabledDesc:
      "オフの場合、Relation Sync は変更を監視しますが逆関係を書き込みません。",
    viewRecentLog: "最近の同期ログ",
    viewRecentLogDesc: "最近の自動同期と一括同期の書き込みを確認します。",
    viewRecentLogButton: "ログを表示",
    undoLastSync: "最後の同期を元に戻す",
    undoLastSyncDesc:
      "Relation Sync が最後に書き込んだ変更セットを元に戻します。後でログを確認してください。",
    undoLastSyncButton: "最後の同期を元に戻す",
    undoLastSyncConfirm:
      "Relation Sync が最後に書き込んだ変更セットを元に戻します。\n\n続行しますか？",
    undoLastSyncNotice: (count) =>
      `RelationSync: ${count} 件の同期変更を元に戻しました。`,
    noUndoAvailable: "RelationSync: 元に戻せる同期変更はありません。",
    configInvalidTitle: "設定を確認してください",
    configInvalidDesc:
      "空、重複、競合している有効なペアを修正するまで、自動書き込みは無効です。",
    bulkProgress: (filesDone, filesTotal, changes) =>
      `RelationSync: ${filesDone}/${filesTotal} ファイルを同期しました（${changes} 件適用）。`,
    bulkSyncCancelledNotice: (changes) =>
      `RelationSync: ${changes} 件の変更後に一括同期をキャンセルしました。`,

    relationsPanelTitle: "関係",
    relationsPanelNoFile: "関係を表示するにはノートを開いてください。",
    relationsPanelNoFrontmatter: "このノートには frontmatter がありません。",
    relationsPanelNoRelations: "このノートに設定済みの関係は見つかりません。",
    relationsPanelRelationCount: (count) =>
      `${count} 件の関連ノート`,
    relationsPanelOpenNoteTooltip: "ノートを開く",

    exportPairs: "関係ペアをエクスポート",
    exportPairsDesc:
      "現在の関係ペアをバウルトのルートにJSONファイルとして保存します。",
    exportPairsButton: "JSONにエクスポート",

    exportSuccess: (filename) => `RelationSync: ${filename} にエクスポートしました。`,
    exportError: "RelationSync: エクスポートに失敗しました。",
    exportOverwriteConfirm: (filename) =>
      `${filename} は保管庫のルートにすでに存在します。\n\n上書きしますか？`,
    importPairs: "関係ペアをインポート",
    importPairsDesc:
      "JSONファイルから関係ペアを読み込みます（既存のペアとマージ）。",
    importPairsButton: "JSONからインポート",
    importSuccess: (count) => `RelationSync: ${count} ペアをインポートしました。`,
    importError: "RelationSync: インポートに失敗しました—ファイルが無効または読み取れません。",

    excludePaths: "除外パス",
    excludePathsDesc:
      "同期時に無視するフォルダまたはファイルのパスをカンマ区切りで指定（例: Templates, アーカイブ）。",
    excludePathsPlaceholder: "Templates, アーカイブ, 日和ノート",

    filterRelations: "関係をフィルタリング",
    searchPlaceholder: "検索… (例: 友達, friend, ex)",

    addPairButton: "+ ペアを追加",

    pairsTotal: (count) => `合計 ${count} ペア`,
    pairsShown: (visible, total) => `${total} ペア中 ${visible} ペアを表示`,

    forwardPlaceholder: "順方向 (例: の友達)",
    inversePlaceholder: "逆方向 (例: の友達)",
    removePairTooltip: "このペアを削除",
    togglePairTooltip: "このペアを有効 / 無効化",

    validationEmptyField: "両方の関係フィールドが必要です。",
    validationSameField: "順方向と逆方向を同じにすることはできません。",
    validationDuplicatePair: "この関係ペアは重複しています。",
    validationConflictingKey: (key) =>
      `「${key}」は別の有効なペアですでに管理されています。`,

    noSearchResults: "検索条件に一致する関係が見つかりません。",
    noRelations: '関係が定義されていません。「+ ペアを追加」をクリックして作成してください。',

    showAllLanguages: "すべての言語を表示",
    showAllLanguagesDesc:
      "オフの場合、設定されている言語に一致する関係のみが表示されます。オンにするとすべて表示されます。",
    enableVisibleCategory: "カテゴリを有効化",
    disableVisibleCategory: "カテゴリを無効化",
    enableCurrentLanguage: "この言語を有効化",
    enableCurrentLanguageDesc:
      "現在の Obsidian 言語の組み込み関係ペアをすべて有効にします。",
    disableOtherLanguages: "他の言語を無効化",
    disableOtherLanguagesDesc:
      "カスタムペアと現在の言語は有効のまま、他の言語パックを無効にします。",
    duplicateImportSkipped: (added, skipped) =>
      `RelationSync: ${added} ペアをインポートし、${skipped} 件の重複をスキップしました。`,

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
