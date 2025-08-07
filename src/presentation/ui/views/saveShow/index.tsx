// Dependencies
import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useTranslation } from 'next-i18next'
import { requestClient } from 'infra/services/http'

// Layout and Components
import { Icon } from '@chakra-ui/icons'
import { FaCalendar, FaFileSignature, FaSignature } from 'react-icons/fa'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
  useColorModeValue,
  useToast,
  UseToastOptions
} from '@chakra-ui/react'

// Save show component
const SaveShowView: FC<{
  id?: string,
  bandId?: string
}> = ({
  id = '',
  bandId = ''
}) => {
    // Hooks
    const router = useRouter()
    const toast = useToast()
    const { t: common } = useTranslation('common')
    const { t } = useTranslation('concert')
    const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
    } = useForm()

    // Color hooks
    const bgBox = useColorModeValue('gray.50', 'gray.800')

    // Requests
    const {
      data: show,
      isLoading: showLoading
    } = useQuery(
      ['save-show'],
      () => requestClient(`/api/shows/get?id=${id}`, 'get'),
      {
        enabled: id !== '',
        refetchOnWindowFocus: false
      }
    )

    // Set form values if an id was received
    useEffect(() => {
      if (show && show.data) {
        console.log('populating form data', show.data?.date)
        const options = { shouldValidate: true, shouldDirty: true }
        setValue('title', show.data?.title, options)
        setValue('description', show.data?.description, options)
        setValue('date', show.data?.date.split('T')[0], options)
      }
    }, [show])

    // Validate path params
    useEffect(() => {
      if (!id && !bandId) {
        toast({
          title: t('messages.invalid_parameters_title'),
          description: t('messages.invalid_parameters_msg'),
          status: 'info',
          duration: 3500,
          isClosable: true
        })
        router.push('../../bands')
      }
    }, [id, bandId])

    // Clear form on startup
    useEffect(() => {
      const options = { shouldValidate: false, shouldDirty: true }
      setValue('title', '', options)
      setValue('description', '', options)
      setValue('date', '', options)
    }, [])

    // Notify user about error while fetching his show data
    useEffect(() => {
      if (show && show?.status !== 200) {
        if ([404].includes(show.status)) {
          toast({
            title: t('messages.show_not_found_title'),
            description: t('messages.show_not_found_msg'),
            status: 'info',
            duration: 5000,
            isClosable: true
          })
        } else {
          toast(genericMsg)
        }
        router.push('../../bands')
      }
    }, [show])

    // Save show
    const { isLoading, mutateAsync } = useMutation((data: any) => {
      return requestClient('/api/shows/save', 'post', data)
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
      const response = await mutateAsync(id ? { id, ...data } : { bandId: bandId, ...data })

      // Verify if request was successfull
      if ([200, 201].includes(response.status)) {
        // Notify user about created show
        toast({
          title: t('messages.create_show_title'),
          description: `${t('messages.create_show_msg_1')}${response?.data?.title}${t('messages.create_show_msg_2')}`,
          status: 'success',
          duration: 2000,
          isClosable: true
        })

        // Redirect to show page
        router.push(id ? `../../shows/${id}` : `../shows/${response.data.id}`)

      } else {
        if ([400].includes(response.status)) {
          toast({
            title: t('messages.invalid_form_title'),
            description: t('messages.invalid_form_msg'),
            status: 'warning',
            duration: 3500,
            isClosable: true
          })
        } else if ([401, 403].includes(response.status)) {
          toast({
            title: t('messages.no_permissions_title'),
            description: t('messages.no_permissions_msg'),
            status: 'info',
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
          <Box
            px="3"
            py="5"
            borderRadius="lg"
            bgColor={bgBox}
            mb="5"
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl
                isDisabled={isLoading || (id != '' && showLoading)}
                isRequired
                mb="5"
              >
                <FormLabel>{t('save.title_label')}</FormLabel>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                  >
                    <Icon as={FaSignature} />
                  </InputLeftElement>
                  <Input
                    disabled={isLoading || (id != '' && showLoading)}
                    variant="filled"
                    type="text"
                    placeholder={t('save.title_placeholder')}
                    minLength={2}
                    {...register('title', { required: true })}
                  />
                </InputGroup>
                {errors.title ? (
                  <FormHelperText color="red.500">{t('save.required_field')}</FormHelperText>
                ) : (
                  <FormHelperText>{t('save.title_hint')}</FormHelperText>
                )}
              </FormControl>
              <FormControl
                isDisabled={isLoading || (id != '' && showLoading)}
                isRequired
                mb="5"
              >
                <FormLabel>{t('save.date_label')}</FormLabel>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                  >
                    <Icon as={FaCalendar} />
                  </InputLeftElement>
                  <Input
                    disabled={isLoading || (id != '' && showLoading)}
                    variant="filled"
                    type="date"
                    {...register('date', { required: true })}
                  />
                </InputGroup>
                {errors.date ? (
                  <FormHelperText color="red.500">{t('save.required_field')}</FormHelperText>
                ) : (
                  <FormHelperText>{t('save.date_hint')}</FormHelperText>
                )}
              </FormControl>
              <FormControl
                isDisabled={isLoading || (id != '' && showLoading)}
                isRequired
                mb="5"
              >
                <FormLabel>{t('save.desc_label')}</FormLabel>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                  >
                    <Icon as={FaFileSignature} />
                  </InputLeftElement>
                  <Textarea
                    disabled={isLoading || (id != '' && showLoading)}
                    variant="filled"
                    placeholder={t('save.desc_placeholder')}
                    pl="10"
                    minLength={2}
                    {...register('description', { required: true })}
                  />
                </InputGroup>
                {errors.description ? (
                  <FormHelperText color="red.500">{t('save.required_field')}</FormHelperText>
                ) : (
                  <FormHelperText>{t('save.desc_hint')}</FormHelperText>
                )}
              </FormControl>
              <Button
                disabled={isLoading || (id != '' && showLoading)}
                variant="fade"
                type="submit"
                width="full"
              >
                {t('save.submit')}
              </Button>
            </form>
          </Box>
        </Container>
      </div>
    )
  }

// Exporting component
export default SaveShowView
