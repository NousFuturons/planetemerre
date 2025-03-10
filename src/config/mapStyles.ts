// src/config/mapStyles.ts
export const mapStyles = {
    // Style de base MapLibre qui est accessible publiquement
    default: {
      version: 8,
      sources: {
        osm: {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors'
        }
      },
      layers: [
        {
          id: 'osm',
          type: 'raster',
          source: 'osm',
          minzoom: 0,
          maxzoom: 19
        }
      ]
    }
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
  