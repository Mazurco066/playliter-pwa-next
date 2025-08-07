// Dependencies
import { FC } from 'react'
import { useTranslation } from 'next-i18next'
import { useUser } from 'infra/services/session'

// Types
import type { BandType } from 'domain/models'

// Components
import {
  Badge,
  Box,
  GridItem,
  Image,
  Text,
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
  const { t } = useTranslation('bands')

  // Color Hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')
  const colorBorder = useColorModeValue('gray.50', 'gray.800')

  // Destruct band data
  const { admins, title, logo, owner } = band

  // Utils
  const role = owner.userId === user?.id 
    ? t('roles.founder')
    : admins.find(a => a.userId === user?.id) 
      ? t('roles.admin')
      : t('roles.member')
  
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
        minHeight="12"
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
            alt={title}
            borderRadius="full"
            h="48px"
            w="48px"
            position="absolute"
            right="-24px"
            borderColor={colorBorder}
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
          pt="2"
          pb="2"
        >
          <Text
            fontWeight="bold"
            fontSize="md"
            mb="1"
          >
            {title}
          </Text>
          <Badge
            variant="outline"
            colorScheme="secondary"
            transition="all 0.3s"
          >
            { role }
          </Badge>
        </Box>
      </Box>
    </GridItem>
  )
}