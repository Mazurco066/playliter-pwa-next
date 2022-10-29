// Dependencies
import { FC, ReactNode }from 'react'

// Components
import { Box, Grid, GridItem } from '@chakra-ui/react'
import { LandingHeader, LandingFooter } from 'presentation/ui/components'

// Layout component
export const LandingLayout: FC<{ children: ReactNode }> = ({
  children
}) => {

  // JSX
  return (
    <Box
      position="relative"
      height="full"
    >
      <LandingHeader />
      <Grid
        templateRows="1fr auto"
        templateColumns="100%"
        height="full"
        overflowY="auto"
        pt="80px"
      >
        <GridItem>
          {children}
        </GridItem>
        <GridItem>
          <LandingFooter />
        </GridItem>
      </Grid>
    </Box>
  )
}
