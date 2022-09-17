// Dependencies
import { FC, ReactNode }from 'react'

// Components
import { Grid, GridItem } from '@chakra-ui/react'
import { TopBar, BottomNavigation } from 'presentation/ui/components'

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
        <BottomNavigation />
      </GridItem>
    </Grid>
  )
}
