// Dependencies
import { FC } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { requestClient } from 'infra/services/http'

// Layout and Components
import { Icon } from '@chakra-ui/icons'
import { FaEnvelope } from 'react-icons/fa'
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
  Heading,
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
  description: 'Um erro inesperado ocorreu! Entre em contato com algum administrador do App.',
  status: 'error',
  duration: 5000,
  isClosable: true
}

// Sign in component
const ForgotPasswordView: FC = () => {
  // Hooks
  const router = useRouter()
  const toast = useToast()
  const { register, handleSubmit, formState: { errors } } = useForm()

  // Color hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')
  const logoImg =  useColorModeValue('logo-black.svg', 'logo.svg')

  // Forget password request
  const { isLoading, mutateAsync } = useMutation((data: any) => {
    return requestClient('/api/accounts/forgot_password', 'post', data)
  })

  // Actions
  const onSubmit = async (data: any) => {
    // Request api via server side
    const response = await mutateAsync({ ...data })

    // Verify if it was successfull
    if ([200].includes(response.status)) {

      // Notify user about recovery E-mail
      toast({
        title: 'Sua conta foi encontrada!',
        description: 'Um E-mail de recuperação de senha foi enviado para sua caixa de entrada! Siga as instruções presentes nele para recuperar sua conta.',
        status: 'success',
        duration: 5000,
        isClosable: true
      })

      // Redirect to login
      router.push('/login')

    } else {
      if ([404].includes(response.status)) {
        toast({
          title: 'Ops.. A conta informada não existe!',
          description: 'Não há contas cadastradas no E-mail informado!',     
          status: 'warning',
          duration: 3000,
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
            <Heading as="h3" size="lg" mb="1">
              Esqueceu sua senha?
            </Heading>
            <Text mb="3">
              Sem problemas😁. Informe o E-mail vinculado a sua conta para receber uma
              notificação para redefinição de sua senha.
            </Text>
            <FormControl isRequired mb="5" isDisabled={isLoading}>
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
                <FormHelperText>Digite o E-mail cadastrado em sua conta.</FormHelperText>
              )}
            </FormControl>
            <Button
              disabled={isLoading}
              variant="fade"
              type="submit"
              width="full"
              mb="3"
            >
              Enviar redefinição
            </Button>
            <Text
              textAlign="center"
            >
              Lembrou sua conta?{' '}
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
export default ForgotPasswordView
