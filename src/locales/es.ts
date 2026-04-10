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

    exportPairs: "Exportar pares de relaciones",
    exportPairsDesc:
      "Guarda todos los pares de relaciones actuales en un archivo JSON en la raíz del vault.",
    exportPairsButton: "Exportar a JSON",
    importPairs: "Importar pares de relaciones",
    importPairsDesc:
      "Carga pares de relaciones desde un archivo JSON (se fusionan con los pares existentes).",
    importPairsButton: "Importar desde JSON",
    importSuccess: (count) => `RelationSync: importados ${count} pares.`,
    importError: "RelationSync: importación fallida — archivo no válido o ilegible.",

    excludePaths: "Rutas excluidas",
    excludePathsDesc:
      "Rutas de carpetas o archivos separadas por comas a ignorar durante la sincronización (ej. Templates, Archivo).",
    excludePathsPlaceholder: "Templates, Archivo, Notas Diarias",

    filterRelations: "Filtrar relaciones",
    searchPlaceholder: "Buscar… (ej. amigo, friend, ex)",

    addPairButton: "+ Añadir pareja",

    pairsTotal: (count) => `${count} parejas en total`,
    pairsShown: (visible, total) => `${visible} / ${total} parejas mostradas`,

    forwardPlaceholder: "directo (ej. amigo de)",
    inversePlaceholder: "inverso (ej. amigo de)",
    removePairTooltip: "Eliminar esta pareja",
    togglePairTooltip: "Activar / desactivar este par",

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
      { forward: "Hijo de", inverse: "Padre de" },
      { forward: "Hija de", inverse: "Padre de" },
      { forward: "Padre de", inverse: "Hijo de" },
      { forward: "Madre de", inverse: "Hijo de" },
      { forward: "Hijastro de", inverse: "Padrastro de" },
      { forward: "Hijastra de", inverse: "Madrastra de" },
      { forward: "Padrastro de", inverse: "Hijastro de" },
      { forward: "Madrastra de", inverse: "Hijastra de" },
      { forward: "Hijo adoptivo de", inverse: "Padre adoptivo de" },
      { forward: "Padre adoptivo de", inverse: "Hijo adoptivo de" },
      { forward: "Esposa de", inverse: "Esposo de" },
      { forward: "Esposo de", inverse: "Esposa de" },
      { forward: "Cónyuge de", inverse: "Cónyuge de" },
      { forward: "Pareja de", inverse: "Pareja de" },
      { forward: "Hermano de", inverse: "Hermano de" },
      { forward: "Hermana de", inverse: "Hermana de" },
      { forward: "Hermano de padre de", inverse: "Hermano de padre de" },
      { forward: "Hermano de madre de", inverse: "Hermano de madre de" },
      { forward: "Nieto de", inverse: "Abuelo de" },
      { forward: "Nieta de", inverse: "Abuelo de" },
      { forward: "Abuelo de", inverse: "Nieto de" },
      { forward: "Abuela de", inverse: "Nieto de" },
      { forward: "Tío de", inverse: "Sobrino de" },
      { forward: "Tía de", inverse: "Sobrino de" },
      { forward: "Sobrino de", inverse: "Tío de" },
      { forward: "Sobrina de", inverse: "Tío de" },
      { forward: "Primo de", inverse: "Primo de" },
      { forward: "Suegro de", inverse: "Yerno de" },
      { forward: "Suegra de", inverse: "Nuera de" },
      { forward: "Yerno de", inverse: "Suegro de" },
      { forward: "Nuera de", inverse: "Suegra de" },
      { forward: "Cuñado de", inverse: "Cuñado de" },
      { forward: "Cuñada de", inverse: "Cuñada de" },
      { forward: "Padrino de", inverse: "Ahijado de" },
      { forward: "Madrina de", inverse: "Ahijado de" },
    ],
    romantic: [
      { forward: "Novio de", inverse: "Novia de" },
      { forward: "Novia de", inverse: "Novio de" },
      { forward: "Prometido de", inverse: "Prometida de" },
      { forward: "Prometida de", inverse: "Prometido de" },
      { forward: "Ex de", inverse: "Ex de" },
      { forward: "Enamorado de", inverse: "Amante de" },
      { forward: "Amante de", inverse: "Enamorado de" },
    ],
    friendship: [
      { forward: "Amigo de", inverse: "Amigo de" },
      { forward: "Amiga de", inverse: "Amiga de" },
      { forward: "Mejor amigo de", inverse: "Mejor amigo de" },
      { forward: "Compañero de piso de", inverse: "Compañero de piso de" },
      { forward: "Aliado de", inverse: "Aliado de" },
      { forward: "Enemigo de", inverse: "Enemigo de" },
      { forward: "Rival de", inverse: "Rival de" },
    ],
    professional: [
      { forward: "Colega de", inverse: "Colega de" },
      { forward: "Jefe de", inverse: "Empleado de" },
      { forward: "Empleado de", inverse: "Jefe de" },
      { forward: "Socio de", inverse: "Socio de" },
      { forward: "Cliente de", inverse: "Proveedor de" },
      { forward: "Proveedor de", inverse: "Cliente de" },
    ],
    education: [
      { forward: "Profesor de", inverse: "Alumno de" },
      { forward: "Alumno de", inverse: "Profesor de" },
      { forward: "Mentor de", inverse: "Mentee de" },
      { forward: "Compañero de clase de", inverse: "Compañero de clase de" },
    ],
    creative: [
      { forward: "Colaborador de", inverse: "Colaborador de" },
      { forward: "Inspirado por", inverse: "Inspiración para" },
      { forward: "Inspiración para", inverse: "Inspirado por" },
    ],
    misc: [
      { forward: "Pariente de", inverse: "Pariente de" },
      { forward: "Conoce a", inverse: "Conocido por" },
      { forward: "Miembro de", inverse: "Tiene miembro" },
      { forward: "Creado por", inverse: "Creador de" },
    ],
  },
};
