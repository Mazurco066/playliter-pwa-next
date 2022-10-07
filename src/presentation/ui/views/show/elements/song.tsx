// Dependencies
import { FC } from 'react'

// Types
import type { SongType } from 'domain/models'

// Components
import { FaEllipsisV } from 'react-icons/fa'
import { DeleteIcon, Icon, ViewIcon } from '@chakra-ui/icons'
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

// Component
export const OrderedSong: FC<{
  onClick?: () => void,
  onRemove?: () => void,
  isLoading?: boolean,
  order?: number,
  song: SongType
}> = ({
  onClick = () => {},
  onRemove = () => {},
  isLoading = false,
  order = 0,
  song
}) => {
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
      overflow="hidden"
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
                  Ver música
                </MenuItem>
                <MenuItem
                  disabled={isLoading}
                  icon={<DeleteIcon />}
                  onClick={onRemove}
                >
                  Remover da apresentação
               </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
    </Box>
  )
}
