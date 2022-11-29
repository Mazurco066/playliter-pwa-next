// Dependencies
import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useTranslation } from 'next-i18next'
import { requestClient } from 'infra/services/http'

// Layout and Components
import { Icon } from '@chakra-ui/icons'
import { FaFileSignature, FaSignature } from 'react-icons/fa'
import { FileUpload } from 'presentation/ui/components'
import {
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
  useToast,
  UseToastOptions
} from '@chakra-ui/react'

// Save band component
const SaveBandView: FC<{ id?: string }> = ({ id = '' }) => {
  // Hooks
  const router = useRouter()
  const toast = useToast()
  const [ logoPreview, setLogoPreview ] = useState<string>('')
  const { t: common } = useTranslation('common')
  const { t } = useTranslation('band')
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  // Requests
  const {
    data: band,
    isLoading: bandLoading
  } = useQuery(
    ['saveBand'],
    () => requestClient(`/api/bands/get?id=${id}`, 'get'),
    {
      enabled: id !== '',
      refetchOnWindowFocus: false
    }
  )
  
  // Set form values if an id was received
  useEffect(() => {
    if (band && band.data) {
      const options = { shouldValidate: true, shouldDirty: true }
      setValue('title', band.data?.title, options)
      setValue('description', band.data?.description, options)
      setLogoPreview(band.data?.logo)
    }
  }, [band])

  // Clear form on startup
  useEffect(() => {
    const options = { shouldValidate: false, shouldDirty: true }
    setValue('title', '', options)
    setValue('description', '', options)
  }, [])

  // Notify user about error while fetching his banda data
  useEffect(() => {
    if (band && band?.status !== 200) {
      if ([404].includes(band.status)) {
        toast({
          title: t('messages.band_not_found_title'),
          description: t('messages.band_not_found_msg'),
          status: 'info',
          duration: 5000,
          isClosable: true
        })
      } else {
        toast(genericMsg)
      }
      router.push('../bands')
    }
  }, [band])

  // Save band
  const { isLoading, mutateAsync } = useMutation((data: any) => {
    return requestClient('/api/bands/save', 'post', data)
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
    const payload = id ? { id, ...data } : { ...data }
    if (logoPreview) payload['logo'] = logoPreview
    const response = await mutateAsync(payload)

    // Verify if request was successfull
    if ([200, 201].includes(response.status)) {
      // Notify user about created band
      toast({
        title: t('messages.save_success_title'),
        description: `${t('messages.save_success_msg_1')}${response?.data?.title}${t('messages.save_success_msg_2')}`,
        status: 'success',
        duration: 2000,
        isClosable: true
      })

      // Redirect to band page
      router.push(id ? '../../bands' : '../bands')

    } else {
      if ([400].includes(response.status)) {
        toast({
          title: t('messages.invalid_form_data_title'),
          description: t('messages.invalid_form_data_msg'),     
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <FileUpload
            source={logoPreview}
            onUploadSuccess={({ url }) => setLogoPreview(url)}
            onUploadError={() => {
              toast({
                title: t('messages.upload_error_title'),
                description: t('messages.upload_error_msg'),
                status: 'error',
                duration: 3500,
                isClosable: true
              })
            }}
          />
          <FormControl
            isDisabled={isLoading || (id != '' && bandLoading)}
            isRequired
            mb="5"
          >
            <FormLabel>{t('save.name_label')}</FormLabel>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<Icon as={FaSignature} />}
              />
              <Input
                disabled={isLoading || (id != '' && bandLoading)}
                type="text"
                placeholder={t('save.name_placeholder')}
                minLength={2}
                {...register('title', { required: true })}
              />
            </InputGroup>
            {errors.title ? (
              <FormHelperText color="red.500">{t('messages.required_field')}</FormHelperText>
            ) : (
              <FormHelperText>{t('save.name_hint')}</FormHelperText>
            )}
          </FormControl>
          <FormControl
            isDisabled={isLoading || (id != '' && bandLoading)}
            isRequired
            mb="5"
          >
            <FormLabel>{t('save.desc_label')}</FormLabel>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<Icon as={FaFileSignature} />}
              />
              <Textarea
                disabled={isLoading || (id != '' && bandLoading)}
                placeholder={t('save.desc_placeholder')}
                pl="10"
                minLength={2}
                {...register('description', { required: true })}
              />
            </InputGroup>
            {errors.description ? (
              <FormHelperText color="red.500">{t('messages.required_field')}</FormHelperText>
            ) : (
              <FormHelperText>{t('save.desc_hint')}</FormHelperText>
            )}
          </FormControl>
          <Button
            disabled={isLoading || (id != '' && bandLoading)}
            variant="fade"
            type="submit"
            width="full"
            mb="5"
          >
            {t('save.submit')}
          </Button>
        </form>
      </Container>
    </div>
  )
}

// Exporting component
export default SaveBandView
