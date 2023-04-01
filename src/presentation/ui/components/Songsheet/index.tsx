// Dependencies
import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Chord } from 'chordsheetjs'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'next-i18next'
import { getTransposedSong, overwriteBaseTone } from 'presentation/utils'
import { requestClient } from 'infra/services/http'

// Types
import type { SongType } from 'domain/models'

// Components
import { ChordLyricsPair } from 'presentation/ui/components'
import { MdArrowDropDown } from 'react-icons/md'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
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

// Component
export const Songsheet: FC<{
  displayPdfHeaders?: boolean,
  displayToneControl?: boolean,
  displayMusicVideo?: boolean,
  onToneUpdateSuccess?: () => void,
  song: SongType,
}> = ({
  displayPdfHeaders = false,
  displayToneControl = false,
  displayMusicVideo = false,
  onToneUpdateSuccess = () => {},
  song
}) => {
  // Hooks
  const toast = useToast()
  const router = useRouter()
  const [ transpose, setTranspose ] = useState<number>(0)
  const [ transpositions, setTranspositions ] = useState<Array<any>>([])
  const [ chordsheet, setChordsheet ] = useState<any | null>(null)
  const { t: common } = useTranslation('common')

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

  // Generic error msg
  const genericMsg: UseToastOptions = {
    title: common('messages.internal_error_title'),
    description: common('messages.internal_error_msg'),
    status: 'error',
    duration: 5000,
    isClosable: true
  }

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
        title: common('messages.tone_updated_title'),
        description: common('messages.tone_updated_msg'),
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
          title: common('messages.song_not_found_title'),
          description: common('messages.song_not_found_msg'),     
          status: 'warning',
          duration: 3500,
          isClosable: true
        })
        router.push(`../bands/${song?.band.id}`)
      } else if ([401, 403].includes(response.status)) {
        toast({
          title: common('messages.no_permissions_title'),
          description: common('messages.no_permissions_msg'),     
          status: 'info',
          duration: 3500,
          isClosable: true
        })
      } else {
        toast(genericMsg)
      }
    }
  }

  // Render actions
  const renderEmbeddedMusicVideo = (url: string) => {
    // Validate if embedded url is supported
    const isValidEmbedded = url.match(/youtube|spotify/) !== null
    if (!isValidEmbedded) return null

    // Youtube embedded video
    if (url.includes('youtube')) {
      return (
        <iframe
          width="100%"
          height="315"
          src={url}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        />
      )
    }

    // Spotify embedded card
    if (url.includes('spotify')) {
      return (
        <iframe
          style={{ borderRadius: '16px' }}
          src={url}
          width="100%"
          height="352"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      )
    }
  }

  // JSX
  return (
    <Box style={{ printColorAdjust: 'exact' }}>
      {
        chordsheet && (
          <>
            {
              displayPdfHeaders ? (
                <Box>
                  <Heading
                    as="h3"
                    size="md"
                    mb="1"
                    color="primary.500"
                  >
                    {chordsheet.title}
                  </Heading>
                  <Text>
                    {common('songsheet.by')}{chordsheet.artist}
                  </Text>
                  <Text mt="1" fontSize="sm">
                    {common('songsheet.tone')}<Text
                      as="strong"
                      fontWeight="medium"
                      color="secondary.500"
                    >{song.tone}</Text>
                  </Text>
                </Box>
              ) : (
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
                    !displayToneControl ? (
                      <Text
                        mt="1"
                        fontSize="sm"
                      >
                        {common('songsheet.tone')}<Text
                          as="strong"
                          fontWeight="medium"
                          color="secondary.500"
                        >{song.tone}</Text>
                      </Text>
                    ) : null
                  }
                  {
                    chordsheet.capo ? (
                      <Text mt="1" fontSize="sm">
                        {common('songsheet.capo')}{chordsheet.capo}
                      </Text>
                    ) : null
                  }
                  {
                    displayToneControl ? (
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
                              {common('songsheet.update_base_tone')}
                            </Button>
                          )
                        }
                      </Flex>
                    ) : null
                  }
                  {
                    displayMusicVideo && song.embeddedUrl ? (
                      <Accordion mt="5" allowToggle>
                        <AccordionItem>
                          <h2>
                            <AccordionButton>
                              <Box as="span" flex='1' textAlign='left'>
                                {common('songsheet.listen')}
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel pb={4}>
                            { renderEmbeddedMusicVideo(song.embeddedUrl) }
                          </AccordionPanel>
                        </AccordionItem>
                      </Accordion>
                    ) : null
                  }
                </Box>
              )
            }
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
                                  alignItems="flex-end"
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
                                  alignItems="flex-end"
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
