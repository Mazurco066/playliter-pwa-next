// Dependencies
import Head from 'next/head'
import { ReactElement } from 'react'

// Layout and Components
import { NextPageWithLayout } from './_app'
import { SecureLayout } from 'presentation/ui/_layouts'

// Hooks
import { useUser } from 'infra/services/session'

// Home component
const Home: NextPageWithLayout = () => {
  // Retrieve user from session
  const { user } = useUser({
    redirectTo: '/login'
  })

  // Page JSX
  return (
    <div>
      <Head>
        <title>Playliter</title>
        <meta name="description" content="Band manager app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <p>Home: { JSON.stringify(user) }</p>      
    </div>
  )
}

// Applying layout
Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <SecureLayout>
      {page}
    </SecureLayout>
  )
}

// Exporting component
export default Home
