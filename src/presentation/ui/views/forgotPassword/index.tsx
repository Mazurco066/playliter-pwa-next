// Dependencies
import { FC } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
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
// Sign in component
const ForgotPasswordView: FC = () => {
  // Hooks
  const router = useRouter()
  const toast = useToast()
  const { t: common } = useTranslation('common')
  const { t } = useTranslation('forgotPassword')
  const { register, handleSubmit, formState: { errors } } = useForm()

  // Color hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')
  const logoImg =  useColorModeValue('/logo-black.svg', '/logo.svg')

  // Forget password request
  const { isLoading, mutateAsync } = useMutation((data: any) => {
    return requestClient('/api/accounts/forgot_password', 'post', data)
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
  const onSubmit = async (data: any) => {
    // Request api via server side
    const response = await mutateAsync({ ...data })

    // Verify if it was successfull
    if ([200].includes(response.status)) {

      // Notify user about recovery E-mail
      toast({
        title: t('messages.email_sent_title'),
        description: t('messages.email_sent_msg'),
        status: 'success',
        duration: 5000,
        isClosable: true
      })

      // Redirect to login
      router.push('/login')

    } else {
      if ([404].includes(response.status)) {
        toast({
          title: t('messages.account_not_exists_title'),
          description: t('messages.account_not_exists_msg'),     
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
            <Heading as="h3" size="lg" mb="1">
              {t('form.title')}
            </Heading>
            <Text mb="3">
              {t('form.subtitle')}
            </Text>
            <FormControl isRequired mb="5" isDisabled={isLoading}>
              <FormLabel>{t('form.email_label')}</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaEnvelope} />}
                />
                <Input
                  type="email"
                  placeholder={t('form.email_label')}
                  {...register('email', { required: true })}
                />
              </InputGroup>
              {errors.email ? (
                <FormHelperText color="red.500">{(t('messages.required_field_msg'))}</FormHelperText>
              ) : (
                <FormHelperText>{t('form.email_hint')}</FormHelperText>
              )}
            </FormControl>
            <Button
              disabled={isLoading}
              variant="fade"
              type="submit"
              width="full"
              mb="3"
            >
              {(t('form.submit'))}
            </Button>
            <Text
              textAlign="center"
            >
              {(t('form.remember_account'))}
              <Link
                fontWeight="bold"
                color="secondary.500"
                onClick={() => router.push('/login')}
              >
                {(t('form.login'))}
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
