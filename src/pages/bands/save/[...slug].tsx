// Dependencies
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useUser } from 'infra/services/session'

// Layout and Components
import { NextPageWithLayout } from '../../_app'
import { SecureLayout } from 'presentation/ui/_layouts'
import { SaveBandView } from 'presentation/ui/views'

// Types
import type { GetServerSideProps } from 'next'

// SaveBand component
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
        <title>Playliter - Salvar Banda</title>
        <meta name="description" content="Salvar Banda" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SaveBandView id={slug} />
    </main>
  )
}

// Load translation files
export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale ?? 'pt', ['common', 'band']),
  }
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
