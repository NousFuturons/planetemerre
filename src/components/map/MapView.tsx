// src/components/map/MapView.tsx
'use client'

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
      center: [-2.0260, 48.6493], // Saint-Malo
      zoom: 13,
      maxZoom: 20,
      minZoom: 3,
    })

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right')
    map.current.addControl(new maplibregl.ScaleControl({}), 'bottom-left')

    return () => {
      map.current?.remove()
    }
  }, [])

  return (
    <Box
      ref={mapContainer}
      position="absolute"
      top="64px" // Correspond à la hauteur de la navbar
      bottom="0"
      left="0"
      right="0"
    />
  )
}
