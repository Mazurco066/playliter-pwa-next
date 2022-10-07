// Dependencies
import { FC, useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { requestClient } from 'infra/services/http'

// Types
import type { ShowType, SongType } from 'domain/models'

// Components
import { DraggableSongItem } from './song'
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DropResult
} from 'react-beautiful-dnd'
import {
  Button,
  Box,
  VStack,
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

// Component
export const ReorderSongs: FC<{
  show: ShowType,
  onCancel?: () => void,
  onSuccess?: () => void
}> = ({
  show,
  onCancel = () => {},
  onSuccess = () => {}
}) => {
  // Hooks
  const toast = useToast()
  const [ songsCopy, setSongsCopy ] = useState<SongType[]>([])

  // Effects
  useEffect(() => {
    const { songs } = show
    setSongsCopy(songs as SongType[])
  }, [show])

  // Reorder songs request
  const {
    isLoading: isReorderLoading,
    mutateAsync: reorderMutation
  } = useMutation((data: any) => {
    return requestClient('/api/shows/reorder', 'post', { ...data })
  })

  // Actions
  const onDragEnd = (result: DropResult) => {
    // Destruct draggable data
    const { destination, source, draggableId } = result
    console.log(result)
    
    // If there is no destination there is no reason for this code to run
    if (!destination) return

    // Also here, if does not have changes there is no need to run this code
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return

    // Retrieve dragged song
    const song = songsCopy.find((song: SongType) => song.id === draggableId)
    if (!song) return

    // Retorder array
    const newSongIds = Array.from(songsCopy)
    newSongIds.splice(source.index, 1)
    newSongIds.splice(destination.index, 0, song)

    // Update state
    setSongsCopy(newSongIds)
  }

  const onReorder = async (id: string, songs: string[]) => {
    const response = await reorderMutation({ id, songs })

    // Verify if request was successfull
    if ([200, 201].includes(response.status)) {
      
      // Notify user about response success
      toast({
        title: 'Sucesso!',
        description: `A apresentação foi reordenada com sucesso!`,
        status: 'success',
        duration: 2000,
        isClosable: true
      })

      // Refetch show
      onSuccess()

    } else {
      toast(genericMsg)
    }
  }

  // JSX
  return (
    <Box>
      <Box mb="3">
        <Button
          disabled={isReorderLoading}
          onClick={isReorderLoading ? () => {} : () => onReorder(show.id, songsCopy.map((s: SongType) => s.id))}
          width="full"
          bgColor="primary.500"
          color="gray.100"
          _hover={{
            bgColor: 'primary.600'
          }}
          _disabled={{
            opacity: '0.7'
          }}
        >
          Reordernar Apresentação
        </Button>
      </Box>
      <Box mb="3">
        <Button
          disabled={isReorderLoading}
          onClick={onCancel}
          width="full"
          bgColor="red.500"
          color="gray.100"
          _hover={{
            bgColor: 'red.600'
          }}
          _disabled={{
            opacity: '0.7'
          }}
        >
          Cancelar
        </Button>
      </Box>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={`droppable-${show.id}`}>
          {
            (provided: DroppableProvided) => (
              <VStack
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {
                  songsCopy.map((_song, i: number) => (
                    <DraggableSongItem 
                      key={_song.id}
                      item={_song as SongType}
                      index={i}
                    />
                  ))
                }
                {provided.placeholder}
              </VStack>
            )
          }
        </Droppable>
      </DragDropContext>
    </Box>
  )
}
