// Dependencies
import { FC } from 'react'
import { useUser } from 'infra/services/session'

// Layout and Components
import {
  Avatar,
  Container,
  Heading
} from '@chakra-ui/react'

// Sign in component
const HomeView: FC = () => {
  // Hooks
  const { user } = useUser()

  // View JSX
  return (
    <div>
      <Container>
        <Heading as="h2" size="xl" mb="5">
          <Avatar src={user?.avatar} name={user?.name} />
        </Heading>
      </Container>
    </div>
  )
}

// Exporting component
export default HomeView
