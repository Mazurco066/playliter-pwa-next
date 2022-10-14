// Dependencies
import { FC } from 'react'

// Components
import {
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text
} from '@chakra-ui/react'

// Component
export const LoadingAlert: FC<{
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  title?: string,
  message?: string
}> = ({
  isOpen,
  onClose = () => {},
  title = 'Por favor aguarde',
  message = 'Carregando...'
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
      <ModalContent bgGradient="linear(to-b, secondary.600, primary.600)">
        <ModalHeader>
          <Flex gap="1rem" alignItems="center">
            <Spinner color="gray.100" size="md" />
            <Text color="gray.100">{title}</Text>
          </Flex>
        </ModalHeader>
        <ModalBody pb={6}>
          <Text color="gray.100">
            {message}
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}