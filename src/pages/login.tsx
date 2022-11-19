// Dependencies
import Head from 'next/head'
import { ReactElement } from 'react'
import { useUser } from 'infra/services/session'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

// Layout and Components
import { NextPageWithLayout } from './_app'
import { AccountLayout } from 'presentation/ui/_layouts'
import { LoginInView } from 'presentation/ui/views'

// Types
import type { GetStaticProps } from 'next'

// Sign in component
const LogIn: NextPageWithLayout = () => {
  // Check if user is already logged in
  useUser({
    redirectTo: '/home',
    redirectIfFound: true
  })

  // Page JSX
  return (
    <>
      <Head>
        <title>Playliter - Login</title>
        <meta name="description" content="Sign in into Playliter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoginInView />
    </>
  )
}

// Load translation files
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale ?? 'pt', ['common', 'login']),
  },
})

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
