// Dependencies
import { FC, useEffect, useState } from 'react'
import { getTransposedSong } from 'presentation/utils'

// Types
import type { SongType } from 'domain/models'

// Components
import { ChordLyricsPair } from 'presentation/ui/components'
import {
  Box,
  Flex,
  Heading,
  Text,
  useColorModeValue
} from '@chakra-ui/react'

// Component
export const Songsheet: FC<{
  displayToneControl?: boolean,
  song: SongType
}> = ({
  song
}) => {
  // Hooks
  const [ transpose, setTranspose ] = useState<number>(0)
  const [ chordsheet, setChordsheet ] = useState<any | null>(null)

  // Color Hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')

  // Effects
  useEffect(() => {
    const cs = getTransposedSong(song.body || '', transpose)
    setChordsheet(cs)
  }, [song, transpose])

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
              {
                chordsheet.capo && (
                  <Text mt="1" fontSize="sm">
                    Capo: {chordsheet.capo}
                  </Text>
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
