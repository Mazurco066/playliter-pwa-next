// Dependencies
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import { useUser } from 'infra/services/session'

// Layout and Components
import { NextPageWithLayout } from '../../_app'
import { SecureLayout } from 'presentation/ui/_layouts'
import { SaveBandView } from 'presentation/ui/views'

// Songs component
const SaveBand: NextPageWithLayout = () => {
  // Check if user authorization is expired
  useUser({ redirectTo: '/login' })

  // Hooks
  const router = useRouter()
  
  // Retrieve page slug
  const slug: string = (router.query.slug as string) || ''

  // Page JSX
  return (
    <main>
      <Head>
        <title>Playliter - Save Band</title>
        <meta name="description" content="Save Band" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SaveBandView id={slug} />
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