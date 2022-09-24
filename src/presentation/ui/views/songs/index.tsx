// Dependencies
import { FC, useCallback, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
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
  const loader = useRef(null)

  // Infinite request
  const {
    data: songs,
    isLoading: songsLoading
  } = useQuery(
    ['songs'],
    () => requestClient(`/api/songs/public?limit=${PAGE_SIZE}`, 'get')
  )
  

  // Notify ui when scroll reached page bottom
  const handleObserver: IntersectionObserverCallback = useCallback((entries: any) => {
    const target = entries[0]
    if (target.isIntersecting) {
      console.log('[observer] found page bottom')
    }
  }, [])

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
        {(songs && !songsLoading) ? (
          songs?.data?.length > 0 ? (
            <Grid
              templateColumns="repeat(2, 1fr)"
              gap="1rem"
              mb="5"
            >
              {songs?.data?.map((song: SongType, i: number) => (
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
