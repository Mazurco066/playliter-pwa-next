// Dependencies
import useSwrInfinite from 'swr/infinite'
import { FC, useCallback, useEffect, useRef } from 'react'
import { fetchJsonFromOrigin } from 'infra/services/http'

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

// Fetchers
const songsFetcher = (url: string) => fetchJsonFromOrigin(url, { method: 'GET' })

// Paging default values
const PAGE_SIZE = 30

// Public Songs component
const SongsView: FC = () => {
  // Hooks
  const loader = useRef(null)

  // Infinite request
  const {
    data,
    error: songsError,
    mutate,
    size,
    setSize,
    isValidating
  } = useSwrInfinite(
    (index) => {
      console.log('[SWR] Request', index * PAGE_SIZE)
      return `api/songs/public?limit=${PAGE_SIZE}&offset=${index * PAGE_SIZE}`
    },
    songsFetcher
  )

  // Retieving and typing infinite scroll flags
  const songs: SongType[] = data ? [].concat(...data) : []
  

  // Notify ui when scroll reached page bottom
  const handleObserver: IntersectionObserverCallback = useCallback((entries: any) => {
    const target = entries[0]
    if (target.isIntersecting) {
      console.log('[observer] found page bottom')
      setSize(size + 1)
    }
  }, [data, songsError])

  // Effects
  useEffect(() => {
    const option: IntersectionObserverInit = {
      root: null,
      rootMargin: '20px',
      threshold: 0
    }
    const observer: IntersectionObserver = new IntersectionObserver(handleObserver, option)
    if (loader.current) observer.observe(loader.current)
  }, [])

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
        {(data && !songsError) ? (
          songs.length > 0 ? (
            <Grid
              templateColumns="repeat(2, 1fr)"
              gap="1rem"
              mb="5"
            >
              {songs.map((song: SongType, i: number) => (
                <SongItem 
                  key={i}
                  song={song}
                  onClick={() => console.log(`Song: ${song.id}`)}
                />
              ))}
            </Grid>
          ) : null
        ) : (
          <p>Loading</p>
        )}
        <div id="page-end" ref={loader} />
      </Container>
    </div>
  )
}

// Exporting component
export default SongsView
