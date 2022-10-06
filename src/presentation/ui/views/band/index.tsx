// Dependencies
import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { requestClient } from 'infra/services/http'
import { useUser } from 'infra/services/session'

// Types
import type { AccountType, CategoryType, ShowType, SongType } from 'domain/models'

// Layout and Components
import { ConfirmAction } from 'presentation/ui/components'
import { Icon, DeleteIcon, EditIcon, SettingsIcon } from '@chakra-ui/icons'
import { FaUserPlus } from 'react-icons/fa'
import {
  CategoriesComponent,
  CategoryForm,
  CategoryItemMinified,
  BandDrawer,
  InviteMember,
  MemberItem,
  ShowItemMinified,
  ShowsComponent,
  SongItemMinified,
  SongsComponent
} from './elements'
import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Stack,
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

  // Page members action state
  const [ action, setAction ] = useState<{
    type: 'promote' | 'demote' | 'remove' | 'delete',
    id: string
  }>({
    type: 'remove',
    id: ''
  })

  // Category form state
  const [ currentCategory, setCurrentCategory ] = useState<CategoryType | null>(null)

  // Confirm dialog state
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose
  } = useDisclosure()

  // Songs drawer state
  const {
    isOpen: isSongsOpen,
    onOpen: onSongsOpen,
    onClose: onSongsClose
  } = useDisclosure()

  // Shows drawer state
  const {
    isOpen: isShowsOpen,
    onOpen: onShowsOpen,
    onClose: onShowsClose
  } = useDisclosure()

  // Categories drawer state
  const {
    isOpen: isCategoriesOpen,
    onOpen: onCategoriesOpen,
    onClose: onCategoriesClose
  } = useDisclosure()

  // Category form modal state
  const {
    isOpen: isCategoryFormOpen,
    onOpen: onCategoryFormOpen,
    onClose: onCategoryFormClose
  } = useDisclosure()

  // Invite member modal state
  const {
    isOpen: isInviteMemberOpen,
    onOpen: onInviteMemberOpen,
    onClose: onInviteMemberClose
  } = useDisclosure()

  // Color Hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')

  // Band request
  const {
    refetch: refetchBand,
    data: band,
    isLoading: bandLoading
  } = useQuery(
    [`get-band-${id}`],
    () => requestClient(`/api/bands/get?id=${id}`, 'get'),
    { enabled: id !== '' }
  )

  // Last 5 shows request
  const {
    data: shows,
    isLoading: showsLoading
  } = useQuery(
    [`few-shows-${id}`],
    () => requestClient(`/api/shows/band?band=${id}&limit=5`, 'get'),
    { enabled: id !== '' }
  )

  // Last 15 songs request
  const {
    data: songs,
    isLoading: songsLoading
  } = useQuery(
    [`few-songs-${id}`],
    () => requestClient(`/api/songs/band?band=${id}&limit=15`, 'get'),
    { enabled: id !== '' }
  )

  // All categories
  const {
    refetch: refetchCategories,
    data: categories,
    isLoading: categoriesLoading
  } = useQuery(
    [`band-categories-${id}`],
    () => requestClient(`/api/bands/categories?band=${id}`, 'get'),
    { enabled: id !== '' }
  )

  // Promote member requet
  const {
    isLoading: isPromoteLoading,
    mutateAsync: promoteRequest
  } = useMutation((data: any) => {
    return requestClient('/api/bands/promote_member', 'post', data)
  })

  // Demote member requet
  const {
    isLoading: isDemoteLoading,
    mutateAsync: demoteRequest
  } = useMutation((data: any) => {
    return requestClient('/api/bands/demote_member', 'post', data)
  })

  // Remove member request
  const {
    isLoading: isRemoveLoading,
    mutateAsync: removeRequest
  } = useMutation((data: any) => {
    return requestClient('/api/bands/remove_member', 'post', data)
  })

  // Delete band request
  const {
    isLoading: isDeleteLoading,
    mutateAsync: deleteBandRequest
  } = useMutation((data: any) => {
    return requestClient('/api/bands/delete', 'post', data)
  })

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
  const canAddSongs = categories?.data && !categoriesLoading && categories.data.length > 0

  // Actions
  const onCategoryClick = (_category: CategoryType) => {
    setCurrentCategory(_category)
    onCategoryFormOpen()
  }

  const onDemoteMember = async (accountId: string, bandId: string) => {
    // Request api
    const response = await demoteRequest({ accountId, bandId })

    // Verify if request was successfull
    if ([200, 201].includes(response.status)) {
      
      // Notify user about response success
      toast({
        title: 'Sucesso!',
        description: `O membro selecionado foi definido como membro!`,
        status: 'success',
        duration: 2000,
        isClosable: true
      })

      // Refetch band
      refetchBand()

    } else {
      if ([400, 404].includes(response.status)) {
        toast({
          title: 'Ops.. Membro não encontrado!',
          description: 'O integrante solicitado não foi encontrado na banda!',     
          status: 'warning',
          duration: 3500,
          isClosable: true
        })
      } else {
        toast(genericMsg)
      }
    }
  }

  const onPromoteMember = async (accountId: string, bandId: string) => {
    // Request api
    const response = await promoteRequest({ accountId, bandId })

    // Verify if request was successfull
    if ([200, 201].includes(response.status)) {
      
      // Notify user about response success
      toast({
        title: 'Sucesso!',
        description: `O membro selecionado foi definido como admin!`,
        status: 'success',
        duration: 2000,
        isClosable: true
      })

      // Refetch band
      refetchBand()

    } else {
      if ([400, 404].includes(response.status)) {
        toast({
          title: 'Ops.. Membro não encontrado!',
          description: 'O integrante solicitado não foi encontrado na banda!',     
          status: 'warning',
          duration: 3500,
          isClosable: true
        })
      } else {
        toast(genericMsg)
      }
    }
  }

  const onRemoveMember = async (accountId: string, bandId: string) => {
    // Request api
    const response = await removeRequest({ accountId, bandId })

    // Verify if request was successfull
    if ([200, 201].includes(response.status)) {
      
      // Notify user about response success
      toast({
        title: 'Sucesso!',
        description: `O membro selecionado foi removido da banda!`,
        status: 'success',
        duration: 2000,
        isClosable: true
      })

      // Refetch band
      refetchBand()

    } else {
      if ([400, 404].includes(response.status)) {
        toast({
          title: 'Ops.. Membro não encontrado!',
          description: 'O integrante solicitado não foi encontrado na banda!',     
          status: 'warning',
          duration: 3500,
          isClosable: true
        })
      } else {
        toast(genericMsg)
      }
    }
  }

  const onDeleteBand = async (bandId: string) => {
    // Request api
    const response = await deleteBandRequest({ bandId })

    // Verify if request was successfull
    if ([200, 201].includes(response.status)) {
      
      // Notify user about response success
      toast({
        title: 'Sucesso!',
        description: `A banda foi removida com sucesso!`,
        status: 'success',
        duration: 2000,
        isClosable: true
      })

      // Refetch band
      router.push('../bands')

    } else {
      if ([400, 404].includes(response.status)) {
        toast({
          title: 'Ops.. Banda não encontrada!',
          description: 'A banda solicitada não foi encontrada!',     
          status: 'warning',
          duration: 3500,
          isClosable: true
        })
      } else {
        toast(genericMsg)
      }
    }
  }

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
                        onClick={() => onInviteMemberOpen()}
                      >
                        Convidar
                      </MenuItem>
                      <MenuItem
                        icon={<EditIcon />}
                        onClick={() => router.push(`../bands/save/${band?.data?.id}`)}
                      >
                        Editar
                      </MenuItem>
                      {
                        isUserOwner && (
                          <MenuItem
                            icon={<DeleteIcon />}
                            onClick={() => {
                              setAction({ type: 'delete', id: band?.data?.id })
                              onConfirmOpen()
                            }}
                          >
                            Remover Banda
                          </MenuItem>
                        )
                      }
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
          </>
        ) : (
          <>
            <Skeleton
              height="192px"
              borderRadius="lg"
              mb="5"
            />
          </>
        )}
        {/** Band shows */}
        <Flex
          justifyContent="space-between"
          alignItems="center"
          mb="3"
        >
          <Heading
            as="h4"
            size="sm"
            textAlign="left"
            textTransform="uppercase"
            mb="0"
          >
            Apresentações
          </Heading>
          <Button
            variant="fade"
            size="xs"
            disabled={showsLoading}
            onClick={() => onShowsOpen()}
          >
            Ver mais
          </Button>
        </Flex>
        {
          shows?.data && !showsLoading ? (
            <>
              {
                shows.data.length > 0 ? (
                  <Stack
                    direction="row"
                    spacing="3"
                    maxWidth="full"
                    overflowX="auto"
                    mb="5"
                  >
                    {shows?.data.map((show: ShowType) => (
                      <ShowItemMinified
                        key={show.id}
                        show={show}
                        onClick={() => console.log(`Show id: ${show.id}`)}
                      /> 
                    ))}
                  </Stack>
                ) : (
                  <Text mb="5">
                    Não há apresentações registradas nessa banda!
                  </Text>
                )
              }
            </>
          ) : (
            <Stack
              direction="row"
              spacing="3"
              maxWidth="full"
              overflowX="auto"
              mb="5"
            >
              <Skeleton
                width="162px"
                height="192px"
                borderRadius="lg"
              />
            </Stack>
          )
        }
        <BandDrawer
          onClose={onShowsClose}
          onOpen={onShowsOpen}
          isOpen={isShowsOpen}
          title="Apresentações da banda"
        >
          {
            isShowsOpen && <ShowsComponent bandId={band?.data?.id} />
          }
        </BandDrawer>
        {/** Band songs */}
        <Flex
          justifyContent="space-between"
          alignItems="center"
          mb="3"
        >
          <Heading
            as="h4"
            size="sm"
            textAlign="left"
            textTransform="uppercase"
            mb="0"
          >
            Músicas
          </Heading>
          <Button
            variant="fade"
            size="xs"
            disabled={songsLoading}
            onClick={() => onSongsOpen()}
          >
            Ver mais
          </Button>
        </Flex>
        {
          songs?.data && !songsLoading ? (
            <>
              {
                songs.data.data?.length > 0 ? (
                  <Stack
                    direction="row"
                    spacing="3"
                    maxWidth="full"
                    overflowX="auto"
                    mb="5"
                  >
                    {songs.data.data.map((song: SongType) => (
                      <SongItemMinified
                        key={song.id}
                        song={song}
                        onClick={() => console.log(`Song id: ${song.id}`)}
                      /> 
                    ))}
                  </Stack>
                ) : (
                  <Text mb="5">
                    Não há músicas registradas nessa banda!
                  </Text>
                )
              }
            </>
          ) : (
            <Stack
              direction="row"
              spacing="3"
              maxWidth="full"
              overflowX="auto"
              mb="5"
            >
              <Skeleton
                width="162px"
                height="192px"
                borderRadius="lg"
              />
            </Stack>
          )
        }
        <BandDrawer
          onClose={onSongsClose}
          onOpen={onSongsOpen}
          isOpen={isSongsOpen}
          title="Repertório da banda"
        >
          {
            isSongsOpen && <SongsComponent
              bandId={band?.data?.id}
              canAddSongs={canAddSongs}
            />
          }
        </BandDrawer>
        {/** Band categories */}
        <Flex
          justifyContent="space-between"
          alignItems="center"
          mb="3"
        >
          <Heading
            as="h4"
            size="sm"
            textAlign="left"
            textTransform="uppercase"
            mb="0"
          >
            Categorias
          </Heading>
          <Button
            variant="fade"
            size="xs"
            disabled={categoriesLoading}
            onClick={() => onCategoriesOpen()}
          >
            Gerenciar
          </Button>
        </Flex>
        {
          categories?.data && !categoriesLoading ? (
            <>
              {
                categories.data.length > 0 ? (
                  <Stack
                    direction="row"
                    spacing="3"
                    maxWidth="full"
                    overflowX="auto"
                    mb="5"
                  >
                    {categories.data.map((category: CategoryType) => (
                      <CategoryItemMinified
                        key={category.id}
                        category={category}
                        onClick={onCategoryClick}
                      /> 
                    ))}
                  </Stack>
                ) : (
                  <Text mb="5">
                    Não há categorias registradas nessa banda!
                  </Text>
                )
              }
            </>
          ) : (
            <Stack
              direction="row"
              spacing="3"
              maxWidth="full"
              overflowX="auto"
              mb="5"
            >
              <Skeleton
                width="64px"
                height="64px"
                borderRadius="lg"
              />
              <Skeleton
                width="64px"
                height="64px"
                borderRadius="lg"
              />
            </Stack>
          )
        }
        <BandDrawer
          onClose={onCategoriesClose}
          onOpen={onCategoriesOpen}
          isOpen={isCategoriesOpen}
          title="Categorias da banda"
        >
          {
            isCategoriesOpen && <CategoriesComponent
              bandId={band?.data?.id}
              onCategoryClick={onCategoryClick}
              onNewCategoryClick={() => {
                setCurrentCategory(null)
                onCategoryFormOpen()
              }}
            />
          }
        </BandDrawer>
        {/* Members management */}
        { (band && !bandLoading) ? (
          <>
            <Heading
              as="h4"
              size="sm"
              textAlign="left"
              textTransform="uppercase"
              mb="3"
            >
              Membros
            </Heading>
            <Box
              //bgGradient="linear(to-b, secondary.600, primary.600)"
              bgColor={bgBox}
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
                        isLoading={isPromoteLoading || isDemoteLoading || isRemoveLoading || bandLoading || isDeleteLoading}
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
          switch (action.type) {
            // Remove Member
            case 'remove':
              onRemoveMember(action.id, band?.data?.id)
              break
            // Promote Member
            case 'promote':
              onPromoteMember(action.id, band?.data?.id)
              break
            // Demote Member
            case 'demote':
              onDemoteMember(action.id, band?.data?.id)
              break
            // Delete band
            case 'delete':
              onDeleteBand(action.id)
              break
          }
        }}
      />
      {/* Category save form */}
      <CategoryForm
        isOpen={isCategoryFormOpen}
        onOpen={onCategoryFormOpen}
        onClose={onCategoryFormClose}
        category={currentCategory}
        onSaveSuccess={() => refetchCategories()}
        onRemoveSuccess={() => refetchCategories()}
        bandId={band?.data?.id}
      />
      {/* Member add modal */}
      <InviteMember 
        isOpen={isInviteMemberOpen}
        onOpen={onInviteMemberOpen}
        onClose={onInviteMemberClose}
        bandId={band?.data?.id}
        members={band?.data?.members.map((m: any) => m.id) || []}
      />
    </div>
  )
}

// Exporting component
export default BandView
