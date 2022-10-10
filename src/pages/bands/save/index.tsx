// Dependencies
import Head from 'next/head'
import { ReactElement } from 'react'
import { useUser } from 'infra/services/session'

// Layout and Components
import { NextPageWithLayout } from '../../_app'
import { SecureLayout } from 'presentation/ui/_layouts'
import { SaveBandView } from 'presentation/ui/views'

// SaveBand component
const SaveBand: NextPageWithLayout = () => {
  // Check if user authorization is expired
  useUser({ redirectTo: '/login' })

  // Page JSX
  return (
    <main>
      <Head>
        <title>Playliter - Salvar Banda</title>
        <meta name="description" content="Savar Banda" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SaveBandView />
    </main>
  )
}

// Applying layout
SaveBand.getLayout = function getLayout(page: ReactElement) {
  return (
    <SecureLayout
      pageTitle="Salvar banda"
      pageSubtitle=""
    >
      {page}
    </SecureLayout>
  )
}

// Exporting component
export default SaveBand
