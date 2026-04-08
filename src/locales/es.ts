import type { LocaleDefinition } from "./types";

/**
 * 🇪🇸 Definición de localización en español.
 */
export const es: LocaleDefinition = {
  code: "es",

  strings: {
    pluginTitle: "Relation Sync",
    pluginDescription:
      "Define pares de relaciones inversas. Cuando escribes " +
      '"forward: [[Destino]]" en el frontmatter de una nota, el plugin ' +
      'añade automáticamente "inverse: [[Origen]]" en el frontmatter de la nota de destino.',

    resetToDefaults: "Restablecer valores predeterminados",
    resetToDefaultsDesc:
      "Elimina todos los cambios personalizados y restaura el conjunto de relaciones integrado.",
    resetToDefaultsButton: "Restablecer valores predeterminados",
    resetConfirm:
      "Esto reemplazará TODAS tus relaciones actuales con los valores predeterminados incorporados.\n\n¿Continuar?",
    resetNotice: "RelationSync: relaciones restablecidas a los valores predeterminados.",

    syncVault: "Sincronizar todo el vault",
    syncVaultDesc:
      "Vuelve a calcular y añade todas las relaciones inversas en cada archivo del vault.",
    syncVaultButton: "Ejecutar sincronización global",
    syncNotice: (count) => `RelationSync: sincronización completada en ${count} notas.`,

    filterRelations: "Filtrar relaciones",
    searchPlaceholder: "Buscar… (ej. amigo, friend, ex)",

    addPairButton: "+ Añadir pareja",

    pairsTotal: (count) => `${count} parejas en total`,
    pairsShown: (visible, total) => `${visible} / ${total} parejas mostradas`,

    forwardPlaceholder: "directo (ej. amigo de)",
    inversePlaceholder: "inverso (ej. amigo de)",
    removePairTooltip: "Eliminar esta pareja",

    noSearchResults: "Ninguna relación coincide con tu búsqueda.",
    noRelations: 'No hay relaciones definidas. Haz clic en "+ Añadir pareja" para crear una.',

    showAllLanguages: "Mostrar todos los idiomas",
    showAllLanguagesDesc:
      "Cuando está desactivado, solo se muestran las relaciones que coinciden con tu idioma. Actívalo para ver todas.",

    catFamily: "👨‍👩‍👧‍👦 Familia",
    catRomantic: "💕 Romántico",
    catFriendship: "🤝 Amistad y Social",
    catProfessional: "💼 Profesional",
    catEducation: "🎓 Educación",
    catCreative: "🎨 Creativo",
    catMisc: "🔗 Miscelánea",
    catCustom: "📦 Personalizado",
  },

  categories: {
    family: [
      { forward: "hijo de", inverse: "padre de" },
      { forward: "hija de", inverse: "padre de" },
      { forward: "padre de", inverse: "hijo de" },
      { forward: "madre de", inverse: "hijo de" },
      { forward: "hijastro de", inverse: "padrastro de" },
      { forward: "hijastra de", inverse: "madrastra de" },
      { forward: "padrastro de", inverse: "hijastro de" },
      { forward: "madrastra de", inverse: "hijastra de" },
      { forward: "hijo adoptivo de", inverse: "padre adoptivo de" },
      { forward: "padre adoptivo de", inverse: "hijo adoptivo de" },
      { forward: "esposa de", inverse: "esposo de" },
      { forward: "esposo de", inverse: "esposa de" },
      { forward: "cónyuge de", inverse: "cónyuge de" },
      { forward: "pareja de", inverse: "pareja de" },
      { forward: "hermano de", inverse: "hermano de" },
      { forward: "hermana de", inverse: "hermana de" },
      { forward: "hermano de padre de", inverse: "hermano de padre de" },
      { forward: "hermano de madre de", inverse: "hermano de madre de" },
      { forward: "nieto de", inverse: "abuelo de" },
      { forward: "nieta de", inverse: "abuelo de" },
      { forward: "abuelo de", inverse: "nieto de" },
      { forward: "abuela de", inverse: "nieto de" },
      { forward: "tío de", inverse: "sobrino de" },
      { forward: "tía de", inverse: "sobrino de" },
      { forward: "sobrino de", inverse: "tío de" },
      { forward: "sobrina de", inverse: "tío de" },
      { forward: "primo de", inverse: "primo de" },
      { forward: "suegro de", inverse: "yerno de" },
      { forward: "suegra de", inverse: "nuera de" },
      { forward: "yerno de", inverse: "suegro de" },
      { forward: "nuera de", inverse: "suegra de" },
      { forward: "cuñado de", inverse: "cuñado de" },
      { forward: "cuñada de", inverse: "cuñada de" },
      { forward: "padrino de", inverse: "ahijado de" },
      { forward: "madrina de", inverse: "ahijado de" },
    ],
    romantic: [
      { forward: "novio de", inverse: "novia de" },
      { forward: "novia de", inverse: "novio de" },
      { forward: "prometido de", inverse: "prometida de" },
      { forward: "prometida de", inverse: "prometido de" },
      { forward: "ex de", inverse: "ex de" },
      { forward: "enamorado de", inverse: "amante de" },
      { forward: "amante de", inverse: "enamorado de" },
    ],
    friendship: [
      { forward: "amigo de", inverse: "amigo de" },
      { forward: "amiga de", inverse: "amiga de" },
      { forward: "mejor amigo de", inverse: "mejor amigo de" },
      { forward: "compañero de piso de", inverse: "compañero de piso de" },
      { forward: "aliado de", inverse: "aliado de" },
      { forward: "enemigo de", inverse: "enemigo de" },
      { forward: "rival de", inverse: "rival de" },
    ],
    professional: [
      { forward: "colega de", inverse: "colega de" },
      { forward: "jefe de", inverse: "empleado de" },
      { forward: "empleado de", inverse: "jefe de" },
      { forward: "socio de", inverse: "socio de" },
      { forward: "cliente de", inverse: "proveedor de" },
      { forward: "proveedor de", inverse: "cliente de" },
    ],
    education: [
      { forward: "profesor de", inverse: "alumno de" },
      { forward: "alumno de", inverse: "profesor de" },
      { forward: "mentor de", inverse: "mentee de" },
      { forward: "compañero de clase de", inverse: "compañero de clase de" },
    ],
    creative: [
      { forward: "colaborador de", inverse: "colaborador de" },
      { forward: "inspirado por", inverse: "inspiración para" },
      { forward: "inspiración para", inverse: "inspirado por" },
    ],
    misc: [
      { forward: "pariente de", inverse: "pariente de" },
      { forward: "conoce a", inverse: "conocido por" },
      { forward: "miembro de", inverse: "tiene miembro" },
      { forward: "creado por", inverse: "creador de" },
    ],
  },
};
