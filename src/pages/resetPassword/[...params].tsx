// Dependencies
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useUser } from 'infra/services/session'

// Layout and Components
import { NextPageWithLayout } from '../_app'
import { AccountLayout } from 'presentation/ui/_layouts'
import { ResetPasswordView } from 'presentation/ui/views'

// Types
import type { GetServerSideProps } from 'next'

// ResetPassword component
const ResetPassword: NextPageWithLayout = () => {
  // Check if user authorization is expired
  useUser({
    redirectTo: '/home',
    redirectIfFound: true
  })

  // Hooks
  const router = useRouter()
  
  // Retrieve page slug
  const params: string[] = (router.query.params as string[]) || []

  // Page JSX
  return (
    <main>
      <Head>
        <title>Playliter - Atualizar senha</title>
        <meta name="description" content="Atualizar senha" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ResetPasswordView params={params} />
    </main>
  )
}

// Load translation files
export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale ?? 'pt', ['common', 'resetPassword']),
  }
})

// Applying layout
ResetPassword.getLayout = function getLayout(page: ReactElement) {
  return (
    <AccountLayout>
      {page}
    </AccountLayout>
  )
}

// Exporting component
export default ResetPassword
