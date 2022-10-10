// Dependencies
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import { useUser } from 'infra/services/session'

// Layout and Components
import { NextPageWithLayout } from '../../_app'
import { SecureLayout } from 'presentation/ui/_layouts'
import { SaveShowView } from 'presentation/ui/views'

// SaveShow component
const SaveShow: NextPageWithLayout = () => {
  // Check if user authorization is expired
  useUser({ redirectTo: '/login' })

  // Hooks
  const router = useRouter()
  
  // Retrieve page slug
  const id: string = (router.query.id as string) || ''
  const band: string = (router.query.band as string) || ''

  // Page JSX
  return (
    <main>
      <Head>
        <title>Playliter - Salvar Apresentação</title>
        <meta name="description" content="Salvar Apresentação" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SaveShowView id={id} bandId={band} />
    </main>
  )
}

// Applying layout
SaveShow.getLayout = function getLayout(page: ReactElement) {
  return (
    <SecureLayout
      pageTitle="Salvar Apresentação"
      pageSubtitle=""
    >
      {page}
    </SecureLayout>
  )
}

// Exporting component
export default SaveShow
