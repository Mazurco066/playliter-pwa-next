// Dependencies
import { FC } from 'react'

// Types
import type { SongType } from 'domain/models'

// Components
import {
  Badge,
  Box,
  Flex,
  Image,
  useColorModeValue,
  Text
} from '@chakra-ui/react'

// Component
export const SongItemMinified: FC<{
  song: SongType,
  onClick?: () => void
}> = ({
  song,
  onClick = () => {}
}) => {
  // Color Hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')

  // Destruct song data
  const { title, category: { title: categoryName} } = song

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
      onClick={onClick}
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
          onClick={onClick}
          _hover={{
            opacity: "0.8"
          }}
        >
          <Image
            src="../img/arts/white/radio-waves.svg"
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
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Text
            fontWeight="bold"
            textAlign="center"
            mb="3"
          >
            {title}
          </Text>
          <Badge
            colorScheme="secondary"
            textAlign="center"
          >
            {categoryName}
          </Badge>
        </Flex>
      </Box>
    </Box>
  )
}
