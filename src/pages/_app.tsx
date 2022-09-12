// Dependencies
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'

// Component packages
import NextNProgress from 'nextjs-progressbar'
import { ChakraProvider  } from '@chakra-ui/react'

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
    <ChakraProvider>
      <NextNProgress
        color="#8257e5"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
      />
      { getLayout(<Component {...pageProps} />) }
    </ChakraProvider>
  ) 
}

// Exporting app
export default MyApp
