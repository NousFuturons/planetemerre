// src/app/layout.tsx
import { Inter } from 'next/font/google'
import { Provider } from '@/components/ui/provider'
import { Navbar } from '@/components/layout/Navbar'
import { Box } from '@chakra-ui/react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className} style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
        <Provider>
          <Box position="relative" h="100vh">
            <Navbar />
            {children}
          </Box>
        </Provider>
      </body>
    </html>
  )
}
