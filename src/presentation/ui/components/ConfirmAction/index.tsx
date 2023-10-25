// Dependencies
import { FC, useEffect, useState } from 'react'
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
  Spinner,
  Text
} from '@chakra-ui/react'

// Component
export const ConfirmAction: FC<{
  enableTimer?: boolean
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
}> = ({
  enableTimer = false,
  isOpen,
  onClose,
  title = '',
  message = '',
  onConfirm = () => {}
}) => {
  // Hooks
  const { t } = useTranslation('common')
  const [ canConfirm, setCanConfirm ] = useState<boolean>(true)

  // Effects
  useEffect(() => {
    if (enableTimer) {
      setCanConfirm(false)
      setTimeout(() => setCanConfirm(true), 4000)
    } else {
      setCanConfirm(true)
    }
  }, [enableTimer, isOpen])

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
            isDisabled={!canConfirm}
            colorScheme="primary"
            mr={3}
            onClick={() => {
              if (canConfirm) {
                onConfirm()
                onClose()
              }
            }}
          >
            { !canConfirm ? <Spinner size="sm" mr="2" /> : null }{t('confirm_action.confirm')}
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
