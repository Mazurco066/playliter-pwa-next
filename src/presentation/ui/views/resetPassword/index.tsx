// Dependencies
import { FC } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from  '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { requestClient } from 'infra/services/http'

// Components
import { FaKey } from 'react-icons/fa'
import { Icon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Flex,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Text,
  useColorModeValue,
  useToast,
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

// Component
const ResetPasswordView: FC<{ params: string[] }> = ({ params }) => {
  // Hooks
  const toast = useToast()
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm()

  // Theme hooks
  const pathSize = params.reduce((pv: string, _: string) => pv + '../', '')
  const bgBox = useColorModeValue('gray.50', 'gray.800')
  const logoImg = useColorModeValue(`${pathSize}logo-black.svg`, `${pathSize}logo.svg`)

  // Reset password request
  const { isLoading, mutateAsync } = useMutation((data: any) => {
    return requestClient('/api/accounts/reset_password', 'post', { ...data })
  })

  // Actions
  const onSubmit = async (data: any) => {
    // Retrieve page params
    const [ accountId, token ] = params

    // Validate page params
    if (!accountId || !token) {
      toast({
        title: 'Ops... URL inválida',
        description: 'A url informada nessá página é inválida. Por favor solicite uma url de refefinição de senha pelo app e a acesse pelo seu E-mail.',
        status: 'error',
        duration: 3500,
        isClosable: true
      })
      return router.push('/login')
    }
    
    // Validate both passwords
    if (data.password !== data.confirmPassword) return toast({
      title: 'Ops... senhas inválidas',
      description: 'A senha digitada deve ser igual a confirmação da senha',
      status: 'warning',
      duration: 2000,
      isClosable: true
    })

    // Request api
    const response = await mutateAsync({
      accountId,
      token,
      newPassword: data.password
    })

    // Verify response status
    if ([200, 201].includes(response.status)) {
     
      // Notify user about operation success
      toast({
        title: 'Senha atualizada com sucesso!',
        description: 'Agora faça o login utilizando sua nova senha.',
        status: 'success',
        duration: 3000,
        isClosable: true
      })
      router.push('/login')

    } else {
      if ([400, 404].includes(response.status)) {
        toast({
          title: 'Ops.. Preenchimento do formulário inválido',
          description: 'Verifique se as senhas possuem mais de 8 caracteres e se as 2 senhas correspondem!',
          status: 'error',
          duration: 2500,
          isClosable: true
        })
      } else {
        toast(genericMsg)
      }
    }
  }

  // JSX
  return (
    <div>
      <Container maxWidth="3xl">
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
              Redefinir Senha
            </Heading>
            <Text mb="3">
              Entre com uma nova senha para sua conta e a confirme
            </Text>
            <FormControl mb="5" isRequired isDisabled={isLoading}>
              <FormLabel>Senha</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaKey} />}
                />
                <Input
                  type="password"
                  disabled={isLoading}
                  minLength={8}
                  placeholder="Senha"
                  {...register('password', { required: true, minLength: 8 })}
                />
              </InputGroup>
              {errors.password ? (
                <FormHelperText color="red.500">Esse campo é requerido.</FormHelperText>
              ) : (
                <FormHelperText>Digite uma nova senha para sua conta.</FormHelperText>
              )}
            </FormControl>
            <FormControl mb="5" isRequired isDisabled={isLoading}>
              <FormLabel>Confirmar senha</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaKey} />}
                />
                <Input
                  type="password"
                  disabled={isLoading}
                  minLength={8}
                  placeholder="Confirmar senha"
                  {...register('confirmPassword', { required: true,  minLength: 8 })}
                />
              </InputGroup>
              {errors.confirmPassword ? (
                <FormHelperText color="red.500">Esse campo é requerido.</FormHelperText>
              ) : (
                <FormHelperText>Confirme a nova senha escolhida para a conta.</FormHelperText>
              )}
            </FormControl>
            <Button
              disabled={isLoading}
              variant="fade"
              type="submit"
              width="full"
              mb="3"
            >
              Redefinir senha
            </Button>
            <Text
              textAlign="center"
            >
              Lembrou sua senha?{' '}
              <Link
                fontWeight="bold"
                color="secondary.500"
                onClick={() => router.push('/login')}
              >
                Voltar para autenticação.
              </Link>
            </Text>
          </form>
        </Box>
      </Container>
    </div>
  )
}

// Exporting component
export default ResetPasswordView
