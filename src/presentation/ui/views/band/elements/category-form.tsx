// Dependencies
import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
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

// Generic msg
const genericMsg: UseToastOptions = {
  title: 'Erro interno.',
  description: 'Um erro inesperado ocorreu! Entre em contato com algum administrador do App.',
  status: 'error',
  duration: 5000,
  isClosable: true
}

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
        title: 'Sucesso!',
        description: `Sua categoria de nome ${response?.data?.title} foi salva com sucesso!`,
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

  const onRemoveSubmit = async () => {
    // Destruct data
    const { id } = category || {}

    // Request api via server side
    const response = await deleteAsync({ id })

    // Verify if request was successfull
    if ([200, 201].includes(response.status)) {
      // Notify user about created band
      toast({
        title: 'Sucesso!',
        description: `Sua categoria de nome ${category?.title} foi removida com sucesso!`,
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
          title: 'Ops.. Categoria não encontrada!',
          description: 'A categoria selecionada não foi encontrada em nossa base de dados!',     
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
              : 'Nova Categoria'
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
              <FormLabel>Nome da categoria</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaSignature} />}
                />
                <Input
                  disabled={isLoading || isDeleteLoading}
                  type="text"
                  placeholder="Nome da categoria"
                  minLength={2}
                  {...register('title', { required: true })}
                />
              </InputGroup>
              {errors.name ? (
                <FormHelperText color="red.500">Esse campo é requerido.</FormHelperText>
              ) : (
                <FormHelperText>Insira um nome para a categoria.</FormHelperText>
              )}
            </FormControl>
            <FormControl
              isRequired
              mb="5"
              isDisabled={isLoading || isDeleteLoading}
            >
              <FormLabel>Descrição</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaFileSignature} />}
                />
                <Textarea
                  disabled={isLoading || isDeleteLoading}
                  placeholder="Descrição da categoria"
                  pl="10"
                  minLength={2}
                  {...register('description', { required: true })}
                />
              </InputGroup>
              {errors.name ? (
                <FormHelperText color="red.500">Esse campo é requerido.</FormHelperText>
              ) : (
                <FormHelperText>Insira uma breve descrição para a categoria.</FormHelperText>
              )}
            </FormControl>
            <Button
              disabled={isLoading || isDeleteLoading}
              variant="fade"
              type="submit"
              width="full"
              mb="3"
            >
              Salvar
            </Button>
            {
              category && (
                <Popover placement='top'>
                  {({ onClose: onPopoverClose }) => (
                    <>
                      <PopoverTrigger>
                        <Button
                          width="full"
                          type="button"
                          colorScheme="red"
                          mb="3"
                        >
                          Remover
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent maxW="200px">
                        <PopoverHeader fontWeight='semibold'>Confirmação</PopoverHeader>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverBody>
                          Deseja realmente remover essa categoria?
                        </PopoverBody>
                        <PopoverFooter display='flex' justifyContent='flex-end'>
                          <ButtonGroup size='sm'>
                            <Button
                              disabled={isLoading || isDeleteLoading}
                              variant='outline'
                              onClick={onPopoverClose}
                            >
                              Não
                            </Button>
                            <Button
                              disabled={isLoading || isDeleteLoading}
                              colorScheme='red'
                              onClick={async () => {
                                onPopoverClose()
                                await onRemoveSubmit()
                              }}
                            >
                              Sim
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
              Cancelar
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
