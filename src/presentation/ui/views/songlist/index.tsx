// Dependencies
import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { requestClient } from 'infra/services/http'
import { formatDate } from 'presentation/utils'

// Types
import type { SongType } from 'domain/models'

// Components
import { FaBook, FaHandPointer } from 'react-icons/fa'
import { DeleteIcon, EditIcon, Icon, SettingsIcon } from '@chakra-ui/icons'
import {
  Badge,
  Box,
  Container,
  Heading,
  Skeleton,
  Text,
  useColorModeValue,
  useMediaQuery,
  useToast,
  UseToastOptions,
  VStack
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
const SonglistView: FC<{ id: string }> = ({ id }) => {
  // Hooks
  const toast = useToast()
  const router = useRouter()

  // Color Hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')

  // Display hooks
  const [ isPrinting ] = useMediaQuery(['print'])

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
          title: 'Apresentação não encontrada.',
          description: 'A Apresentação informada não foi encontrada em sua conta!',
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

  // Destruct show data
  const { date, description, songs, title } = show?.data || {}

  // *Printable examples
  // <Text>Testando</Text>
  // <Box style={{ pageBreakAfter: 'always' }} />
  // <Text>Testando</Text>

  // JSX
  return (
    <div>
      <Container maxWidth="6xl">
        { (show && !showLoading) ? (
          <>
            
            {
              songs.length > 0 ? (          
                <VStack gap="0.5rem" mb="5">
            
                </VStack>    
              ) : (
                <Text>
                  Não há músicas adicionadas a essa apresentação!
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
    </div>
  )
}

// Exporting component
export default SonglistView
