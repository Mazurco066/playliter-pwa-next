// Dependencies
import { FC, useEffect, useState, Fragment } from 'react'
import { useInView } from 'react-intersection-observer'
import { useInfiniteQuery } from '@tanstack/react-query'
import { requestClient } from 'infra/services/http'

// Types
import type { SongType } from 'domain/models'

// Components
import { SearchIcon } from '@chakra-ui/icons'
import { SongItem } from './song'
import {
  Box,
  Button,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  Skeleton,
  Text,
  useColorModeValue,
  VStack
} from '@chakra-ui/react'

// Paging default values
const PAGE_SIZE = 30

// Component
export const SongsComponent: FC<{ bandId: string }> = ({ bandId }) => {
  // Hooks
  const { ref, inView } = useInView()
  const [ filterSearch, setFilterSearch ] = useState<string>('')
  const [ hasSearched, setSearchedState ] = useState<boolean>(false)

  // Color hooks
  const bgSearch = useColorModeValue('primary.500', 'primary.200')
  const colorSearch = useColorModeValue('gray.100', 'gray.900')
  const hoverSearch = useColorModeValue('primary.600', 'primary.300')

  // Infinite scroll request
  const {
    status,
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch
  } = useInfiniteQuery(
    [`band-songs-${bandId}`],
    async ({ pageParam = 0 }) => {
      const response = await requestClient(`/api/songs/band?band=${bandId}&limit=${PAGE_SIZE}&offset=${pageParam}&filter=${filterSearch}`, 'get')
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

  // JSX
  return (
    <>
      <Box mb="5" pt="3">
        <FormControl mb="5" isDisabled={(status === 'loading' || isFetchingNextPage)}>
          <InputGroup
            borderColor="blackAlpha.500"
          >
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon />}
            />
            <Input
              disabled={(status === 'loading' || isFetchingNextPage)}
              type="text"
              placeholder="Buscar..."
              minLength={2}
              value={filterSearch}
              color="gray.50"
              _placeholder={{
                color: 'gray.300'
              }}
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
              fontWeight="medium"
              bgColor={bgSearch}
              color={colorSearch}
              _hover={{
                bgColor: hoverSearch
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
        <Button
          w="full"
          onClick={() => console.log('[new] song')}
          colorScheme="primary"
        >
          Nova Música
        </Button>
      </Box>
      <Box>
        {
          (status === 'loading') ? (
            <>
              <VStack
                gap="0.5rem"
                mb="5"
              >
                {[1, 2, 3, 4].map((key: number) => (
                  <Skeleton
                    key={key}
                    width="full"
                    height="72px"
                    borderRadius="lg"
                  />
                ))}
              </VStack>
            </>
          ) : status === 'error' ? (
            <Text>
              Ocorreu um erro ao tentar recuperar a lista de músicas públicas. 
              Notifique um adiministrados do aplicativo assim que possível!
            </Text>
          ) : (
            <VStack
              gap="0.5rem"
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
                          onClick={(_id: string) => console.log(`Song: ${_id}`)}
                        />
                      ))
                    }
                  </Fragment>
                ))
              }
            </VStack>
          )
        }
        <div id="page-end" ref={ref} />
        {
          isFetchingNextPage && hasNextPage && (
            <Box
              bgColor="blackAlpha.500"
              borderRadius="lg"
              px="3"
              py="5"
            >
              <Text
                textAlign="center"
                fontSize="md"
                fontWeight="bold"
              >
                Carregando mais músicas...
              </Text>
            </Box>
          )
        }
      </Box>
    </>
  )
}
