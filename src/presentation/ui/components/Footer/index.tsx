// Dependencies
import { FC } from 'react'

// Components
import { Icon } from '@chakra-ui/icons'
import { FaGithub } from 'react-icons/fa'
import {
  Container,
  Flex,
  Divider,
  Link,
  Text
} from '@chakra-ui/react'

// Footer component
export const Footer: FC = () => {
  // JSX
  return (
    <Container height="full" maxW="6xl">
      <Divider orientation="horizontal" />
      <Flex
        height="full"
        alignItems="center" 
        justifyContent="space-between"
      >
        <Text>
          Playliter <Text as="strong" color="secondary.500">v1.0.1</Text>
        </Text>
        <Link
          href="https://github.com/Mazurco066/playliter-pwa-next"
          target="_blank"
          rel="noreferrer noopener"
        >
          <Icon w={6} h={6} as={FaGithub} />
        </Link>
      </Flex>
    </Container>
  )
}