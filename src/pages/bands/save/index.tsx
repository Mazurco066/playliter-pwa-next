// Dependencies
import Head from 'next/head'
import { ReactElement } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useUser } from 'infra/services/session'

// Layout and Components
import { NextPageWithLayout } from '../../_app'
import { SecureLayout } from 'presentation/ui/_layouts'
import { SaveBandView } from 'presentation/ui/views'

// Types
import type { GetStaticProps } from 'next'

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

// Load translation files
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale ?? 'pt', ['common', 'band']),
  },
})

// Applying layout
SaveBand.getLayout = function getLayout(page: ReactElement) {
  const { t } = useTranslation('band')
  return (
    <SecureLayout
      pageTitle={t('save_title')}
      pageSubtitle=""
    >
      {page}
    </SecureLayout>
  )
}

// Exporting component
export default SaveBand
