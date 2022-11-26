// Dependencies
import { FC } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { requestClient } from 'infra/services/http'

// Types
import { BandType } from 'domain/models'

// Layout and Components
import { BandItem } from './elements'
import {
  Button,
  Container,
  Heading,
  Grid,
  Skeleton,
  Text,
  useColorModeValue
} from '@chakra-ui/react'

// Bands list component
const BandsView: FC = () => {
  // Hooks
  const router = useRouter()
  const { t } = useTranslation('bands')

  // Color hooks
  const colorSubtile = useColorModeValue('gray.500', 'gray.400')

  // HTTP Requests by SWR
  const {
    data: bands,
    isLoading: bandsLoading
  } = useQuery(
    ['bands'],
    () => requestClient('/api/bands/list', 'get')
  )
  
  // View JSX
  return (
    <div>
      <Container maxWidth="6xl">
        <Heading
          as="h4"
          size="md"
          textAlign="left"
          textTransform="uppercase"
          mb="1"
        >
          {t('create_label')}
        </Heading>
        <Text
          mb="5"
          color={colorSubtile}
        >
          {t('create_hint')}
        </Text>
        <Button
          variant="fade"
          width="full"
          mb="5"
          onClick={() => router.push('/bands/save')}
        >
          {t('create_btn')}
        </Button>
        <Heading
          as="h3"
          size="md"
          textAlign="left"
          textTransform="uppercase"
          mb="1"
        >
          {t('my_bands')}
        </Heading>
        <Text
          mb="5"
          color={colorSubtile}
        >
          {t('my_bands_label')}
        </Text>
        { bands && !bandsLoading ? (
          <>
            { bands?.data?.length > 0 ? (
              <Grid
                templateColumns="repeat(2, 1fr)"
                gap="1rem"
                mb="5"
              >
                { bands?.data?.map((band: BandType) => (
                  <BandItem
                    key={band.id}
                    band={band}
                    onClick={() => router.push(`/bands/${band.id}`)}
                  />
                )) }
              </Grid>
            ) : (
              <Text mb="5">
                {t('no_bands')}
              </Text>
            ) }
          </>
        ) : (
          <Grid
            templateColumns="repeat(2, 1fr)"
            gap="1rem"
            mb="5"
          >
            {[1, 2, 3, 4].map((key: number) => (
              <Skeleton
                key={key}
                width="full"
                height="128px"
                borderRadius="lg"
              />
            ))}
          </Grid>
        ) }
      </Container>
    </div>
  )
}

// Exporting component
export default BandsView
