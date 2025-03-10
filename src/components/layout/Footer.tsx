// src/components/layout/Footer.tsx
import { Box, Text, Container } from '@chakra-ui/react'

export function Footer() {
  return (
    <Box as="footer" bg="gray.100" py={4}>
      <Container>
        <Text textAlign="center">
          © {new Date().getFullYear()} Futurons! Tous droits réservés.
        </Text>
      </Container>
    </Box>
  )
}
