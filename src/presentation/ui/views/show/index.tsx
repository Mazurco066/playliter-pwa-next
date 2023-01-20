// Dependencies
import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'next-i18next'
import { requestClient } from 'infra/services/http'
import { formatDate } from 'presentation/utils'

// Types
import type { ObservationType, SongType } from 'domain/models'
type ConfirmShowAction = {
  type: 'remove' | 'delete' | 'remove_note',
  id: string
}

// Components
import { ConfirmAction } from 'presentation/ui/components'
import { AddSongs, NoteForm, Notes, OrderedSong, ReorderSongs, ShowDrawer } from './elements'
import { FaBook, FaHandPointer, FaPlus } from 'react-icons/fa'
import { DeleteIcon, EditIcon, Icon, SettingsIcon } from '@chakra-ui/icons'
import {
  Badge,
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
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  UseToastOptions,
  VStack
} from '@chakra-ui/react'

// Component
const ShowView: FC<{ id: string }> = ({ id }) => {
  // Hooks
  const toast = useToast()
  const router = useRouter()
  const [ action, setAction ] = useState<ConfirmShowAction>({ type: 'remove', id: '' })
  const [ currentNote, setCurrentNote ] = useState<ObservationType | null>(null)
  const { t: common } = useTranslation('common')
  const { t } = useTranslation('concert')

  // Confirm dialog state
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose
  } = useDisclosure()

  // Notes drawer state
  const {
    isOpen: isNotesOpen,
    onOpen: onNotesOpen,
    onClose: onNotesClose
  } = useDisclosure()

  // Reorder drawer state
  const {
    isOpen: isReorderOpen,
    onOpen: onReorderOpen,
    onClose: onReorderClose
  } = useDisclosure()

  // Note form modal state
  const {
    isOpen: isNoteFormOpen,
    onOpen: onNoteFormOpen,
    onClose: onNoteFormClose
  } = useDisclosure()

  // Add songs drawer state
  const {
    isOpen: isSongsFormOpen,
    onOpen: onSongsFormOpen,
    onClose: onSongsFormClose
  } = useDisclosure()

  // Color Hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')

  // Show request
  const {
    data: show,
    isLoading: showLoading,
    refetch
  } = useQuery(
    [`get-show-${id}`],
    () => requestClient(`/api/shows/get?id=${id}`, 'get'),
    { enabled: id !== '' }
  )

  // Notify user about error while fetching show data
  useEffect(() => {
    if (show && show?.status !== 200) {
      if ([404].includes(show.status)) {
        toast({
          title: t('messages.show_not_found_title'),
          description: t('messages.show_not_found_msg'),
          status: 'info',
          duration: 5000,
          isClosable: true
        })
      } else {
        toast(genericMsg)
      }
      router.push('../bands')
    }
  }, [show])

  // Remove song mutation
  const {
    isLoading: removeSongLoading,
    mutateAsync: removeSongMutation
  } = useMutation((data: any) => {
    return requestClient('/api/songs/remove_from_show', 'post', { ...data })
  })

  // Remove note mutation
  const {
    isLoading: removeNoteLoading,
    mutateAsync: removeNoteMutation
  } = useMutation((data: any) => {
    return requestClient('/api/shows/remove_note', 'post', { ...data })
  })

  // Remove show mutation
  const {
    isLoading: removeShowLoading,
    mutateAsync: removeShowMutation
  } = useMutation((data: any) => {
    return requestClient('/api/shows/delete', 'post', { ...data })
  })

  // Generic error msg
  const genericMsg: UseToastOptions = {
    title: common('messages.internal_error_title'),
    description: common('messages.internal_error_msg'),
    status: 'error',
    duration: 5000,
    isClosable: true
  }

  // Actions
  const handleConfirmShowAction = () => {
    switch (action.type) {
      case 'remove':
        onRemoveSong(action.id, show?.data.id)
        break
      case 'delete':
        onRemoveShow(action.id)
        break
      case 'remove_note':
        onRemoveNote(show?.data.id, action.id)
        break
    }
  }

  const onRemoveSong = async (id: string, showId: string) => {
    const response = await removeSongMutation({ id, showId })

    // Verify if request was successfull
    if ([200, 201].includes(response.status)) {
      
      // Notify user about response success
      toast({
        title: t('messages.remove_from_show_title'),
        description: t('messages.remove_from_show_msg'),
        status: 'success',
        duration: 2000,
        isClosable: true
      })

      // Refetch show
      refetch()

    } else {
      if ([400, 404].includes(response.status)) {
        toast({
          title: t('messages.song_not_present_title'),
          description: t('messages.song_not_present_msg'),     
          status: 'warning',
          duration: 3500,
          isClosable: true
        })
      } else {
        toast(genericMsg)
      }
    }
  }

  const onRemoveNote = async (id: string, noteId: string) => {
    const response = await removeNoteMutation({ id, noteId })

    // Verify if request was successfull
    if ([200, 201].includes(response.status)) {
      
      // Notify user about response success
      toast({
        title: t('messages.remove_note_title'),
        description: t('messages.remove_note_msg'),
        status: 'success',
        duration: 2000,
        isClosable: true
      })

      // Refetch show
      refetch()

    } else {
      if ([400, 404].includes(response.status)) {
        toast({
          title: t('messages.note_not_found_title'),
          description: t('messages.note_not_found_msg'),     
          status: 'warning',
          duration: 3500,
          isClosable: true
        })
      } else {
        toast(genericMsg)
      }
    }
  }

  const onRemoveShow = async (id: string) => {
    const response = await removeShowMutation({ id })

     // Verify if request was successfull
     if ([200, 201].includes(response.status)) {
      
      // Notify user about response success
      toast({
        title: t('messages.remove_show_title'),
        description: t('messages.remove_show_msg'),
        status: 'success',
        duration: 2000,
        isClosable: true
      })

      // Return to band page
      router.push(`../bands/${show?.data.band.id}`)

    } else {
      if ([400, 404].includes(response.status)) {
        toast({
          title: t('messages.show_not_found_title'),
          description: t('messages.show_not_found_msg'),     
          status: 'warning',
          duration: 3500,
          isClosable: true
        })
        router.push(`../bands/${show?.data.band.id}`)
      } else {
        toast(genericMsg)
      }
    }
  }

  const onNoteEdit = (_note: ObservationType) => {
    setCurrentNote(_note)
    onNoteFormOpen()
  }

  // Destruct show data
  const { date, description, songs, title } = show?.data || {}

  // Unify loading flag
  const loadingStatus = removeSongLoading || showLoading || removeShowLoading || removeNoteLoading

  // JSX
  return (
    <div>
      <Container maxWidth="6xl">
        { (show && !showLoading) ? (
          <>
            <Box
              bgColor={bgBox}
              borderRadius="lg"
              mb="5"
            >
              <Box
                bgGradient="linear(to-b, secondary.600, primary.600)"
                position="relative"
                borderTopRadius="lg"
                p="3"
                pt="14"
              >
                <Heading
                  as="h2"
                  size="md"
                  textTransform="uppercase"
                  textAlign="center"
                  color="gray.100"
                >
                  { title }
                </Heading>
                <Badge
                  position="absolute"
                  left="2"
                  top="2"
                >
                  { date ? formatDate(date) : '' }
                </Badge>
                <Flex
                  justifyContent="flex-end"
                  px="2"
                  pt="2"
                  position="absolute"
                  top="0"
                  right="0"
                  left="0"
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
                        disabled={removeSongLoading || showLoading || removeShowLoading}
                        icon={<EditIcon />}
                        onClick={() => router.push(`../shows/save/${show?.data.id}`)}
                      >
                        {t('menu.edit')}
                      </MenuItem>
                      <MenuItem
                        disabled={removeSongLoading || showLoading || removeShowLoading}
                        icon={<Icon as={FaHandPointer} />}
                        onClick={() => onReorderOpen()}
                      >
                        {t('menu.reorder')}
                      </MenuItem>    
                      <MenuItem
                        disabled={removeSongLoading || showLoading || removeShowLoading}
                        icon={<DeleteIcon />}
                        onClick={() => {
                          setAction({ type: 'delete', id: show.data.id })
                          onConfirmOpen()
                        }}
                      >
                        {t('menu.remove')}
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
              </Box>
              <Box px="3" py="5">
                <Text mb="5">
                  { description }
                </Text>
                <Flex gap="1rem" alignItems="center">
                  <IconButton
                    disabled={loadingStatus}
                    aria-label="Anotações"
                    icon={<Icon as={FaBook} />}
                    flex="0 0 auto"
                    onClick={() => onNotesOpen()}
                  />
                  <Button
                    disabled={loadingStatus}
                    variant="fade"
                    width="full"
                    flexGrow="1"
                    onClick={() => router.push(`../../songlist/${show.data.id}`)}
                  >
                    {t('btn_sequential')}
                  </Button>
                  <IconButton
                    disabled={loadingStatus}
                    aria-label="Adicionar músicas"
                    icon={<Icon as={FaPlus} />}
                    flex="0 0 auto"
                    onClick={() => onSongsFormOpen()}
                  />
                </Flex>
              </Box>
            </Box>
            <Heading
              as="h4"
              size="sm"
              textAlign="left"
              textTransform="uppercase"
              mb="3"
            >
              {t('added_songs')}
            </Heading>
            {
              songs.length > 0 ? (          
                <VStack gap="0.5rem" mb="5">
                  {
                    songs.map((_song: SongType, i: number) => (
                      <OrderedSong 
                        key={_song.id}
                        song={_song}
                        order={i+1}
                        onClick={() => router.push(`../songs/${_song.id}`)}
                        onEdit={() => router.push(`../songs/save/${_song.id}`)}
                        onRemove={() => {
                          setAction({ type: 'remove', id: _song.id })
                          onConfirmOpen()
                        }}
                        isLoading={loadingStatus}
                      />
                    ))
                  }
                </VStack>    
              ) : (
                <Text>
                  {t('no_songs')}
                </Text>
              )
            }
          </>
        ) : (
          <>
            <Skeleton
              height="192px"
              borderRadius="lg"
              mb="5"
            />
            <Skeleton
              height="20px"
              borderRadius="lg"
              mb="3"
            />
            <Skeleton
              height="64px"
              borderRadius="lg"
              mb="3"
            />
            <Skeleton
              height="64px"
              borderRadius="lg"
              mb="3"
            />
            <Skeleton
              height="64px"
              borderRadius="lg"
            />
          </>
        ) }
      </Container>
      <ShowDrawer
        onClose={onNotesClose}
        onOpen={onNotesOpen}
        isOpen={isNotesOpen}
        title={t('notes_drawer')}
      >
        { (show && !showLoading) ? (
          <Notes
            show={show.data}
            isLoading={loadingStatus}
            onImportSuccess={() => refetch()}
            onEditNote={onNoteEdit}
            onAddNote={() => {
              setCurrentNote(null)
              onNoteFormOpen()
            }}
            onDeleteNote={(note: ObservationType) => {
              setAction({ type: 'remove_note', id: note.id })
              onConfirmOpen()
            }}
          />
        ) : null}
      </ShowDrawer>
      <ShowDrawer
        onClose={onReorderClose}
        onOpen={onReorderOpen}
        isOpen={isReorderOpen}
        title={t('reorder_drawer')}
      >
        { (show && !showLoading && isReorderOpen) ? (
          <ReorderSongs
            show={show.data}
            onCancel={onReorderClose}
            onSuccess={() => {
              onReorderClose()
              refetch()
            }}
          />
        ) : null}
      </ShowDrawer>
      <ShowDrawer
        onClose={onSongsFormClose}
        onOpen={onSongsFormOpen}
        isOpen={isSongsFormOpen}
        title={t('add_drawer')}
      >
        {
          (show && !showLoading && isSongsFormOpen) ? (
            <AddSongs 
              show={show.data}
              onAddSuccess={() => refetch()}
            />
          ) : null
        }
      </ShowDrawer>
      <NoteForm
        isOpen={isNoteFormOpen}
        onOpen={onNoteFormOpen}
        onClose={onNoteFormClose}
        note={currentNote}
        onSaveSuccess={() => refetch()}
        showId={show?.data?.id}
      />
      <ConfirmAction
        onClose={onConfirmClose}
        onOpen={onConfirmOpen}
        isOpen={isConfirmOpen}
        onConfirm={handleConfirmShowAction}
      />
    </div>
  )
}

// Exporting component
export default ShowView
