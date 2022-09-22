// Dependencies
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import { FetchError, fetchJsonFromOrigin } from 'infra/services/http'

// Layout and Components
import { Icon, DeleteIcon, EditIcon, SettingsIcon } from '@chakra-ui/icons'
import { FaUserPlus, FaUsers } from 'react-icons/fa'
import {
  Avatar,
  Box,
  Container,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Tab,
  TabPanels,
  Tabs,
  TabList,
  TabPanel,
  Text,
  useColorModeValue,
  useToast,
  UseToastOptions
} from '@chakra-ui/react'

// Fetchers
const bandFetcher = (url: string) => fetchJsonFromOrigin(url, { method: 'GET' })

// Generic msg
const genericMsg: UseToastOptions = {
  title: 'Erro interno.',
  description: 'Um erro inesperado ocorreu! Entre em contato com algum administrador do App.',
  status: 'error',
  duration: 5000,
  isClosable: true
}

// Band component
const BandView: FC<{ id: string }> = ({ id }) => {
  // Hooks
  const router = useRouter()
  const toast = useToast()

  // Color Hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')
  const colorTab = useColorModeValue('gray.900', 'gray.100')

  // Requests
  const {
    data: band,
    error: bandError
  } = useSWR(`api/bands/get?id=${id}`, bandFetcher)

  // Notify user about error while fetching his banda data
  useEffect(() => {
    if (bandError) {
      if (bandError instanceof FetchError) {
        if ([404].includes(bandError.response.status)) {
          toast({
            title: 'Banda não encontrada.',
            description: 'A banda informada não foi encontrada em sua conta!',
            status: 'info',
            duration: 5000,
            isClosable: true
          })
        } else {
          toast(genericMsg)
        }
      } else {
        toast(genericMsg)
      }
      router.push('../bands')
    }
  }, [bandError])

  // View JSX
  return (
    <div>
      <Container>
        { (band && !bandError) ? (
          <>
            <Box
              bgColor={bgBox}
              borderRadius="lg"
              mb="5"
            >
              <Box
                height="64px"
                bgGradient="linear(to-b, secondary.600, primary.600)"
                position="relative"
                borderTopRadius="lg"
                mb="10"
              >
                <Flex
                  justifyContent="flex-end"
                  px="2"
                  pt="2"
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
                        icon={<Icon as={FaUserPlus} />}
                      >
                        Convidar
                      </MenuItem>
                      <MenuItem
                        icon={<Icon as={FaUsers} />}
                      >
                        Membros
                      </MenuItem>
                      <MenuItem
                        icon={<EditIcon />}
                        onClick={() => router.push(`../bands/save/${band.id}`)}
                      >
                        Editar
                      </MenuItem>
                      <MenuItem
                        icon={<DeleteIcon />}
                      >
                        Remover
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
                <Avatar
                  position="absolute"
                  top="4"
                  left="0"
                  right="0"
                  margin="0 auto"
                  size="xl"
                  borderWidth="5px"
                  borderColor={bgBox}
                  name={band.title}
                  src={band.logo}
                />
              </Box>
              <Box
                px="3"
                py="5"
              >
                <Heading
                  as="h4"
                  size="md"
                  textAlign="left"
                  textTransform="uppercase"
                  color="secondary.500"
                  mb="1"
                >
                  {band?.title}
                </Heading>
                <Text mb="3">
                  {band?.description}
                </Text>
                <Text fontSize="sm">
                  Criada em{' '}
                  <Text as="strong" color="secondary.500">
                    {band?.createdAt.split('T')[0].split('-').reverse().join('/')}
                  </Text>
                </Text>
              </Box>
            </Box>
          </>
        ) : (
          <>
            <Skeleton
              height="192px"
              borderRadius="lg"
            />
          </>
        )}
        <Box>
          <Tabs
            isFitted
            variant="soft-rounded"
            
          >
            <TabList
              mb='1em'
              bgColor={bgBox}
              borderRadius="full"
            >
              {
                ['Músicas', 'Categorias', 'Apresentações'].map((tab: string, i: number) => (
                  <Tab
                    key={i}
                    color={colorTab}
                    _selected={{
                      bgGradient: "linear(to-b, secondary.600, primary.600)",
                      color: 'gray.100'
                    }}  
                  >
                    {tab}
                  </Tab>
                ))
              }
            </TabList>
            <TabPanels>
              <TabPanel>
                <p>Músicas</p>
              </TabPanel>
              <TabPanel>
                <p>Categorias</p>
              </TabPanel>
              <TabPanel>
                <p>Apresentações</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </div>
  )
}

// Exporting component
export default BandView
