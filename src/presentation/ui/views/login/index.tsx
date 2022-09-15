// Dependencies
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { useUser } from 'infra/services/session'
import { fetchJson, FetchError } from 'infra/services/http'
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

// Sign in component
const LogInView: FC = () => {
  // Hooks
  const toast = useToast()
  const router = useRouter()
  const { mutateUser } = useUser()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  // Color hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')
  const logoImg =  useColorModeValue('logo-black.svg', 'logo.svg')

  // Actions
  const onSubmit = async (data: any) => {
    try {
      mutateUser(await fetchJson('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }))
    } catch (error) {
      const genericMsg: UseToastOptions = {
        title: 'Erro interno.',
        description: "Um erro inesperado ocorreu! Entre em contato com algum administrador do App.",
        status: 'error',
        duration: 5000,
        isClosable: true
      }
      if (error instanceof FetchError) {
        if ([401, 403, 404].includes(error.response.status)) {
          toast({
            title: 'Autenticação inválida.',
            description: "Usuário ou senha incorreto(s).",
            status: 'error',
            duration: 2000,
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
          <FormControl mb="5">
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
          <FormControl mb="5">
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
