// Dependencies
import { FC, ReactNode }from 'react'

// Types
import type { BottomNav } from 'domain/types'

// Components
import { Grid, GridItem } from '@chakra-ui/react'
import { TopBar, BottomNavigation } from 'presentation/ui/components'
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
export const SecureLayout: FC<{ children: ReactNode }> = ({
  children
}) => {

  // JSX
  return (
    <Grid
      templateRows="80px 1fr 80px"
      minHeight="100vh"
    >
      <GridItem>
        <TopBar />
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
