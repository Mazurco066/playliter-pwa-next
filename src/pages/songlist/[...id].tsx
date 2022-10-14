// Dependencies
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import { useUser } from 'infra/services/session'

// Layout and Components
import { NextPageWithLayout } from '../_app'
import { SecureLayout } from 'presentation/ui/_layouts'
import { SonglistView } from 'presentation/ui/views'

// Songlist component
const Songlist: NextPageWithLayout = () => {
  // Check if user authorization is expired
  useUser({ redirectTo: '/login' })

  // Hooks
  const router = useRouter()
  
  // Retrieve page id
  const id: string = (router.query.id as string) || ''

  // Page JSX
  return (
    <main>
      <Head>
        <title>Playliter - Apresentação</title>
        <meta name="description" content="Apresentação" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SonglistView id={id} />
    </main>
  )
}

// Applying layout
Songlist.getLayout = function getLayout(page: ReactElement) {
  return (
    <SecureLayout
      pageTitle="Detalhes da Apresentação"
      pageSubtitle=""
    >
      {page}
    </SecureLayout>
  )
}

// Exporting component
export default Songlist
