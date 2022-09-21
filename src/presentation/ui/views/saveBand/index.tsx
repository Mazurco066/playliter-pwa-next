// Dependencies
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { FetchError, fetchJsonFromOrigin } from 'infra/services/http'

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

// Save band component
const SaveBandView: FC<{
  id?: string
}> = ({
  id
}) => {
  // Hooks
  const toast = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  // Actions
  const onSubmit = async (data: any) => {
    // Generic msg
    const genericMsg: UseToastOptions = {
      title: 'Erro interno.',
      description: "Um erro inesperado ocorreu! Entre em contato com algum administrador do App.",
      status: 'error',
      duration: 5000,
      isClosable: true
    }

    try {

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
          <FormControl isRequired mb="5">
            <FormLabel>Nome da banda</FormLabel>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<Icon as={FaSignature} />}
              />
              <Input
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
          <FormControl isRequired mb="5">
            <FormLabel>Descrição</FormLabel>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<Icon as={FaFileSignature} />}
              />
              <Textarea
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
