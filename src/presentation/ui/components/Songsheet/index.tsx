// Dependencies
import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Chord } from 'chordsheetjs'
import { useMutation } from '@tanstack/react-query'
import { getTransposedSong, overwriteBaseTone } from 'presentation/utils'
import { requestClient } from 'infra/services/http'

// Types
import type { SongType } from 'domain/models'

// Components
import { ChordLyricsPair } from 'presentation/ui/components'
import { MdArrowDropDown } from 'react-icons/md'
import {
  Box,
  Button,
  Flex,
  Heading,
  Select,
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
export const Songsheet: FC<{
  displayToneControl?: boolean,
  onToneUpdateSuccess?: () => void,
  song: SongType,
}> = ({
  displayToneControl = false,
  onToneUpdateSuccess = () => {},
  song
}) => {
  // Hooks
  const toast = useToast()
  const router = useRouter()
  const [ transpose, setTranspose ] = useState<number>(0)
  const [ transpositions, setTranspositions ] = useState<Array<any>>([])
  const [ chordsheet, setChordsheet ] = useState<any | null>(null)

  // Color Hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')

  // Effects
  useEffect(() => {
    // Parse chordpro string to Chordsheetjs Object
    const cs = getTransposedSong(song.body || '', transpose)
    setChordsheet(cs)

    // Calc transposition keys
    const baseTone = song.tone
    const key = Chord.parse(baseTone)
    const steps = []
    for (let i = -11; i <= 11; i++) {
      steps.push({
        step: i,
        name: key.transpose(i)
      })
    }
    setTranspositions(steps)
  }, [song, transpose])

  // Update song tone request
  const {
    isLoading,
    mutateAsync
  } = useMutation((data: any) => {
    return requestClient('/api/songs/save', 'post', { ...data })
  })

  // Actions
  const onUpdateTone = async () => {
    // Compute song key and transposed body
    const t = transpositions.find(t => t.step === transpose)
    const newTone = `${t.name.root.note.note}${t.name.root.modifier ? t.name.root.modifier : ''}`
    const updatedSongBody = overwriteBaseTone(chordsheet)

    // Define requets payload
    const payload = {
      id: song.id,
      title: song.title,
      writter: song.writter,
      tone: newTone,
      body: updatedSongBody,
      category: song.category.id,
      isPublic: song.isPublic
    }

    // Request api
    const response = await mutateAsync(payload)

     // Verify if request was successfull
     if ([200, 201].includes(response.status)) {
      
      // Notify user about response success
      toast({
        title: 'Sucesso!',
        description: `O tom base da música foi alterado!`,
        status: 'success',
        duration: 2000,
        isClosable: true
      })
      onToneUpdateSuccess()

      // Update transpositions
      const baseTone = newTone
      const key = Chord.parse(baseTone)
      const steps = []
      for (let i = -11; i <= 11; i++) {
        steps.push({
          step: i,
          name: key.transpose(i)
        })
      }
      setTranspositions(steps)
      setTranspose(0)

    } else {
      if ([400, 404].includes(response.status)) {
        toast({
          title: 'Ops.. Música não encontrada!',
          description: 'A música solicitada não foi encontrada!',     
          status: 'warning',
          duration: 3500,
          isClosable: true
        })
        router.push(`../bands/${song?.band.id}`)
      } else if ([401, 403].includes(response.status)) {
        toast({
          title: 'Atualização de tom base negada!',
          description: 'Você precisa ter um integrante da banda para atualizar o tom base da mesma! Clone essa música para uma banda que você participa para modificá-la.',     
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
    <Box>
      {
        chordsheet && (
          <>
            <Box
              bgColor={bgBox}
              borderRadius="lg"
              px="3"
              py="5"
              mb="3"
            >
              <Heading
                as="h3"
                size="md"
                mb="2"
                color="secondary.500"
              >
                {chordsheet.title}
              </Heading>
              <Text>
                {chordsheet.artist}
              </Text>
              {
                !displayToneControl && (
                  <Text
                    mt="1"
                    fontSize="sm"
                  >
                    Tom: <Text
                      as="strong"
                      fontWeight="medium"
                      color="secondary.500"
                    >{song.tone}</Text>
                  </Text>
                )
              }
              {
                chordsheet.capo && (
                  <Text mt="1" fontSize="sm">
                    Capo: {chordsheet.capo}
                  </Text>
                )
              }
              {
                displayToneControl && (
                  <Flex mt="2" gap="0.5rem" alignItems="center">
                    <Select
                      icon={<MdArrowDropDown />}
                      variant="filled"
                      width="fit-content"
                      size="sm"
                      mb="0"
                      value={transpose}
                      onChange={(evt) => setTranspose(parseInt(evt.target.value))}
                    >
                      {
                        transpositions.map((t: any, i: number) => (
                          <option key={i} value={t.step}>
                            { `${t.name.root.note.note}${t.name.root.modifier ? t.name.root.modifier : ''}` }
                          </option>
                        ))
                      }
                    </Select>
                    {
                      transpose !== 0 && (
                        <Button 
                          size="sm"
                          variant="fade"
                          disabled={isLoading}
                          onClick={isLoading ? () => {} : () => onUpdateTone()}
                        >
                          Atualizar tom base
                        </Button>
                      )
                    }
                  </Flex>
                )
              }
            </Box>
            <Box
              overflow="hidden"
              maxWidth="100%"
              overflowX="auto"
            >
              <Box
                style={{ counterReset: 'verse' }}
              >
                {
                  chordsheet.paragraphs.map((paragraph: any, i: number) => (
                    <Box
                      className={paragraph.type}
                      key={paragraph.type + i}
                      mt="3"
                    >
                      {
                        paragraph.type.includes('chorus') ? (
                          <Box
                            pl="4"
                            borderLeftWidth="4px"
                            borderLeftColor="primary.500"
                          >
                            {
                              paragraph.lines.map((line: any, idx: number) => (
                                <Flex
                                  key={idx}
                                  position="relative"
                                  maxWidth="full"
                                  wrap="wrap"
                                  style={{
                                    breakInside: 'avoid',
                                    pageBreakInside: 'avoid'
                                  }}
                                >
                                  {
                                    line.hasRenderableItems() && (
                                      line.items.map((item: any, idx2: number) => (
                                        <div key={'inner-' + idx2}>
                                          {
                                            item.isRenderable() && (
                                              <>
                                                {
                                                  item.name === 'comment' ? (
                                                    <Text
                                                      fontSize="sm"
                                                      color="gray.400"
                                                    >
                                                      { item.value }
                                                    </Text>
                                                  ) : (
                                                    <ChordLyricsPair item={item} />
                                                  )
                                                }                                                
                                              </>
                                            )
                                          }
                                        </div>
                                      ))
                                    )
                                  }
                                </Flex>
                              ))
                            }
                          </Box>
                        ) : (
                          <>
                            {
                              paragraph.lines.map((line: any, idx: number) => (
                                <Flex
                                  key={idx}
                                  position="relative"
                                  maxWidth="full"
                                  wrap="wrap"
                                  style={{
                                    breakInside: 'avoid',
                                    pageBreakInside: 'avoid'
                                  }}
                                >
                                  {
                                    line.hasRenderableItems() && (
                                      line.items.map((item: any, idx2: number) => (
                                        <div key={'inner-' + idx2}>
                                          {
                                            item.isRenderable() && (
                                              <>
                                                {
                                                  item.name === 'comment' ? (
                                                    <Text
                                                      fontSize="sm"
                                                      color="gray.400"
                                                    >
                                                      { item.value }
                                                    </Text>
                                                  ) : (
                                                    <ChordLyricsPair item={item} />
                                                  )
                                                }                                                
                                              </>
                                            )
                                          }
                                        </div>
                                      ))
                                    )
                                  }
                                </Flex>
                              ))
                            }
                          </>
                        )
                      }
                    </Box>
                  ))
                }
              </Box>
            </Box>
          </>
        )
      }
    </Box>
  )
}
