// Dependencies
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useUser } from 'infra/services/session'

// Layout and Components
import { NextPageWithLayout } from '../_app'
import { SecureLayout } from 'presentation/ui/_layouts'
import { SonglistView } from 'presentation/ui/views'

// Types
import type { GetServerSideProps } from 'next'

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
        <title>Playliter - Visualização Sequencial</title>
        <meta name="description" content="Visualização Sequencial" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SonglistView id={id} />
    </main>
  )
}

// Load translation files
export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale ?? 'pt', ['common', 'songList']),
  }
})

// Applying layout
Songlist.getLayout = function getLayout(page: ReactElement) {
  const { t } = useTranslation('songList')
  return (
    <SecureLayout
      pageTitle={t('title')}
      pageSubtitle=""
    >
      {page}
    </SecureLayout>
  )
}

// Exporting component
export default Songlist
