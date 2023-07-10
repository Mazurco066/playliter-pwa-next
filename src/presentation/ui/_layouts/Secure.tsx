// Dependencies
import { FC, ReactNode }from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

// Types
import type { BottomNav } from 'domain/types'

// Components
import { Grid, GridItem, useMediaQuery } from '@chakra-ui/react'
import { TopBar, TopNavigation, BottomNavigation, PageTransition } from 'presentation/ui/components'
import { FaCompactDisc, FaHome, FaUsers } from 'react-icons/fa'

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
  const { t } = useTranslation('common')

  // Display hooks
  const [ isPrinting ] = useMediaQuery(['print'])

  // JSX if is printing songs
  if (isPrinting) {
    return (
      <>
        {children}
      </>
    )
  }

  // Secure navigation settings
  const navigation: BottomNav[] = [
    {
      label: t('bottom_navigation.bands'),
      icon: FaUsers,
      path: '/bands',
      activePaths: [
        '/bands',
        '/bands/save',
        '/shows',
        '/songlist'
      ]
    },
    {
      label: t('bottom_navigation.home'),
      icon: FaHome,
      path: '/home',
      activePaths: [
        '/home'
      ]
    },
    {
      label: t('bottom_navigation.songs'),
      icon: FaCompactDisc,
      path: '/songs',
      activePaths: [
        '/songs'
      ]
    }
  ]
  
  // JSX for PWA
  return (
    <Grid
      templateRows="80px 1fr 80px"
      templateColumns="100%"
      height="full"
      sx={{ '@media print': { display: 'block' } }}
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
        position="relative"
        sx={{ '@media print': { padding: 0 } }}
      >
        <PageTransition>
          {children}
        </PageTransition>
      </GridItem>
      <GridItem>
        <BottomNavigation
          navigation={navigation}
        />
      </GridItem>
    </Grid>
  )  
}
