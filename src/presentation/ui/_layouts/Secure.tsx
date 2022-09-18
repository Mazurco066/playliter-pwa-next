// Dependencies
import { FC, ReactNode }from 'react'
import { useRouter } from 'next/router'

// Types
import type { BottomNav } from 'domain/types'

// Components
import { Grid, GridItem } from '@chakra-ui/react'
import { TopBar, TopNavigation, BottomNavigation } from 'presentation/ui/components'
import { FaCompactDisc, FaHome, FaUsers } from 'react-icons/fa'

// Secure navigation settings
const navigation: BottomNav[] = [
  {
    label: 'Bandas',
    icon: FaUsers,
    path: '/bands',
    activePaths: [
      '/bands'
    ]
  },
  {
    label: 'Home',
    icon: FaHome,
    path: '/home',
    activePaths: [
      '/home'
    ]
  },
  {
    label: 'Músicas',
    icon: FaCompactDisc,
    path: '/songs',
    activePaths: [
      '/songs'
    ]
  }
]

// Layout component
export const SecureLayout: FC<{
  children: ReactNode,
  pageTitle?: string,
  pageSubtitle?: string
}> = ({
  children,
  pageTitle = '',
  pageSubtitle = ''
}) => {
  // Hooks
  const router = useRouter()

  // JSX
  return (
    <Grid
      templateRows="80px 1fr 80px"
      minHeight="100vh"
    >
      <GridItem>
        {
          router.route === '/profile' ? (
            <TopBar
              pageTitle={pageTitle}
              pageSubtitle={pageSubtitle}
            />
          ) : (
            <TopNavigation
              pageTitle={pageTitle}
              pageSubtitle={pageSubtitle}
            />
          )
        }
      </GridItem>
      <GridItem py="5">
        {children}
      </GridItem>
      <GridItem>
        <BottomNavigation
          navigation={navigation}
        />
      </GridItem>
    </Grid>
  )
}
