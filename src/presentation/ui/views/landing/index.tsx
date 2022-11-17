// Dependencies
import { FC } from 'react'

// Layout and Components
import { Hero, Feature } from './elements'
import {
  Box,
  Container,
  Flex,
  Heading,
  Link,
  Text,
  useBreakpointValue
} from '@chakra-ui/react'

// Sign in component
const LandingView: FC = () => {
  // Styles
  const featureDirection: any = useBreakpointValue({ base: 'column', md: 'row' })

  // View JSX
  return (
    <Box bgColor="gray.100">
      <Hero />
      <Container
        maxWidth="6xl"
        py="20px"
        color="gray.900"
      >
        <Box
          color="gray.900"
          as="section"
          mb="5"
        >
          <Heading
            as="h3"
            size="lg"
            fontWeight="thin"
            textAlign="center"
            mb="3"
          >
            Funcionalidades do aplicativo
          </Heading>
          <Heading
            as="h3"
            size="md"
            fontWeight="light"
            textAlign="center"
            mb="5"
          >
            O Playliter pode te ajudar em suas apresentações com:
          </Heading>
          <Flex
            gap="1rem"
            justifyContent="space-between"
            direction={featureDirection}
            mb="3"
          >
            <Feature
              title="Repertório músical"
              description="Organize o repertório de sua banda de um modo em que todos os membros da banda tenham acesso a informação."
              image="/img/arts/musical-note.png"
            />
              <Feature
              title="Apresentações"
              description="As apresentações ficam visiveis a todos os membros da banda assim como as músicas que seram usadas e seus respectivos tons."
              image="/img/arts/musical-concert.png"
            />
              <Feature
              title="Simplicidade"
              description="Uma interface simples para ter uma navegação eficiente entre os recursos do aplicativo."
              image="/img/arts/android.png"
            />
          </Flex>
          <Text
            textAlign="center"
            fontSize="lg"
            fontWeight="light"
          >
            O código do aplicativo é <strong>open source</strong>. Você pode acessá-lo{' '}
            <Link
              href="https://github.com/Mazurco066/playliter-pwa-next"
              target="_blank"
              rel="noreferrer noopener"
              color="primary.500"
            >clicando aqui</Link>.
          </Text>
        </Box>
      </Container>
    </Box>
  )
}

// Exporting component
export default LandingView
