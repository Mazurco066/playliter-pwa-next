// Dependencies
import { FC, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'next-i18next'
import { requestClient } from 'infra/services/http'

// Types
import type { ObservationType, ShowType } from 'domain/models'

// Components
import { NoteItem } from './note'
import { FaPlus } from 'react-icons/fa'
import { Icon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Flex,
  IconButton,
  Spinner,
  Text,
  useToast,
  UseToastOptions,
  VStack
} from '@chakra-ui/react'

// Component
export const Notes: FC<{
  isLoading?: boolean,
  onDeleteNote?: (note: ObservationType) => void,
  onEditNote?: (note: ObservationType) => void,
  onAddNote?: () => void,
  onImportSuccess?: () => void,
  show: ShowType
}> = ({
  isLoading = false,
  onDeleteNote = () => {},
  onEditNote = () => {},
  onAddNote = () => {},
  onImportSuccess = () => {},
  show
}) => {
  // Hooks
  const toast = useToast()
  const [ isImportLoading, setImportLoading ] = useState<boolean>(false)
  const { t: common } = useTranslation('common')
  const { t } = useTranslation('concert')

  // Scrap liturgy request
  const { isLoading: isScrapLoading, mutateAsync } = useMutation((data: any) => {
    return requestClient('/api/shows/scrap_liturgy', 'post', data)
  })

  // Save note request
  const { mutateAsync: saveNoteRequest } = useMutation((data: any) => {
    return requestClient('/api/shows/save_note', 'post', data)
  })

  // Generic error msg
  const genericMsg: UseToastOptions = {
    title: common('messages.internal_error_title'),
    description: common('messages.internal_error_msg'),
    status: 'error',
    duration: 5000,
    isClosable: true
  }

  // Actions
  const onScrapLiturgy = async (date: string) => {
    setImportLoading(true)
    const response = await mutateAsync({ date })

    // Verify if request was successfull
    if ([200, 201].includes(response.status)) {

      // PS: Promise.all works but it ll misss some observations
      // Api is not adding all if all requests are at same time on Promise.all
      const responses = []
      for (let i = 0; i < response.data.length; i++) {
        const liturgy = response.data[i]
        const obsResponse = await saveNoteRequest({
          title: liturgy.title,
          data: liturgy.content,
          showId: show.id
        })
        responses.push(obsResponse)
      }
      setImportLoading(false)

      // Verify import errors
      const hasImportErrors = responses.find(resp => ![200, 201].includes(resp.status))
      
      // Notify user
      onImportSuccess()
      if (!hasImportErrors) {
        toast({
          title: t('messages.liturgy_import_title'),
          description: t('messages.liturgy_import_msg'),
          status: 'success',
          duration: 2000,
          isClosable: true
        })
      } else {
        toast({
          title: t('messages.liturgy_error_title'),
          description: t('messages.liturgy_error_msg'),
          status: 'error',
          duration: 2000,
          isClosable: true
        })
      }

    } else {
      setImportLoading(false)
      toast(genericMsg)
    }
  }

  // Destruct show data
  const { observations } = show

  // Unify loading
  const loadingStatus = isLoading || isScrapLoading || isImportLoading

  // JSX
  return (
    <Box pt="2">
      {
        (isScrapLoading || isImportLoading) && (
          <Box
            bgColor="gray.200"
            borderRadius="lg"
            mb="5"
            px="3"
            py="5"
          >
            <Flex gap="1rem" alignItems="center">
              <Box flex="0 0 auto">
                <Spinner
                  thickness='4px'
                  speed='0.65s'
                  emptyColor='gray.300'
                  color='primary.500'
                  size='lg'
                />
              </Box>
              <Box flexGrow="1">
                <Text color="gray.900" fontWeight="medium">
                  {t('notes.import_loading')}
                </Text>
              </Box>
            </Flex>
          
          </Box>
        )
      }
      <Box mb="3">
        <Flex gap="0.5rem" alignItems="center">
          <Button
            disabled={isLoading}
            onClick={loadingStatus ? () => {} : () => onScrapLiturgy(show.date.split('T')[0])}
            width="full"
            flexGrow="1"
            bgColor="primary.500"
            color="gray.100"
            _hover={{
              bgColor: 'primary.600'
            }}
            _disabled={{
              opacity: '0.7'
            }}
          >
            {t('notes.import_liturgy')}
          </Button>
          <IconButton
            aria-label='Adicionar Anotação'
            icon={<Icon as={FaPlus} />}
            backgroundColor="whiteAlpha.200"
            _hover={{
              backgroundColor: "whiteAlpha.300"
            }}
            flex="0 0 auto"
            disabled={isLoading}
            onClick={loadingStatus ? () => {} : () => onAddNote()}
          />
        </Flex>
      </Box>
      {
        observations.length > 0 ? (
          <VStack>
            {
              observations.map((obs: ObservationType) => (
                <NoteItem
                  key={obs.id}
                  isLoading={isLoading}
                  observation={obs}
                  onRemove={(obs: ObservationType) => onDeleteNote(obs)}
                  onEdit={(obs: ObservationType) => onEditNote(obs)}
                />
              ))
            }
          </VStack>
        ) : (
          <Text>
            {t('notes.no_registers')}
          </Text>
        )
      }
    </Box>
  )
}
