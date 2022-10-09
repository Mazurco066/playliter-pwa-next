// Dependencies
import { FC } from 'react'
import { formatDate } from 'presentation/utils'

// Types
import type { ShowType } from 'domain/models'

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

// Default Component
export const ShowItem:FC<{
  show: ShowType,
  onClick?: (id: string) => void
}> = ({
  show,
  onClick = () => {}
}) => {
   // Destruct show data
   const { id, title, date } = show

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
            src="../img/arts/white/concert.svg"
            alt="img"
            h="32px"
            w="32px"
          />
        </Box>
        <Box
          flexGrow="1"
        >
          <Badge
            bgColor="primary.200"
            color="primary.700"
            borderRadius="sm"
            mb="1"
          >
            {formatDate(date)}
          </Badge>
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
