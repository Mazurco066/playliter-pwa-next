// Dependencies
import { FC, useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useUser } from 'infra/services/session'
import { requestClient } from 'infra/services/http'

// Types
import type { InviteType } from 'domain/models'

// Layout and Components
import { EditableControls, InviteItem } from './elements'
import { EmailIcon } from '@chakra-ui/icons'
import {
  Avatar,
  Badge,
  Box,
  Container,
  Editable,
  EditablePreview,
  EditableInput,
  Flex,
  Grid,
  Heading,
  Input,
  Skeleton,
  Text,
  useColorModeValue
} from '@chakra-ui/react'


// Bands list component
const ProfileView: FC = () => {
  // Hooks
  const { user } = useUser()
  const [ name, setName ] = useState<string>()

  // Color hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')

  // Destruct user data
  const { avatar, isEmailconfirmed } = user || {}

  // HTTP Requests
  const {
    data: pendingInvites,
    isLoading: invitesLoading
  } = useQuery(
    ['invites'], 
    () => requestClient('/api/bands/invites', 'get')
  )

  // Utils
  const notificationsCount = (pendingInvites?.data?.length || 0) + (isEmailconfirmed ? 0 : 1)

  // Effects
  useEffect(() => {
    if (user) setName(user.name)
  }, [user])

  // Actions
  const onNameSubmit = async (newValue: string) => {
    setName(newValue)
  }

  // View JSX
  return (
    <div>
      <Container>
        <Box
          bgColor={bgBox}
          borderRadius="lg"
          px="3"
          py="5"
          mb="5"
        >
          <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Avatar
              src={avatar}
              name={name}
              size="xl"
              mb="3"
            />
            <Editable
              textAlign='center'
              value={name}
              fontSize='2xl'
              isPreviewFocusable={false}
              onSubmit={onNameSubmit}
              onCancel={(oldValue: string) => setName(oldValue)}
              onChange={(value: string) => setName(value)}
            >
              <EditablePreview />
              <Input as={EditableInput} />
              <EditableControls />
            </Editable>
          </Flex>
        </Box>
        <Flex 
          alignItems="center"
          mb="5"
        >
          <Heading
            as="h3"
            size="md"
            textAlign="left"
            textTransform="uppercase"
            mr="2"
          >
            Notificações
          </Heading>
          {
            notificationsCount > 0 && (
              <Badge
                colorScheme="red"
                fontSize="sm"
              >
                {notificationsCount}
              </Badge>
            )
          }
        </Flex>
        {
          (user && !isEmailconfirmed) && (
            <Box
              px="5"
              py="5"
              bgColor={bgBox}
              borderRadius="lg"
              mb="5"
              onClick={() => console.log('Confirm E-mail')}
            >
              <Flex alignItems="center">
                <Box
                  flex="0 0 auto"
                  mr="4"
                  display="flex"
                  alignItems="center"
                >
                  <EmailIcon fontSize="xl" />
                </Box>
                <Box flexGrow="1">
                  <Heading
                    as="h4"
                    size="sm"
                    mb="1"
                    color="red.300"
                  >
                    E-mail ainda não foi confirmado
                  </Heading>
                  <Text>
                    Clique aqui para confirmar
                  </Text>
                </Box>
              </Flex>
            </Box>
          )
        }
        {
          (pendingInvites && !invitesLoading) ? (
            <>
              { pendingInvites.data?.length > 0 ? (
                <Grid
                  templateColumns="1fr"
                  gap="1rem"
                  mb="5"
                >
                  { pendingInvites?.data.map((invite: InviteType, i: number) => (
                    <InviteItem
                      key={i}
                      invite={invite}
                      onResponse={(resp: string) => console.log(`Invite id: ${invite.id} - ${resp}`)}
                    />
                  ))}
                </Grid>
              ) : !isEmailconfirmed && (
                <Text>
                  Não há notificações pendentes
                </Text>
              )}
            </>
          ) : (
            <Grid
              templateColumns="1fr"
              gap="1rem"
              mb="5"
            >
              <Skeleton height="90px" width="full" borderRadius="lg" />
              <Skeleton height="90px" width="full" borderRadius="lg" />
            </Grid>
          )
        }
      </Container>
    </div>
  )
}

// Exporting component
export default ProfileView
