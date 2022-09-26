// Dependencies
import { FC } from 'react'

// Types
import type { InviteType } from 'domain/models'

// Components
import { EmailIcon } from '@chakra-ui/icons'
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
  onClick?: () => void,
  onResponse?: (response: string) => void
}> = ({
  invite,
  onClick = () => {},
  onResponse = () => {}
}) => {
  // Color hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')

  // Destruct invite data
  const { band: { title: bandTitle } } = invite
 
  // JSX
  return (
    <GridItem onClick={onClick}>
      <Popover
        placement='bottom'
        closeOnBlur={false}
      >
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
                <EmailIcon fontSize="xl" />
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
        <PopoverContent color='white' bg='blue.800' borderColor='blue.800'>
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
                onClick={() => onResponse('accepted')}
                colorScheme='green'
              >
                Aceitar
              </Button>
              <Button
                onClick={() => onResponse('denied')}
                colorScheme='red'
              >
                Negar
              </Button>
            </ButtonGroup>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    </GridItem>
  )
}
