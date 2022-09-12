// Dependencies
import { FC, ReactNode }from 'react'

// Components
import { Box } from '@chakra-ui/react'

// Layout component
export const SecureLayout: FC<{ children: ReactNode }> = ({
  children
}) => {

  // JSX
  return (
    <Box>
      {children}
    </Box>
  )
}
