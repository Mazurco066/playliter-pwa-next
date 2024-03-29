// Dependencies
import { FC, Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useInView } from 'react-intersection-observer'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useTranslation } from 'next-i18next'
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
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Skeleton,
  Text,
  useColorModeValue
} from '@chakra-ui/react'

// Paging default values
const PAGE_SIZE = 30

// Public Songs component
const SongsView: FC = () => {
  // Hooks
  const router = useRouter()
  const { ref, inView } = useInView()
  const [ filterSearch, setFilterSearch ] = useState<string>('')
  const [ hasSearched, setSearchedState ] = useState<boolean>(false)
  const { t } = useTranslation('songs')

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
      const response = await requestClient(`/api/songs/public?limit=${PAGE_SIZE}&offset=${pageParam}&filter=${encodeURI(filterSearch)}`, 'get')
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
      <Container  maxWidth="6xl">
        <Box mb="5">
          <Heading
            as="h4"
            size="md"
            textAlign="left"
            textTransform="uppercase"
            mb="1"
          >
            {t('label')}
          </Heading>
          <FormControl mb="5" isDisabled={(status === 'loading' || isFetchingNextPage)}>
            <FormLabel fontWeight="normal">
              {t('input_label')}
            </FormLabel>
            <InputGroup>
              <Input
                disabled={(status === 'loading' || isFetchingNextPage)}
                type="text"
                placeholder={t('input_placeholder')}
                minLength={2}
                value={filterSearch}
                onKeyUp={event => {
                  if (event.code === 'Enter') {
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
              <InputRightElement>
                <IconButton
                  icon={<SearchIcon />}
                  aria-label="Search songs"
                  backgroundColor="primary.500"
                  color="gray.100"
                  borderLeftRadius="none"
                  _hover={{
                    backgroundColor: 'primary.600'
                  }}
                  onClick={(status === 'loading' || isFetchingNextPage)
                  ? () => {}
                  : () => {
                    setSearchedState(true)
                    refetch()
                  }
                }
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
        </Box>
        {
          (status === 'loading') ? (
            <>
              <Grid
                templateColumns="1fr"
                gap="1rem"
                mb="5"
              >
                {[1, 2, 3, 4].map((key: number) => (
                  <Skeleton
                    key={key}
                    width="full"
                    height="75px"
                    borderRadius="lg"
                  />
                ))}
              </Grid>
            </>
          ) : status === 'error' ? (
            <Text>
              {t('messages.request_error')}
            </Text>
          ) : (
            <Grid
              templateColumns="1fr"
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
                        onClick={() => router.push(`../songs/${song.id}`)}
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
              <Text
                textAlign="center"
                fontSize="md"
                fontWeight="bold"
              >
                {t('messages.loading_more')}
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
