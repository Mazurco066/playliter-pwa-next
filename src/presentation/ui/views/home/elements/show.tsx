// Dependencies
import { FC } from 'react'

// Components
import {
  Badge,
  Box,
  Flex,
  Heading,
  Text,
  useColorModeValue
} from '@chakra-ui/react'

// Pending show item component
export const ShowItem: FC<{
  title: string,
  band: string,
  date: string,
  onClick?: () => void
}> = ({
  title,
  band,
  date,
  onClick = () => {}
}) => {
  // Color Hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')

  // JSX
  return (
    <Box
      data-group
      p="5"
      position="relative"
      borderRadius="lg"
      cursor="pointer"
      transition="all 0.3s"
      bg={bgBox}
      onClick={onClick}
      _hover={{
        bgGradient: 'linear(to-l, secondary.600, primary.600)'
      }}
    >
      <Flex alignItems="center">
        <Box flexGrow="1">
          <Badge
            variant="outline"
            colorScheme="primary"
            mb="2"
            transition="all 0.3s"
            _groupHover={{
              color: 'gray.100'
            }}
          >
            { date.split('T')[0].split('-').reverse().join('/') }
          </Badge>
          <Heading
            mb="1"
            as="h4"
            size="sm"
            transition="all 0.3s"
            _groupHover={{
              color: 'gray.100'
            }}
          >
            {title}
          </Heading>
          <Text
            color="secondary.500"
            fontWeight="semibold"
            transition="all 0.3s"
            _groupHover={{
              color: 'gray.100'
            }}
          >
            {band}
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}