// Dependencies
import Head from 'next/head'
import { ReactElement } from 'react'
import { useUser } from 'infra/services/session'

// Layout and Components
import { NextPageWithLayout } from './_app'
import { AccountLayout } from 'presentation/ui/_layouts'
import { LandingView } from 'presentation/ui/views'

// Landing component
const Landing: NextPageWithLayout = () => {
  // Check if user is already logged in
  useUser({
    redirectTo: '/home',
    redirectIfFound: true
  })

  // Page JSX
  return (
    <main>
      <Head>
        <title>Playliter</title>
        <meta name="description" content="Band manager app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LandingView />     
    </main>
  )
}

// Applying layout
Landing.getLayout = function getLayout(page: ReactElement) {
  return (
    <AccountLayout>
      {page}
    </AccountLayout>
  )
}

// Exporting component
export default Landing
