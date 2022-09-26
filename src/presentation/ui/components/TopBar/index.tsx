// Dependencies
import { FC } from 'react'
import { useRouter } from 'next/router'

// Components
import { ArrowBackIcon } from '@chakra-ui/icons'
import { UserMenu, ThemeSwitch } from 'presentation/ui/components'
import {
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Text
} from '@chakra-ui/react'

// TopBar component
export const TopBar: FC<{
  pageTitle: string,
  pageSubtitle: string
}> = ({
  pageTitle,
  pageSubtitle
}) => {
  // Hooks
  const router = useRouter()

  // JSX
  return (
    <Container height="full">
      <Flex
        justify="space-between"
        align="center"
        height="full"
      >
        <IconButton 
          aria-label="go-back"
          icon={<ArrowBackIcon />}
          variant="ghost"
          fontSize="2xl"
          onClick={() => router.back()}
        />
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Heading
            as="h3"
            size="md"
            textTransform="capitalize"
            textOverflow="ellipsis"
            textAlign="center"
          >
            {pageTitle}
          </Heading>
          {
            pageSubtitle !== '' && (
              <Text
                mt="1"
                textTransform="uppercase"
                fontWeight="bold"
                color="secondary.500"
                textAlign="center"
                fontSize="sm"
              >
                {pageSubtitle}
              </Text>
            )
          }
        </Flex>
        <HStack spacing="2">
          <ThemeSwitch />
          <UserMenu />
        </HStack>
      </Flex>
      <Divider orientation="horizontal" />
    </Container> 
  )
}
