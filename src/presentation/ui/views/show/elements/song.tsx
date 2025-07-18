// Dependencies
import { FC } from 'react'
import { useTranslation } from 'next-i18next'

// Types and interfaces
import type { SongType } from 'domain/models'

// Components
import { FaEllipsisV, FaHandRock, FaPlus } from 'react-icons/fa'
import { DeleteIcon, EditIcon, Icon, ViewIcon } from '@chakra-ui/icons'
import { CSS } from '@dnd-kit/utilities'
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
import { useSortable } from '@dnd-kit/sortable'

// Drag Component
export const DraggableSongItem: FC<{ item: SongType, index: number }> = ({ item, index }) => {
  // Color Hooks
  const bgBox = useColorModeValue('blackAlpha.500', 'blackAlpha.500')
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  
  // Styles
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Destruct song data
  const { id, title, writter } = item

  // JSX
  return (
    <Box
      data-group
      bgColor={bgBox}
      width="full"
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.3s"
      cursor="grab"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Flex
        alignItems="center"
        justifyContent="flex-start"
        height="full"
      >
        <Box
          width="48px"
          height="64px"
          flex="0 0 auto"
        >
          <Flex
            justifyContent="center"
            alignItems="center"
            height="full"
          >
            <Icon as={FaHandRock} />
          </Flex>
        </Box>
        <Box
          flexGrow="1"
          pr="2"
          py="3"
          pl="1"
        >
          <Heading
            as="h5"
            size="sm"
          >
            {title}
          </Heading>
          <Text>
            {writter}
          </Text>
        </Box>
      </Flex>
    </Box>

  )
}

// Ordered Component
export const OrderedSong: FC<{
  onClick?: () => void,
  onEdit?: () => void,
  onRemove?: () => void,
  isLoading?: boolean,
  order?: number,
  song: SongType
}> = ({
  onClick = () => { },
  onEdit = () => { },
  onRemove = () => { },
  isLoading = false,
  order = 0,
  song
}) => {
    // Hooks
    const { t } = useTranslation('concert')

    // Color Hooks
    const bgBox = useColorModeValue('gray.50', 'gray.800')
    const colorOrder = useColorModeValue('secondary.700', 'secondary.400')

    // Destruct song data
    const { title, writter } = song

    // JSX
    return (
      <Box
        data-group
        bgColor={bgBox}
        width="full"
        borderRadius="lg"
        transition="all 0.3s"
        _hover={{
          cursor: 'pointer'
        }}
      >
        <Flex
          alignItems="center"
          justifyContent="flex-start"
          height="full"
        >
          {/* Order Section */}
          <Box
            width="48px"
            height="full"
            flex="0 0 auto"
          >
            <Flex
              justifyContent="center"
              alignItems="center"
              height="full"
            >
              <Text
                color={colorOrder}
                fontWeight="semibold"
              >
                {order}
              </Text>
            </Flex>
          </Box>
          {/* Song data */}
          <Box
            flexGrow="1"
            px="2"
            py="3"
          >
            <Heading
              as="h5"
              size="sm"
              _groupHover={{
                color: colorOrder
              }}
            >
              {title}
            </Heading>
            <Text>
              {writter}
            </Text>
          </Box>
          <Box
            flex="0 0 auto"
            pr="3"
          >
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
                  icon={<ViewIcon />}
                  onClick={onClick}
                >
                  {t('options.see')}
                </MenuItem>
                <MenuItem
                  disabled={isLoading}
                  icon={<EditIcon />}
                  onClick={onEdit}
                >
                  {t('options.edit')}
                </MenuItem>
                <MenuItem
                  disabled={isLoading}
                  icon={<DeleteIcon />}
                  onClick={onRemove}
                >
                  {t('options.remove')}
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Box>
    )
  }

// Add Component
export const AddSong: FC<{
  song: SongType,
  isLoading?: boolean,
  onClick?: () => void,
}> = ({
  song: { title, writter },
  isLoading = false,
  onClick = () => { }
}) => {
    // JSX
    return (
      <Box
        data-group
        bgColor="blackAlpha.500"
        width="full"
        borderRadius="lg"
        transition="all 0.3s"
        _hover={{
          cursor: 'pointer'
        }}
      >
        <Flex
          alignItems="center"
          justifyContent="flex-start"
          height="full"
        >
          <Box
            flexGrow="1"
            px="2"
            py="3"
          >
            <Heading
              as="h5"
              size="sm"
              _groupHover={{
                color: 'secondary.400'
              }}
            >
              {title}
            </Heading>
            <Text>
              {writter}
            </Text>
          </Box>
          <Box
            flex="0 0 auto"
            pr="3"
          >
            <IconButton
              disabled={isLoading}
              aria-label="Add song"
              backgroundColor="whiteAlpha.200"
              _hover={{
                backgroundColor: "whiteAlpha.300"
              }}
              icon={<Icon as={FaPlus} />}
              flex="0 0 auto"
              onClick={isLoading ? () => { } : () => onClick()}
            />
          </Box>
        </Flex>
      </Box>
    )
  }
