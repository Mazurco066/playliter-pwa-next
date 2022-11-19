// Dependencies
import { FC } from 'react'
import { useTranslation } from 'next-i18next'

// Layout and Components
import { Hero, Feature } from './elements'
import {
  Box,
  Container,
  Flex,
  Heading,
  Link,
  Text,
  useBreakpointValue
} from '@chakra-ui/react'

// Sign in component
const LandingView: FC = () => {
  // Hooks
  const { t } = useTranslation('landing')

  // Styles
  const featureDirection: any = useBreakpointValue({ base: 'column', md: 'row' })

  // View JSX
  return (
    <Box bgColor="gray.100">
      <Hero />
      <Container
        maxWidth="6xl"
        py="20px"
        color="gray.900"
      >
        <Box
          color="gray.900"
          as="section"
          mb="5"
        >
          <Heading
            as="h3"
            size="lg"
            fontWeight="thin"
            textAlign="center"
            mb="3"
          >
            {t('feature.title')}
          </Heading>
          <Heading
            as="h3"
            size="md"
            fontWeight="light"
            textAlign="center"
            mb="5"
          >
            {t('feature.subtitle')}
          </Heading>
          <Flex
            gap="1rem"
            justifyContent="space-between"
            direction={featureDirection}
            mb="3"
          >
            <Feature
              title={t('feature.card_1_title')}
              description={t('feature.card_1_text')}
              image="/img/arts/musical-note.png"
            />
            <Feature
              title={t('feature.card_2_title')}
              description={t('feature.card_2_text')}
              image="/img/arts/musical-concert.png"
            />
              <Feature
              title={t('feature.card_3_title')}
              description={t('feature.card_3_text')}
              image="/img/arts/android.png"
            />
          </Flex>
          <Text
            textAlign="center"
            fontSize="lg"
            fontWeight="light"
          >
            {t('feature.link_prev')}<strong>{t('feature.link_feature')}</strong>{t('feature.link_next')}
            <Link
              href="https://github.com/Mazurco066/playliter-pwa-next"
              target="_blank"
              rel="noreferrer noopener"
              color="primary.500"
            >{t('feature.link_url')}</Link>.
          </Text>
        </Box>
      </Container>
    </Box>
  )
}

// Exporting component
export default LandingView
