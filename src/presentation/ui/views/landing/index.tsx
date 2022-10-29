// Dependencies
import { FC } from 'react'
import { useRouter } from 'next/router'

// Layout and Components
import { Hero } from './elements'
import {
  Box,
  Container,
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
        <Text>Conteúdo da landing page em breve aqui</Text>
      </Container>
    </Box>
  )
}

// Exporting component
export default LandingView
