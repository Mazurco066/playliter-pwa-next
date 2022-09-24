// Dependencies
import { FC } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { useUser } from 'infra/services/session'
import { requestClient } from 'infra/services/http'

// Types
import type { BandType, ShowType } from 'domain/models'

// Layout and Components
import { BandItem, ShowItem } from './elements'
import {
  Box,
  Container,
  Flex,
  Heading,
  Skeleton,
  Stack,
  Text,
  useColorModeValue
} from '@chakra-ui/react'

// Sign in component
const HomeView: FC = () => {
  // Hooks
  const router = useRouter()
  const { user } = useUser()

  // Color hooks
  const showSubtitleColor = useColorModeValue('gray.500', 'gray.400')
  const bgBox = useColorModeValue('gray.50', 'gray.800')

  // HTTP Requests
  const {
    data: pendingShows,
    isLoading: pendingShowsLoading
  } = useQuery(
    ['shows'],
    () => requestClient('/api/shows/pending', 'get')
  )
  const {
    data: bands,
    isLoading: bandsLoading
  } = useQuery(
    ['bands'],
    () => requestClient('/api/bands/list?limit=3', 'get')
  )

  // View JSX
  return (
    <div>
      <Container>
        <Heading
          as="h3"
          size="lg"
          textTransform="uppercase"
        >
          Bem vindo(a)<br/>{user?.name}! 
        </Heading>
        {/* Pending shows section */}
        {pendingShows?.data && !pendingShowsLoading ? (
          <>
            <Text color={showSubtitleColor} mb="3">
              { 
                pendingShows?.data?.length
                  ? `Você tem ${pendingShows.data?.length} ${pendingShows.data?.length === 1 ? 'Apresentação pendente' : 'Apresentações pendentes'}`
                  : 'Não há apresentações pendentes.'
              }
            </Text>
            <Stack
              direction="row"
              spacing="3"
              maxWidth="full"
              overflowX="auto"
              mb="5"
            >
              {pendingShows?.data?.map((show: ShowType) => (
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
            <Skeleton height="72px" mt="2" mb="2" />
            <Stack
              direction="row"
              spacing="3"
              maxWidth="full"
              overflowX="auto"
              mb="5"
            >
              <Skeleton width="162px" height="192px" />
            </Stack>
          </>
        )}
        {/* My bands section */}
        {bands?.data && !bandsLoading ? (
          <>
            {
              bands?.data?.length > 0 && (
                <>
                  <Heading
                    as="h3"
                    size="md"
                    textAlign="left"
                    textTransform="uppercase"
                    mb="4"
                  >
                    Minhas Bandas
                  </Heading>
                  <Box
                    px="3"
                    py="5"
                    mb="5"
                    borderRadius="lg"
                    bgColor={bgBox}
                  >
                    <Flex
                      gap="1.25rem"
                      justifyContent="center"
                      alignItems="center"
                    >
                      {bands?.data?.map((band: BandType) => (
                        <BandItem
                          key={band.id}
                          band={band}
                          onClick={() => router.push(`/bands/${band.id}`)}
                        />
                      ))}
                      <Box
                        data-group
                        w="64px"
                        h="64px"
                        borderRadius="lg"
                        overflow="hidden"
                        cursor="pointer"
                        transition="all 0.3s"
                        bgGradient="linear(to-t, secondary.600, primary.600)"
                        onClick={() => router.push('/bands')}
                        _hover={{
                          opacity: "0.8"
                        }}
                      >
                        <Flex
                          alignItems="center"
                          justifyContent="center"
                          height="full"
                        >
                          <Text
                            textAlign="center"
                            fontSize="sm"
                            fontWeight="semibold"
                          >
                            Ver<br/>mais
                          </Text>
                        </Flex>
                      </Box>
                    </Flex>
                  </Box>
                </>
              )
            }
          </>
        ) : (
          <>
            <Flex
              gap="1.5rem"
              justifyContent="center"
              alignItems="center"
              mb="5"
            >
              <Skeleton height="64px" width="64px" />
              <Skeleton height="64px" width="64px" />
              <Skeleton height="64px" width="64px" />
              <Skeleton height="64px" width="64px" />
            </Flex>
          </>
        )}
        {/* App version */}
        <Text
          textAlign="center"
        >
          Versão: <Text as="strong" color="secondary.500">1.0.0</Text>
        </Text>
      </Container>
    </div>
  )
}

// Exporting component
export default HomeView
