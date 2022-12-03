// Dependencies
import { FC } from 'react'
import { useTranslation } from 'next-i18next'

// Type
import type { InviteType } from 'domain/models'

// Components
import { EmailIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  Text,
  useColorModeValue
} from '@chakra-ui/react'

// Pending show item component
export const Invite: FC<{
  invite: InviteType,
  onClick?: () => void
}> = ({
  invite,
  onClick = () => {}
}) => {
  // Hooks
  const { t: common } = useTranslation('common')

  // Color Hooks
  const colorText = useColorModeValue('gray.900', 'gray.100')
  const bgInvite = useColorModeValue('gray.100', 'gray.900')

  // JSX
  return (
    <Box
      data-group
      key={invite.id}      
      mb="2"
      p="2"
      borderRadius="md"
      bg={bgInvite}
      cursor="pointer"
      _hover={{
        bgGradient: 'linear(to-l, secondary.600, primary.600)'
      }}
      _last={{
        mb: "0"
      }}
      onClick={onClick}
    >
      <Flex direction="column" alignItems="center">
        <EmailIcon
          mr="3"
          mb="1"
          color={colorText}
          _groupHover={{
            color: 'gray.100'
          }}
        />
        <Text
          textAlign="center"
          color={colorText}
          _groupHover={{
            color: 'gray.100'
          }}
        >
          {common('invite_notification.notification_text')}
          <Text
            as="strong"
            color="secondary.500"
            _groupHover={{
              color: 'gray.100'
            }}
          >
            {invite.band.title}
          </Text>{' '}!
        </Text>
      </Flex>
    </Box>
  )
}
