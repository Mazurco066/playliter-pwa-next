// Dependencies
import { FC } from 'react'

// Types
import type { SongType } from 'domain/models'

// Components
import { FaCompactDisc } from 'react-icons/fa'
import {
  Badge,
  Box,
  Divider,
  Flex,
  Image,
  useColorModeValue,
  Text
} from '@chakra-ui/react'

// Default Component
export const SongItem:FC<{
  song: SongType,
  onClick?: (id: string) => void
}> = ({
  song,
  onClick = () => {}
}) => {
  // Destruct song data
  const { id, title, writter, category: { title: categoryTitle } } = song

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
      onClick={() => onClick(id)}
      _hover={{
        opacity: "0.8"
      }}
    >
      <Flex
        alignItems="center"
      >
        <Box flex="0 0 auto" mr="4">
          <Image
            src="/img/arts/white/audio-wave.svg"
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
            {writter}
          </Text>
          <Badge
            position='absolute'
            bottom="-2"
            right="2.5"
            bgColor="primary.200"
            color="primary.700"
            borderRadius="sm"
          >
            {categoryTitle}
          </Badge>
        </Box>
      </Flex>
    </Box>
  )
}

// Minified Component
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
      flexDirection="column"
      position="relative"
      bg={bgBox}
      onClick={onClick}
      _hover={{
        opacity: "0.8"
      }}
      p="2"
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
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
          <FaCompactDisc />
        </Box>
        <Badge
          colorScheme="secondary"
          textAlign="center"
          pt="1"
          rounded="md"
        >
          {categoryName}
        </Badge>
      </Flex>
      <Divider
        mt="3"
        mb="4"
      />
      <Text
        fontWeight="bold"
        textAlign="center"
      >
        {title}
      </Text>
    </Box>
  )
}
