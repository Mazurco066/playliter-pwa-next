// Dependencies
import { FC, ReactNode }from 'react'

// Components
import { Box } from '@chakra-ui/react'
import { LandingHeader, LandingFooter } from 'presentation/ui/components'

// Layout component
export const LandingLayout: FC<{ children: ReactNode }> = ({
  children
}) => {

  // JSX
  return (
    <Box position="relative">
      <LandingHeader />
      {children}
      <LandingFooter />
    </Box>
  )
}
