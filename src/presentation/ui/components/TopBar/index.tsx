// Dependencies
import useSWR from 'swr'
import { FC } from 'react'
import { useUser } from 'infra/services/session'
import { fetchJson } from 'infra/services/http'

// Components
import {
  Invitations,
  UserMenu,
  ThemeSwitch
} from 'presentation/ui/components'
import {
  Avatar,
  AvatarBadge,
  Container,
  Divider,
  Flex,
  Heading,
  HStack
} from '@chakra-ui/react'

// Fetchers
const invitesFetcher = (url: string) => fetchJson(url, { method: 'GET' })

// TopBar component
export const TopBar: FC = () => {
  // Hooks
  const { user } = useUser()

  // HTTP Requests by SWR
  const {
    data: pendingInvites
  } = useSWR('api/bands/invites', invitesFetcher)

  // JSX
  return (
    <Container height="full">
      <Flex
        justify="space-between"
        align="center"
        height="full"
      >
        <Flex alignItems="center">
          <Avatar
            src={user?.avatar}
            name={user?.name}
          >
            <AvatarBadge boxSize='1.25em' bg='green.500' />
          </Avatar>
          <Heading
            as="h3"
            size="md"
            ml="3"
            textTransform="capitalize"
            textOverflow="ellipsis"
          >
            Playliter App
          </Heading>
        </Flex>
        <HStack spacing="2">
          <Invitations
            invites={pendingInvites || []}
          />
          <ThemeSwitch />
          <UserMenu />
        </HStack>
      </Flex>
      <Divider orientation="horizontal" />
    </Container> 
  )
}
