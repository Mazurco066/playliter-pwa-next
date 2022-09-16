// Dependencies
import { FC } from 'react'
import { useUser } from 'infra/services/session'

// Layout and Components
import { Container } from '@chakra-ui/react'

// Sign in component
const HomeView: FC = () => {
  // Hooks
  const { user } = useUser()

  // View JSX
  return (
    <div>
      <Container>
     
      </Container>
    </div>
  )
}

// Exporting component
export default HomeView
