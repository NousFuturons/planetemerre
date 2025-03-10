// src/components/layout/Footer.tsx
'use client'

import {
  Box,
  Container,
  Stack,
  Text,
  useColorModeValue
} from '@chakra-ui/react'

export function Footer() {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
    >
      <Container
        as={Stack}
        maxW={'container.xl'}
        py={4}
        spacing={4}
        justify={'center'}
        align={'center'}
      >
        <Text>© 2024 Futurons ! Tous droits réservés</Text>
      </Container>
    </Box>
  )
}
