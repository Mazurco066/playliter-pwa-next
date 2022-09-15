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
      templateRows='100px 1fr 80px'
      minHeight='100vh'
    >
      <GridItem>
        <Header />
      </GridItem>
      <GridItem>
        {children}
      </GridItem>
      <GridItem>
        <Footer />
      </GridItem>
    </Grid>
  )
}
