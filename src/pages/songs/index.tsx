// Dependencies
import Head from 'next/head'
import { ReactElement } from 'react'
import { useTranslation } from 'next-i18next'
import { useUser } from 'infra/services/session'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

// Layout and Components
import { NextPageWithLayout } from '../_app'
import { SecureLayout } from 'presentation/ui/_layouts'
import { SongsView } from 'presentation/ui/views'

// Types
import type { GetStaticProps } from 'next'

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

// Load translation files
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale ?? 'pt', ['common', 'songs']),
  },
})

// Applying layout
Songs.getLayout = function getLayout(page: ReactElement) {
  const { t } = useTranslation('songs')
  return (
    <SecureLayout
      pageTitle={t('title')}
      pageSubtitle={t('subtitle')}
    >
      {page}
    </SecureLayout>
  )
}

// Exporting component
export default Songs
