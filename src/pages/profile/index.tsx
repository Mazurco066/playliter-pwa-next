// Dependencies
import Head from 'next/head'
import { ReactElement } from 'react'
import { useUser } from 'infra/services/session'

// Layout and Components
import { NextPageWithLayout } from '../_app'
import { SecureLayout } from 'presentation/ui/_layouts'
import { ProfileView } from 'presentation/ui/views'

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

// Applying layout
Profile.getLayout = function getLayout(page: ReactElement) {
  return (
    <SecureLayout
      pageTitle="Meu Perfil"
      pageSubtitle=""
    >
      {page}
    </SecureLayout>
  )
}

// Exporting component
export default Profile