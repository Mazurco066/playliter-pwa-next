// Dependencies
import { FC } from 'react'
import { useTranslation } from 'next-i18next'

// Components
import { FaGithub, FaPortrait, FaEnvelope } from 'react-icons/fa'
import { Icon } from '@chakra-ui/icons'
import {
  Box,
  Container,
  Flex,
  Image,
  Link,
  Text,
  useBreakpointValue
} from '@chakra-ui/react'

// Component
export const LandingFooter: FC = () => {
  // Hooks
  const { t } = useTranslation('landing')

  // Styles
  const footerDirection: any = useBreakpointValue({ base: 'column', md: 'row' })
  const footerJustify: any = useBreakpointValue({ base: 'center', md: 'space-between' })

  // JSX
  return (
    <Box
      as="footer"
      bgColor="rgb(33, 33, 33)"
      width="full"
    >
      <Container maxWidth="6xl">
        <Box
          display="flex"
          gap="1rem"
          padding="20px 0"
          flexDirection={footerDirection}
          justifyContent={footerJustify}
          alignItems="flex-start"
        >
          <Box
            flexGrow="1"
          >
            <Text
              fontSize="md"
              fontWeight="bold"
              textTransform="uppercase"
              mb="2"
              color="gray.100"
            >
              {t('footer.author_title')}
            </Text>
            <Text
              fontSize="sm"
              color="gray.100"
              mb="2"
            >
              {t('footer.credits')}
            </Text>
            <Flex
              alignItems="center"
              justifyContent="flex-start"
              gap="8px"
              mb="2"
            >
              <Box maxWidth="2.5rem">
                <Image 
                  src="img/me.png"
                  alt={t('footer.author')}
                />
              </Box>
              <Box>
                <Text
                  fontSize="md"
                  fontWeight="medium"
                  textTransform="uppercase"
                  color="gray.100"
                  mb="0"
                >
                  {t('footer.author')}
                </Text>
              </Box>
            </Flex>
            <Text
              fontSize="sm"
              color="gray.100"
              mb="2"
            >
              {t('footer.techs')}
            </Text>
            <Flex
              alignItems="center"
              justifyContent="flex-start"
              gap="8px"
            >
              <Box maxWidth="2.5rem">
                <Image 
                  src="img/react-logo.png"
                  alt="ReactJs"
                />
              </Box>
              <Box maxWidth="2.5rem">
                <Image 
                  src="img/next-logo.png"
                  alt="NextJs"
                />
              </Box>
            </Flex>
          </Box>
          <Box>
            <Text
              fontSize="md"
              fontWeight="bold"
              textTransform="uppercase"
              mb="2"
              color="gray.100"
            >
              {t('footer.contact')}
            </Text>
            <Link
              fontSize="md"
              fontWeight="medium"
              color="gray.100"
              href='mailto:mazurco066@gmail.com'
              display="flex"
              alignItems="center"
            >
              <Icon as={FaEnvelope} mr="2"/>mazurco066@gmail.com
            </Link>
          </Box>
          <Box>
            <Text
              fontSize="md"
              fontWeight="bold"
              textTransform="uppercase"
              mb="2"
              color="gray.100"
            >
              {t('footer.links')}
            </Text>
            <Link
              display="block"
              fontSize="md"
              fontWeight="medium"
              color="gray.100"
              href='https://github.com/Mazurco066'
              target="_blank"
              mb="1"
            >
              Github<Icon as={FaGithub} ml="2"/>
            </Link>
            <Link
              display="block"
              fontSize="md"
              fontWeight="medium"
              color="gray.100"
              href='https://github.com/Mazurco066/playliter-pwa-next'
              target="_blank"
              mb="1"
            >
              {t('footer.code')}<Icon as={FaGithub} ml="2"/>
            </Link>
            <Link
              display="block"
              fontSize="md"
              fontWeight="medium"
              color="gray.100"
              href='https://mazurco066.github.io'
              target="_blank"
            >
              {t('footer.portfolio')}<Icon as={FaPortrait} ml="2"/>
            </Link>
          </Box>
        </Box>
      </Container>
      <Box
        bgColor="rgb(18, 18, 18)"
        padding="20px 0"
        width="full"
      >
        <Container maxWidth="6xl">
          <Text fontSize="sm" color="gray.100">
            © {new Date().getFullYear()}, {t('footer.author')}
          </Text>
        </Container>
      </Box>
    </Box>
  )
}
