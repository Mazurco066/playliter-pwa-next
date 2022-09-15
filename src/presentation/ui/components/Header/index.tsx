// Dependencies
import { FC } from 'react'

// Components
import { ThemeSwitch } from 'presentation/ui/components'
import {
  Container,
  Divider,
  Flex,
  Heading,
  Link,
  Image
} from '@chakra-ui/react'

// Header component
export const Header: FC = () => {
  // JSX
  return (
    <Container height="full">
      <Flex
        justify="space-between"
        align="center"
        height="full"
      >
        <Link href="/">
          <Flex alignItems="center">
            <Image
              src="logo-512.svg"
              alt="Playliter logo"
              width="56px"
            />
            <Heading
              as="h1"
              size="md"
              ml="2"
            >
              Playliter
            </Heading>
          </Flex>
        </Link>
        <ThemeSwitch />
      </Flex>
      <Divider orientation="horizontal" />
    </Container> 
  )
}
