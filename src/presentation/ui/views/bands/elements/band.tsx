// Dependencies
import { FC } from 'react'
import { useUser } from 'infra/services/session'

// Types
import type { BandType } from 'domain/models'

// Components
import {
  Badge,
  Box,
  GridItem,
  Heading,
  Image,
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
  // Hooks
  const { user } = useUser()

  // Color Hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')
  const colorBorder = useColorModeValue('gray.50', 'gray.800')

  // Destruct band data
  const { admins, title, logo, owner } = band

  // Utils
  const role = owner.id === user?.id 
    ? 'Fundador'
    : admins.find(a => a.id === user?.id) 
      ? 'Admin' 
      : 'Membro' 

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
        height="64px"
        bgGradient="linear(to-b, secondary.600, primary.600)"
        borderTopRadius="lg"
        position="relative"
        mb="5"
      >
        <Badge
          variant="outline"
          colorScheme="gray"
          color="white"
          transition="all 0.3s"
          position="absolute"
          top="1.5"
          right="1.5"
        >
          { role }
        </Badge>
        <Box
          w="64px"
          h="64px"
          borderRadius="full"
          overflow="hidden"
          cursor="pointer"
          transition="all 0.3s"
          position="absolute"
          top="32px"
          left="0"
          right="0"
          margin="0 auto"
          border="2px solid"
          borderColor={colorBorder}
          bg={bgBox}
          onClick={onClick}
          _hover={{
            opacity: "0.8"
          }}
        >
          <Image
            src={logo}
            alt={title}
            h="full"
            w="full"
          />
        </Box>
      </Box>
      <Box py="5" px="3">
        <Heading
          mb="1"
          as="h4"
          size="sm"
          transition="all 0.3s"
        >
          {title}
        </Heading>
      </Box>
    </GridItem>
  )
}