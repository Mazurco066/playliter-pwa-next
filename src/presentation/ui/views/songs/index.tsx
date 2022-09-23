// Dependencies
import useSwrInfinite from 'swr/infinite'
import { FC } from 'react'
import { fetchJsonFromOrigin } from 'infra/services/http'

// Types
import type { SongType } from 'domain/models'

// Layout and Components
import { SongItem } from './elements'
import {
  Container,
  Heading
} from '@chakra-ui/react'

// Fetchers
const songsFetcher = (url: string) => fetchJsonFromOrigin(url, { method: 'GET' })

// Paging default values
const PAGE_SIZE = 30

// Bands list component
const SongsView: FC = () => {
  // Infinite request
  const {
    data,
    error: songsError,
    mutate,
    size,
    setSize,
    isValidating
  } = useSwrInfinite(
    (index) => `api/songs/public?limit=${PAGE_SIZE}&offset=${index}`,
    songsFetcher
  )

  // Retieving and typing infinite scroll flags
  const songs: SongType[] = data ? [].concat(...data) : []

  // View JSX
  return (
    <div>
      <Container>
        <Heading
          as="h4"
          size="md"
          textAlign="left"
          textTransform="uppercase"
          mb="1"
        >
          Músicas Públicas
        </Heading>
        {(data && !songsError) ? (
          songs.length > 0 ? (
            <div>
              {songs.map((song: SongType, i: number) => (
                <SongItem 
                  key={i}
                  song={song}
                  onClick={() => console.log(`Song: ${song.id}`)}
                />
              ))}
            </div>
          ) : null
        ) : (
          <p>Loading</p>
        )}
      </Container>
    </div>
  )
}

// Exporting component
export default SongsView
