// Dependencies
import { FC } from 'react'
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
  account: AccountType,
  role: string,
  canRemove?: boolean,
  canManage?: boolean,
  isOwner?: boolean,
  isLoading?: boolean,
  onManage?: (action: string, id: string) => void,
  onRemove?: (id: string) => void
}> = ({
  account,
  role,
  canRemove = false,
  canManage = false,
  isOwner = false,
  isLoading = false,
  onManage = () => {},
  onRemove = () => {}
}) => {
  // Hooks
  const { user } = useUser()

  // Color Hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')
  const colorText = useColorModeValue('gray.900', 'gray.100')

  // Destruct data
  const { id: userId } = user || {}
  const { id, avatar, name } = account

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
                    (isOwner || canManage) && (
                      <>
                        {
                          role === 'Membro' ? (
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
                              Tornar Admin
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
                              Tornar Membro
                            </Button>
                          )
                        }
                        {
                          (canRemove && (id !== userId)) && (
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
                                Remover
                              </Button>
                            </>
                          )
                        }
                      </>
                    )
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
