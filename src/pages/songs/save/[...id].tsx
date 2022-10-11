// Dependencies
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import { useUser } from 'infra/services/session'

// Layout and Components
import { NextPageWithLayout } from '../../_app'
import { SecureLayout } from 'presentation/ui/_layouts'
import { SaveSongView } from 'presentation/ui/views'

// SaveSong component
const SaveSong: NextPageWithLayout = () => {
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
        <title>Playliter - Salvar Música</title>
        <meta name="description" content="Salvar Música" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SaveSongView id={id} bandId={band} />
    </main>
  )
}

// Applying layout
SaveSong.getLayout = function getLayout(page: ReactElement) {
  return (
    <SecureLayout
      pageTitle="Salvar Música"
      pageSubtitle=""
    >
      {page}
    </SecureLayout>
  )
}

// Exporting component
export default SaveSong
