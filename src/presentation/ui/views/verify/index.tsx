// Dependencies
import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from  '@tanstack/react-query'
import { requestClient } from 'infra/services/http'
import { useUser } from 'infra/services/session'

// Components
import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Link,
  PinInput,
  PinInputField,
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
const VerifyAccountView: FC<{ code?: string }> = ({ code = '' }) => {
  // Hooks
  const router = useRouter()
  const toast = useToast()
  const [ verificationCode, setVerificationCode ] = useState<string>('')
  const { user, mutateUser } = useUser()

  // Color Hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')

  // Effects
  useEffect(() => {
    if (code[0]) setVerificationCode(code[0])
  }, [code])

  // Resend verification E-mail request
  const {
    isLoading: resendLoading,
    mutateAsync: resendAsync 
  } = useMutation(() => {
    return requestClient('/api/accounts/resend_verification', 'get')
  })

  // Verify account request
  const {
    isLoading: verifyLoading,
    mutateAsync: verifyAsync 
  } = useMutation((data: any) => {
    return requestClient('/api/accounts/verify_account', 'post', { ...data })
  })

  // Actions
  const resendVerificationEmail = async () => {
    // Request endpoint
    const response = await resendAsync()

    // Verify if response was successfull
    if ([200, 201].includes(response.status)) {
      toast({
        title: 'Sucesso!',
        description: `Um novo código de verificação foi enviado para seu E-mail!`,
        status: 'success',
        duration: 2000,
        isClosable: true
      })
    } else {
      toast(genericMsg)
    }
  }

  const verifyAccountByCode = async () => {
    // Validate verification code
    if (verificationCode.length < 4) return toast({
      title: 'Ops.. Código inválido',
      description: 'O código de verificação deve ter 4 dígitos!',
      status: 'warning',
      duration: 2000,
      isClosable: true
    })

    // Request endpoint
    const response = await verifyAsync({ code: verificationCode })

    // Verify response data
    if ([200, 201].includes(response.status)) {
     
      // Notify user about verification success
      toast({
        title: 'Sucesso!',
        description: `Seu E-mail foi verificado com sucesso! Seja bem vindo(a) ao Playliter.`,
        status: 'success',
        duration: 2000,
        isClosable: true
      })

      // Update user on session storage
      const updatedUser = { ...user, isEmailconfirmed: true }
      mutateUser(updatedUser)

      // Redirect to profile page
      router.push('../profile')

    } else {
      if ([400, 404].includes(response.status)) {
        toast({
          title: 'Ops.. Código inválido',
          description: 'O código de verificação inserido não corresponde ao gerado para sua conta!',
          status: 'error',
          duration: 2000,
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
      <Container maxWidth="lg">
        <Box
          bgColor={bgBox}
          borderRadius="lg"
          p="5"
          mb="5"
        >
          <Text textAlign="center" mb="5">
            Digite o código de verificação que foi enviado para seu E-mail. Se não encontrar o E-mail pode ser que tenha caído na caixa de span.
          </Text>
          <Flex
            gap="1rem"
            direction="column"
            alignItems="center"
            justifyContent="center"
            mb="5"
          >
            <HStack>
              <PinInput 
                size="lg"
                value={verificationCode}
                onChange={setVerificationCode}
                isDisabled={verifyLoading}
              >
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
          </Flex>
          <Text textAlign="center" mb="5">
            Não recebeu o E-mail?{' '}
            <Link
              color='secondary.500'
              onClick={resendLoading ? () => {} : () => resendVerificationEmail()}
            >
              Reenviar E-mail
            </Link>
          </Text>
          <Button
            width="full"
            variant="fade"
            disabled={verifyLoading}
            onClick={verifyLoading ? () => {} : () => verifyAccountByCode()}
          >
            Validar E-mail
          </Button>
        </Box>
      </Container>
    </div>
  )
}

// Exporting component
export default VerifyAccountView
