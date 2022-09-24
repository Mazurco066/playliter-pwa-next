// Dependencies
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fetchJson } from 'infra/services/http'

// Component packages
import theme from 'presentation/theme'
import NextNProgress from 'nextjs-progressbar'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'

// Create a client
const queryClient: QueryClient = new QueryClient()

// Layout wrapper
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

// App props includind layout
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

// App wrapper
function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  // Global JSX
  return (  
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme} cssVarsRoot="body">
        <NextNProgress
          color="#8257e5"
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
        />
        { getLayout(<Component {...pageProps} />) }
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      </ChakraProvider>
    </QueryClientProvider>
  ) 
}

// Exporting app
export default MyApp
