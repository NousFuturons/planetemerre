// src/components/map/MapControls.tsx
'use client'

import { Box, Button, VStack, useColorModeValue } from '@chakra-ui/react'

export function MapControls() {
  const bgColor = useColorModeValue('white', 'gray.800')

  return (
    <Box
      position="absolute"
      left="4"
      top="50%"
      transform="translateY(-50%)"
      zIndex={100}
      bg={bgColor}
      p={2}
      borderRadius="md"
      boxShadow="base"
    >
      <VStack spacing={2}>
        <Button size="sm" colorScheme="blue">
          Points d'intérêt
        </Button>
        <Button size="sm" colorScheme="teal">
          Niveaux d'eau
        </Button>
        <Button size="sm" colorScheme="purple">
          Annotations
        </Button>
      </VStack>
    </Box>
  )
}
