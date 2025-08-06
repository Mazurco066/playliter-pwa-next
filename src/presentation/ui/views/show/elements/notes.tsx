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
  onDeleteNote = () => { },
  onEditNote = () => { },
  onAddNote = () => { },
  onImportSuccess = () => { },
  show
}) => {
    // Hooks
    const toast = useToast()
    const [isImportLoading, setImportLoading] = useState<boolean>(false)
    const { t: common } = useTranslation('common')
    const { t } = useTranslation('concert')

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

    // Destruct show data
    const { observations = [] } = show

    // Unify loading
    const loadingStatus = isLoading || isImportLoading

    // JSX
    return (
      <Box pt="2">
        {
          (isImportLoading) && (
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
              onClick={loadingStatus ? () => { } : () => onAddNote()}
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
          </Flex>
        </Box>
        {
          observations?.length > 0 ? (
            <VStack>
              {
                observations?.map((obs: ObservationType) => (
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
