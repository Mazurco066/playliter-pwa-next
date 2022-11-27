// Dependencies
import { FC } from 'react'
import { truncateSrt } from 'presentation/utils'

// Types
import type { CategoryType } from 'domain/models'

// Components
import {
  Box,
  Flex,
  Image,
  Text,
  useColorModeValue
} from '@chakra-ui/react'

// Default component
export const CategoryItem:FC<{
  category: CategoryType,
  onClick?: (category: CategoryType) => void
}> = ({
  category,
  onClick = () => {}
}) => {
   // Destruct show data
   const { title, description } = category

  // JSX
  return (
    <Box
      data-group
      bgColor="blackAlpha.500"
      borderRadius="lg"
      cursor="pointer"
      transition="all 0.3s"
      width="full"
      p="3"
      position="relative"
      onClick={() => onClick(category)}
      _hover={{
        opacity: "0.8"
      }}
    >
      <Flex
        alignItems="center"
      >
        <Box flex="0 0 auto" mr="4">
          <Image
            src="/img/arts/white/swing.svg"
            alt="img"
            h="32px"
            w="32px"
          />
        </Box>
        <Box
          flexGrow="1"
        >
          <Text
            fontWeight="bold"
            color="gray.100"
          >
            {title}
          </Text>
          <Text>
            {truncateSrt(description, 75)}
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}

// Component
export const CategoryItemMinified: FC<{
  category: CategoryType,
  onClick?: (category: CategoryType) => void
}> = ({
  category,
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
      borderRadius="lg"
      overflow="hidden"
      cursor="pointer"
      transition="all 0.3s"
      bg={bgBox}
      onClick={() => onClick(category)}
      _hover={{
        opacity: "0.8"
      }}
    >
      <Box
        height="32px"
        bgGradient="linear(to-b, secondary.600, primary.600)"
        borderTopRadius="lg"
        position="relative"
        mb="3"
      >
        <Box
          w="48px"
          h="48px"
          borderRadius="full"
          overflow="hidden"
          cursor="pointer"
          transition="all 0.3s"
          position="absolute"
          top="8px"
          left="0"
          right="0"
          margin="0 auto"
          _hover={{
            opacity: "0.8"
          }}
        >
          <Image
            src="/img/arts/white/swing.svg"
            alt="img"
            h="full"
            w="full"
          />
        </Box>
      </Box>
      <Box
        px="3"
        py="4"
        borderBottomRadius="lg"
      >
        <Text
          fontWeight="bold"
          textAlign="center"
          mb="3"
        >
          {category.title}
        </Text>
      </Box>
    </Box>
  )
}
