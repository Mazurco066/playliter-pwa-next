// Dependencies
import { FC } from 'react'
import { useTranslation } from 'next-i18next'
import { useUser } from 'infra/services/session'

// Types
import type { AccountType } from 'domain/models'

// Components
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useColorModeValue
} from '@chakra-ui/react'

// Component
export const MemberItem: FC<{
  account: AccountType
  role: string
  canRemove?: boolean
  canTransfer?: boolean
  canManage?: boolean
  isOwner?: boolean
  isLoading?: boolean
  onManage?: (action: 'promote' | 'demote', id: string) => void
  onRemove?: (id: string) => void
  onTransfer?: (id: string) => void
}> = ({
  account,
  role,
  canRemove = false,
  canTransfer = false,
  canManage = false,
  isOwner = false,
  isLoading = false,
  onManage = () => {},
  onRemove = () => {},
  onTransfer = () => {}
}) => {
  // Hooks
  const { user } = useUser()
  const { t } = useTranslation('band')

  // Color Hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')
  const colorText = useColorModeValue('gray.900', 'gray.100')

  // Destruct data
  const { id: userId } = user || {}
  const { id, avatar, name, userId: accountUserId } = account

  // JSX
  return (
    <Box>
      <Popover
        placement='bottom'
        closeOnBlur={true}
      >
        {({ onClose }) => (
          <>
            <PopoverTrigger>
              <Avatar
                src={avatar}
                name={name}
                size="md"
              />
            </PopoverTrigger>
            <PopoverContent
              color={colorText}
              bgColor={bgBox}
              borderColor={bgBox}
              maxW="200px"
            >
              <PopoverHeader
                pt={4}
                fontWeight="bold"
                border="0"
                textTransform="capitalize"
              >
                {name}
              </PopoverHeader>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                <Flex
                  direction="column"
                >
                  <Badge
                    width="fit-content"
                    colorScheme="secondary"
                  >
                    {role}
                  </Badge>
                  {
                    ((isOwner || canManage) && (accountUserId !== userId)) ? (
                      <>
                        {
                          [t('roles.member')].includes(role) ? (
                            <Button
                              mt="5"
                              colorScheme="primary"
                              size="sm"
                              disabled={isLoading}
                              onClick={() => {
                                onManage('promote', id)
                                onClose()
                              }}
                            >
                              {t('menu.turn_admin')}
                            </Button>
                          ) : role === 'Admin' && (
                            <Button
                              mt="5"
                              colorScheme="primary"
                              size="sm"
                              disabled={isLoading}
                              onClick={() => {
                                onManage('demote', id)
                                onClose()
                              }}
                            >
                              {t('menu.turn_member')}
                            </Button>
                          )
                        }
                        {
                          (canRemove && (accountUserId !== userId)) && (
                            <>
                              <Button
                                mt="3"
                                colorScheme="red"
                                size="sm"
                                disabled={isLoading}
                                onClick={() => {
                                  onRemove(id)
                                  onClose()
                                }}
                              >
                                {t('menu.remove_member')}
                              </Button>
                            </>
                          )
                        }
                      </>
                    ) : null
                  }
                  {
                    (canTransfer && (accountUserId !== userId)) ? (
                      <Button
                        mt="3"
                        colorScheme="secondary"
                        size="sm"
                        disabled={isLoading}
                        onClick={() => {
                          onTransfer(id)
                          onClose()
                        }}
                      >
                        {t('menu.transfer')}
                      </Button>
                    ) : null
                  }
                </Flex>
              </PopoverBody>
            </PopoverContent>
          </>
        )}
      </Popover>
    </Box>
  )
}
