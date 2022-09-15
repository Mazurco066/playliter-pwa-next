// Dependencies
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { useUser } from 'infra/services/session'
import { useRouter } from 'next/router'
import { FetchError, fetchJson } from 'infra/services/http'
import type { AccountType } from 'domain/models'

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

      // Request api via server side
      const response: AccountType = await fetchJson(`api/accounts/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data })
      })

      // Notify user about created account
      toast({
        title: 'Seja bem vindo!',
        description: `Sua conta foi criado com sucesso ${response.name}`,
        status: 'success',
        duration: 2000,
        isClosable: true
      })

      // Authenticate user
      mutateUser(await fetchJson('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: response.username,
          password: data.password
        })
      }))

    } catch (error) {
      if (error instanceof FetchError) {
        if ([400].includes(error.response.status)) {
          console.log(error.message)
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
      } else {
        toast(genericMsg)
      }
    }
  }

  // View JSX
  return (
    <div>
      <Container>
        <Flex justifyContent="center" mb="3">
          <Image
            maxWidth="164px"
            src={logoImg}
            alt="Playliter logo"
          />
        </Flex>
        <Box p="5" borderRadius="lg" bg={bgBox}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isRequired mb="5">
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
            <FormControl isRequired mb="5">
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
            <FormControl isRequired mb="5">
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
            <FormControl isRequired mb="5">
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
