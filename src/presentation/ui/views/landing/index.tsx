// Dependencies
import { FC } from 'react'
import { useRouter } from 'next/router'

// Layout and Components
import { Hero } from './elements'
import {
  Box,
  Container,
  Heading,
  Text
} from '@chakra-ui/react'

// Sign in component
const LandingView: FC = () => {
  // Hooks
  const router = useRouter()

  // View JSX
  return (
    <Box bgColor="gray.100">
      <Hero />
      <Container
        maxWidth="6xl"
        py="20px"
        color="gray.900"
      >
        <Heading
          as="h3"
          size="md"
          textTransform="uppercase"
        >
          Funcionalidades do aplicativo
        </Heading>
      </Container>
    </Box>
  )
}

// Exporting component
export default LandingView
