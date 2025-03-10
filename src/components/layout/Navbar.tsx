// src/components/layout/Navbar.tsx
import { Box, Flex, Heading, Button } from '@chakra-ui/react'

export function Navbar() {
  return (
    <Box as="nav" bg="gray.800" color="white" px={4} py={3}>
      <Flex align="center" justify="space-between">
        <Heading size="md">Planète Merre : Saint-Malo +5m</Heading>
        <Flex gap={4}>
          <Button variant="ghost">Login</Button>
          <Button colorScheme="blue">Sign Up</Button>
        </Flex>
      </Flex>
    </Box>
  )
}
