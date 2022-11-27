// Dependencies
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useUser } from 'infra/services/session'

// Layout and Components
import { NextPageWithLayout } from '../_app'
import { SecureLayout } from 'presentation/ui/_layouts'
import { BandView } from 'presentation/ui/views'

// Types
import type { GetServerSideProps } from 'next'

// Songs component
const Band: NextPageWithLayout = () => {
  // Check if user authorization is expired
  useUser({ redirectTo: '/login' })

  // Hooks
  const router = useRouter()
  
  // Retrieve page slug
  const slug: string = (router.query.slug as string) || ''

  // Page JSX
  return (
    <main>
      <Head>
        <title>Playliter - Banda</title>
        <meta name="description" content="Banda" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BandView id={slug} />
    </main>
  )
}

// Load translation files
export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale ?? 'pt', ['common', 'band']),
  }
})

// Applying layout
Band.getLayout = function getLayout(page: ReactElement) {
  return (
    <SecureLayout
      pageTitle="Detalhes da Banda"
      pageSubtitle=""
    >
      {page}
    </SecureLayout>
  )
}

// Exporting component
export default Band
