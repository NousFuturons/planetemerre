// src/components/map/MapView.tsx
'use client'

import { useEffect, useRef } from 'react'
import { Box } from '@chakra-ui/react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MapControls } from './MapControls'

export function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [-2.0260, 48.6493], // Saint-Malo
      zoom: 13
    })

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right')
    map.current.addControl(
      new maplibregl.ScaleControl({ maxWidth: 150, unit: 'metric' }),
      'bottom-right'
    )

    return () => {
      map.current?.remove()
    }
  }, [])

  return (
    <Box 
      position="fixed" // Changed from relative to fixed
      top="64px"      // Height of navbar
      left="0"
      right="0"
      bottom="0"      // Ensures it stretches to bottom of viewport
    >
      <Box
        ref={mapContainer}
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
      />
      <MapControls />
    </Box>
  )
}
