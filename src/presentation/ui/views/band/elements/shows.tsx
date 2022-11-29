// Dependencies
import { FC, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'next-i18next'
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
  const router = useRouter()
  const [ filterSearch, setFilterSearch ] = useState<string>('')
  const { t } = useTranslation('band')

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
              placeholder={t('concerts.search_placeholder')}
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
          onClick={() => router.push(`../shows/save?band=${bandId}`)}
          bgColor="primary.500"
          color="gray.100"
          _hover={{
            bgColor: 'primary.600'
          }}
        >
          <AddIcon mr="2" /> {t('concerts.new_action')}
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
                            onClick={(_id: string) => router.push(`../shows/${_id}`)}
                          />
                        ))
                      }
                    </VStack>
                  ) : (
                    <Text>
                      {t('concerts.no_presentations_filtered')}
                    </Text>
                  )
                }
              </>
            ) : (
              <Text>
                {t('concerts.no_presentations')}
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
