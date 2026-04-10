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
      { forward: "Filho de", inverse: "Pai de" },
      { forward: "Filha de", inverse: "Mãe de" },
      { forward: "Pai de", inverse: "Filho de" },
      { forward: "Mãe de", inverse: "Filha de" },
      { forward: "Esposa de", inverse: "Marido de" },
      { forward: "Marido de", inverse: "Esposa de" },
      { forward: "Irmão de", inverse: "Irmão de" },
      { forward: "Irmã de", inverse: "Irmã de" },
      { forward: "Avô de", inverse: "Neto de" },
      { forward: "Avó de", inverse: "Neto de" },
      { forward: "Tio de", inverse: "Sobrinho de" },
      { forward: "Tia de", inverse: "Sobrinha de" },
    ],
    romantic: [
      { forward: "Namorado de", inverse: "Namorada de" },
      { forward: "Namorada de", inverse: "Namorado de" },
      { forward: "Noivo de", inverse: "Noiva de" },
      { forward: "Ex de", inverse: "Ex de" },
    ],
    friendship: [
      { forward: "Amigo de", inverse: "Amigo de" },
      { forward: "Melhor amigo de", inverse: "Melhor amigo de" },
      { forward: "Aliado de", inverse: "Aliado de" },
      { forward: "Inimigo de", inverse: "Inimigo de" },
    ],
    professional: [
      { forward: "Colega de", inverse: "Colega de" },
      { forward: "Chefe de", inverse: "Funcionário de" },
      { forward: "Sócio de", inverse: "Sócio de" },
    ],
    education: [
      { forward: "Professor de", inverse: "Aluno de" },
      { forward: "Estudante de", inverse: "Professor de" },
      { forward: "Mentor de", inverse: "Mentorado de" },
    ],
    creative: [
      { forward: "Colaborador de", inverse: "Colaborador de" },
      { forward: "Inspirado por", inverse: "Inspiração para" },
    ],
    misc: [
      { forward: "Membro de", inverse: "Possui membro" },
      { forward: "Criado por", inverse: "Criador de" },
    ],
  },
};
