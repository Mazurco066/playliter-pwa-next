// Dependencies
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { useUser } from 'infra/services/session'
import { fetchJson } from 'infra/services/http'

// Layout and Components
import {
  Button,
  Container,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Heading,
  Input
} from '@chakra-ui/react'

// Sign in component
const LogInView: FC = () => {
  // Hooks
  const { mutateUser } = useUser()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  // Actions
  const onSubmit = async (data: any) => {
    console.log(data)
    try {
      mutateUser(await fetchJson('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }))
    } catch (error) {
      console.error('An unexpected error happened:', error)
    }
  }

  // View JSX
  return (
    <div>
      <Container>
        <Heading as="h2" size="xl" mb="5">
          Login
        </Heading>
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
          <Button colorScheme='blue' type='submit'>
            Acessar
          </Button>
        </form>
      </Container>
    </div>
  )
}

// Exporting component
export default LogInView
