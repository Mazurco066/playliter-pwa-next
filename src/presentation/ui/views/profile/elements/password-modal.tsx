// Dependencies
import { FC, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useForm } from 'react-hook-form'

// Components
import { FaCalendar, FaKey } from 'react-icons/fa'
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'

// Component
export const PasswordModal: FC<{
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  isLoading?: boolean,
  onConfirmCallback?: (data: {
    new_password: string;
    old_password: string;
  }) => void
}> = ({
  isOpen,
  onClose,
  isLoading = false,
  onConfirmCallback = () => { }
}) => {
    // Hooks
    const { t } = useTranslation('profile')
    const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
    } = useForm()

    // Actions
    const onSubmit = async (data: any) => {
      onConfirmCallback(data)
    }

    // Clear field data
    useEffect(() => {
      if (isOpen) {
        setValue('new_password', '')
        setValue('old_password', '')
      }
    }, [isOpen])

    // JSX
    return (
      <Modal
        size="sm"
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent
          mx="4"
        >
          <ModalHeader>
            {t('form.title')}
          </ModalHeader>
          <ModalCloseButton
            isDisabled={isLoading}
          />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl isRequired mb="5" isDisabled={isLoading}>
                <FormLabel>{t('form.old_password_label')}</FormLabel>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                  >
                    <Icon as={FaKey} />
                  </InputLeftElement>
                  <Input
                    type="password"
                    placeholder={t('form.old_password_placeholder')}
                    minLength={8}
                    {...register('old_password', { minLength: 8, required: true })}
                  />
                </InputGroup>
                {errors.old_password ? (
                  <FormHelperText color="red.500">
                    {errors.old_password.type === 'minLength' ? t('messages.min_length_msg') : t('messages.required_field_msg')}
                  </FormHelperText>
                ) : (
                  <FormHelperText>{t('form.old_password_hint')}</FormHelperText>
                )}
              </FormControl>
              <FormControl isRequired mb="5" isDisabled={isLoading}>
                <FormLabel>{t('form.new_password_label')}</FormLabel>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                  >
                    <Icon as={FaKey} />
                  </InputLeftElement>
                  <Input
                    type="password"
                    placeholder={t('form.new_password_placeholder')}
                    minLength={8}
                    {...register('new_password', { minLength: 8, required: true })}
                  />
                </InputGroup>
                {errors.new_password ? (
                  <FormHelperText color="red.500">
                    {errors.new_password.type === 'minLength'? t('messages.min_length_msg') : t('messages.required_field_msg')}
                  </FormHelperText>
                ) : (
                  <FormHelperText>{t('form.new_password_hint')}</FormHelperText>
                )}
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={onClose}
              isDisabled={isLoading}
            >
              {t('form.cancel_action')}
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit(onSubmit)}
              isDisabled={isLoading}
            >
              {t('form.confirm_action')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }