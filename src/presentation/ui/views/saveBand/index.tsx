// Dependencies
import useSWR from 'swr'
import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { FetchError, fetchJsonFromOrigin } from 'infra/services/http'

// Types
import type { BandType } from 'domain/models'

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

// Save band component
const SaveBandView: FC<{ id?: string }> = ({ id }) => {
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
    error: bandError
  } = useSWR(id ? `api/bands/get?id=${id}` : null, bandFetcher)

  // Set form values if an id was received
  useEffect(() => {
    if (band) {
      const options = { shouldValidate: true, shouldDirty: true }
      setValue('title', band.title, options)
      setValue('description', band.title, options)
    }
  }, [band])

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
      router.push('../../bands')
    }
  }, [bandError])

  // Actions
  const onSubmit = async (data: any) => {
    try {

      // Request api via server side
      const response: BandType = await fetchJsonFromOrigin('api/bands/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: id ? JSON.stringify({ id, ...data }) : JSON.stringify({ ...data })
      })

      // Notify user about created band
      toast({
        title: 'Sucesso!',
        description: `Sua banda de nome ${response.title} foi salva com sucesso!`,
        status: 'success',
        duration: 2000,
        isClosable: true
      })

      // Redirect to band page
      router.push(id ? '../../bands' : '../bands')

    } catch (error) {
      if (error instanceof FetchError) {
        if ([400].includes(error.response.status)) {
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
      } else {
        toast(genericMsg)
      }
    }
  }

  // View JSX
  return (
    <div>
      <Container>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FileUpload />
          <FormControl
            isDisabled={(id && !band) as boolean}
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
                disabled={(id && !band) as boolean}
                type="text"
                placeholder="Nome da banda"
                minLength={2}
                {...register('title', { required: true })}
              />
            </InputGroup>
            {errors.name ? (
              <FormHelperText color="red.500">Esse campo é requerido.</FormHelperText>
            ) : (
              <FormHelperText>Insira um nome para identificar sua banda.</FormHelperText>
            )}
          </FormControl>
          <FormControl
            isDisabled={(id && !band) as boolean}
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
                disabled={(id && !band) as boolean}
                placeholder="Descrição da banda"
                pl="10"
                minLength={2}
                {...register('description', { required: true })}
              />
            </InputGroup>
            {errors.name ? (
              <FormHelperText color="red.500">Esse campo é requerido.</FormHelperText>
            ) : (
              <FormHelperText>Insira uma breve descrição para a banda.</FormHelperText>
            )}
          </FormControl>
          <Button
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
