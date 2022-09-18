// Dependencies
import { FC } from 'react'

// Layout and Components
import {
  Container,
  Heading
} from '@chakra-ui/react'

// Bands list component
const BandsView: FC = () => {
  // View JSX
  return (
    <div>
      <Container>
        <Heading as="h2" size="xl">
          Bands
        </Heading>
      </Container>
    </div>
  )
}

// Exporting component
export default BandsView
