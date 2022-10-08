// Dependencies
import NextLink from 'next/link'
import { FC } from 'react'
import { useRouter } from 'next/router'

// Types
import type { BottomNav } from 'domain/types'

// Components
import { Icon } from '@chakra-ui/icons'
import {
  Container,
  Flex,
  Divider,
  Link,
  Text,
  useColorModeValue
} from '@chakra-ui/react'

// BottomNavigation component
export const BottomNavigation: FC<{
  navigation: BottomNav[]
}> = ({
  navigation
}) => {
  // Hooks
  const router = useRouter()

  // Color hooks
  const colorActive = useColorModeValue('secondary.500', 'secondary.500')
  const colorNormal = useColorModeValue('gray.900', 'gray.100')
  const bgNavigation = useColorModeValue('gray.50', 'gray.800')

  // Utils
  const currentRoute = router.route

  // JSX
  return (
    <Container
      height="full"
      bg={bgNavigation}
      borderTopRadius="2xl"
      maxWidth="6xl"
    >
      <Flex
        height="full"
        alignItems="center" 
        justifyContent="space-around"
      >
        {
          navigation.map(({ label, icon, path, activePaths }: BottomNav, i) => (
            <Link
              href={path}
              as={NextLink}
              key={i}
              cursor="pointer"
              _hover={{
                textDecoration: "none",
              }}
            >
              <Flex
                direction="column"
                alignItems="center"
              >
                <Icon
                  as={icon}
                  fontSize="xl"
                  mb="1"
                  color={activePaths.includes(currentRoute) ? colorActive : colorNormal}
                />
                <Text
                  fontSize="sm"
                  fontWeight={activePaths.includes(currentRoute) ? "bold" : "semibold"}
                >
                  {label}
                </Text>
              </Flex>
            </Link>
          )) 
        }
      </Flex>
    </Container>
  )
}