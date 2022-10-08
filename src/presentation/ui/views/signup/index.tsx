// Dependencies
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { useUser } from 'infra/services/session'
import { useRouter } from 'next/router'
import { useMutation } from '@tanstack/react-query'
import { requestClient } from 'infra/services/http'

// Layout and Components
import { Icon } from '@chakra-ui/icons'
import { FaEnvelope, FaUser, FaKey } from 'react-icons/fa'
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Text,
  useToast,
  useColorModeValue,
  UseToastOptions
} from '@chakra-ui/react'

// Generic msg
const genericMsg: UseToastOptions = {
  title: 'Erro interno.',
  description: "Um erro inesperado ocorreu! Entre em contato com algum administrador do App.",
  status: 'error',
  duration: 5000,
  isClosable: true
}

// Sign in component
const SignUpView: FC = () => {
  // Hooks
  const router = useRouter()
  const toast = useToast()
  const { mutateUser } = useUser()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  // Color hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')
  const logoImg =  useColorModeValue('logo-black.svg', 'logo.svg')

  // SignUp request
  const { isLoading, mutateAsync } = useMutation((data: any) => {
    return requestClient('/api/accounts/create', 'post', data)
  })

  // Login request
  const { isLoading: isLogging, mutateAsync: mutateUserAsync } = useMutation((data: any) => {
    return requestClient('/api/login', 'post', data)
  })

  // Actions
  const onSubmit = async (data: any) => {
    // Request api via server side
    const response = await mutateAsync({ ...data })

    // Verify if it was successfull
    if ([200, 201].includes(response.status)) {

      // Notify user about created account
      toast({
        title: 'Seja bem vindo!',
        description: `Sua conta foi criado com sucesso ${response.data?.name}`,
        status: 'success',
        duration: 2000,
        isClosable: true
      })

      // Authenticate user
      const loginResponse = await mutateUserAsync({
        username: response.data?.username,
        password: data.password
      })

      // Verify if authentication was successfull
      if ([200].includes(loginResponse.status)) {
        mutateUser(loginResponse.data)
      } else {
        router.push('/login')
      }

    } else {
      if ([400].includes(response.status)) {
        toast({
          title: 'Ops.. Há campos em uso!',
          description: 'Usuário ou E-mail informados já estão em uso por outra pessoa!',     
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
        <Flex justifyContent="center" mb="3">
          <Image
            maxWidth="164px"
            src={logoImg}
            alt="Playliter logo"
          />
        </Flex>
        <Box p="5" borderRadius="lg" bg={bgBox}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isRequired mb="5" isDisabled={isLoading || isLogging}>
              <FormLabel>Nome</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaUser} />}
                />
                <Input
                  type="text"
                  placeholder="Nome"
                  minLength={2}
                  {...register('name', { required: true })}
                />
              </InputGroup>
              {errors.name ? (
                <FormHelperText color="red.500">Esse campo é requerido.</FormHelperText>
              ) : (
                <FormHelperText>Nome que será mostrado no app.</FormHelperText>
              )}
            </FormControl>
            <FormControl isRequired mb="5" isDisabled={isLoading || isLogging}>
              <FormLabel>Usuário</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaUser} />}
                />
                <Input
                  type="text"
                  placeholder="Usuário"
                  minLength={3}
                  {...register('username', { required: true })}
                />
              </InputGroup>
              {errors.username ? (
                <FormHelperText color="red.500">Esse campo é requerido.</FormHelperText>
              ) : (
                <FormHelperText>Usuário que será usado na autenticação.</FormHelperText>
              )}
            </FormControl>
            <FormControl isRequired mb="5" isDisabled={isLoading || isLogging}>
              <FormLabel>E-mail</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaEnvelope} />}
                />
                <Input
                  type="email"
                  placeholder="E-mail"
                  {...register('email', { required: true })}
                />
              </InputGroup>
              {errors.email ? (
                <FormHelperText color="red.500">Esse campo é requerido.</FormHelperText>
              ) : (
                <FormHelperText>E-mail que será usado para redefinição de senha.</FormHelperText>
              )}
            </FormControl>
            <FormControl isRequired mb="5" isDisabled={isLoading || isLogging}>
              <FormLabel>Senha</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaKey} />}
                />
                <Input
                  type="password"
                  placeholder="Senha"
                  minLength={8}
                  {...register('password', { required: true })}
                />
              </InputGroup>
              {errors.password ? (
                <FormHelperText color="red.500">Esse campo é requerido.</FormHelperText>
              ) : (
                <FormHelperText>Senha utilizada para entrar no app.</FormHelperText>
              )}
            </FormControl>
            <Button
              disabled={isLoading || isLogging}
              variant="fade"
              type="submit"
              width="full"
              mb="3"
            >
              Criar conta
            </Button>
            <Text
              textAlign="center"
            >
              Já possui conta?{' '}
              <Link
                fontWeight="bold"
                color="secondary.500"
                onClick={() => router.push('/login')}
              >
                Fazer login!
              </Link>
            </Text>
          </form>
        </Box>
      </Container>
    </div>
  )
}

// Exporting component
export default SignUpView
