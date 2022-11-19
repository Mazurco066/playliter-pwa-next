// Dependencies
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'

// Query service
import { SWRConfig } from 'swr'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { requestClient } from 'infra/services/http'

// I18n wrappers
import { appWithTranslation } from 'next-i18next'

// Component packages
import theme from 'presentation/theme'
import NextNProgress from 'nextjs-progressbar'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'

// Create a client for tanstack client
const queryClient: QueryClient = new QueryClient()

// Layout wrapper
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

// App props includind layout
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

// Global SWR Fetcher fot user hook
const fetcher = (url: string) => requestClient(url, 'get')

// App wrapper
function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  // Global JSX
  return (  
    <QueryClientProvider client={queryClient}>
      <SWRConfig value={{ fetcher }}>
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
      </SWRConfig>
    </QueryClientProvider>
  ) 
}

// Exporting app
export default appWithTranslation(MyApp)
