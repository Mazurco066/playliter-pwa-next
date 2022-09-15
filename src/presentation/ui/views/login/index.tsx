// Dependencies
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { useUser } from 'infra/services/session'
import { fetchJson, FetchError } from 'infra/services/http'

// Layout and Components
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Heading,
  Input,
  useToast
} from '@chakra-ui/react'

// Sign in component
const LogInView: FC = () => {
  // Hooks
  const { mutateUser } = useUser()
  const toast = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  // Actions
  const onSubmit = async (data: any) => {
    try {
      mutateUser(await fetchJson('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }))
    } catch (error) {
      if (error instanceof FetchError) {
        if ([401, 403].includes(error.response.status)) {
          toast({
            title: 'Autenticação inválida.',
            description: "Usuário ou senha incorreto(s).",
            status: 'error',
            duration: 2000,
            isClosable: true
          })
        }
      } else {
        toast({
          title: 'Erro interno.',
          description: "Um erro inesperado ocorreu! Entre em contato com algum administrador do App.",
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
    }
  }

  // View JSX
  return (
    <Container>
      <Heading as="h2" size="xl" mb="5" color='secondary'>
        Login
      </Heading>
      <Box p="5" borderRadius="lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl mb="5" isRequired>
            <FormLabel>Usuário</FormLabel>
            <Input type='text' {...register('username', { required: true })} />
            {errors.username ? (
              <FormErrorMessage>Username is required.</FormErrorMessage>
            ) : (
              <FormHelperText>Digite seu usuário dentro do app.</FormHelperText>
            )}
          </FormControl>
          <FormControl mb="5" isRequired>
            <FormLabel>Senha</FormLabel>
            <Input type='password' {...register('password', { required: true })} />
            {errors.password ? (
              <FormErrorMessage>Password is required.</FormErrorMessage>
            ) : (
              <FormHelperText>Digite sua senha.</FormHelperText>
            )}
          </FormControl>
          <Button colorScheme="primary" type='submit'>
            Acessar
          </Button>
        </form>
      </Box>
    </Container>
  )
}

// Exporting component
export default LogInView
