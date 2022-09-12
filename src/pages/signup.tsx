// Dependencies
import Head from 'next/head'
import { ReactElement } from 'react'

// Layout and Components
import { NextPageWithLayout } from './_app'
import { AccountLayout } from 'presentation/ui/_layouts'

// Sign in component
const SignUp: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Playliter</title>
        <meta name="description" content="Band manager app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <p>Sign up</p>
    </div>
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
