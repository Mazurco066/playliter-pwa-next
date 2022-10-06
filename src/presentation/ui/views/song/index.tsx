// Dependencies
import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { requestClient } from 'infra/services/http'

// Components
import {
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
const SongView: FC<{ id: string }> = ({ id }) => {
  // Hooks
  const toast = useToast()
  const router = useRouter()

  // Song request
  const {
    data: song,
    isLoading: songLoading
  } = useQuery(
    [`get-show-${id}`],
    () => requestClient(`/api/songs/get?id=${id}`, 'get'),
    { enabled: id !== '' }
  )

  // Notify user about error while fetching show data
  useEffect(() => {
    if (song && song?.status !== 200) {
      if ([404].includes(song.status)) {
        toast({
          title: 'Música não encontrada.',
          description: 'A Música informada não foi encontrada em sua conta!',
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

  // JSX
  return (
    <div>
      Song - {id}
    </div>
  )
}

// Exporting component
export default SongView
