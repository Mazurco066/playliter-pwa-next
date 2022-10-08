// Dependencies
import { FC } from 'react'

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
  Text,
  VStack
} from '@chakra-ui/react'

// Component
export const Notes: FC<{
  isLoading?: boolean,
  onDeleteNote?: (note: ObservationType) => void,
  onEditNote?: (note: ObservationType) => void,
  onAddNote?: () => void,
  show: ShowType

}> = ({
  isLoading = false,
  onDeleteNote = () => {},
  onEditNote = () => {},
  onAddNote = () => {},
  show
}) => {
  // Destruct show data
  const { observations } = show

  // JSX
  return (
    <Box>
      <Box mb="3">
        <Flex gap="0.5rem" alignItems="center">
          <Button
            disabled={isLoading}
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
            Importar Liturgia
          </Button>
          <IconButton
            aria-label='Adicionar Anotação'
            icon={<Icon as={FaPlus} />}
            flex="0 0 auto"
            disabled={isLoading}
            onClick={onAddNote}
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
            Não há anotações registradas nessa apresentação.
          </Text>
        )
      }
    </Box>
  )
}
