// Dependencies
import Head from 'next/head'
import { ReactElement } from 'react'

// Layout and Components
import { NextPageWithLayout } from './_app'
import { AccountLayout } from 'presentation/ui/_layouts'
import { LoginInView } from 'presentation/ui/views'

// Sign in component
const LogIn: NextPageWithLayout = () => {
  // Page JSX
  return (
    <main>
      <Head>
        <title>Playliter - Login</title>
        <meta name="description" content="Sign in into Playliter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoginInView />
    </main>
  )
}

// Applying layout
LogIn.getLayout = function getLayout(page: ReactElement) {
  return (
    <AccountLayout>
      {page}
    </AccountLayout>
  )
}

// Exporting component
export default LogIn
