// Dependencies
import { FC, useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useUser } from 'infra/services/session'
import { requestClient } from 'infra/services/http'

// Layout and Components
import { EditableControls } from './elements'
import {
  Avatar,
  Badge,
  Box,
  Container,
  Editable,
  EditablePreview,
  EditableInput,
  Flex,
  Heading,
  Input,
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
    data: pendingInvites
  } = useQuery(
    ['invites'], 
    () => requestClient('/api/bands/invites', 'get')
  )

  // Utils
  const notificationsCount = (pendingInvites?.data?.length || 0) + (isEmailconfirmed ? 0 : 1)

  // Effects
  useEffect(() => {
    if (user) {
      setName(user.name)
    }
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
        <Flex alignItems="center">
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
      </Container>
    </div>
  )
}

// Exporting component
export default ProfileView
