// Dependencies
import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'next-i18next'
import { requestClient } from 'infra/services/http'

// Types
import type { CategoryType } from 'domain/models'

// Components
import { Icon } from '@chakra-ui/icons'
import { FaFileSignature, FaSignature } from 'react-icons/fa'
import {
  Button,
  ButtonGroup,
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
  Popover,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Textarea,
  useToast,
  UseToastOptions
} from '@chakra-ui/react'

// Component
export const CategoryForm: FC<{
  bandId: string,
  category?: CategoryType | null
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  onSaveSuccess?: () => void,
  onRemoveSuccess?: () => void
}> = ({
  bandId,
  category = null,
  isOpen,
  onClose,
  onSaveSuccess = () => {},
  onRemoveSuccess = () => {}
}) => {
  // Hooks
  const toast = useToast()
  const { t: common } = useTranslation('common')
  const { t } = useTranslation('band')
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  // Effects
  useEffect(() => {
    if (category) {
      const options = { shouldValidate: true, shouldDirty: true }
      setValue('title', category.title, options)
      setValue('description', category.description, options)
    } else {
      const options = { shouldValidate: false, shouldDirty: true }
      setValue('title', '', options)
      setValue('description', '', options)
    }
  }, [category])

  // Save category
  const { isLoading, mutateAsync } = useMutation((data: any) => {
    return requestClient('/api/bands/save_category', 'post', data)
  })

  // Delete category
  const {
    isLoading: isDeleteLoading,
    mutateAsync: deleteAsync
  } = useMutation((data: any) => {
    return requestClient('/api/bands/delete_category', 'post', data)
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
    const { id } = category || {}

    // Request api via server side
    const response = await mutateAsync(id ? { id, bandId, ...data } : { bandId, ...data })

    // Verify if request was successfull
    if ([200, 201].includes(response.status)) {
      // Notify user about created band
      toast({
        title: t('messages.category_save_title'),
        description: `${t('messages.category_save_title_1')}${response?.data?.title}${t('messages.category_save_title_2')}`,
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

  const onRemoveSubmit = async () => {
    // Destruct data
    const { id } = category || {}

    // Request api via server side
    const response = await deleteAsync({ id })

    // Verify if request was successfull
    if ([200, 201].includes(response.status)) {
      // Notify user about created band
      toast({
        title: t('messages.category_remove_title'),
        description: `${t('messages.category_remove_title_1')}${category?.title}${t('messages.category_remove_title_2')}`,
        status: 'success',
        duration: 2000,
        isClosable: true
      })

      // Close modal and refresh data
      onClose()
      onRemoveSuccess()

    } else {
      if ([400, 404].includes(response.status)) {
        toast({
          title: t('messages.category_not_found_title'),
          description: t('messages.category_not_found_msg'),     
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
            category
              ? category.title
              : t('category_form.new_label')
          }
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl
              isRequired
              mb="5"
              isDisabled={isLoading || isDeleteLoading}
            >
              <FormLabel>{t('category_form.name_label')}</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaSignature} />}
                />
                <Input
                  disabled={isLoading || isDeleteLoading}
                  type="text"
                  placeholder={t('category_form.name_placeholder')}
                  minLength={2}
                  {...register('title', { required: true })}
                />
              </InputGroup>
              {errors.title ? (
                <FormHelperText color="red.500">{t('messages.required_field')}</FormHelperText>
              ) : (
                <FormHelperText>{t('category_form.name_hint')}</FormHelperText>
              )}
            </FormControl>
            <FormControl
              isRequired
              mb="5"
              isDisabled={isLoading || isDeleteLoading}
            >
              <FormLabel>{t('category_form.desc_label')}</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaFileSignature} />}
                />
                <Textarea
                  disabled={isLoading || isDeleteLoading}
                  placeholder={t('category_form.desc_placeholder')}
                  pl="10"
                  minLength={2}
                  {...register('description', { required: true })}
                />
              </InputGroup>
              {errors.description ? (
                <FormHelperText color="red.500">{t('messages.required_field')}</FormHelperText>
              ) : (
                <FormHelperText>{t('category_form.desc_hint')}</FormHelperText>
              )}
            </FormControl>
            <Button
              disabled={isLoading || isDeleteLoading}
              variant="fade"
              type="submit"
              width="full"
              mb="3"
            >
              {t('category_form.submit')}
            </Button>
            {
              category && (
                <Popover placement='top'>
                  {({ onClose: onPopoverClose }) => (
                    <>
                      <PopoverTrigger>
                        <Button
                          disabled={isLoading || isDeleteLoading}
                          width="full"
                          type="button"
                          colorScheme="red"
                          mb="3"
                        >
                          {t('category_form.remove')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent maxW="200px">
                        <PopoverHeader fontWeight='semibold'>{t('category_form.remove_confirmation')}</PopoverHeader>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverBody>
                          {t('category_form.remove_label')}
                        </PopoverBody>
                        <PopoverFooter display='flex' justifyContent='flex-end'>
                          <ButtonGroup size='sm'>
                            <Button
                              disabled={isLoading || isDeleteLoading}
                              variant='outline'
                              onClick={onPopoverClose}
                            >
                              {t('category_form.no')}
                            </Button>
                            <Button
                              disabled={isLoading || isDeleteLoading}
                              colorScheme='red'
                              onClick={async () => {
                                onPopoverClose()
                                await onRemoveSubmit()
                              }}
                            >
                              {t('category_form.yes')}
                            </Button>
                          </ButtonGroup>
                        </PopoverFooter>
                      </PopoverContent>
                    </>
                  )}
                </Popover>
              )
            }
            <Button
              disabled={isLoading || isDeleteLoading}
              colorScheme="secondary"
              type="button"
              width="full"
              mb="3"
              onClick={isLoading ? () => {} : onClose}
            >
              {t('category_form.cancel')}
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
