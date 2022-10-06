// Dependencies
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import { useUser } from 'infra/services/session'

// Layout and Components
import { NextPageWithLayout } from '../_app'
import { SecureLayout } from 'presentation/ui/_layouts'
import { ShowView } from 'presentation/ui/views'

// Show component
const Show: NextPageWithLayout = () => {
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
      <ShowView id={id} />
    </main>
  )
}

// Applying layout
Show.getLayout = function getLayout(page: ReactElement) {
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
export default Show
