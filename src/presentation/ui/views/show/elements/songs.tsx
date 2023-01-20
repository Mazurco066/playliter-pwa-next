// Dependencies
import { FC, useState, useEffect, Fragment } from 'react'
import { useInView } from 'react-intersection-observer'
import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import { useTranslation } from 'next-i18next'
import { requestClient } from 'infra/services/http'

// Types
import type { ShowType, SongType } from 'domain/models'

// Components
import { RepeatIcon } from '@chakra-ui/icons'
import { AddSong } from './song'
import {
  Box,
  FormControl,
  Flex,
  Input,
  InputGroup,
  InputRightAddon,
  Skeleton,
  Text,
  useToast,
  UseToastOptions,
  VStack,
  IconButton
} from '@chakra-ui/react'

// Paging default values
const PAGE_SIZE = 30

// Component
export const AddSongs: FC<{
  onAddSuccess?: () => void,
  show: ShowType
}> = ({
  onAddSuccess = () => {},
  show
}) => {
  // Destruct props
  const { band: { id: bandId } } = show

  // Hooks
  const toast = useToast()
  const { t: common } = useTranslation('common')
  const { t } = useTranslation('concert')
  const [ filterSearch, setFilterSearch ] = useState<string>('')
  const [ hasSearched, setSearchedState ] = useState<boolean>(false)
  const { ref, inView } = useInView()

  // Generic error msg
  const genericMsg: UseToastOptions = {
    title: common('messages.internal_error_title'),
    description: common('messages.internal_error_msg'),
    status: 'error',
    duration: 5000,
    isClosable: true
  }

  // Infinite scroll request
  const {
    status,
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch
  } = useInfiniteQuery(
    [`add-band-songs-${bandId}`],
    async ({ pageParam = 0 }) => {
      const response = await requestClient(`/api/songs/band?band=${bandId}&limit=${PAGE_SIZE}&offset=${pageParam}&filter=${filterSearch}`, 'get')
      return response.data
    }, {
      getPreviousPageParam: (firstPage) => firstPage.previousId ?? undefined,
      getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
      refetchOnWindowFocus: false
    }
  )

  // Add to show mutation
  const {
    isLoading: addToShowLoading,
    mutateAsync: addToShowMutation
  } = useMutation((data: any) => {
    return requestClient('/api/songs/add_to_show', 'post', { ...data })
  })

  // Infinite scroll effect
  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [inView])

  // Actions
  const addSongToList = async (songid: string, showId: string) => {
    const response = await addToShowMutation({ id: songid, showId })

    // Verify if request was successfull
    if ([200, 201].includes(response.status)) {
      
      // Notify user about response success
      toast({
        title: t('messages.added_to_show_title'),
        description: t('messages.added_to_show_msg'),
        status: 'success',
        duration: 2000,
        isClosable: true
      })
      onAddSuccess()

    } else {
      if ([400].includes(response.status)) {
        toast({
          title: t('messages.song_present_title'),
          description: t('messages.song_present_msg'),     
          status: 'info',
          duration: 3500,
          isClosable: true
        })
      } else if ([404].includes(response.status)) {
        toast({
          title: t('messages.show_not_found_title'),
          description: t('messages.show_not_found_msg'),     
          status: 'info',
          duration: 3500,
          isClosable: true
        })
      } else {
        toast(genericMsg)
      }
    }
  }

  // JSX
  return (
    <Box pt="2">
      <Box mb="2">
        <Text color="gray.100">
          {t('add_songs.subtitle')}
        </Text>
      </Box>
      <Box>
        <Flex
          gap="2"
          alignItems="center"
          justifyContent="space-between"
          mb="5"
        >
          <IconButton
            disabled={isFetchingNextPage}
            aria-label="Refetch"
            backgroundColor="whiteAlpha.200"
            _hover={{
              backgroundColor: "whiteAlpha.300"
            }}
            icon={<RepeatIcon />}
            flex="0 0 auto"
            onClick={() => {
              setFilterSearch('')
              setSearchedState(false)
              setTimeout(() => refetch(), 100)
            }}
          />
          <FormControl
            isDisabled={(status === 'loading' || isFetchingNextPage)}
            flexGrow="1"
          >
            <InputGroup borderColor="primary.600">
              <Input
                disabled={(status === 'loading' || isFetchingNextPage)}
                type="text"
                placeholder={t('add_songs.search_placeholder')}
                minLength={2}
                value={filterSearch}
                color="gray.50"
                _placeholder={{
                  color: 'gray.300'
                }}
                onKeyUp={event => {
                  if (event.code === 'Enter' && status !== 'loading') {
                    setSearchedState(true)
                    refetch()
                  }
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
                children={t('add_songs.search_btn')}
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
        </Flex>
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
              {t('add_songs.songs_error')}
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
                        <AddSong 
                          key={song.id}
                          song={song}
                          isLoading={isFetchingNextPage || addToShowLoading}
                          onClick={() => addSongToList(song.id, show.id)}
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
                {t('add_songs.load_more')}
              </Text>
            </Box>
          )
        }
      </Box>
    </Box>
  )
}