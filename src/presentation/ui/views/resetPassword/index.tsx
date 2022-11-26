// Dependencies
import { FC } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from  '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
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

// Component
const ResetPasswordView: FC<{ params: string[] }> = ({ params }) => {
  // Hooks
  const toast = useToast()
  const router = useRouter()
  const { t: common } = useTranslation('common')
  const { t } = useTranslation('resetPassword')
  const { register, handleSubmit, formState: { errors } } = useForm()

  // Theme hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')
  const logoImg = useColorModeValue(`/logo-black.svg`, `/logo.svg`)

  // Reset password request
  const { isLoading, mutateAsync } = useMutation((data: any) => {
    return requestClient('/api/accounts/reset_password', 'post', { ...data })
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
    // Retrieve page params
    const [ accountId, token ] = params

    // Validate page params
    if (!accountId || !token) {
      toast({
        title: t('messages.invalid_url_title'),
        description: t('messages.invalid_url_msg'),
        status: 'error',
        duration: 3500,
        isClosable: true
      })
      return router.push('/login')
    }
    
    // Validate both passwords
    if (data.password !== data.confirmPassword) return toast({
      title: t('messages.invalid_password_title'),
      description: t('messages.invalid_password_msg'),
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
        title: t('messages.reset_success_title'),
        description: t('messages.reset_success_msg'),
        status: 'success',
        duration: 3000,
        isClosable: true
      })
      router.push('/login')

    } else {
      if ([400, 404].includes(response.status)) {
        toast({
          title: t('messages.invalid_form_title'),
          description: t('messages.invalid_form_msg'),
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
              {t('form.title')}
            </Heading>
            <Text mb="3">
              {t('form.subtitle')}
            </Text>
            <FormControl mb="5" isRequired isDisabled={isLoading}>
              <FormLabel>{t('form.password_label')}</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaKey} />}
                />
                <Input
                  type="password"
                  disabled={isLoading}
                  minLength={8}
                  placeholder={t('form.password_label')}
                  {...register('password', { required: true, minLength: 8 })}
                />
              </InputGroup>
              {errors.password ? (
                <FormHelperText color="red.500">{(t('messages.required_field_msg'))}</FormHelperText>
              ) : (
                <FormHelperText>{t('form.password_hint')}</FormHelperText>
              )}
            </FormControl>
            <FormControl mb="5" isRequired isDisabled={isLoading}>
              <FormLabel>{t('form.confirm_label')}</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaKey} />}
                />
                <Input
                  type="password"
                  disabled={isLoading}
                  minLength={8}
                  placeholder={t('form.confirm_label')}
                  {...register('confirmPassword', { required: true,  minLength: 8 })}
                />
              </InputGroup>
              {errors.confirmPassword ? (
                <FormHelperText color="red.500">{(t('messages.required_field_msg'))}</FormHelperText>
              ) : (
                <FormHelperText>{t('form.confirm_hint')}</FormHelperText>
              )}
            </FormControl>
            <Button
              disabled={isLoading}
              variant="fade"
              type="submit"
              width="full"
              mb="3"
            >
              {t('form.submit')}
            </Button>
            <Text
              textAlign="center"
            >
              {t('form.remember_account')}
              <Link
                fontWeight="bold"
                color="secondary.500"
                onClick={() => router.push('/login')}
              >
                {t('form.login')}
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
