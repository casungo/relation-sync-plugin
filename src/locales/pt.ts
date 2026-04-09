import type { LocaleDefinition } from "./types";

/**
 * 🇧🇷 Definição de localização em português.
 */
export const pt: LocaleDefinition = {
  code: "pt",

  strings: {
    pluginTitle: "Relation Sync",
    pluginDescription:
      "Define pares de relações inversas. Quando você escreve " +
      '"forward: [[Destino]]" no frontmatter de uma nota, o plugin ' +
      'adiciona automaticamente "inverse: [[Origem]]" no frontmatter do destino.',

    resetToDefaults: "Redefinir para padrões",
    resetToDefaultsDesc:
      "Exclui todas as alterações personalizadas e restaura o conjunto de relações integrado.",
    resetToDefaultsButton: "Redefinir para padrões",
    resetConfirm:
      "Isso substituirá TODAS as suas relações atuais pelos padrões integrados.\n\nContinuar?",
    resetNotice: "RelationSync: relações redefinidas para os padrões.",

    syncVault: "Sincronizar todo o vault",
    syncVaultDesc:
      "Recalcula e adiciona todas as relações inversas em todos os arquivos do vault.",
    syncVaultButton: "Executar sincronização global",
    syncNotice: (count) => `RelationSync: sincronização concluída em ${count} notas.`,

    exportPairs: "Exportar pares de relações",
    exportPairsDesc:
      "Salva todos os pares de relações atuais em um arquivo JSON na raiz do vault.",
    exportPairsButton: "Exportar para JSON",
    importPairs: "Importar pares de relações",
    importPairsDesc:
      "Carrega pares de relações de um arquivo JSON (mescla com os pares existentes).",
    importPairsButton: "Importar do JSON",
    importSuccess: (count) => `RelationSync: ${count} pares importados.`,
    importError: "RelationSync: falha na importação — arquivo inválido ou ilegível.",

    excludePaths: "Caminhos excluídos",
    excludePathsDesc:
      "Caminhos de pastas ou arquivos separados por vírgula a ignorar durante a sincronização (ex. Templates, Arquivo).",
    excludePathsPlaceholder: "Templates, Arquivo, Notas Diárias",

    filterRelations: "Filtrar relações",
    searchPlaceholder: "Pesquisar… (ex: amigo, friend, ex)",

    addPairButton: "+ Adicionar par",

    pairsTotal: (count) => `${count} pares no total`,
    pairsShown: (visible, total) => `${visible} / ${total} pares exibidos`,

    forwardPlaceholder: "direto (ex: amigo de)",
    inversePlaceholder: "inverso (ex: amigo de)",
    removePairTooltip: "Remover este par",
    togglePairTooltip: "Ativar / desativar este par",

    noSearchResults: "Nenhuma relação corresponde à sua pesquisa.",
    noRelations: 'Nenhuma relação definida. Clique em "+ Adicionar par" para criar uma.',

    showAllLanguages: "Mostrar todos os idiomas",
    showAllLanguagesDesc:
      "Quando desativado, apenas as relações que correspondem ao seu idioma são exibidas. Ative para ver todas.",

    catFamily: "👨‍👩‍👧‍👦 Família",
    catRomantic: "💕 Romântico",
    catFriendship: "🤝 Amizade e Social",
    catProfessional: "💼 Profissional",
    catEducation: "🎓 Educação",
    catCreative: "🎨 Criativo",
    catMisc: "🔗 Diversos",
    catCustom: "📦 Personalizado",
  },

  categories: {
    family: [
      { forward: "filho de", inverse: "pai de" },
      { forward: "filha de", inverse: "mãe de" },
      { forward: "pai de", inverse: "filho de" },
      { forward: "mãe de", inverse: "filha de" },
      { forward: "esposa de", inverse: "marido de" },
      { forward: "marido de", inverse: "esposa de" },
      { forward: "irmão de", inverse: "irmão de" },
      { forward: "irmã de", inverse: "irmã de" },
      { forward: "avô de", inverse: "neto de" },
      { forward: "avó de", inverse: "neto de" },
      { forward: "tio de", inverse: "sobrinho de" },
      { forward: "tia de", inverse: "sobrinha de" },
    ],
    romantic: [
      { forward: "namorado de", inverse: "namorada de" },
      { forward: "namorada de", inverse: "namorado de" },
      { forward: "noivo de", inverse: "noiva de" },
      { forward: "ex de", inverse: "ex de" },
    ],
    friendship: [
      { forward: "amigo de", inverse: "amigo de" },
      { forward: "melhor amigo de", inverse: "melhor amigo de" },
      { forward: "aliado de", inverse: "aliado de" },
      { forward: "inimigo de", inverse: "inimigo de" },
    ],
    professional: [
      { forward: "colega de", inverse: "colega de" },
      { forward: "chefe de", inverse: "funcionário de" },
      { forward: "sócio de", inverse: "sócio de" },
    ],
    education: [
      { forward: "professor de", inverse: "aluno de" },
      { forward: "estudante de", inverse: "professor de" },
      { forward: "mentor de", inverse: "mentorado de" },
    ],
    creative: [
      { forward: "colaborador de", inverse: "colaborador de" },
      { forward: "inspirado por", inverse: "inspiração para" },
    ],
    misc: [
      { forward: "membro de", inverse: "possui membro" },
      { forward: "criado por", inverse: "criador de" },
    ],
  },
};
