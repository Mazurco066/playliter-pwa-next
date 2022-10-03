// Dependencies
import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'

// Types
import type { CategoryType } from 'domain/models'

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
  Textarea
} from '@chakra-ui/react'

// Component
export const CategoryForm: FC<{
  category?: CategoryType | null
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void
}> = ({
  category = null,
  isOpen,
  onClose
}) => {
  // Hooks
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

  // Actions
  const onSubmit = async (data: any) => {
    console.log(data)
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
            >
              <FormLabel>Nome da categoria</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaSignature} />}
                />
                <Input
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
            >
              <FormLabel>Descrição</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaFileSignature} />}
                />
                <Textarea
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
              variant="fade"
              type="submit"
              width="full"
              mb="3"
            >
              Salvar
            </Button>
            {
              category && (
                <Button
                  colorScheme="red"
                  type="button"
                  width="full"
                  mb="3"
                >
                  Remover
                </Button>
              )
            }
            <Button
              colorScheme="secondary"
              type="button"
              width="full"
              mb="3"
              onClick={onClose}
            >
              Cancelar
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
