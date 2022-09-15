// Dependencies
import { FC, ReactNode }from 'react'

// Components
import { Grid, GridItem } from '@chakra-ui/react'
import { Header, Footer } from 'presentation/ui/components'

// Layout component
export const AccountLayout: FC<{ children: ReactNode }> = ({ children }) => {
  // JSX
  return (
    <Grid
      templateRows='80px 1fr 80px'
      minHeight='100vh'
    >
      <GridItem>
        <Header />
      </GridItem>
      <GridItem py="5">
        {children}
      </GridItem>
      <GridItem>
        <Footer />
      </GridItem>
    </Grid>
  )
}
