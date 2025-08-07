// Dependencies
import { FC } from 'react'
import { useTranslation } from 'next-i18next'
import { useForm } from 'react-hook-form'

// Components
import { FaCalendar } from 'react-icons/fa'
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
export const CloneConcertModal: FC<{
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  isLoading?: boolean,
  onConfirmCallback?: (date: string) => void
}> = ({
  isOpen,
  onClose,
  isLoading = false,
  onConfirmCallback = () => { }
}) => {
    // Hooks
    const { t } = useTranslation('concert')
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm()

    // Actions
    const onSubmit = async (data: any) => {
      onConfirmCallback(data.date)
    }

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
            {t('clone_modal.title')}
          </ModalHeader>
          <ModalCloseButton
            isDisabled={isLoading}
          />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl
                isDisabled={isLoading}
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
                    disabled={isLoading}
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
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={onClose}
              isDisabled={isLoading}
            >
              {t('clone_modal.cancel_action')}
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit(onSubmit)}
              isDisabled={isLoading}
            >
              {t('clone_modal.confirm_action')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }
