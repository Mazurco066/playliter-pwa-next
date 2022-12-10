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
import { SaveShowView } from 'presentation/ui/views'

// Types
import type { GetStaticProps } from 'next'

// SaveShow component
const SaveShow: NextPageWithLayout = () => {
  // Check if user authorization is expired
  useUser({ redirectTo: '/login' })

  // Hooks
  const router = useRouter()
  
  // Retrieve page slug
  const band: string = (router.query.band as string) || ''

  // Page JSX
  return (
    <main>
      <Head>
        <title>Playliter - Salvar Apresentação</title>
        <meta name="description" content="Savar Apresentação" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SaveShowView bandId={band} />
    </main>
  )
}

// Load translation files
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale ?? 'pt', ['common', 'concert']),
  },
})

// Applying layout
SaveShow.getLayout = function getLayout(page: ReactElement) {
  const { t } = useTranslation('concert')
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
export default SaveShow
