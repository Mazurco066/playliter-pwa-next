// Dependencies
import Head from 'next/head'
import { ReactElement } from 'react'
import { useUser } from 'infra/services/session'

// Layout and Components
import { NextPageWithLayout } from '../_app'
import { SecureLayout } from 'presentation/ui/_layouts'
import { SongsView } from 'presentation/ui/views'

// Songs component
const Songs: NextPageWithLayout = () => {
  // Check if user authorization is expired
  useUser({ redirectTo: '/login' })

  // Page JSX
  return (
    <main>
      <Head>
        <title>Playliter - Músicas</title>
        <meta name="description" content="Public songs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SongsView />
    </main>
  )
}

// Applying layout
Songs.getLayout = function getLayout(page: ReactElement) {
  return (
    <SecureLayout
      pageTitle="Músicas"
      pageSubtitle="Públicas"
    >
      {page}
    </SecureLayout>
  )
}

// Exporting component
export default Songs