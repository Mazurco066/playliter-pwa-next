// Dependencies
import { FC } from 'react'
import { truncateSrt } from 'presentation/utils'

// Types
import type { CategoryType } from 'domain/models'

// Components
import { FaPaperclip } from 'react-icons/fa'
import {
  Box,
  Divider,
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
      flexDirection="column"
      position="relative"
      bg={bgBox}
      onClick={() => onClick(category)}
      _hover={{
        opacity: "0.8"
      }}
      p="2"
    >
      <Flex
        alignItems="center"
        justifyContent="center"
      >
        <Box
          bgGradient="linear(to-b, secondary.600, primary.600)"
          w="32px"
          h="32px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          rounded="full"
          color="gray.100"
        >
          <FaPaperclip />
        </Box>
      </Flex>
      <Divider
        mt="3"
        mb="4"
      />
      <Text
        fontWeight="bold"
        textAlign="center"
      >
        {category.title}
      </Text>
    </Box>
  )
}
