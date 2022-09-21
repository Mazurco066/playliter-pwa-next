// Dependencies
import { FC, ReactNode }from 'react'
import { useRouter } from 'next/router'

// Types
import type { BottomNav } from 'domain/types'

// Components
import { Grid, GridItem, Box } from '@chakra-ui/react'
import { TopBar, TopNavigation, BottomNavigation } from 'presentation/ui/components'
import { FaCompactDisc, FaHome, FaUsers } from 'react-icons/fa'

// Secure navigation settings
const navigation: BottomNav[] = [
  {
    label: 'Bandas',
    icon: FaUsers,
    path: '/bands',
    activePaths: [
      '/bands',
      '/bands/save'
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
      templateColumns="100%"
      height="full"      
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
      <GridItem
        py="5"
        maxHeight="100%"
        overflowY="auto"
      >
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
