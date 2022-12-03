// Dependencies
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useUser } from 'infra/services/session'

// Layout and Components
import { NextPageWithLayout } from '../_app'
import { SecureLayout } from 'presentation/ui/_layouts'
import { SongView } from 'presentation/ui/views'

// Types
import type { GetServerSideProps } from 'next'

// Song component
const Song: NextPageWithLayout = () => {
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
        <title>Playliter - Música</title>
        <meta name="description" content="Música" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SongView id={id} />
    </main>
  )
}

// Load translation files
export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale ?? 'pt', ['common', 'song']),
  }
})

// Applying layout
Song.getLayout = function getLayout(page: ReactElement) {
  return (
    <SecureLayout
      pageTitle="Detalhes da Música"
      pageSubtitle=""
    >
      {page}
    </SecureLayout>
  )
}

// Exporting component
export default Song
