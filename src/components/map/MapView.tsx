// src/components/map/MapView.tsx
'use client'

import { useEffect, useRef } from 'react'
import { Box } from '@chakra-ui/react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MapControls } from './MapControls'
import { mapStyles, styleCustomization } from '@/config/mapStyles'

export function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    // Création de la carte avec le style par défaut
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyles.default,
      center: [-2.0260, 48.6493], // Saint-Malo
      zoom: 13,
      maxZoom: 20,
      minZoom: 3,
    })

    // Personnalisation du style après le chargement
    map.current.on('style.load', () => {
      if (!map.current) return

      // Personnalisation des couleurs de l'eau
      map.current.setPaintProperty(
        'water',
        'fill-color',
        styleCustomization.water.color
      )
      map.current.setPaintProperty(
        'water',
        'fill-opacity',
        styleCustomization.water.opacity
      )

      // Personnalisation des bâtiments
      map.current.setPaintProperty(
        'building',
        'fill-color',
        styleCustomization.buildings.color
      )
      map.current.setPaintProperty(
        'building',
        'fill-opacity',
        styleCustomization.buildings.opacity
      )
    })

    // Ajout des contrôles
    map.current.addControl(
      new maplibregl.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: true
      }),
      'top-right'
    )

    map.current.addControl(
      new maplibregl.ScaleControl({
        maxWidth: 150,
        unit: 'metric'
      }),
      'bottom-right'
    )

    return () => {
      map.current?.remove()
    }
  }, [])

  return (
    <Box position="relative">
      <Box
        ref={mapContainer}
        position="absolute"
        top="64px"
        bottom="0"
        left="0"
        right="0"
      />
      <MapControls />
    </Box>
  )
}
