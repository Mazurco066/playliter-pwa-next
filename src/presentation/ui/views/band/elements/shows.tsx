// Dependencies
import { FC, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { requestClient } from 'infra/services/http'

// Types
import type { ShowType } from 'domain/models'

// Components
import { ShowItem } from './show'
import { AddIcon, SearchIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Text,
  VStack
} from '@chakra-ui/react'

// Component
export const ShowsComponent: FC<{ bandId: string }> = ({ bandId }) => {
  // Hooks
  const [ filterSearch, setFilterSearch ] = useState<string>('')

   // Shows request
   const {
    data: shows,
    isLoading: showsLoading
  } = useQuery(
    [`band-shows-${bandId}`],
    () => requestClient(`/api/shows/band?band=${bandId}`, 'get'),
  )

  // Filtered shows
  const filteredShows = (shows && shows.data)
    ? shows.data.filter(({ title, description }: ShowType) => 
        title.toLowerCase().includes(filterSearch.toLowerCase()) ||
        description.toLowerCase().includes(filterSearch.toLowerCase())
      )
    : []

  // JSX
  return (
    <>
      <Box mb="5" pt="3">
        <FormControl mb="5">
          <InputGroup borderColor="primary.600">
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon />}
            />
            <Input
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
              }}
            />
          </InputGroup>
        </FormControl>
        <Button
          w="full"
          onClick={() => console.log('[new] show')}
          bgColor="primary.500"
          color="gray.100"
          _hover={{
            bgColor: 'primary.600'
          }}
        >
          <AddIcon mr="2" /> Nova Apresentação
        </Button>
      </Box>
      { shows && !showsLoading ? (
        <>
          {
            (shows.data?.length > 0) ? (
              <>
                {
                  filteredShows.length > 0 ? (
                    <VStack
                      gap="0.5rem"
                      mb="5"
                    >
                      {
                        filteredShows.map((show: ShowType) => (
                          <ShowItem
                            key={show.id}
                            show={show}
                            onClick={(_id: string) => console.log(`Show id ${_id}`)}
                          />
                        ))
                      }
                    </VStack>
                  ) : (
                    <Text>
                      Não há apresentações correspondentes ao filtro informado.
                    </Text>
                  )
                }
              </>
            ) : (
              <Text>
                Não há apresentações registradas nessa banda.
              </Text>
            )
          }
        </>
      ) : (
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
      )}
    </>
  )
}