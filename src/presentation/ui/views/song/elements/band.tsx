// Dependencies
import { FC } from 'react'

// Types
import type { BandType } from 'domain/models'

// Components
import {
  Box,
  Flex,
  Image,
  Text
} from '@chakra-ui/react'

// Components
export const BandItem: FC<{
  item: BandType,
  onClick?: (id: string) => void
}> = ({
  item,
  onClick = () => {}
}) => {
  // Destruct band data
  const { id, title, logo } = item

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
            src={logo}
            alt="img"
            h="32px"
            w="32px"
            borderRadius="full"
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
        </Box>
      </Flex>
    </Box>
  )
}