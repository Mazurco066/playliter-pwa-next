// Dependencies
import { FC } from 'react'

// Components
import { ThemeSwitch } from 'presentation/ui/components'
import { Container, Flex } from '@chakra-ui/react'

// Header component
export const Header: FC = () => {
  // JSX
  return (
    <Container height="full">
      <Flex
        justify="flex-end"
        align="center"
        height="full"
      >
        <ThemeSwitch />
      </Flex>
    </Container> 
  )
}
