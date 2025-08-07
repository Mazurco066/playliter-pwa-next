// Dependencies
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useUser } from 'infra/services/session'
import { useRouter } from 'next/router'
import { useMutation } from '@tanstack/react-query'
import { requestClient } from 'infra/services/http'
import { useTranslation } from 'next-i18next'

// Layout and Components
import { Icon } from '@chakra-ui/icons'
import { FaEnvelope, FaUser, FaKey } from 'react-icons/fa'
import {
  Box,
  Button,
  Checkbox,
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
  const { t: common } = useTranslation('common')
  const { t } = useTranslation('signup')
  const { mutateUser } = useUser()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  // Privacy policy hooks
  const [agreedToPolicy, setPolicyAgreement] = useState<boolean>(false)

  // Color hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')
  const logoImg = useColorModeValue('/logo-black.svg', '/logo.svg')

  // SignUp request
  const { isLoading, mutateAsync } = useMutation((data: any) => {
    return requestClient('/api/accounts/create', 'post', data)
  })

  // Login request
  const { isLoading: isLogging, mutateAsync: mutateUserAsync } = useMutation((data: any) => {
    return requestClient('/api/login', 'post', data)
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
    // Verify if user agreed to privacy policy
    if (!agreedToPolicy) {
      return toast({
        title: t('messages.privacy_required'),
        description: t('messages.privacy_required_msg'),
        status: 'info',
        duration: 2000,
        isClosable: true
      })
    }

    // Request api via server side
    const response = await mutateAsync({ ...data })

    // Verify if it was successfull
    if ([200, 201].includes(response.status)) {

      // Notify user about created account
      toast({
        title: t('messages.welcome_title'),
        description: `${t('messages.welcome_msg')} ${response.data?.name}`,
        status: 'success',
        duration: 2000,
        isClosable: true
      })

      // Authenticate user
      const loginResponse = await mutateUserAsync({
        username: response.data?.email,
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
          title: t('messages.in_use_title'),
          description: t('messages.in_use_msg'),
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
              <FormLabel>{t('form.name_label')}</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                >
                  <Icon as={FaUser} />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder={t('form.name_label')}
                  minLength={2}
                  {...register('name', { required: true })}
                />
              </InputGroup>
              {errors.name ? (
                <FormHelperText color="red.500">{t('messages.required_field_msg')}</FormHelperText>
              ) : (
                <FormHelperText>{t('form.name_hint')}</FormHelperText>
              )}
            </FormControl>
            <FormControl isRequired mb="5" isDisabled={isLoading || isLogging}>
              <FormLabel>{t('form.email_label')}</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                >
                  <Icon as={FaEnvelope} />
                </InputLeftElement>
                <Input
                  type="email"
                  placeholder={t('form.email_label')}
                  {...register('email', { required: true })}
                />
              </InputGroup>
              {errors.email ? (
                <FormHelperText color="red.500">{t('messages.required_field_msg')}</FormHelperText>
              ) : (
                <FormHelperText>{t('form.email_hint')}</FormHelperText>
              )}
            </FormControl>
            <FormControl isRequired mb="5" isDisabled={isLoading || isLogging}>
              <FormLabel>{t('form.password_label')}</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                >
                  <Icon as={FaKey} />
                </InputLeftElement>
                <Input
                  type="password"
                  placeholder={t('form.password_label')}
                  minLength={8}
                  {...register('password', { required: true })}
                />
              </InputGroup>
              {errors.password ? (
                <FormHelperText color="red.500">{t('messages.required_field_msg')}</FormHelperText>
              ) : (
                <FormHelperText>{t('form.password_hint')}</FormHelperText>
              )}
            </FormControl>
            <Checkbox
              isDisabled={isLoading || isLogging}
              isChecked={agreedToPolicy}
              onChange={e => setPolicyAgreement(e.target.checked)}
              mb="5"
            >
              {t('form.warning')}
              <Link
                fontWeight="bold"
                color="secondary.500"
                href='https://www.playliter.com.br/privacyPolicy'
                target="_blank"
              >
                {t('form.warning_link')}
              </Link>.
            </Checkbox>
            <Button
              disabled={isLoading || isLogging}
              variant="fade"
              type="submit"
              width="full"
              mb="3"
            >
              {t('form.button')}
            </Button>
            <Text
              textAlign="center"
            >
              {t('form.has_account')}
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
export default SignUpView
