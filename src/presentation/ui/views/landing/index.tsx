// Dependencies
import { FC } from 'react'

// Layout and Components
import {
  Container,
  Heading
} from '@chakra-ui/react'

// Sign in component
const LandingView: FC = () => {
  // View JSX
  return (
    <div>
      <Container>
        <Heading as="h2" size="xl" mb="5">
          Landing
        </Heading>
      </Container>
    </div>
  )
}

// Exporting component
export default LandingView
