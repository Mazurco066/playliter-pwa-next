// Dependencies
import { FC } from 'react'

// Layout and Components
import {
  Container,
  Heading
} from '@chakra-ui/react'

// Sign in component
const HomeView: FC = () => {
  // View JSX
  return (
    <div>
      <Container>
        <Heading as="h2" size="xl" mb="5">
          Home
        </Heading>
      </Container>
    </div>
  )
}

// Exporting component
export default HomeView
