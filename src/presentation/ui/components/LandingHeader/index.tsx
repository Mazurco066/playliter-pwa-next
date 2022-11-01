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
      bgColor="gray.900"
      position="fixed"
      left="0"
      right="0"
      top="0"
      zIndex="2"
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
              bgColor="secondary.500"
              color="gray.100"
              variant='solid'
              onClick={() => router.push('/login')}
              _hover={{
                bgColor: 'secondary.600'
              }}
            >
              Entrar
            </Button>
            <Button
              size="sm"
              rightIcon={<ArrowForwardIcon />}
              color="secondary.400"
              borderColor="secondary.500"
              variant='outline'
              onClick={() => router.push('/signup')}
              _hover={{
                bgColor: 'secondary.600',
                borderColor: 'secondary.600',
                color: 'gray.100'
              }}
            >
              Cadastrar
            </Button>
          </Stack>
        </Flex>
      </Container>
    </Box>
  )
}
