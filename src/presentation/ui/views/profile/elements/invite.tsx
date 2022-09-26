// Dependencies
import { FC } from 'react'

// Types
import type { InviteType } from 'domain/models'

// Components
import { FaUserPlus } from 'react-icons/fa'
import { Icon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  GridItem,
  Heading,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useColorModeValue
} from '@chakra-ui/react'

// Component
export const InviteItem: FC<{
  invite: InviteType,
  isLoading?: boolean,
  onResponse?: (response: string) => void
}> = ({
  invite,
  isLoading = false,
  onResponse = () => {}
}) => {
  // Color hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')

  // Destruct invite data
  const { band: { title: bandTitle } } = invite
 
  // JSX
  return (
    <GridItem>
      <Popover
        placement='bottom'
        closeOnBlur={false}
      >
        {({ onClose }) => (
          <>
            <PopoverTrigger>
              <Box
                py="5"
                px="5"
                bgColor={bgBox}
                borderRadius="lg"
                cursor="pointer"
                transition="all 0.3s"
                _hover={{
                  opacity: "0.7"
                }}
              >
                <Flex alignItems="center">
                  <Box
                    flex="0 0 auto"
                    mr="4"
                    display="flex"
                    alignItems="center"
                  >
                    <Icon as={FaUserPlus} fontSize="xl" />
                  </Box>
                  <Box flexGrow="1">
                    <Heading as="h4" size="sm" mb="1">
                      Você foi convidado
                    </Heading>
                    <Text>
                      a se juntar a banda{' '}
                      <Text as="strong" color="secondary.500">
                        {bandTitle}
                      </Text>
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </PopoverTrigger>
            <PopoverContent
              color='white'
              bgGradient="linear(to-b, secondary.600, primary.600)"
              borderColor='secondary.700'
            >
              <PopoverHeader pt={4} fontWeight='bold' border='0'>
                Responder convite
              </PopoverHeader>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                Deseja aceitar o convite e participar da banda {bandTitle}?
              </PopoverBody>
              <PopoverFooter
                border='0'
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                pb={4}
              >
                <ButtonGroup size='sm'>
                  <Button
                    disabled={isLoading}
                    colorScheme='green'
                    onClick={() => {
                      onResponse('accepted')
                      onClose()
                    }}
                  >
                    Aceitar
                  </Button>
                  <Button
                    disabled={isLoading}
                    colorScheme='red'
                    onClick={() => {
                      onResponse('denied')
                      onClose()
                    }}
                  >
                    Negar
                  </Button>
                </ButtonGroup>
              </PopoverFooter>
            </PopoverContent>
          </>
        )}
      </Popover>
    </GridItem>
  )
}
