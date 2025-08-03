// Dependencies
import { FC, useState, useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { requestClient } from 'infra/services/http'

// Types
import type { AccountType } from 'domain/models'

// Components
import { SearchIcon } from '@chakra-ui/icons'
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControl,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Skeleton,
  Text,
  useToast,
  UseToastOptions,
  VStack
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
  members
}) => {
  // Hooks
  const toast = useToast()
  const [ search, setSearch ] = useState<string>('')
  const [ checkedAccounts, setCheckedAccounts ] = useState<string[]>([])

  // Accounts request
  // const {
  //   refetch,
  //   data: accounts,
  //   isLoading: isAccountsLoading
  // } = useQuery(
  //   ['app-accounts'],
  //   () => requestClient('/api/accounts/list', 'get')
  // )

  const refetch = () => {}
  const accounts = { data: [] }
  const isAccountsLoading = false

  // Add member category
  const { isLoading, mutateAsync } = useMutation((data: any) => {
    return requestClient('/api/bands/invite_member', 'post', data)
  })

  // Effects
  useEffect(() => {
    if (isOpen) {
      refetch()
      setCheckedAccounts([])
    } 
  }, [isOpen])

  // Computed data
  const filteredAccounts = (accounts && accounts.data) 
    ? accounts.data.filter(({ id, name }: AccountType) =>
      name.toLowerCase().includes(search.toLowerCase()) && 
      !members.includes(id)
    )
    : []

  // Actions
  const addMember = async (bandId: string, members: string[]) => {
    // Send invites to selected accounts
    const responses = await Promise.all(
      members.map(async (id: string) => mutateAsync({ accountId: id, bandId }))
    )

    // Verify if any invite failed to send
    const hasErrors = responses.filter(r => r.status > 400).length !== 0
    if (hasErrors) {
      // Notify users about error
      toast({
        title: 'Ops!',
        description: `Ocorreu um erro e um ou mais contas selecionadas podem não ter recebido o convite! Tente novamente mais tarde.`,
        status: 'warning',
        duration: 2000,
        isClosable: true
      })
      onClose()
    } else {
      // Notify user about invites sent
      toast({
        title: 'Novos integrantes convidados!',
        description: `As contas selecionadas foram convidadas a se juntar a banda!`,
        status: 'success',
        duration: 2000,
        isClosable: true
      })
      onClose()
    }
  }

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
        { accounts && !isAccountsLoading ? (
          <>
            { accounts.data?.length > 0 ? (
              <>
                <FormControl mb="5">
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<SearchIcon />}
                    />
                    <Input
                      type="text"
                      placeholder="Buscar..."
                      minLength={2}
                      value={search}
                      onChange={e => {
                        const inputValue = e.target.value
                        setSearch(inputValue)
                      }}
                    />
                  </InputGroup>
                </FormControl>
                <VStack
                  maxHeight="256px"
                  overflowY="auto"
                  mb="3"
                >
                  { filteredAccounts.length > 0 ? (
                    <>
                      { filteredAccounts.map((acc: AccountType) => (
                        <Checkbox
                          width="full"
                          key={acc.id}
                          value={acc.id}
                          isChecked={checkedAccounts.includes(acc.id)}
                          onChange={() => {
                            if (checkedAccounts.includes(acc.id)) {
                              setCheckedAccounts(checkedAccounts.filter((_acc: string) => _acc !== acc.id))
                            } else {
                              setCheckedAccounts([ ...checkedAccounts, acc.id ])
                            }
                          }}
                        >
                          <Flex
                            alignItems="center"
                            width="full"
                          >
                            <Box pl="2">
                              <Avatar 
                                size="sm"
                                src={acc.avatar}
                                name={acc.name}
                              />
                            </Box>
                            <Box pl="3">
                              <Heading size="sm" as="h5">
                                {acc.name}
                              </Heading>
                            </Box>
                          </Flex>
                        </Checkbox>
                      )) }
                    </>
                  ) : (
                    <Text>
                      Não há contas correspondentes ao filtro informado.
                    </Text>
                  ) }
                </VStack>
                <Button
                  disabled={isLoading || isAccountsLoading}
                  variant="fade"
                  width="full"
                  onClick={(isLoading || isAccountsLoading) ? () => {} : () => addMember(bandId, checkedAccounts)}
                >
                  Convidar Selecionados
                </Button>
              </>
            ) : (
              <Text>
                Não há outras contas cadastradas no aplicativo no momento. Convide seus amigos a se criar sua conta no Playliter.
              </Text>
            ) }
          </>
        ) : (
          <>
            <VStack
              maxHeight="256px"
              overflowY="auto"
              mb="3"
            >
              <Skeleton height="32px" borderRadius="lg" mb="2" />
              <Skeleton height="32px" borderRadius="lg" mb="2" />
              <Skeleton height="32px" borderRadius="lg" mb="2" />
            </VStack>
          </>
        ) }
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
