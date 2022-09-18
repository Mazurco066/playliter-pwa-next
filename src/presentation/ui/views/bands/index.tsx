// Dependencies
import useSWR from 'swr'
import { FC } from 'react'
import { fetchJson } from 'infra/services/http'

// Layout and Components
import {
  Container,
  Heading
} from '@chakra-ui/react'

// Fetchers
const bandsFetcher = (url: string) => fetchJson(url, { method: 'GET' })

// Bands list component
const BandsView: FC = () => {
  // HTTP Requests by SWR
  const {
    data: bands,
    error: bandsError
  } = useSWR('api/bands/list', bandsFetcher)

  // View JSX
  return (
    <div>
      <Container>
        <Heading as="h2" size="xl">
          Bands
        </Heading>
      </Container>
    </div>
  )
}

// Exporting component
export default BandsView
