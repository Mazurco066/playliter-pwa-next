// Dependencies
import { FC } from 'react'
import { useRouter } from 'next/router'

// Layout and Components
import {
  Button,
  Container,
  Heading
} from '@chakra-ui/react'

// Sign in component
const LandingView: FC = () => {
  // Hooks
  const router = useRouter()

  // View JSX
  return (
    <div>
      <Container maxWidth="6xl">
        <Button
          variant="fade"
          width="full"
          onClick={() => router.push('/login')}
        >
          Acessar
        </Button>
      </Container>
    </div>
  )
}

// Exporting component
export default LandingView
