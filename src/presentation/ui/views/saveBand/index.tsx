// Dependencies
import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation } from '@tanstack/react-query'
import { requestClient } from 'infra/services/http'

// Layout and Components
import { Icon } from '@chakra-ui/icons'
import { FaFileSignature, FaSignature } from 'react-icons/fa'
import { FileUpload } from 'presentation/ui/components'
import {
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
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

// Save band component
const SaveBandView: FC<{ id?: string }> = ({ id = '' }) => {
  // Hooks
  const router = useRouter()
  const toast = useToast()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  // Requests
  const {
    data: band,
    isLoading: bandLoading
  } = useQuery(
    ['saveBand'],
    () => requestClient(`/api/bands/get?id=${id}`, 'get'),
    {
      enabled: id !== '',
      refetchOnWindowFocus: false
    }
  )
  
  // Set form values if an id was received
  useEffect(() => {
    if (band && band.data) {
      const options = { shouldValidate: true, shouldDirty: true }
      setValue('title', band.data?.title, options)
      setValue('description', band.data?.description, options)
    }
  }, [band])

  // Clear form on startup
  useEffect(() => {
    const options = { shouldValidate: false, shouldDirty: true }
    setValue('title', '', options)
    setValue('description', '', options)
  }, [])

  // Notify user about error while fetching his banda data
  useEffect(() => {
    if (band && band?.status !== 200) {
      if ([404].includes(band.status)) {
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
      router.push('../bands')
    }
  }, [band])

  // Save band
  const { isLoading, mutateAsync } = useMutation((data: any) => {
    return requestClient('/api/bands/save', 'post', data)
  })

  // Actions
  const onSubmit = async (data: any) => {
    // Request api via server side
    const response = await mutateAsync(id ? { id, ...data } : { ...data })

    // Verify if request was successfull
    if ([200, 201].includes(response.status)) {
      // Notify user about created band
      toast({
        title: 'Sucesso!',
        description: `Sua banda de nome ${response?.data?.title} foi salva com sucesso!`,
        status: 'success',
        duration: 2000,
        isClosable: true
      })

      // Redirect to band page
      router.push(id ? '../../bands' : '../bands')

    } else {
      if ([400].includes(response.status)) {
        toast({
          title: 'Ops.. Há campos inválidos!',
          description: 'Por favor revise o preenchimento de seu formulário!',     
          status: 'warning',
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <FileUpload />
          <FormControl
            isDisabled={isLoading || (id != '' && bandLoading)}
            isRequired
            mb="5"
          >
            <FormLabel>Nome da banda</FormLabel>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<Icon as={FaSignature} />}
              />
              <Input
                disabled={isLoading || (id != '' && bandLoading)}
                type="text"
                placeholder="Nome da banda"
                minLength={2}
                {...register('title', { required: true })}
              />
            </InputGroup>
            {errors.title ? (
              <FormHelperText color="red.500">Esse campo é requerido.</FormHelperText>
            ) : (
              <FormHelperText>Insira um nome para identificar sua banda.</FormHelperText>
            )}
          </FormControl>
          <FormControl
            isDisabled={isLoading || (id != '' && bandLoading)}
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
                disabled={isLoading || (id != '' && bandLoading)}
                placeholder="Descrição da banda"
                pl="10"
                minLength={2}
                {...register('description', { required: true })}
              />
            </InputGroup>
            {errors.description ? (
              <FormHelperText color="red.500">Esse campo é requerido.</FormHelperText>
            ) : (
              <FormHelperText>Insira uma breve descrição para a banda.</FormHelperText>
            )}
          </FormControl>
          <Button
            disabled={isLoading || (id != '' && bandLoading)}
            variant="fade"
            type="submit"
            width="full"
            mb="5"
          >
            Salvar
          </Button>
        </form>
      </Container>
    </div>
  )
}

// Exporting component
export default SaveBandView
