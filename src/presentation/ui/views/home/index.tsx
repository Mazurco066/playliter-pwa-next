// Dependencies
import useSWR from 'swr'
import { FC } from 'react'
import { useUser } from 'infra/services/session'
import { fetchJson } from 'infra/services/http'

// Types
import type { ShowType } from 'domain/models'

// Layout and Components
import { ShowItem } from './elements'
import {
  Container,
  Heading,
  Skeleton,
  Stack,
  Text,
  useColorModeValue
} from '@chakra-ui/react'

// Fetchers
const showsFetcher = (url: string) => fetchJson(url, { method: 'GET' })

// Sign in component
const HomeView: FC = () => {
  // Hooks
  const { user } = useUser()

  // Color hooks
  const showSubtitleColor = useColorModeValue('gray.500', 'gray.400')

  // HTTP Requests by SWR
  const {
    data: pendingShows,
    error: pendingShowsError
  } = useSWR('api/shows/pending', showsFetcher)

  // View JSX
  return (
    <div>
      <Container>
        <Heading as="h3" size="xl">
          Bem vindo(a)<br/>{user?.name}! 
        </Heading>
        {pendingShows && !pendingShowsError ? (
          <>
            <Text color={showSubtitleColor} mb="3">
              { 
                pendingShows?.length
                  ? `Você tem ${pendingShows?.length} ${pendingShows?.length === 1 ? 'Apresentação pendente' : 'Apresentações pendentes'}`
                  : 'Não há apresentações pendentes.'
              }
            </Text>
            <Stack
              direction="column"
              spacing="3"
              maxWidth="full"
              overflowX="auto"
            >
              {pendingShows.map((show: ShowType) => (
                <ShowItem
                  key={show.id}
                  title={show.title}
                  band={show.band.title}
                  date={show.date}
                  onClick={() => console.log(`Show id: ${show.id}`)}
                /> 
              ))}
            </Stack>
          </>
        ) : (
          <>
            <Skeleton height="20px" mt="2" />
            <Skeleton height="72px" mt="2" />
          </>
        )}
      </Container>
    </div>
  )
}

// Exporting component
export default HomeView
