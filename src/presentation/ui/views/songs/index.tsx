// Dependencies
import { FC } from 'react'

// Layout and Components
import {
  Container,
  Heading
} from '@chakra-ui/react'

// Bands list component
const SongsView: FC = () => {
  // View JSX
  return (
    <div>
      <Container>
        <Heading as="h2" size="xl">
          Songs
        </Heading>
      </Container>
    </div>
  )
}

// Exporting component
export default SongsView
