// Dependencies
import dynamic from 'next/dynamic'
import { FC } from 'react'
import { useRouter } from 'next/router'

// Components
const AnimatedBg = dynamic(() => import('./bg-animated'), { ssr: false, })
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Text,
  useBreakpointValue
} from '@chakra-ui/react'

// Component
export const Hero: FC = () => {
  // Hooks
  const router = useRouter()

  // Styles
  const heroDirection: any = useBreakpointValue({ base: 'column-reverse', md: 'row' })
  const heroGap: any = useBreakpointValue({ base: '2.5rem', md: '4rem' })
  const heroJustify: any = useBreakpointValue({ base: 'center', md: 'center' })

  // JSX
  return (
    <Box
      id="playliter-hero"
      height="calc(100vh - 80px)"
      bgGradient="linear(to-br, secondary.600, primary.600)"
      color="gray.100"
      position="relative"
    >
      <AnimatedBg />
      <Container maxWidth="6xl" height="full">
        <Flex
          direction={heroDirection}
          height="full"
          alignItems="center"
          justifyContent={heroJustify}
          gap={heroGap}
        >
          <Box width="fit-content">
            <Box maxWidth="300px">
              <Text
                fontSize="sm"
                textTransform="uppercase"
                fontWeight="medium"
                color="gray.50"
                mb="2"
              >
                Gerencie o repertório de sua banda
              </Text>
              <Heading as="h2" size="lg" mb="2">
                Utilizando o Playliter
              </Heading>
              <Text fontSize="md" mb="6">
                Aqui você encontra ferramentas para automatizar a organização de suas apresentações.
              </Text>
              <Button width="full" onClick={() => router.push('/login')}>
                Acessar Aplicativo
              </Button>
            </Box>
          </Box>
          <Box width="fit-content">
            <Box maxWidth="300px">
              <Image
                src="/img/logo.svg"
                alt="Playliter logo"
              />
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}
