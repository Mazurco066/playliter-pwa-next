// Dependencies
import { FC } from 'react'
import { useTranslation } from 'next-i18next'

// Layout and Components
import {
  Box,
  Container,
  Heading,
  Text
} from '@chakra-ui/react'

// Local types
interface ISection {
  title: string
  content: string
}

// Sign in component
const PrivacyPolicyView: FC = () => {
  // Hooks
  const { t } = useTranslation('privacy')

  // Privacy object
  const policy: any = t('privacyPolicy')

  // View JSX
  return (
    <Box bgColor="gray.100">
      <Container
        maxWidth="6xl"
        py="20px"
        color="gray.900"
      >
        <Box mb="4">
          <Heading
            as="h1"
            size="xl"
            mb="1"
          >
            {t('privacyPolicy.title')}
          </Heading>
          <Text
            fontSize="md"
            fontWeight="medium"
            color="gray.500"
          >
            {t('privacyPolicy.lastUpdated')}
          </Text>
        </Box>
        {
          // Privacy policy sections
          policy.sections.map(({ title, content }: ISection, index: number) => (
            <Box
              key={`section-${index}`}
              mb="4"
            >
              <Text
                fontSize="lg"
                fontWeight="semibold"
                mb="2"
              >
                {title}
              </Text>
              <Text
                fontSize="md"
                fontWeight="normal"
                whiteSpace="pre-wrap"
              >
                {content}
              </Text>
            </Box>
          ))
        }
      </Container>
    </Box>
  )
}

// Exporting component
export default PrivacyPolicyView
