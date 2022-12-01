// Dependencies
import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'next-i18next'
import { requestClient } from 'infra/services/http'

// Types
import type { ObservationType } from 'domain/models'

// Components
import { Icon } from '@chakra-ui/icons'
import { FaFileSignature, FaSignature } from 'react-icons/fa'
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Textarea,
  useToast,
  UseToastOptions
} from '@chakra-ui/react'

// Component
export const NoteForm: FC<{
  showId: string,
  note?: ObservationType | null
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  onSaveSuccess?: () => void
}> = ({
  showId,
  note = null,
  isOpen,
  onClose,
  onSaveSuccess = () => {}
}) => {
  // Hooks
  const toast = useToast()
  const { t: common } = useTranslation('common')
  const { t } = useTranslation('concert')
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  // Effects
  useEffect(() => {
    if (note) {
      const options = { shouldValidate: true, shouldDirty: true }
      setValue('title', note.title, options)
      setValue('data', note.data, options)
    } else {
      const options = { shouldValidate: false, shouldDirty: true }
      setValue('title', '', options)
      setValue('data', '', options)
    }
  }, [note])

  // Save note
  const { isLoading, mutateAsync } = useMutation((data: any) => {
    return requestClient('/api/shows/save_note', 'post', data)
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
    // Destruct data
    const { id } = note || {}

    // Request api via server side
    const response = await mutateAsync(id ? { id, showId, ...data } : { showId, ...data })

    // Verify if request was successfull
    if ([200, 201].includes(response.status)) {
      // Notify user about created band
      toast({
        title: t('messages.save_note_title'),
        description: t('messages.save_note_msg'),
        status: 'success',
        duration: 2000,
        isClosable: true
      })

      // Close modal and refresh data
      onClose()
      onSaveSuccess()

    } else {
      if ([400].includes(response.status)) {
        toast({
          title: t('messages.invalid_form_title'),
          description: t('messages.invalid_form_msg'),     
          status: 'warning',
          duration: 3500,
          isClosable: true
        })
      } else {
        toast(genericMsg)
      }
    }
  }

  // JSX
  return (
    <Modal
      size="xs"
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {
            note
              ? note.title
              : t('form.new_note')
          }
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl
              isRequired
              mb="5"
              isDisabled={isLoading}
            >
              <FormLabel>{t('form.title_label')}</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaSignature} />}
                />
                <Input
                  disabled={isLoading}
                  type="text"
                  placeholder={t('form.title_placeholder')}
                  minLength={2}
                  {...register('title', { required: true })}
                />
              </InputGroup>
              {errors.title ? (
                <FormHelperText color="red.500">{t('form.required_field')}</FormHelperText>
              ) : (
                <FormHelperText>{t('form.title_hint')}</FormHelperText>
              )}
            </FormControl>
            <FormControl
              isRequired
              mb="5"
              isDisabled={isLoading}
            >
              <FormLabel>{t('form.content_label')}</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaFileSignature} />}
                />
                <Textarea
                  disabled={isLoading}
                  placeholder={t('form.content_placeholder')}
                  pl="10"
                  minLength={2}
                  minHeight="200px"
                  {...register('data', { required: true })}
                />
              </InputGroup>
              {errors.data ? (
                <FormHelperText color="red.500">{t('form.required_field')}</FormHelperText>
              ) : (
                <FormHelperText>{t('form.content_hint')}</FormHelperText>
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
 
            <Button
              disabled={isLoading}
              colorScheme="secondary"
              type="button"
              width="full"
              mb="3"
              onClick={isLoading ? () => {} : onClose}
            >
              {t('form.cancel')}
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
