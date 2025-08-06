// Dependencies
import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'next-i18next'
import { useUser } from 'infra/services/session'
import { requestClient } from 'infra/services/http'

// Types
import type { InviteType } from 'domain/models'

// Layout and Components
import { AvatarUpload, ConfirmAction } from 'presentation/ui/components'
import { EditableControls, InviteItem } from './elements'
import { EmailIcon } from '@chakra-ui/icons'
import {
  Badge,
  Button,
  Box,
  Container,
  Editable,
  EditableInput,
  Flex,
  Grid,
  Heading,
  Input,
  Skeleton,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  UseToastOptions
} from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons'

// Bands list component
const ProfileView: FC = () => {
  // Hooks
  const router = useRouter()
  const toast = useToast()
  const { user, mutateUser } = useUser()
  const [ name, setName ] = useState<string>('')
  const [ userEmail, setUserEmail ] = useState<string>('')
  const [ userAvatar, setUserAvatar ] = useState<string>('')
  const [ uploadedUrl, setUploadedUrl ] = useState<string>('')
  const { t: common } = useTranslation('common')
  const { t } = useTranslation('profile')

  // Color hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')

  // Destruct user data
  const { id, avatar, email, isEmailconfirmed } = user || {}

  // Confirm dialog state
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose
  } = useDisclosure()

  // Pending Invites Requests
  const {
    data: pendingInvites,
    isLoading: invitesLoading,
    refetch: refetchInvites
  } = useQuery(
    ['invites'], 
    () => requestClient('/api/bands/invites', 'get')
  )

  // Save account request
  const {
    isLoading: deleteAccountLoading,
    mutateAsync: deleteAccountAsync
  } = useMutation(() => {
    return requestClient('/api/accounts/delete_account', 'delete')
  })

  // Save account request
  const {
    isLoading: accountLoading,
    mutateAsync: mutateUserAsync
  } = useMutation((data: any) => {
    return requestClient('/api/accounts/update', 'post', data)
  })

  // Respond invite request
  const {
    isLoading: inviteLoading,
    mutateAsync: mutateInvite
  } = useMutation((data: any) => {
    return requestClient('/api/bands/respond_invite', 'post', data)
  })

  // Generic error msg
  const genericMsg: UseToastOptions = {
    title: common('messages.internal_error_title'),
    description: common('messages.internal_error_msg'),
    status: 'error',
    duration: 5000,
    isClosable: true
  }

  // Utils
  const notificationsCount = (pendingInvites?.data?.length || 0) + (isEmailconfirmed ? 0 : 1)

  // Effects
  useEffect(() => {
    if (user) {
      setName(user.name)
      setUserAvatar(user.avatar)
      setUserEmail(user.email)
    }
  }, [user])

  useEffect(() => {
    if (uploadedUrl && uploadedUrl !== user.avatar) {
      onAvatarChange(uploadedUrl)
    }
  }, [uploadedUrl])

  // Actions
  const onAvatarChange = async (newValue: string) => {
    // Avatar was not updated
    if (newValue === user.avatar) return

    // Request account update
    const accountResponse = await mutateUserAsync({
      id: id,
      avatar: newValue,
      name: user.name,
      email: email,
      role: user?.role?.toLowerCase(),
    })

    // Verify if it was successfull
    if ([200, 201].includes(accountResponse.status)) {
      setUserAvatar(newValue)

      // Mutate session user
      const updatedUser = { ...user, avatar: newValue }
      mutateUser(updatedUser)

      // Notify user about avatar update
      toast({
        title: t('messages.avatar_update_title'),
        description: t('messages.avatar_update_msg'),
        status: 'success',
        duration: 2000,
        isClosable: true
      })

    } else {
      setUserAvatar(user?.avatar || '')
      if ([400].includes(accountResponse.status)) {
        toast({
          title: t('messages.no_info_title'),
          description: t('messages.no_info_msg'),     
          status: 'info',
          duration: 3500,
          isClosable: true
        })
      } else {
        toast(genericMsg)
      }
    }
  }

  const onNameSubmit = async (newValue: string) => {
    // Name was not updated
    if (newValue === user.name) return

    // Validate if name as informed
    if (!newValue || newValue.length <= 3) {
      setName(user?.name || '')
      return toast({
        title: t('messages.invalid_name_title'),
        description: t('messages.invalid_name_msg'),     
        status: 'warning',
        duration: 3500,
        isClosable: true
      })
    }

    // Request account update
    const accountResponse = await mutateUserAsync({
      id: id,
      avatar: avatar,
      name: newValue,
      email: email,
      role: user?.role?.toLowerCase(),
    })

    // Verify if it was successfull
    if ([200, 201].includes(accountResponse.status)) {
      setName(newValue)

      // Mutate session user
      const updatedUser = { ...user, name: newValue }
      mutateUser(updatedUser)

      // Notify user about name update
      toast({
        title: t('messages.name_update_title'),
        description: t('messages.name_update_msg'),
        status: 'success',
        duration: 2000,
        isClosable: true
      })

    } else {
      setName(user?.name || '')
      if ([400].includes(accountResponse.status)) {
        toast({
          title: t('messages.no_info_title'),
          description: t('messages.no_info_msg'), 
          status: 'info',
          duration: 3500,
          isClosable: true
        })
      } else {
        toast(genericMsg)
      }
    }
  }

  const onEmailSubmit = async (newValue: string) => {
    // E-mail was not updated
    if (newValue === user.email) return

    // Validate if name as informed
    if (!newValue || !/\S+@\S+\.\S+/.test(newValue)) {
      setUserEmail(user?.email || '')
      return toast({
        title: t('messages.invalid_email_title'),
        description: t('messages.invalid_email_msg'),     
        status: 'warning',
        duration: 3500,
        isClosable: true
      })
    }

    // Request account update
    const accountResponse = await mutateUserAsync({
      id: id,
      avatar: avatar,
      name: user.name,
      email: newValue,
      role: user?.role?.toLowerCase(),
    })

    // Verify if it was successfull
    if ([200, 201].includes(accountResponse.status)) {
      setName(newValue)

      // Mutate session user
      const updatedUser = {
        ...user,
        email: newValue,
        isEmailconfirmed: accountResponse.data.isEmailconfirmed
      }
      mutateUser(updatedUser)

      // Notify user about name update
      toast({
        title: t('messages.email_update_title'),
        description: t('messages.email_update_msg'),
        status: 'success',
        duration: 3000,
        isClosable: true
      })

    } else {
      setUserEmail(user?.email || '')
      if ([400].includes(accountResponse.status)) {
        toast({
          title: t('messages.email_in_use_title'),
          description: t('messages.email_in_use_msg'),     
          status: 'warning',
          duration: 3500,
          isClosable: true
        })
      } else {
        toast(genericMsg)
      }
    }
  }

  const onRespondInvite = async(id: string, response: string) => {
    // Respond invite request
    const inviteResponse = await mutateInvite({
      id: id,
      user_response: response
    })

    // Verify if it was successfull
    if ([200, 201].includes(inviteResponse.status)) {

      // Notify user about name update
      toast({
        title: t('messages.invite_response_title'),
        description: `${t('messages.invite_response_msg_1')}${response === 'denied'? 'negou' : 'aceitou'}${t('messages.invite_response_msg_2')}`,
        status: 'success',
        duration: 3000,
        isClosable: true
      })

      // Refresh invite list
      refetchInvites()

    } else {
      if ([400].includes(inviteResponse.status)) {
        toast({
          title: t('messages.invalid_response_title'),
          description: t('messages.invalid_response_msg'),     
          status: 'info',
          duration: 3000,
          isClosable: true
        })
      } else {
        toast(genericMsg)
      }
    }
  }

  const onWipeAccountData = async () => {
    const response = await deleteAccountAsync()
    if (response.status < 400) {
      toast({
        title: t('messages.deleteAccount_title'),
        description: t('messages.deleteAccount_msg'),
        status: 'success',
        duration: 3000,
        isClosable: true
      })
      mutateUser(
        await requestClient('/api/logout', 'post'),
        false
      )
      router.push('/login')
    } else {
      toast({
        title: t('messages.deleteAccountError_title'),
        description: t('messages.deleteAccountError_msg'),
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  }

  // View JSX
  return (
    <div>
      <Container maxWidth="6xl">
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
            <AvatarUpload
              source={userAvatar}
              name={name}
              onUploadSuccess={({ url }) => setUploadedUrl(url)}
              onUploadError={() => {
                toast({
                  title: t('messages.upload_error_title'),
                  description: t('messages.upload_error_msg'),
                  status: 'error',
                  duration: 3500,
                  isClosable: true
                })
              }}
            />
            {/* Name editable */}
            <Editable
              textAlign='center'
              value={name}
              fontSize='2xl'
              isPreviewFocusable={false}
              submitOnBlur={false}
              onSubmit={onNameSubmit}
              onCancel={(oldValue: string) => setName(oldValue)}
              onChange={(value: string) => setName(value)}
              isDisabled={accountLoading}
            >
              <Input as={EditableInput} />
              <EditableControls />
            </Editable>
            {/* E-mail editable */}
            <Editable
              textAlign='center'
              value={userEmail}
              fontSize='lg'
              isPreviewFocusable={false}
              submitOnBlur={false}
              onSubmit={onEmailSubmit}
              onCancel={(oldValue: string) => setUserEmail(oldValue)}
              onChange={(value: string) => setUserEmail(value)}
              isDisabled={accountLoading}
            >
              <Input as={EditableInput} />
              <EditableControls />
            </Editable>
            <Button
              mt="3"
              colorScheme="red"
              onClick={() => onConfirmOpen()}
              isDisabled={accountLoading || deleteAccountLoading}
            >
              <WarningIcon mr="2" /> {t('delete')}
            </Button>
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
            {t('notifications_label')}
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
              onClick={() => router.push('../verify')}
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
                    {t('email_not_confirmed')}
                  </Heading>
                  <Text>
                    {t('click_to_confirm')}
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
                      onResponse={(resp: string) => onRespondInvite(invite.id, resp)}
                      isLoading={accountLoading || inviteLoading || invitesLoading}
                    />
                  ))}
                </Grid>
              ) : isEmailconfirmed && (
                <Text>
                  {t('empty_notifications')}
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
      <ConfirmAction
        enableTimer
        onClose={onConfirmClose}
        onOpen={onConfirmOpen}
        isOpen={isConfirmOpen}
        onConfirm={onWipeAccountData}
        message={t('delete_warning')}
      />
    </div>
  )
}

// Exporting component
export default ProfileView
