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
  Link,
  Text,
  useColorModeValue
} from '@chakra-ui/react'

// Component props
interface IBottomNavigation {
  navigation: BottomNav[]
}

// BottomNavigation component
export const BottomNavigation: FC<IBottomNavigation> = ({ navigation }) => {
  // Hooks
  const router = useRouter()

  // Color hooks
  const colorNormal = useColorModeValue('gray.100', 'gray.100')
  const colorBorder = useColorModeValue('gray.100', 'gray.900')

  // Utils
  const currentRoute = router.route

  // JSX
  return (
    <Container
      height="full"
      bgGradient="linear(to-b, secondary.600, primary.600)"
      borderTopRadius="2xl"
      maxWidth="6xl"
      sx={{ '@media print': { display: 'none' } }}
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
              _hover={{
                textDecoration: "none"
              }}
            >
              {
                activePaths.some(item => currentRoute.includes(item)) ? (
                  <Flex
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                    zIndex={20}
                    mb="10"
                  >
                    <Flex
                      rounded="full"
                      width="56px"
                      height="56px"
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                      border="2px"
                      borderColor={colorBorder}
                      bgColor="secondary.500"
                    >
                      <Icon
                        as={icon}
                        fontSize="2xl"
                        mb="1"
                        color={colorNormal}
                      />
                    </Flex>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color={colorNormal}
                      mt="2 "
                    >
                      {label}
                    </Text>
                  </Flex>
                ) : (
                  <Flex
                    direction="column"
                    alignItems="center"
                    cursor="pointer"
                  >
                    <Icon
                      as={icon}
                      fontSize="xl"
                      mb="1"
                      color={colorNormal}
                    />
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color={colorNormal}
                    >
                      {label}
                    </Text>
                  </Flex>
                )
              }
            </Link>
          )) 
        }
      </Flex>
    </Container>
  )
}