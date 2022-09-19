// Dependencies
import { FC } from 'react'

// Types
import type { BandType } from 'domain/models'

// Components
import {
  Box,
  Image,
  Tooltip,
  useColorModeValue
} from '@chakra-ui/react'

// Pending show item component
export const BandItem: FC<{
  band: BandType
  onClick?: () => void
}> = ({
  band,
  onClick = () => {}
}) => {
  // Color Hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')

  // JSX
  return (
    <Tooltip label={band.title}>
      <Box
        data-group
        w="64px"
        h="64px"
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
        <Image
          src={band.logo}
          alt={band.title}
          h="full"
          w="full"
        />
      </Box>
    </Tooltip>
  )
}