// src/utils/mapUtils.ts
import { MapStyleKey, mapStyles } from '@/config/mapStyles'
import type { Map } from 'maplibre-gl'

export const changeMapStyle = async (
  map: Map,
  styleKey: MapStyleKey
): Promise<void> => {
  try {
    await map.setStyle(mapStyles[styleKey])
    // Réappliquer les personnalisations après le changement de style
    map.once('style.load', () => {
      // Réappliquer les personnalisations ici
      // ... code de personnalisation ...
    })
  } catch (error) {
    console.error('Erreur lors du changement de style:', error)
  }
}
