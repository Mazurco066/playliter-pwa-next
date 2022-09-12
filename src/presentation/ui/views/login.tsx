// Dependencies
import Head from 'next/head'
import { FC } from 'react'
import { useForm } from 'react-hook-form'

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  // Page JSX
  return (
    <div>
      <Head>
        <title>Playliter</title>
        <meta name="description" content="Band manager app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Heading as="h2" size="xl" mb="5">
          Login
        </Heading>
        <form onSubmit={handleSubmit((data) => console.log(data))}>
          <FormControl mb="5">
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
