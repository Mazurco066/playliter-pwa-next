// Dependencies
import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from  '@tanstack/react-query'
import { useTranslation } from 'next-i18next'
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

// Component
const VerifyAccountView: FC<{ code?: string }> = ({ code = '' }) => {
  // Hooks
  const router = useRouter()
  const toast = useToast()
  const [ verificationCode, setVerificationCode ] = useState<string>('')
  const { user, mutateUser } = useUser()
  const { t: common } = useTranslation('common')
  const { t } = useTranslation('verify')

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

  // Generic error msg
  const genericMsg: UseToastOptions = {
    title: common('messages.internal_error_title'),
    description: common('messages.internal_error_msg'),
    status: 'error',
    duration: 5000,
    isClosable: true
  }

  // Actions
  const resendVerificationEmail = async () => {
    // Request endpoint
    const response = await resendAsync()

    // Verify if response was successfull
    if ([200, 201].includes(response.status)) {
      toast({
        title: t('messages.resend_success_title'),
        description: t('messages.resend_success_msg'),
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
      title: t('messages.invalid_code_title'),
      description: t('messages.invalid_code_msg'),
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
        title: t('messages.verified_email_title'),
        description: t('messages.verified_email_msg'),
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
          title: t('messages.code_not_found_title'),
          description: t('messages.code_not_found_msg'),
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
            {t('code_label')}
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
            {t('resend_1')}
            <Link
              color='secondary.500'
              onClick={resendLoading ? () => {} : () => resendVerificationEmail()}
            >
              {t('resend_2')}
            </Link>
          </Text>
          <Button
            width="full"
            variant="fade"
            disabled={verifyLoading}
            onClick={verifyLoading ? () => {} : () => verifyAccountByCode()}
          >
            {t('submit')}
          </Button>
        </Box>
      </Container>
    </div>
  )
}

// Exporting component
export default VerifyAccountView
