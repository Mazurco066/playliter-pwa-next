// Dependencies
import Head from 'next/head'
import { ReactElement } from 'react'

// Layout and Components
import { NextPageWithLayout } from './_app'
import { AccountLayout } from 'presentation/ui/_layouts'
import { SignUpView } from 'presentation/ui/views'

// Sign in component
const SignUp: NextPageWithLayout = () => {
  return (
    <main>
      <Head>
        <title>Playliter - SignUp</title>
        <meta name="description" content="SignUp into Playliter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SignUpView />
    </main>
  )
}

// Applying layout
SignUp.getLayout = function getLayout(page: ReactElement) {
  return (
    <AccountLayout>
      {page}
    </AccountLayout>
  )
}

// Exporting component
export default SignUp
