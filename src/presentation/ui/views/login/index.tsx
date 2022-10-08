// Dependencies
import { FC } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useUser } from 'infra/services/session'
import { requestClient } from 'infra/services/http'
import { useRouter } from 'next/router'

// Layout and Components
import { Icon } from '@chakra-ui/icons'
import { FaUser, FaKey } from 'react-icons/fa'
import {
  InputLeftElement,
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
  Link,
  Text,
  useToast,
  useColorModeValue,
  UseToastOptions
} from '@chakra-ui/react'

// Generic error msg
const genericMsg: UseToastOptions = {
  title: 'Erro interno.',
  description: 'Um erro inesperado ocorreu! Entre em contato com algum administrador do App.',
  status: 'error',
  duration: 5000,
  isClosable: true
}

// Sign in component
const LogInView: FC = () => {
  // Hooks
  const toast = useToast()
  const router = useRouter()
  const { mutateUser } = useUser({
    redirectTo: '/home',
    redirectIfFound: true
  })
  const { register, handleSubmit, formState: { errors } } = useForm()

  // Color hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')
  const logoImg =  useColorModeValue('logo-black.svg', 'logo.svg')

  // Login request
  const { isLoading, mutateAsync } = useMutation((data: any) => {
    return requestClient('/api/login', 'post', data)
  })

  // Actions
  const onSubmit = async (data: any) => {
    // Request api
    const response = await mutateAsync(data)
    if ([200].includes(response.status)) {
      mutateUser(response.data)
    } else {
      if ([401, 403, 404].includes(response.status)) {
        toast({
          title: 'Autenticação inválida.',
          description: "Usuário ou senha incorreto(s).",
          status: 'info',
          duration: 2000,
          isClosable: true
        })
      } else {
        toast(genericMsg)
      }
    }
  }
  
  // View JSX
  return (
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
          <FormControl mb="5" isDisabled={isLoading}>
            <FormLabel>Usuário</FormLabel>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<Icon as={FaUser} />}
              />
              <Input
                type="text"
                placeholder="Usuário"
                {...register('username', { required: true })}
              />
            </InputGroup>
            {errors.username ? (
              <FormHelperText color="red.500">Esse campo é requerido.</FormHelperText>
            ) : (
              <FormHelperText>Digite seu usuário dentro do app.</FormHelperText>
            )}
          </FormControl>
          <FormControl mb="5" isDisabled={isLoading}>
            <FormLabel>Senha</FormLabel>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<Icon as={FaKey} />}
              />
              <Input
                type="password"
                placeholder="Senha"
                {...register('password', { required: true })}
              />
            </InputGroup>
            {errors.password ? (
              <FormHelperText color="red.500">Esse campo é requerido.</FormHelperText>
            ) : (
              <FormHelperText>Digite sua senha.</FormHelperText>
            )}
          </FormControl>
          <Text textAlign="center" mb="3">
            <Link
              fontWeight="bold"
              color="secondary.500"
              onClick={() => router.push('/forgotPassword')}
            >
              Esqueci minha senha
            </Link>
          </Text>
          <Button
            disabled={isLoading}
            variant="fade"
            type="submit"
            width="full"
            mb="3"
          >
            Acessar
          </Button>
          <Text
            textAlign="center"
          >
            Não possui conta?{' '}
            <Link
              fontWeight="bold"
              color="secondary.500"
              onClick={() => router.push('/signup')}
            >
              Criar uma agora!
            </Link>
          </Text>
        </form>
      </Box>
    </Container>
  )
}

// Exporting component
export default LogInView
