// src/components/ui/provider.tsx
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { ReactNode } from 'react'

const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        height: '100%',
        margin: 0,
        padding: 0
      }
    }
  }
})

export function Provider({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  )
}
