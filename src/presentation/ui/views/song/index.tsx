// Dependencies
import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'next-i18next'
import { requestClient } from 'infra/services/http'

// Types
import type { CategoryType, SongType, ShowType, BandType } from 'domain/models'
type ConfirmShowAction = {
  type: 'delete' | 'clone'
  id: string
}

// Components
import { BandItem, SongDrawer } from './elements'
import { ConfirmAction, Songsheet } from 'presentation/ui/components'
import {
  CopyIcon,
  DeleteIcon,
  EditIcon,
  SettingsIcon
} from '@chakra-ui/icons'
import {
  Box,
  Container,
  IconButton,
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
  const [ action, setAction ] = useState<ConfirmShowAction>({ type: 'clone', id: '' })
  const { t: common } = useTranslation('common')
  const { t } = useTranslation('song')

  // Confirm dialog state
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose
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

  const {
    data: bands,
    isLoading: bandsLoading
  } = useQuery(
    ['bands'],
    () => requestClient('/api/bands/list', 'get')
  )

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
      case 'clone':
        onCloneSong(song?.data.id, action.id)
        break
      case 'delete':
        onRemoveSong(action.id)
        break
    }
  }

  const onCloneSong = async (_: string, bandId: string) => {
    
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
                displayMusicVideo
                displayToneControl
                song={song.data as SongType}
                onToneUpdateSuccess={() => refetch()}
              />
              <Container
                maxWidth="6xl"
                position="fixed"
                bottom="28"
                display="flex"
                justifyContent="flex-end"
              >
                <Box pr="8">
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
              </Container>
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
        message={
          action.type === 'clone'
            ? t('clone_confirmation')
            : t('remove_confirmation')
        }
      />
    </div>
  )
}

// Exporting component
export default SongView
