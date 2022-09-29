// Dependencies
import { FC, Fragment, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useInfiniteQuery } from '@tanstack/react-query'
import { requestClient } from 'infra/services/http'

// Types
import type { SongType } from 'domain/models'

// Layout and Components
import { SearchIcon } from '@chakra-ui/icons'
import { SongItem } from './elements'
import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  Skeleton,
  Text,
  useColorModeValue
} from '@chakra-ui/react'

// Paging default values
const PAGE_SIZE = 30

// Public Songs component
const SongsView: FC = () => {
  // Hooks
  const { ref, inView } = useInView()
  const [ filterSearch, setFilterSearch ] = useState<string>('')
  const [ hasSearched, setSearchedState ] = useState<boolean>(false)

  // Color Hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')

  // Infinite scroll request
  const {
    status,
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch
  } = useInfiniteQuery(
    ['public_songs'],
    async ({ pageParam = 0 }) => {
      const response = await requestClient(`/api/songs/public?limit=${PAGE_SIZE}&offset=${pageParam}&filter=${filterSearch}`, 'get')
      return response.data
    }, {
      getPreviousPageParam: (firstPage) => firstPage.previousId ?? undefined,
      getNextPageParam: (lastPage) => lastPage.nextId ?? undefined
    }
  )

  // Infinite scroll effect
  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [inView])

  // View JSX
  return (
    <div>
      <Container>
        <Box mb="5">
          <Heading
            as="h4"
            size="md"
            textAlign="left"
            textTransform="uppercase"
            mb="1"
          >
            Músicas Públicas
          </Heading>

          <FormControl mb="5" isDisabled={(status === 'loading' || isFetchingNextPage)}>
            <FormLabel fontWeight="normal">
              Pequisar músicas
            </FormLabel>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon />}
              />
              <Input
                disabled={(status === 'loading' || isFetchingNextPage)}
                type="text"
                placeholder="Pesquisar..."
                minLength={2}
                value={filterSearch}
                onChange={e => {
                  const inputValue = e.target.value
                  setFilterSearch(inputValue)
                  if (hasSearched && inputValue === '') {
                    setTimeout(() => {
                      refetch()
                      setSearchedState(false)
                    }, 200)
                  }
                }}
              />
              <InputRightAddon
                cursor="pointer"
                children="Buscar"
                _hover={{
                  opacity: '0.7'
                }}
                onClick={(status === 'loading' || isFetchingNextPage)
                  ? () => {}
                  : () => {
                    setSearchedState(true)
                    refetch()
                  }
                }
              />
            </InputGroup>
          </FormControl>
        </Box>
        {
          (status === 'loading') ? (
            <>
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
            </>
          ) : status === 'error' ? (
            <Text>
              Ocorreu um erro ao tentar recuperar a lista de músicas públicas. 
              Notifique um adiministrados do aplicativo assim que possível!
            </Text>
          ) : (
            <Grid
              templateColumns="repeat(2, 1fr)"
              gap="1rem"
              mb="5"
            >
            {
              data.pages.map((page) => (
                <Fragment key={page.nextId}>
                  {
                    page?.data.map((song: SongType) => (
                      <SongItem 
                        key={song.id}
                        song={song}
                        onClick={() => console.log(`Song: ${song.id}`)}
                      />
                    ))
                  }
                </Fragment>
              ))
            }
            </Grid>
          )
        }
        <div id="page-end" ref={ref} />
        {
          isFetchingNextPage && hasNextPage && (
            <Box
              bgColor={bgBox}
              borderRadius="lg"
              px="3"
              py="5"
            >
              <Text textAlign="center" fontSize="lg">
                Carregando mais músicas...
              </Text>
            </Box>
          )
        }
      </Container>
    </div>
  )
}

// Exporting component
export default SongsView
