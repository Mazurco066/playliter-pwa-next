// Dependencies
import Head from 'next/head'
import { ReactElement } from 'react'

// Layout and Components
import { NextPageWithLayout } from './_app'
import { SecureLayout } from 'presentation/ui/_layouts'
import { HomeView } from 'presentation/ui/views'

// Home component
const Home: NextPageWithLayout = () => {
  // Page JSX
  return (
    <main>
      <Head>
        <title>Playliter - Home</title>
        <meta name="description" content="Band manager app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomeView />
    </main>
  )
}

// Applying layout
Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <SecureLayout>
      {page}
    </SecureLayout>
  )
}

// Exporting component
export default Home
