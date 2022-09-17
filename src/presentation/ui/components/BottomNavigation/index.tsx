// Dependencies
import { FC } from 'react'
import { useRouter } from 'next/router'

// Components
import { Icon } from '@chakra-ui/icons'
import { FaCompactDisc, FaHome, FaUsers } from 'react-icons/fa'
import {
  Container,
  Flex,
  Divider,
  Link,
  Text,
  useColorModeValue
} from '@chakra-ui/react'

// Routes
const navigation: {
  label: string,
  icon: any,
  path: string
  activePaths: string[]
}[] = [
  {
    label: 'Bandas',
    icon: FaUsers,
    path: '/bands',
    activePaths: [
      '/bands'
    ]
  },
  {
    label: 'Home',
    icon: FaHome,
    path: '/home',
    activePaths: [
      '/home'
    ]
  },
  {
    label: 'Músicas',
    icon: FaCompactDisc,
    path: '/songs',
    activePaths: [
      '/songs'
    ]
  }
]

// BottomNavigation component
export const BottomNavigation: FC = () => {
  // Hooks
  const router = useRouter()

  // Color hooks
  const colorActive = useColorModeValue('primary.500', 'secondary.500')
  const colorNormal = useColorModeValue('gray.900', 'gray.100')

  // Utils
  const currentRoute = router.route
  console.log('[deb]', currentRoute)

  // JSX
  return (
    <Container height="full">
      <Divider orientation="horizontal" />
      <Flex
        height="full"
        alignItems="center" 
        justifyContent="space-around"
      >
        {
          navigation.map(({
            label,
            icon,
            path,
            activePaths
          }: {
            label: string,
            icon: any,
            path: string,
            activePaths: string[]
          }, i) => (
            <Link
              key={i}
              href={path}
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