// Dependencies
import Head from 'next/head'
import { ReactElement } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useUser } from 'infra/services/session'

// Layout and Components
import { NextPageWithLayout } from '../_app'
import { SecureLayout } from 'presentation/ui/_layouts'
import { ProfileView } from 'presentation/ui/views'

// Types
import type { GetStaticProps } from 'next'

// Profile component
const Profile: NextPageWithLayout = () => {
  // Check if user authorization is expired
  useUser({ redirectTo: '/login' })

  // Page JSX
  return (
    <main>
      <Head>
        <title>Playliter - Perfil</title>
        <meta name="description" content="Meu perfil" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ProfileView />
    </main>
  )
}

// Load translation files
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale ?? 'pt', ['common', 'profile']),
  },
})

// Applying layout
Profile.getLayout = function getLayout(page: ReactElement) {
  const { t } = useTranslation('profile')
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
export default Profile