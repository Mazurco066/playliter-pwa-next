// Dependencies
import useSWR from 'swr'
import { FC } from 'react'
import { fetchJson } from 'infra/services/http'

// Types
import { BandType } from 'domain/models'

// Layout and Components
import { BandItem } from './elements'
import {
  Button,
  Container,
  Heading,
  Grid,
  Skeleton,
  Text,
  useColorModeValue
} from '@chakra-ui/react'

// Fetchers
const bandsFetcher = (url: string) => fetchJson(url, { method: 'GET' })

// Bands list component
const BandsView: FC = () => {
  // HTTP Requests by SWR
  const {
    data: bands,
    error: bandsError
  } = useSWR('api/bands/list', bandsFetcher)

  // Color hooks
  const colorSubtile = useColorModeValue('gray.500', 'gray.400')

  // View JSX
  return (
    <div>
      <Container>
        <Heading
          as="h4"
          size="md"
          textAlign="left"
          textTransform="uppercase"
          mb="1"
        >
          Deseja criar uma nova banda?
        </Heading>
        <Text
          mb="5"
          color={colorSubtile}
        >
          Clique no botão abaixo e preencha os dados.
        </Text>
        <Button
          variant="fade"
          width="full"
          mb="5"
          onClick={() => console.log('[new band]')}
        >
          Criar banda
        </Button>
        <Heading
          as="h3"
          size="md"
          textAlign="left"
          textTransform="uppercase"
          mb="1"
        >
          Minhas bandas
        </Heading>
        <Text
          mb="5"
          color={colorSubtile}
        >
          Lista de bandas que você participa.
        </Text>
        { bands && !bandsError ? (
          <>
            { bands.length > 0 ? (
              <Grid
                templateColumns="repeat(2, 1fr)"
                gap="1rem"
                mb="5"
              >
                { bands.map((band: BandType) => (
                  <BandItem
                    key={band.id}
                    band={band}
                    onClick={() => console.log(`Band id: ${band.id}`)}
                  />
                )) }
              </Grid>
            ) : (
              <Text mb="5">
                Você não participa de nenhuma banda!
              </Text>
            ) }
          </>
        ) : (
          <Grid
            templateColumns="repeat(2, 1fr)"
            gap="1rem"
            mb="5"
          >
            {[1, 2, 3, 4].map((key: number) => (
              <Skeleton
                key={key}
                width="full"
                height="128px"
                borderRadius="lg"
              />
            ))}
          </Grid>
        ) }
      </Container>
    </div>
  )
}

// Exporting component
export default BandsView
