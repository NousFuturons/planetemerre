// src/components/layout/Navbar.tsx
'use client'

import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  useColorModeValue
} from '@chakra-ui/react'

export function Navbar() {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box
      as="nav"
      position="fixed"
      top="0"
      left="0"
      right="0"
      bg={bgColor}
      borderBottom={1}
      borderStyle={'solid'}
      borderColor={borderColor}
      zIndex={1000}
      h="64px" // Hauteur fixe pour le calcul
    >
      <Flex
        h="full"
        alignItems={'center'}
        justifyContent={'space-between'}
        maxW={'container.xl'}
        mx={'auto'}
        px={4}
      >
        <Text fontSize={'xl'} fontWeight={'bold'}>
          Saint-Malo +5 mètres
        </Text>

        <Stack direction={'row'} spacing={4}>
          <Button variant={'ghost'}>Explorer</Button>
          <Button colorScheme={'blue'}>Connexion</Button>
        </Stack>
      </Flex>
    </Box>
  )
}
