// Dependencies
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useUser } from 'infra/services/session'

// Layout and Components
import { NextPageWithLayout } from '../_app'
import { SecureLayout } from 'presentation/ui/_layouts'
import { VerifyAccountView } from 'presentation/ui/views'

// Types
import type { GetServerSideProps } from 'next'

// VerifyAccount component
const VerifyAccount: NextPageWithLayout = () => {
  // Check if user authorization is expired
  useUser({ redirectTo: '/login' })

  // Hooks
  const router = useRouter()
  
  // Retrieve page slug
  const code: string = (router.query.code as string) || ''

  // Page JSX
  return (
    <main>
      <Head>
        <title>Playliter - Verificar E-mail</title>
        <meta name="description" content="Verificar E-mail" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <VerifyAccountView code={code} />
    </main>
  )
}

// Load translation files
export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale ?? 'pt', ['common', 'verify']),
  }
})

// Applying layout
VerifyAccount.getLayout = function getLayout(page: ReactElement) {
  return (
    <SecureLayout
      pageTitle="Verificar E-mail"
      pageSubtitle=""
    >
      {page}
    </SecureLayout>
  )
}

// Exporting component
export default VerifyAccount
