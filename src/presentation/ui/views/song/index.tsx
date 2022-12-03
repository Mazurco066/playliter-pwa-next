// Dependencies
import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'next-i18next'
import { requestClient } from 'infra/services/http'

// Types
import type { CategoryType, SongType, ShowType, BandType } from 'domain/models'
type ConfirmShowAction = {
  type: 'add' | 'delete' | 'clone'
  id: string
}

// Components
import { BandItem, SongDrawer, ShowItem } from './elements'
import { ConfirmAction, Songsheet } from 'presentation/ui/components'
import {
  AddIcon,
  CopyIcon,
  DeleteIcon,
  EditIcon,
  SearchIcon,
  SettingsIcon
} from '@chakra-ui/icons'
import {
  Box,
  Container,
  IconButton,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Text,
  useDisclosure,
  useToast,
  UseToastOptions,
  VStack
} from '@chakra-ui/react'

// Component
const SongView: FC<{ id: string }> = ({ id }) => {
  // Hooks
  const toast = useToast()
  const router = useRouter()
  const [ filterSearch, setFilterSearch ] = useState<string>('')
  const [ action, setAction ] = useState<ConfirmShowAction>({ type: 'add', id: '' })
  const { t: common } = useTranslation('common')
  const { t } = useTranslation('song')

  // Confirm dialog state
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose
  } = useDisclosure()

  // Add to show drawer state
  const {
    isOpen: isAddingOpen,
    onOpen: onAddingOpen,
    onClose: onAddingClose
  } = useDisclosure()

  // Clone song drawer state
  const {
    isOpen: isCloningOpen,
    onOpen: onCloningOpen,
    onClose: onCloningClose
  } = useDisclosure()

  // Song request
  const {
    refetch,
    data: song,
    isLoading: songLoading
  } = useQuery(
    [`get-song-${id}`],
    () => requestClient(`/api/songs/get?id=${id}`, 'get'),
    { enabled: id !== '' }
  )

  // Account shows request
  const {
    data: accountShows,
    isLoading: accountShowsLoading
  } = useQuery(
    [`get-account-shows`],
    () => requestClient(`/api/shows/account`, 'get'),
    { enabled: id !== '' }
  )

  const {
    data: bands,
    isLoading: bandsLoading
  } = useQuery(
    ['bands'],
    () => requestClient('/api/bands/list', 'get')
  )

  // Add to show mutation
  const {
    isLoading: addToShowLoading,
    mutateAsync: addToShowMutation
  } = useMutation((data: any) => {
    return requestClient('/api/songs/add_to_show', 'post', { ...data })
  })

  // Clone song request
  const {
    isLoading: isCloneLoading,
    mutateAsync: cloneRequest
  } = useMutation((data: any) => {
    return requestClient('/api/songs/save', 'post', { ...data })
  })

  // Band categories mutation
  const {
    isLoading: categoriesLoading,
    mutateAsync: bandCategoriesRequest
  } = useMutation((bandId: string) => {
    return requestClient(`/api/bands/categories?band=${bandId}`, 'get')
  })

  // Remove song mutation
  const {
    isLoading: removeSongLoading,
    mutateAsync: removeSongMutation
  } = useMutation((data: any) => {
    return requestClient('/api/songs/delete', 'post', { ...data })
  })

  // Generic error msg
  const genericMsg: UseToastOptions = {
    title: common('messages.internal_error_title'),
    description: common('messages.internal_error_msg'),
    status: 'error',
    duration: 5000,
    isClosable: true
  }

  // Notify user about error while fetching show data
  useEffect(() => {
    if (song && song?.status !== 200) {
      if ([404].includes(song.status)) {
        toast({
          title: t('messages.song_not_found_title'),
          description: t('messages.song_not_found_msg'),
          status: 'info',
          duration: 5000,
          isClosable: true
        })
      } else {
        toast(genericMsg)
      }
      router.push('../songs')
    }
  }, [song])

  // Actions
  const handleConfirmShowAction = () => {
    switch (action.type) {
      case 'add':
        onAddSongToList(song?.data.id, action.id)
        break
      case 'clone':
        onCloneSong(song?.data.id, action.id)
        break
      case 'delete':
        onRemoveSong(action.id)
        break
    }
  }

  const onAddSongToList = async (songid: string, showId: string) => {
    const response = await addToShowMutation({ id: songid, showId })

    // Verify if request was successfull
    if ([200, 201].includes(response.status)) {
      
      // Notify user about response success
      toast({
        title: t('messages.added_to_show_title'),
        description: t('messages.added_to_show_msg'),
        status: 'success',
        duration: 2000,
        isClosable: true
      })
      onAddingClose()

    } else {
      if ([400].includes(response.status)) {
        toast({
          title: t('messages.song_present_title'),
          description: t('messages.song_present_msg'),     
          status: 'info',
          duration: 3500,
          isClosable: true
        })
      } else if ([404].includes(response.status)) {
        toast({
          title: t('messages.show_not_found_title'),
          description: t('messages.show_not_found_msg'),     
          status: 'info',
          duration: 3500,
          isClosable: true
        })
      } else {
        toast(genericMsg)
      }
    }
  }

  const onCloneSong = async (songId: string, bandId: string) => {
    
    // Retrieve selected band categories
    const bandCategories = await bandCategoriesRequest(bandId)
    if (![200, 201].includes(bandCategories.status)) {
      toast(genericMsg)
    }

    // Validate if selected band has categories
    const categoriesList: CategoryType[] = bandCategories.data
    if (categoriesList.length <= 0) {
      return toast({
        title: t('messages.no_categories_title'),
        description: t('messages.no_categories_msg'),     
        status: 'info',
        duration: 3500,
        isClosable: true
      })
    }
    const firstCategoryId = categoriesList[0].id

    // Clone song payload
    const payload = {
      title: `${song?.data.title} - Copy`,
      writter: song?.data.writter,
      category: firstCategoryId,
      isPublic: false,
      tone: song?.data.tone,
      body: song?.data.body,
      bandId
    }

    // Request api
    const response = await cloneRequest(payload)

    // Verify if request was successfull
    if ([200, 201].includes(response.status)) {
      
      // Notify user about response success
      toast({
        title: t('messages.clone_title'),
        description: t('messages.clone_msg'),
        status: 'success',
        duration: 2000,
        isClosable: true
      })

      // Redirect to cloned song page
      onCloningClose()
      router.push(`../songs/${response.data.id}`)

    } else {
      toast(genericMsg)
    }
  }

  const onRemoveSong = async (id: string) => {
    const response = await removeSongMutation({ songId: id })

     // Verify if request was successfull
     if ([200, 201].includes(response.status)) {
      
      // Notify user about response success
      toast({
        title: t('messages.removed_title'),
        description: t('messages.removed_msg'),
        status: 'success',
        duration: 2000,
        isClosable: true
      })

      // Return to band page
      router.push(`../bands/${song?.data.band.id}`)

    } else {
      if ([400, 404].includes(response.status)) {
        toast({
          title: t('messages.song_not_found_title'),
          description: t('messages.song_not_found_msg'),     
          status: 'warning',
          duration: 3500,
          isClosable: true
        })
        router.push(`../bands/${song?.data.band.id}`)
      } else if ([401, 403].includes(response.status)) {
        toast({
          title: t('messages.no_permission_title'),
          description: t('messages.no_permission_msg'),     
          status: 'info',
          duration: 3500,
          isClosable: true
        })
      } else {
        toast(genericMsg)
      }
    }
  }

  // Unify loading status
  const loadingStatus = (
    songLoading ||
    accountShowsLoading ||
    removeSongLoading ||
    addToShowLoading ||
    isCloneLoading ||
    categoriesLoading
  )

  // Computed props
  const filteredShows = (accountShows && accountShows.data)
    ? accountShows.data.filter(({ title, description }: ShowType) => 
        title.toLowerCase().includes(filterSearch.toLowerCase()) ||
        description.toLowerCase().includes(filterSearch.toLowerCase())
      )
    : []

  // JSX
  return (
    <div>
      <Container
        maxWidth="6xl"
        pb="16"
      >
        {
          song && !songLoading ? (
            <>
              <Songsheet 
                displayToneControl
                song={song.data as SongType}
                onToneUpdateSuccess={() => refetch()}
              />
              <Box
                position="fixed"
                bottom="24"
                right="5"
              >
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label='Options'
                    icon={<SettingsIcon />}
                    variant='fade'
                    color="gray.100"
                  />
                  <MenuList>
                    <MenuItem
                      icon={<AddIcon />}
                      disabled={loadingStatus}
                      onClick={loadingStatus ? () => {} : () => {
                        setFilterSearch('')
                        onAddingOpen()
                      }}
                    >
                      {t('menu.add')}
                    </MenuItem> 
                    <MenuItem
                      icon={<EditIcon />}
                      disabled={songLoading || removeSongLoading}
                      onClick={() => router.push(`../songs/save/${song.data.id}`)}
                    >
                      {t('menu.edit')}
                    </MenuItem>
                    <MenuItem
                      icon={<CopyIcon />}
                      disabled={bandsLoading || songLoading || isCloneLoading}
                      onClick={(bandsLoading || songLoading || isCloneLoading) ? () => {} : () => onCloningOpen()}
                    >
                      {t('menu.clone')}
                    </MenuItem>  
                    <MenuItem
                      icon={<DeleteIcon />}
                      disabled={songLoading || removeSongLoading}
                      onClick={(songLoading || removeSongLoading) ? () => {} : () => {
                        setAction({ type: 'delete', id: song.data.id })
                        onConfirmOpen()
                      }}
                    >
                      {t('menu.remove')}
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Box>
            </>
          ) : (
            <>
              <Skeleton
                height="128px"
                borderRadius="lg"
                mb="3"
              />
              {
                [0, 1, 2, 3, 4, 5, 6].map((val: number) => (
                  <Skeleton
                    key={val}
                    height="27px"
                    borderRadius="lg"
                    mb="2"
                  />
                ))
              }
            </>
          )
        }
      </Container>
      <SongDrawer
        onClose={onAddingClose}
        onOpen={onAddingOpen}
        isOpen={isAddingOpen}
        title={t('add_to_concert_drawer')}
      >
        <Box py="3">
          <FormControl mb="5">
            <InputGroup borderColor="primary.600">
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon />}
              />
              <Input
                type="text"
                placeholder={t('search_placeholder')}
                minLength={2}
                value={filterSearch}
                color="gray.50"
                _placeholder={{
                  color: 'gray.300'
                }}
                onChange={e => {
                  const inputValue = e.target.value
                  setFilterSearch(inputValue)
                }}
              />
            </InputGroup>
          </FormControl>
          {
            accountShows && !accountShowsLoading && (
              <>
                {
                  accountShows.data.length > 0 ? (
                    <>
                      {
                        filteredShows.length > 0 ? (
                          <VStack
                            gap="1rem"
                          >
                            {
                              filteredShows.map((show: ShowType) => (
                                <ShowItem
                                  key={show.id}
                                  show={show}
                                  onClick={(_id: string) => {
                                    if (!loadingStatus) {
                                      setAction({ type: 'add', id: _id })
                                      onConfirmOpen()
                                    }
                                  }}
                                />
                              ))
                            }
                          </VStack>
                        ) : (
                          <Text>
                            {t('no_concerts_filtered')}
                          </Text>
                        )
                      }
                    </>
                  ) : (
                    <Text>
                      {t('no_concerts')}
                    </Text>
                  )
                }
              </>
            )
          }
        </Box>
      </SongDrawer>
      <SongDrawer
        onClose={onCloningClose}
        onOpen={onCloningOpen}
        isOpen={isCloningOpen}
        title={t('clone_drawer_title')}
      >
        <Box py="3">
          {
            bands && !bandsLoading && (
              <>
                {
                  bands.data.length > 0 ? (
                    <>
                      <Text mb="5">
                        {t('select_band')}
                      </Text>
                      <VStack gap="0.25rem">
                        {
                          bands.data.map((band: BandType) => (
                            <BandItem
                              key={band.id}
                              item={band}
                              onClick={(_id: string) => {
                                if (!bandsLoading && !isCloneLoading && !categoriesLoading) {
                                  setAction({ type: 'clone', id: _id })
                                  onConfirmOpen()
                                }
                              }}
                            />
                          ))
                        }
                      </VStack>
                    </>
                  ) : (
                    <Text textAlign="justify">
                      {t('no_bands')}
                    </Text>
                  )
                }
              </>
            )
          }
        </Box>
      </SongDrawer>
      <ConfirmAction
        onClose={onConfirmClose}
        onOpen={onConfirmOpen}
        isOpen={isConfirmOpen}
        onConfirm={handleConfirmShowAction}
        message={action.type === 'add'
          ? t('add_confirmation')
          : action.type === 'clone'
            ? t('clone_confirmation')
            : t('remove_confirmation')
        }
      />
    </div>
  )
}

// Exporting component
export default SongView
