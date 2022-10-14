// Dependencies
import NextLink from 'next/link'
import { FC } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { useUser } from 'infra/services/session'
import { requestClient } from 'infra/services/http'

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
  Text,
  useMediaQuery
} from '@chakra-ui/react'

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

  // Display hooks
  const [ isPrinting ] = useMediaQuery(['print'])

  // HTTP Requests
  const {
    data: pendingInvites
  } = useQuery(
    ['invites'], 
    () => requestClient('/api/bands/invites', 'get')
  )

  // Utils
  const notificationsCount = pendingInvites?.data?.length + (user?.isEmailconfirmed ? 0 : 1)

  // JSX
  return (
    <Container
      height="full"
      maxWidth="6xl"
      display={isPrinting ? 'none' : 'block' }
    >
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
