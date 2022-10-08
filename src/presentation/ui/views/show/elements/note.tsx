// Dependencies
import { FC } from 'react'

// Types and interfaces
import type { ObservationType } from 'domain/models'

// Components
import { FaEllipsisV } from 'react-icons/fa'
import { DeleteIcon, Icon, EditIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue
} from '@chakra-ui/react'

// Note component
export const NoteItem: FC<{
  onEdit?: (obs: ObservationType) => void,
  onRemove?: (obs: ObservationType) => void,
  isLoading?: boolean,
  observation: ObservationType
}> = ({
  onEdit = () => {},
  onRemove = () => {},
  isLoading = false,
  observation
}) => {
  // Color Hooks
  const bgBox = useColorModeValue('blackAlpha.500', 'blackAlpha.500')

  // Destruct song data
  const { id, title, data } = observation

  // JSX
  return (
    <Box
      data-group
      bgColor={bgBox}
      width="full"
      borderRadius="lg"
      transition="all 0.3s"
      position="relative"
      px="3"
      pb="5"
      pt="2"
      _hover={{
        cursor: 'pointer'
      }}
    >
      <Flex alignItems="center" mb="2">
        <Heading
          as="h5"
          size="sm"
          flexGrow="1"
        >
          {title}
        </Heading>
        <Box flex="0 0 auto">
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label='Options'
              icon={<Icon as={FaEllipsisV} />}
              variant='ghost'
            />
              <MenuList>   
                <MenuItem
                  disabled={isLoading}
                  icon={<EditIcon />}
                  onClick={isLoading ? () => {} : () => onEdit(observation)}
                >
                  Editar
                </MenuItem>
                <MenuItem
                  disabled={isLoading}
                  icon={<DeleteIcon />}
                  onClick={isLoading ? () => {} : () => onRemove(observation)}
                >
                  Remover
               </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
      <Text 
        whiteSpace="break-spaces"
        textAlign="justify"
      >
        {data}
      </Text>
    </Box>
  )
}
