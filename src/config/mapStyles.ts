// src/config/mapStyles.ts
export const mapStyles = {
    // Style de base VersaTiles que nous pouvons personnaliser
    default: 'https://tiles.versatiles.org/assets/lib/styles/colorful/style.json',
    // Pour référence future, ajout d'autres styles possibles
    satellite: 'https://tiles.versatiles.org/assets/lib/styles/satellite/style.json',
    dark: 'https://tiles.versatiles.org/assets/lib/styles/dark/style.json'
  } as const
  
  export type MapStyleKey = keyof typeof mapStyles
  
  // Configuration de personnalisation du style
  export const styleCustomization = {
    water: {
      color: '#a2d2ff',
      opacity: 0.8
    },
    land: {
      color: '#f0f0f0'
    },
    buildings: {
      color: '#e5e5e5',
      opacity: 0.6
    }
  }
  