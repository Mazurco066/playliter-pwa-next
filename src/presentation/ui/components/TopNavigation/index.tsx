// Dependencies
import useSWR from 'swr'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { useUser } from 'infra/services/session'
import { fetchJsonFromOrigin } from 'infra/services/http'

// Components
import { ArrowBackIcon } from '@chakra-ui/icons'
import {
  Avatar,
  AvatarBadge,
  Container,
  Divider,
  Flex,
  Heading,
  IconButton,
  Link,
  Text
} from '@chakra-ui/react'

// Fetchers
const invitesFetcher = (url: string) => fetchJsonFromOrigin(url, { method: 'GET' })

// TopNavigation component
export const TopNavigation: FC<{
  pageTitle: string,
  pageSubtitle: string
}> = ({
  pageTitle,
  pageSubtitle
}) => {
  // Hooks
  const router = useRouter()
  const { user } = useUser()

  // HTTP Requests by SWR
  const {
    data: pendingInvites
  } = useSWR('api/bands/invites', invitesFetcher)

  // Utils
  const notificationsCount = pendingInvites?.length + (user?.isEmailconfirmed ? 0 : 1)

  // JSX
  return (
    <Container height="full">
      <Flex
        justify="space-between"
        align="center"
        height="full"
      >
        <IconButton 
          aria-label="go-back"
          icon={<ArrowBackIcon />}
          variant="ghost"
          fontSize="2xl"
          onClick={() => router.back()}
        />
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Heading
            as="h3"
            size="md"
            textTransform="capitalize"
            textOverflow="ellipsis"
            textAlign="center"
          >
            {pageTitle}
          </Heading>
          {
            pageSubtitle !== '' && (
              <Text
                mt="1"
                textTransform="uppercase"
                fontWeight="bold"
                color="secondary.500"
                textAlign="center"
                fontSize="sm"
              >
                {pageSubtitle}
              </Text>
            )
          }
        </Flex>
        <Link as={NextLink} href="/profile">
          <Avatar
            src={user?.avatar}
            name={user?.name}
            ml="3"
            cursor="pointer"
          >
            {
              notificationsCount > 0 && (
                <AvatarBadge
                  bg='tomato'
                  boxSize='1.25em'
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text
                    color="gray.100"
                    as="small"
                    fontSize="0.65rem"
                    fontWeight="bold"
                    textAlign="center"
                    pr="0.07rem"
                  >
                    {notificationsCount}
                  </Text>
                </AvatarBadge>
              )
            }            
          </Avatar>
        </Link>
        
      </Flex>
      <Divider orientation="horizontal" />
    </Container> 
  )
}
