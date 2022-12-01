// Dependencies
import { FC } from 'react'
import { useTranslation } from 'next-i18next'

// Components
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text
} from '@chakra-ui/react'

// Component
export const ConfirmAction: FC<{
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  title?: string,
  message?: string,
  confirmText?: string,
  cancelText?: string,
  onConfirm?: () => void
}> = ({
  isOpen,
  onClose,
  title = '',
  message = '',
  onConfirm = () => {}
}) => {
  // Hooks
  const { t } = useTranslation('common')

  // JSX
  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
      size="xs"
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {title ? title : t('confirm_action.title')}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Text>
            {message ? message : t('confirm_action.message')}
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="primary"
            mr={3}
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {t('confirm_action.confirm')}
          </Button>
          <Button
            colorScheme="red"
            onClick={() => {
              onClose()
            }}
          >
            {t('confirm_action.cancel')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
