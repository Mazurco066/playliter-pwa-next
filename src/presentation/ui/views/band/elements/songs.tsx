// Dependencies
import { FC, useEffect, useState, Fragment } from 'react'
import { useRouter } from 'next/router'
import { useInView } from 'react-intersection-observer'
import { useInfiniteQuery } from '@tanstack/react-query'
import { requestClient } from 'infra/services/http'

// Types
import type { SongType } from 'domain/models'

// Components
import { AddIcon, SearchIcon } from '@chakra-ui/icons'
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
  useToast,
  VStack
} from '@chakra-ui/react'

// Paging default values
const PAGE_SIZE = 30

// Component
export const SongsComponent: FC<{
  bandId: string,
  canAddSongs: boolean
}> = ({
  bandId,
  canAddSongs
}) => {
  // Hooks
  const router = useRouter()
  const toast = useToast()
  const { ref, inView } = useInView()
  const [ filterSearch, setFilterSearch ] = useState<string>('')
  const [ hasSearched, setSearchedState ] = useState<boolean>(false)

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
          <InputGroup borderColor="primary.600">
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
              bgColor="primary.500"
              color="gray.100"
              _hover={{
                bgColor: "primary.600"
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
          onClick={() => {
            if (!canAddSongs) return toast({
              title: 'Ops.. Não há categorias registradas!',
              description: 'Registre no mínimo uma categoria antes de criar uma música para sua banda!',     
              status: 'info',
              duration: 3500,
              isClosable: true
            })
            console.log('[new] song')
          }}
          bgColor="primary.500"
          color="gray.100"
          _hover={{
            bgColor: 'primary.600'
          }}
        >
          <AddIcon mr="2" /> Nova Música
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
                          onClick={(_id: string) => router.push(`../songs/${_id}`)}
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
