// Dependencies
import { FC } from 'react'

// Components
import { WarningIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  Text,
  useColorModeValue
} from '@chakra-ui/react'

// Pending show item component
export const ConfirmationEmailNotification: FC<{
  onClick?: () => void
}> = ({
  onClick = () => {}
}) => {
  // Color Hooks
  const colorText = useColorModeValue('gray.900', 'gray.100')
  const bgInvite = useColorModeValue('gray.100', 'gray.900')

  // JSX
  return (
    <Box
      data-group
      mb="2"
      p="2"
      borderRadius="md"
      bg={bgInvite}
      cursor="pointer"
      onClick={onClick}
      _hover={{
        bgGradient: 'linear(to-l, secondary.600, primary.600)'
      }}
    >
      <Flex direction="column" alignItems="center">
        <WarningIcon
          mr="3"
          mb="1"
          color={colorText}
          _groupHover={{
            color: 'gray.100'
          }}
        />
        <Text
          textAlign="center"
          color={colorText}
          _groupHover={{
            color: 'gray.100'
          }}
        >
          O E-mail cadastrado em sua conta ainda não foi confirmado!
        </Text>
      </Flex>
    </Box>
  )
}
