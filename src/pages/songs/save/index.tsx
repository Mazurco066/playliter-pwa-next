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
import { SaveSongView } from 'presentation/ui/views'

// Types
import type { GetStaticProps } from 'next'

// SaveSong component
const SaveSong: NextPageWithLayout = () => {
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
        <title>Playliter - Salvar Música</title>
        <meta name="description" content="Savar Música" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SaveSongView bandId={band} />
    </main>
  )
}

// Load translation files
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale ?? 'pt', ['common', 'song']),
  },
})

// Applying layout
SaveSong.getLayout = function getLayout(page: ReactElement) {
  const { t } = useTranslation('song')
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
export default SaveSong
