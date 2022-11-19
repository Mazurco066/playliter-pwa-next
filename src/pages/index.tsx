// Dependencies
import Head from 'next/head'
import { ReactElement } from 'react'
import { useUser } from 'infra/services/session'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

// Layout and Components
import { NextPageWithLayout } from './_app'
import { LandingLayout } from 'presentation/ui/_layouts'
import { LandingView } from 'presentation/ui/views'

// Types
import type { GetStaticProps } from 'next'

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

// Load translation files
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale ?? 'pt', ['landing']),
  },
})

// Applying layout
Landing.getLayout = function getLayout(page: ReactElement) {
  return (
    <LandingLayout>
      {page}
    </LandingLayout>
  )
}

// Exporting component
export default Landing
