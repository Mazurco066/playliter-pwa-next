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
  const { title, writter, band: { title: publisher } } = song

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
            src="img/arts/white/radio-waves.svg"
            alt="img"
            h="full"
            w="full"
          />
        </Box>
      </Box>
      <Tooltip label={`${t('published')}${publisher}`}>
        <Box
          px="3"
          py="4"
          borderBottomRadius="lg"
        >
          <Text
            fontWeight="bold"
            textAlign="center"
          >
            {title}
          </Text>
          <Text
            textAlign="center"
          >
            {writter}
          </Text>
        </Box>
      </Tooltip>
    </GridItem>
  )
}
