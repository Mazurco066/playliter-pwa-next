// Dependencies
import { FC } from 'react'
import { useUser } from 'infra/services/session'

// Layout and Components
import {
  Container,
  Heading,
  Text,
  useColorModeValue
} from '@chakra-ui/react'

// Sign in component
const HomeView: FC = () => {
  // Hooks
  const { user } = useUser()

  // Color hooks
  const showSubtitleColor = useColorModeValue('gray.500', 'gray.400')

  // View JSX
  return (
    <div>
      <Container>
        <Heading as="h3" size="xl">
          Bem vindo(a)!
        </Heading>
        <Text color={showSubtitleColor}>
          3 Apresentações pendentes
        </Text>
      </Container>
    </div>
  )
}

// Exporting component
export default HomeView
