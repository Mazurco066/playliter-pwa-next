// Dependencies
import { FC, Fragment, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { requestClient } from 'infra/services/http'

// Types
import type { SongType } from 'domain/models'

// Layout and Components
import { SongItem } from './elements'
import {
  Box,
  Container,
  Grid,
  Heading
} from '@chakra-ui/react'

// Paging default values
const PAGE_SIZE = 30

// Public Songs component
const SongsView: FC = () => {
  // Hooks
  const { ref, inView } = useInView()

  // Infinite scroll request
  const {
    status,
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage
  } = useInfiniteQuery(
    ['songs'],
    async ({ pageParam = 0 }) => {
      const response = await requestClient(`/api/songs/public?limit=${PAGE_SIZE}&offset=${pageParam}`, 'get')
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

  useEffect(() => {
    console.log('[data updated]', data)
  }, [data])
  
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
        </Box>
        {
          status === 'loading' ? (
            <>
              <p>Loading...</p>
            </>
          ) : status === 'error' ? (
            <span>Error: internal</span>
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
      </Container>
    </div>
  )
}

// Exporting component
export default SongsView
