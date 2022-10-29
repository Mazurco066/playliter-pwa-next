// Dependencies
import { FC } from 'react'
import { useRouter } from 'next/router'

// Components
import Link from 'next/link'
import { FiLogIn } from 'react-icons/fi'
import { ArrowForwardIcon, Icon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Container,
  Flex,
  Image,
  Stack
} from '@chakra-ui/react'

// Component
export const LandingHeader: FC = () => {
  // Hooks
  const router = useRouter()

  // JSX
  return (
    <Box
      height="80px"
      bgColor="rgba(0, 0, 0, 0.3)"
      position="fixed"
      left="0"
      right="0"
      top="0"
    >
      <Container maxWidth="6xl" height="full">
        <Flex
          alignItems="center"
          justifyContent="space-between"
          height="full"
        >
          <Box
            maxWidth="3.5rem"
            _hover={{
              cursor: 'pointer'
            }}
          >
            <Link href="/">
              <Image
                src="/img/logo.svg"
                alt="logo"
              />
            </Link>
          </Box>
          <Stack direction='row' spacing={4}>
            <Button
              size="sm"
              leftIcon={<Icon as={FiLogIn} />}
              colorScheme='secondary'
              variant='solid'
              onClick={() => router.push('/login')}
            >
              Entrar
            </Button>
            <Button
              size="sm"
              rightIcon={<ArrowForwardIcon />}
              colorScheme='secondary'
              variant='outline'
              onClick={() => router.push('/signup')}
            >
              Cadastrar
            </Button>
          </Stack>
        </Flex>
      </Container>
    </Box>
  )
}
