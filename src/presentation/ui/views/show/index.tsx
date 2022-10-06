// Dependencies
import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { requestClient } from 'infra/services/http'
import { formatDate } from 'presentation/utils'

// Components
import {
  DeleteIcon,
  EditIcon,
  Icon,
  SettingsIcon
} from '@chakra-ui/icons'
import {
  Badge,
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
const ShowView: FC<{ id: string }> = ({ id }) => {
  // Hooks
  const toast = useToast()
  const router = useRouter()

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
  const { date, description, title } = show?.data || {}

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
                      icon={<DeleteIcon />}
                      onClick={() => {}}
                    >
                      Remover Banda
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            </Box>
            <Box px="3" py="5">
              <Text>
                { description }
              </Text>
            </Box>
          </Box>
        </>
      ) : (
        <>
          <Skeleton
            height="192px"
            borderRadius="lg"
            mb="5"
          />
        </>
      ) }
      </Container>
    </div>
  )
}

// Exporting component
export default ShowView
