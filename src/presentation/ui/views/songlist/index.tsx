// Dependencies
import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { requestClient } from 'infra/services/http'
 
// Types
import type { SongType } from 'domain/models'

// Components
import { pdfPrintStyles } from './styles'
import { Songsheet, PrintableSong } from 'presentation/ui/components'
import { FaArrowRight, FaArrowLeft, FaPrint } from 'react-icons/fa'
import {
  Box,
  ButtonGroup,
  Container,
  Flex,
  Heading,
  IconButton,
  Skeleton,
  Text,
  useColorModeValue,
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
const SonglistView: FC<{ id: string }> = ({ id }) => {
  // Hooks
  const toast = useToast()
  const router = useRouter()
  const [ songIndex, setSongIndex ] = useState<number>(0)
  
  // Color Hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')

  // Show request
  const {
    data: show,
    isLoading: showLoading
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
  const { songs } = show?.data || {}

  // Actions
  const printPdf = async () => {
    // Here i'm doing a Dynamic import, because the print component uses the Window functions
    // which must be loaded at runtime, learn more about it here https://nextjs.org/docs/advanced-features/dynamic-import
    const printPdf = (await import('print-js')).default
    printPdf({
      printable: 'printable-songs',
      type: 'html',
      style: pdfPrintStyles,
      font_size: '19px'
    })
  }

  // JSX
  return (
    <div>
      <Container maxWidth="6xl">
        { (show && !showLoading) ? (
          <>
            {
              songs.length > 0 ? (          
                <>
                  <Box
                    sx={{ '@media print': { display: 'none' } }}
                  >
                    <Box
                      px="3"
                      py="5"
                      borderRadius="lg"
                      bgColor={bgBox}
                      mb="3"
                    >
                      <Flex
                        gap="1rem"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Heading
                          as="h3"
                          size="sm"
                          textAlign="left"
                          textTransform="uppercase"
                        >
                          <Text fontSize="xl" as="strong" color="secondary.500">{songIndex + 1}°</Text> Música
                        </Heading>
                        <ButtonGroup>
                          <IconButton
                            aria-label="print-songlist"
                            icon={<FaArrowLeft />}
                            onClick={() => {
                              const prevIndex: number = songIndex - 1
                              setSongIndex((prevIndex < 0) ? (songs.length - 1) : prevIndex)
                            }}
                          />
                          <IconButton
                            aria-label="print-songlist"
                            variant="fade"
                            icon={<FaPrint />}
                            onClick={() => printPdf()}
                          />
                          <IconButton
                            aria-label="print-songlist"
                            icon={<FaArrowRight />}
                            onClick={() => {
                              const nextIndex: number = songIndex + 1
                              setSongIndex((nextIndex > (songs.length - 1)) ? 0 : nextIndex)
                            }}
                          />
                        </ButtonGroup>
                      </Flex>
                    </Box>
                    <Songsheet
                      song={songs[songIndex]}
                      displayPdfHeaders
                    />
                  </Box>
                  {/* TODO: Finish print styles */}
                  <Box display="none">
                    <Box
                      id="printable-songs"
                      position="relative"
                      sx={{ '@media print': { display: 'block' } }}
                    >
                      { // List of songs
                        songs.map((_song: SongType, i: number) => (
                          <Box key={i} style={{ pageBreakAfter: 'always' }}>
                            <PrintableSong song={_song} />
                          </Box>
                        ))
                      }
                    </Box>
                  </Box>
                </> 
              ) : (
                <Text>
                  Não há músicas adicionadas a essa apresentação!
                </Text>
              )
            }
          </>
        ) : (
          <>
            <Skeleton height="80px" borderRadius="lg" mb="5" />
            <Skeleton height="27px" mb="1" />
            <Skeleton height="27px" mb="1" />
            <Skeleton height="27px" mb="1" />
            <Skeleton height="27px" mb="1" />
            <Skeleton height="27px" mb="5" />
          </>
        ) }
      </Container>
    </div>
  )
}

// Exporting component
export default SonglistView
