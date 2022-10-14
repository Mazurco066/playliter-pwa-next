// Dependencies
import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation } from '@tanstack/react-query'
import { requestClient } from 'infra/services/http'

// Layout and Components
import { Icon } from '@chakra-ui/icons'
import { FaCalendar, FaFileSignature, FaSignature } from 'react-icons/fa'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
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

// Save show component
const SaveShowView: FC<{
  id?: string,
  bandId?: string
}> = ({
  id = '',
  bandId = ''
}) => {
  // Hooks
  const router = useRouter()
  const toast = useToast()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  // Color hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')

  // Requests
  const {
    data: show,
    isLoading: showLoading
  } = useQuery(
    ['save-show'],
    () => requestClient(`/api/shows/get?id=${id}`, 'get'),
    {
      enabled: id !== '',
      refetchOnWindowFocus: false
    }
  )
  
  // Set form values if an id was received
  useEffect(() => {
    if (show && show.data) {
      const options = { shouldValidate: true, shouldDirty: true }
      setValue('title', show.data?.title, options)
      setValue('description', show.data?.description, options)
      setValue('date', show.data?.date.split('T')[0], options)
    }
  }, [show])

  // Validate path params
  useEffect(() => {
    if (!id && !bandId) {
      toast({
        title: 'Parâmetros inválidos.',
          description: 'Para acessar a página de salvar show por favor utilize uma URL valida!',
          status: 'info',
          duration: 3500,
          isClosable: true
      })
      router.push('../../bands')
    }
  }, [id, bandId])

  // Clear form on startup
  useEffect(() => {
    const options = { shouldValidate: false, shouldDirty: true }
    setValue('title', '', options)
    setValue('description', '', options)
    setValue('date', '', options)
  }, [])

  // Notify user about error while fetching his show data
  useEffect(() => {
    if (show && show?.status !== 200) {
      if ([404].includes(show.status)) {
        toast({
          title: 'Apresentação não encontrada.',
          description: 'A apresentação informada não foi encontrada!',
          status: 'info',
          duration: 5000,
          isClosable: true
        })
      } else {
        toast(genericMsg)
      }
      router.push('../../bands')
    }
  }, [show])

  // Save show
  const { isLoading, mutateAsync } = useMutation((data: any) => {
    return requestClient('/api/shows/save', 'post', data)
  })

  // Actions
  const onSubmit = async (data: any) => {
    // Request api via server side
    const response = await mutateAsync(id ? { id, ...data } : { bandId: bandId, ...data })

    // Verify if request was successfull
    if ([200, 201].includes(response.status)) {
      // Notify user about created show
      toast({
        title: 'Sucesso!',
        description: `Sua apresentação com título de ${response?.data?.title} foi salva com sucesso!`,
        status: 'success',
        duration: 2000,
        isClosable: true
      })

      // Redirect to show page
      router.push(id  ? `../../shows/${id}` : `../shows/${response.data.id}`)

    } else {
      if ([400].includes(response.status)) {
        toast({
          title: 'Ops.. Há campos inválidos!',
          description: 'Por favor revise o preenchimento de seu formulário!',     
          status: 'warning',
          duration: 3500,
          isClosable: true
        })
      } else if ([401, 403].includes(response.status)) {
        toast({
          title: 'Permissão insuficiente!',
          description: 'Você não tem permissão para criar/salvar apresentações desta banda!',     
          status: 'info',
          duration: 3500,
          isClosable: true
        })
      } else {
        toast(genericMsg)
      }
    }
  }

  // View JSX
  return (
    <div>
      <Container maxWidth="6xl">
        <Box
          px="3"
          py="5"
          borderRadius="lg"
          bgColor={bgBox}
          mb="5"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl
              isDisabled={isLoading || (id != '' && showLoading)}
              isRequired
              mb="5"
            >
              <FormLabel>Título da apresentação</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaSignature} />}
                />
                <Input
                  disabled={isLoading || (id != '' && showLoading)}
                  variant="filled"
                  type="text"
                  placeholder="Título da apresentação"
                  minLength={2}
                  {...register('title', { required: true })}
                />
              </InputGroup>
              {errors.title ? (
                <FormHelperText color="red.500">Esse campo é requerido.</FormHelperText>
              ) : (
                <FormHelperText>Insira um nome para identificar essa apresentação.</FormHelperText>
              )}
            </FormControl>
            <FormControl
              isDisabled={isLoading || (id != '' && showLoading)}
              isRequired
              mb="5"
            >
              <FormLabel>Data da apresentação</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaCalendar} />}
                />
                <Input
                  disabled={isLoading || (id != '' && showLoading)}
                  variant="filled"
                  type="date"
                  {...register('date', { required: true })}
                />
              </InputGroup>
              {errors.date ? (
                <FormHelperText color="red.500">Esse campo é requerido.</FormHelperText>
              ) : (
                <FormHelperText>Insira uma data para apresentação.</FormHelperText>
              )}
            </FormControl>
            <FormControl
              isDisabled={isLoading || (id != '' && showLoading)}
              isRequired
              mb="5"
            >
              <FormLabel>Descrição</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaFileSignature} />}
                />
                <Textarea
                  disabled={isLoading || (id != '' && showLoading)}
                  variant="filled"
                  placeholder="Descrição da apresentação"
                  pl="10"
                  minLength={2}
                  {...register('description', { required: true })}
                />
              </InputGroup>
              {errors.description ? (
                <FormHelperText color="red.500">Esse campo é requerido.</FormHelperText>
              ) : (
                <FormHelperText>Insira uma breve descrição para a apresentação.</FormHelperText>
              )}
            </FormControl>
            <Button
              disabled={isLoading || (id != '' && showLoading)}
              variant="fade"
              type="submit"
              width="full"
            >
              Salvar
            </Button>
          </form>
        </Box>
      </Container>
    </div>
  )
}

// Exporting component
export default SaveShowView
