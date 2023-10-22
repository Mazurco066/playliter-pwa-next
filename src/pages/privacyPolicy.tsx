// Dependencies
import Head from 'next/head'
import { ReactElement } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

// Layout and Components
import { NextPageWithLayout } from './_app'
import { LandingLayout } from 'presentation/ui/_layouts'
import { PrivacyPolicyView } from 'presentation/ui/views'

// Types
import type { GetStaticProps } from 'next'

// PrivacyPolicy component
const PrivacyPolicy: NextPageWithLayout = () => {
  // Page JSX
  return (
    <main>
      <Head>
        <title>Playliter - Privacy Policy</title>
        <meta name="description" content="App privacy Police" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PrivacyPolicyView />
    </main>
  )
}

// Load translation files
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale ?? 'pt', ['landing', 'privacy']),
  },
})

// Applying layout
PrivacyPolicy.getLayout = function getLayout(page: ReactElement) {
  return (
    <LandingLayout>
      {page}
    </LandingLayout>
  )
}

// Exporting component
export default PrivacyPolicy
