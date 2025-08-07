// Dependencies
import { FC, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { requestClient } from 'infra/services/http'

// Components
import {
  Button,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  useToast,
  Icon,
  FormHelperText
} from '@chakra-ui/react'
import { FaEnvelope } from 'react-icons/fa'
import { useForm } from 'react-hook-form'

// Component
export const InviteMember: FC<{
  bandId: string,
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  members: string[]
}> = ({
  bandId,
  isOpen,
  onClose,
}) => {
    // Hooks
    const toast = useToast()
    const { register, handleSubmit, formState: { errors }, setValue } = useForm()

    // Add member category
    const { isLoading, mutateAsync } = useMutation((data: any) => {
      return requestClient('/api/bands/invite_member', 'post', data)
    })

    // Actions
    const onSubmit = async (data: any) => {
      const response = await mutateAsync({ bandId, email: data.email })

      if (![200, 201].includes(response.status)) {
        let msg = `Ocorreu um erro e um ou mais contas selecionadas podem não ter recebido o convite! Tente novamente mais tarde.`

        if (response.data.message === 'User not found') {
          msg = 'Não há usuários válidos com esse E-mail para receber o convite!'
        }

        if (response.data.message === 'User is already a member of this band') {
          msg = 'Esse usuário já é um membro ativo dessa banda!'
        }

        // Notify users about error
        toast({
          title: 'Ops!',
          description: msg,
          status: 'warning',
          duration: 2000,
          isClosable: true
        })
        onClose()
      } else {
        // Notify user about invites sent
        toast({
          title: 'Integrante convidado!',
          description: `A conta selecionada foi convidada a se juntar a banda!`,
          status: 'success',
          duration: 2000,
          isClosable: true
        })
        onClose()
      }
    }

    // Effects
    useEffect(() => {
      if (isOpen) {
        setValue('email', '')
      }
    }, [isOpen, setValue])

    //JSX
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
            Convidar integrante
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Text mb="3">
                Insira o E-mail do usuário que você deseja convidar para banda
              </Text>
              <FormControl isRequired mb="5" isDisabled={isLoading}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                  >
                    <Icon as={FaEnvelope} />
                  </InputLeftElement>
                  <Input
                    type="email"
                    placeholder={"johndoe@email.com"}
                    {...register('email', { required: true })}
                  />
                </InputGroup>
                {errors.email ? (
                  <FormHelperText color="red.500">{"Campo requerido"}</FormHelperText>
                ) : (
                  <FormHelperText>E-mail do usuário</FormHelperText>
                )}
              </FormControl>
              <Button
                disabled={isLoading}
                variant="fade"
                type="submit"
                width="full"
                mb="3"
              >
                Convidar
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    )
  }
