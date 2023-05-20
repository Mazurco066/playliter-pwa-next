// Dependencies
import { FC } from 'react'
import { useTranslation } from 'next-i18next'

// Types
import type { SongType } from 'domain/models'

// Components
import {
  Box,
  GridItem,
  Image,
  useColorModeValue,
  Text,
  Tooltip
} from '@chakra-ui/react'

// Component
export const SongItem: FC<{
  song: SongType,
  onClick?: () => void
}> = ({
  song,
  onClick = () => {}
}) => {
  // Hooks
  const { t } = useTranslation('songs')

  // Color Hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')

  // Destruct song data
  const { title, writter, band: { title: publisher, logo } } = song

  // JSX
  return (
    <GridItem
      data-group
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
        height='full'
        display="flex"
        flexDirection="row"
        alignItems="center"
        borderRadius="lg"
        mb="3"
      >
        <Box
          width="48px"
          height="full"
          bgGradient="linear(to-b, secondary.600, primary.600)"
          flex="0 0 auto"
          position="relative"
          display="flex"
          alignItems="center"
          mr="8"
        >
          <Image
            src={logo}
            alt="img"
            borderRadius="full"
            h="48px"
            w="48px"
            position="absolute"
            right="-24px"
          />
        </Box>
        <Box
          height="full"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="flex-start"
          flexGrow="1"
          pr="2"
        >
          <Text
            fontWeight="bold"
            fontSize="md"
          >
            {title}
          </Text>
          <Text
            fontSize="sm"
            fontWeight="bold"
            color="secondary.500"
          >
            {writter}
          </Text>
          <Text
            fontSize="xs"
          >
            {`${t('published')}${publisher}`}
          </Text>
        </Box>
      </Box>
    </GridItem>
  )
}
