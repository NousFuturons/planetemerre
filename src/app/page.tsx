// src/app/page.tsx
import { Box, Container } from '@chakra-ui/react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MapView } from '@/components/map/MapView'

export default function Home() {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Container maxW="container.xl" flex={1} py={8}>
        <MapView />
      </Container>
      <Footer />
    </Box>
  )
}
