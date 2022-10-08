// Dependencies
import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
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

// Generic msg
const genericMsg: UseToastOptions = {
  title: 'Erro interno.',
  description: 'Um erro inesperado ocorreu! Entre em contato com algum administrador do App.',
  status: 'error',
  duration: 5000,
  isClosable: true
}

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
        title: 'Sucesso!',
        description: `Sua anotação foi salva com sucesso!`,
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
          title: 'Ops.. Há campos inválidos!',
          description: 'Por favor revise o preenchimento de seu formulário!',     
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
              : 'Nova anotação'
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
              <FormLabel>Título da anotação</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaSignature} />}
                />
                <Input
                  disabled={isLoading}
                  type="text"
                  placeholder="Título da anotação"
                  minLength={2}
                  {...register('title', { required: true })}
                />
              </InputGroup>
              {errors.title ? (
                <FormHelperText color="red.500">Esse campo é requerido.</FormHelperText>
              ) : (
                <FormHelperText>Insira um título para a anotação.</FormHelperText>
              )}
            </FormControl>
            <FormControl
              isRequired
              mb="5"
              isDisabled={isLoading}
            >
              <FormLabel>Conteúdo</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaFileSignature} />}
                />
                <Textarea
                  disabled={isLoading}
                  placeholder="Conteúdo"
                  pl="10"
                  minLength={2}
                  minHeight="200px"
                  {...register('data', { required: true })}
                />
              </InputGroup>
              {errors.data ? (
                <FormHelperText color="red.500">Esse campo é requerido.</FormHelperText>
              ) : (
                <FormHelperText>Insira o conteúdo de sua anotação.</FormHelperText>
              )}
            </FormControl>
            <Button
              disabled={isLoading}
              variant="fade"
              type="submit"
              width="full"
              mb="3"
            >
              Salvar
            </Button>
 
            <Button
              disabled={isLoading}
              colorScheme="secondary"
              type="button"
              width="full"
              mb="3"
              onClick={isLoading ? () => {} : onClose}
            >
              Cancelar
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
