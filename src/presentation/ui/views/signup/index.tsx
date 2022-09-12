// Dependencies
import { FC } from 'react'

// Layout and Components
import {
  Container,
  Heading
} from '@chakra-ui/react'

// Sign in component
const SignUpView: FC = () => {
  // View JSX
  return (
    <div>
      <Container>
        <Heading as="h2" size="xl" mb="5">
          SignUp
        </Heading>
      </Container>
    </div>
  )
}

// Exporting component
export default SignUpView
