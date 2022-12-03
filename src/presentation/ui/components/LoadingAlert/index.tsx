// Dependencies
import { FC } from 'react'
import { useTranslation } from 'next-i18next'

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
  // Hooks
  const { t: common } = useTranslation('common')

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
            <Text color="gray.100">
              {title || common('loading_alert.title')}
            </Text>
          </Flex>
        </ModalHeader>
        <ModalBody pb={6}>
          <Text color="gray.100">
            {message || common('loading_alert.message')}
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}