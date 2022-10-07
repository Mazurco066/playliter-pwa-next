// Dependencies
import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { requestClient } from 'infra/services/http'
import { formatDate } from 'presentation/utils'

// Components
import { OrderedSong, ShowDrawer } from './elements'
import { FaBook, FaHandPointer } from 'react-icons/fa'
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
import { SongType } from 'domain/models'

// Generic msg
const genericMsg: UseToastOptions = {
  title: 'Erro interno.',
  description: 'Um erro inesperado ocorreu! Entre em contato com algum administrador do App.',
  status: 'error',
  duration: 5000,
  isClosable: true
}

// Component
const ShowView: FC<{ id: string }> = ({ id }) => {
  // Hooks
  const toast = useToast()
  const router = useRouter()
  const [ reordermode, setReorderMode ] = useState<boolean>(false)

  // Notes drawer state
  const {
    isOpen: isNotesOpen,
    onOpen: onNotesOpen,
    onClose: onNotesClose
  } = useDisclosure()

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
  const { date, description, songs, title } = show?.data || {}

  // JSX
  return (
    <div>
      <Container>
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
                  { formatDate(date) }
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
                        icon={<EditIcon />}
                        onClick={() => {}}
                      >
                        Editar
                      </MenuItem>
                      <MenuItem
                        icon={<Icon as={FaHandPointer} />}
                        onClick={() => {}}
                      >
                        Reordenar Músicas
                      </MenuItem>    
                      <MenuItem
                        icon={<DeleteIcon />}
                        onClick={() => {}}
                      >
                        Remover Apresentação
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
                    aria-label='Anotações'
                    icon={<Icon as={FaBook} />}
                    flex="0 0 auto"
                    onClick={() => onNotesOpen()}
                  />
                  <Button
                    variant="fade"
                    width="full"
                    flexGrow="1"
                    onClick={() => console.log('view pdf')}
                  >
                    Visualização sequencial
                  </Button>
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
              Músicas Adicionadas
            </Heading>
            {
              songs.length > 0 ? (
                <>
                  {
                    reordermode ? (
                      <>
                      </>
                    ) : (
                      <VStack gap="0.5rem" mb="5">
                        {
                          songs.map((_song: SongType, i: number) => (
                            <OrderedSong 
                              key={_song.id}
                              song={_song}
                              order={i+1}
                              onClick={() => router.push(`../songs/${_song.id}`)}
                            />
                          ))
                        }
                      </VStack>
                    )
                  }
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
        title="Anotações da apresentação"
      >
        { (show && !showLoading) && (
          <>
            <p>Conteúdo aqui</p>
          </>
        )}
      </ShowDrawer>
    </div>
  )
}

// Exporting component
export default ShowView
