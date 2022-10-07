// Dependencies
import { FC } from 'react'

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
  title = 'Tem Certeza?',
  message = 'Essa ação é permanente!',
  onConfirm = () => {}
}) => {
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
          {title}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Text>
            {message}
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
            Continuar
          </Button>
          <Button
            colorScheme="red"
            onClick={() => {
              onClose()
            }}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
