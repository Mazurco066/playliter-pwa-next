// Dependencies
import { FC } from 'react'

// Components
import {
  Badge,
  Box,
  Flex,
  Heading,
  Image,
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
      minWidth="162px"
      maxWidth="162px"
      position="relative"
      borderRadius="lg"
      cursor="pointer"
      transition="all 0.3s"
      bg={bgBox}
      onClick={onClick}
      _hover={{
        opacity: "0.8"
      }}
    >
      <Badge
        variant="outline"
        colorScheme="gray"
        color="white"
        transition="all 0.3s"
        position="absolute"
        top="1.5"
        right="1.5"
      >
        { date.split('T')[0].split('-').reverse().join('/') }
      </Badge>
      <Box
        minHeight="128px"
        bgGradient="linear(to-b, secondary.600, primary.600)"
        borderTopRadius="lg"
      >
        <Flex
          justifyContent="center"
          alignItems="center"
          pt="6"
        >
          <Image 
            src="img/arts/white/concert.svg"
            alt="Concert image"
            width="96px"
            height="96px"
            objectFit="cover"
          />
        </Flex>
      </Box>
      <Box py="5" px="3">
        <Heading
          mb="1"
          as="h4"
          size="sm"
          transition="all 0.3s"
        >
          {title}
        </Heading>
        <Text
          color="secondary.500"
          fontWeight="semibold"
          transition="all 0.3s"
        >
          {band}
        </Text>
      </Box>
    </Box>
  )
}