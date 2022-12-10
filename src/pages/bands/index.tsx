// Dependencies
import Head from 'next/head'
import { ReactElement } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useUser } from 'infra/services/session'

// Layout and Components
import { NextPageWithLayout } from '../_app'
import { SecureLayout } from 'presentation/ui/_layouts'
import { BandsView } from 'presentation/ui/views'

// Types
import type { GetStaticProps } from 'next'

// Bands component
const Bands: NextPageWithLayout = () => {
  // Check if user authorization is expired
  useUser({ redirectTo: '/login' })

  // Page JSX
  return (
    <main>
      <Head>
        <title>Playliter - Bandas</title>
        <meta name="description" content="Bandas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BandsView />
    </main>
  )
}

// Load translation files
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale ?? 'pt', ['common', 'bands']),
  },
})

// Applying layout
Bands.getLayout = function getLayout(page: ReactElement) {
  const { t } = useTranslation('bands')
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
export default Bands
