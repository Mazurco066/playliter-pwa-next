// Dependencies
import { FC } from 'react'

// Types
import type { InviteType } from 'domain/models'

// Components
import { FaBell } from 'react-icons/fa'
import { Icon } from '@chakra-ui/icons'
import {
  Badge,
  Box,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useColorModeValue,
  Text
} from '@chakra-ui/react'

// Footer component
export const Invitations: FC<{
  invites: InviteType[]
}> = ({
  invites
}) => {
  // Color Hooks
  const bgPopover = useColorModeValue('gray.50', 'gray.800')
  const borderPopover = useColorModeValue('gray.200', 'gray.600')

  // JSX
  return (
    <Popover
      placement='bottom'
      closeOnBlur={false}
    >
      <PopoverTrigger>
        <Box position="relative">
          <IconButton
            aria-label="notifications-toggle"
            icon={<Icon as={FaBell} />}
            variant="outline"
          />
          {
            invites.length > 0 && (
              <Badge
                colorScheme="red"
                position="absolute"
                borderRadius="sm"
                top="-1"
                right="-1"
              >
                {invites.length}
              </Badge>
            )
          }
        </Box>
      </PopoverTrigger>
      <PopoverContent
        color='white'
        bg={bgPopover}
        borderColor={borderPopover}
        width="200px"
      >
        <PopoverHeader
          pt="4"
          fontWeight='bold'
          border='0'
        >
          Notificações
        </PopoverHeader>
        <PopoverArrow  />
        <PopoverCloseButton mt="2" />
        <PopoverBody>
          {
            // Invitations list
            invites.map((invite: InviteType) => (
              <Box
                key={invite.id}          
                mb="2"
                _last={{
                  mb: "0"
                }}
              >
                <Text>Convite para banda:</Text>
                <Text fontWeight="bold" color="secondary.500">
                  {invite.band.title}
                </Text>
              </Box>
            ))
          }
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
