// Dependencies
import { FC } from 'react'

// Components
import {
  Box,
  Flex,
  Heading,
  Image,
  Text
} from '@chakra-ui/react'

// Component
export const Feature: FC<{
  title: string,
  description: string,
  image: string
}> = ({
  title,
  description,
  image
}) => {
  // JSX
  return (
    <Box
      backgroundImage="/img/arts/musical-note.png"
      bgGradient="linear(to-b, secondary.600, primary.600)"
      width="full"
      borderRadius="lg"
      py="7"
      px="4"
      color="gray.100"
    >
      <Flex
        justifyContent="center"
        alignItems="center"
        direction="column"
      >
        <Box
          bgColor="blackAlpha.400"
          width="90px"
          height="90px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          overflow="hidden"
          rounded="full"
          mb="3"
        >
          <Image
            src={image}
            alt="Musical note"
          />
        </Box>
        <Heading
          as="h3"
          size="md"
          textTransform="uppercase"
          mb="5"
          textAlign="center"
        >
          {title}
        </Heading>
        <Text
          textAlign="center"
          fontSize="md"
        >
          {description}
        </Text>
      </Flex>
    </Box>
  )
}
