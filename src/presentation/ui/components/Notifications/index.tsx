// Dependencies
import { FC } from 'react'
import { useUser } from 'infra/services/session'

// Types
import type { InviteType } from 'domain/models'

// Components
import { FaBell } from 'react-icons/fa'
import { Icon } from '@chakra-ui/icons'
import { ConfirmationEmailNotification, Invite } from 'presentation/ui/components'
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
  useColorModeValue
} from '@chakra-ui/react'

// Footer component
export const Notifications: FC<{
  invites: InviteType[]
}> = ({
  invites
}) => {
  // Hooks
  const { user } = useUser()

  // Color Hooks
  const colorText = useColorModeValue('gray.900', 'gray.100')
  const bgPopover = useColorModeValue('gray.50', 'gray.800')
  const borderPopover = useColorModeValue('gray.200', 'gray.600')

  // Utils
  const notificationsCount = invites.length + (user?.isEmailconfirmed ? 0 : 1)
  
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
            notificationsCount > 0 && (
              <Badge
                colorScheme="red"
                position="absolute"
                borderRadius="sm"
                top="-1"
                right="-1"
              >
                {notificationsCount}
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
        maxHeight="400px"
        overflowY="auto"
      >
        <PopoverHeader
          pt="4"
          fontWeight='bold'
          border='0'
          color={colorText}
        >
          Notificações
        </PopoverHeader>
        <PopoverArrow  />
        <PopoverCloseButton mt="2" />
        <PopoverBody>
          {
            // E-mail confirmation reminder
            !user?.isEmailconfirmed && (
              <ConfirmationEmailNotification 
                onClick={() => console.log('Confirm E-mail')}
              />
            )
          }
          {
            // Invitations list
            invites.map((invite: InviteType) => (
              <Invite
                key={invite.id}
                invite={invite}
                onClick={() => console.log(`Invite id: ${invite.id}`)}
              />
            ))
          }
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
