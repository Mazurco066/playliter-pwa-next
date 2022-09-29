// Dependencies
import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { requestClient } from 'infra/services/http'
import { useUser } from 'infra/services/session'

// Types
import type { AccountType } from 'domain/models'

// Layout and Components
import { MemberItem } from './elements'
import { ConfirmAction } from 'presentation/ui/components'
import { Icon, DeleteIcon, EditIcon, SettingsIcon } from '@chakra-ui/icons'
import { FaUserPlus, FaUsers } from 'react-icons/fa'
import {
  Avatar,
  Box,
  Container,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  UseToastOptions
} from '@chakra-ui/react'

// Generic msg
const genericMsg: UseToastOptions = {
  title: 'Erro interno.',
  description: 'Um erro inesperado ocorreu! Entre em contato com algum administrador do App.',
  status: 'error',
  duration: 5000,
  isClosable: true
}

// Band component
const BandView: FC<{ id: string }> = ({ id }) => {
  // Hooks
  const router = useRouter()
  const toast = useToast()
  const { user } = useUser()
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose
  } = useDisclosure()

  // Page members action state
  const [ action, setAction ] = useState<{
    type: 'promote' | 'demote' | 'remove',
    id: string
  }>({
    type: 'remove',
    id: ''
  })

  // Color Hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')

  // Requests
  const {
    data: band,
    isLoading: bandLoading
  } = useQuery(
    ['get-band'],
    () => requestClient(`/api/bands/get?id=${id}`, 'get'),
    { enabled: id !== '' }
  )

  // Notify user about error while fetching his banda data
  useEffect(() => {
    if (band && band?.status !== 200) {
      if ([404].includes(band.status)) {
        toast({
          title: 'Banda não encontrada.',
          description: 'A banda informada não foi encontrada em sua conta!',
          status: 'info',
          duration: 5000,
          isClosable: true
        })
      } else {
        toast(genericMsg)
      }
      router.push('../bands')
    }
  }, [band])

  // Destruct params
  const { id: userId } = user || {}
  const {
    admins = [],
    members = [],
    owner = {}
  } = band ? band.data : {}

  // Compute role
  const isUserOwner = userId === owner.id
  const isUserAdmin = admins.find((a: AccountType) => a.id === userId) !== undefined

  // View JSX
  return (
    <div>
      <Container>
        { (band && !bandLoading) ? (
          <>
            {/* Band details */}
            <Box
              bgColor={bgBox}
              borderRadius="lg"
              mb="5"
            >
              <Box
                height="64px"
                bgGradient="linear(to-b, secondary.600, primary.600)"
                position="relative"
                borderTopRadius="lg"
                mb="10"
              >
                <Flex
                  justifyContent="flex-end"
                  px="2"
                  pt="2"
                >
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label='Options'
                      icon={<SettingsIcon />}
                      variant='ghost'
                      color="gray.100"
                    />
                    <MenuList>
                      <MenuItem
                        icon={<Icon as={FaUserPlus} />}
                      >
                        Convidar
                      </MenuItem>
                      <MenuItem
                        icon={<Icon as={FaUsers} />}
                      >
                        Membros
                      </MenuItem>
                      <MenuItem
                        icon={<EditIcon />}
                        onClick={() => router.push(`../bands/save/${band?.data?.id}`)}
                      >
                        Editar
                      </MenuItem>
                      <MenuItem
                        icon={<DeleteIcon />}
                      >
                        Remover
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
                <Avatar
                  position="absolute"
                  top="4"
                  left="0"
                  right="0"
                  margin="0 auto"
                  size="xl"
                  borderWidth="5px"
                  borderColor={bgBox}
                  name={band?.data?.title}
                  src={band?.data?.logo}
                />
              </Box>
              <Box
                px="3"
                py="5"
              >
                <Heading
                  as="h4"
                  size="md"
                  textAlign="left"
                  textTransform="uppercase"
                  color="secondary.500"
                  mb="1"
                >
                  {band?.data?.title}
                </Heading>
                <Text mb="3">
                  {band?.data?.description}
                </Text>
                <Text fontSize="sm">
                  Criada em{' '}
                  <Text as="strong" color="secondary.500">
                    {band?.data?.createdAt?.split('T')[0].split('-').reverse().join('/')}
                  </Text>
                </Text>
              </Box>
            </Box>
            {/* Members management */}
            <Heading
              as="h3"
              size="md"
              textAlign="left"
              textTransform="uppercase"
              mb="3"
            >
              Membros
            </Heading>
            <Box
              bgGradient="linear(to-b, secondary.600, primary.600)"
              borderRadius="lg"
              mb="5"
              px="3"
              py="5"
            >
              <Flex
                alignItems="center"
                justifyContent="flex-start"
                gap="1rem"
                overflowY="hidden"
                overflowX="auto"
              >
                {
                  members.map((acc: AccountType, i: number)=> {
                    // Compute role
                    const { id } = acc
                    const isOwner = id === owner.id
                    const isAdmin = admins.find((a: AccountType) => a.id === id) !== undefined
                    const role = isOwner ? 'Fundador' : isAdmin ? 'Admin' : 'Membro'

                    // JSX
                    return (
                      <MemberItem
                        key={i}
                        account={acc}
                        role={role}
                        isOwner={isUserOwner}
                        canManage={isUserAdmin || isUserOwner}
                        canRemove={isUserOwner}
                        onRemove={(_id: string) => {
                          setAction({ type: 'remove', id: _id })
                          onConfirmOpen()
                        }}
                        onManage={(action: 'promote' | 'demote', _id: string) => {
                          setAction({ type: action, id: _id })
                          onConfirmOpen()
                        }}
                        isLoading={false}
                      />
                    )
                  })
                }
              </Flex>
            </Box>
          </>
        ) : (
          <>
            <Skeleton
              height="192px"
              borderRadius="lg"
              mb="5"
            />
            <Skeleton
              height="64px"
              borderRadius="lg"
              mb="5"
            />
          </>
        )}
      </Container>
      {/* Confirm action component */}
      <ConfirmAction
        onClose={onConfirmClose}
        onOpen={onConfirmOpen}
        isOpen={isConfirmOpen}
        onConfirm={() => {
          console.log('confirmed action here', action)
        }}
      />
    </div>
  )
}

// Exporting component
export default BandView
