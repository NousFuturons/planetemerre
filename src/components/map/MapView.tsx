'use client'  // Ajouter cette ligne tout en haut du fichier

import { useEffect, useRef } from 'react'
import { Box } from '@chakra-ui/react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [2.3522, 48.8566], // Paris
      zoom: 11
    })

    return () => {
      map.current?.remove()
    }
  }, [])

  return (
    <Box 
      ref={mapContainer} 
      h="600px" 
      w="100%" 
      borderRadius="md" 
      overflow="hidden"
    />
  )
}
