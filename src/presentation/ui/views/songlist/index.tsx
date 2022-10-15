// Dependencies
import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { requestClient } from 'infra/services/http'
// import { formatDate } from 'presentation/utils'

// Types
import type { SongType } from 'domain/models'

// Components
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

// PDF styles
const pdfPrintStyles = `.column,.row{display:flex!important}.printable-songsheet{page-break-after:always;-webkit-print-color-adjust:exact;-moz-print-color-adjust:exact;-ms-print-color-adjust:exact;print-color-adjust:exact}.song-title{font-size:30px!important;color:#8257e5}.song-artist,.song-tone{margin-bottom:1rem}.song-tone strong{color:#4963f7}.song-section{overflow:hidden;max-width:100%;overflow-x:auto}.chord,.lyrics{max-height:28px;min-height:28px;font-size:22px;white-space:pre}.chord{margin-right:4px}.paragraph+.paragraph{margin-top:1rem}.row{flex-direction:row;position:relative;break-inside:avoid;page-break-inside:avoid}.column{flex-direction:column}.comment{color:#ccc;font-size:16px!important}.chorus:before,.comment,.verse::before{font-weight:700;font-style:italic;break-after:avoid;page-break-inside:avoid}.chord-sheet :not(.tab) .chord{color:#4963f7;font-weight:700}.chorus{border-left:4px solid #8257e5;padding-left:1.5em}.chorus::before{content:"Refrão:"}.verse::before{counter-increment:verse;content:"Verso " counter(verse) ":"}.chord:after,.lyrics:after{content:'\\200b'}`

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
  const { songs, title, description, date } = show?.data || {}

  // Actions
  const printPdf = async () => {
    // Here i'm doing a Dynamic import, because the print component uses the Window functions
    // which must be loaded at runtime, learn more about it here https://nextjs.org/docs/advanced-features/dynamic-import
    const printPdf = (await import('print-js')).default
    printPdf({
      printable: 'printable-songs',
      type: 'html',
      style: pdfPrintStyles
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
