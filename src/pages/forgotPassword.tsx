// Dependencies
import Head from 'next/head'
import { ReactElement } from 'react'
import { useUser } from 'infra/services/session'

// Layout and Components
import { NextPageWithLayout } from './_app'
import { AccountLayout } from 'presentation/ui/_layouts'
import { ForgotPasswordView } from 'presentation/ui/views'

// Sign in component
const ForgotPassword: NextPageWithLayout = () => {
  // Check if user is already logged in
  useUser({
    redirectTo: '/home',
    redirectIfFound: true
  })

  // Page JSX
  return (
    <main>
      <Head>
        <title>Playliter - Forgot password</title>
        <meta name="description" content="Platliter account recovery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ForgotPasswordView />
    </main>
  )
}

// Applying layout
ForgotPassword.getLayout = function getLayout(page: ReactElement) {
  return (
    <AccountLayout>
      {page}
    </AccountLayout>
  )
}

// Exporting component
export default ForgotPassword
