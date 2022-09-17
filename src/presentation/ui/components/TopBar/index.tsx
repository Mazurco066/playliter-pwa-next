// Dependencies
import { FC } from 'react'
import { useUser } from 'infra/services/session'

// Components
import { UserMenu, ThemeSwitch } from 'presentation/ui/components'
import {
  Avatar,
  Container,
  Divider,
  Flex,
  Heading,
  HStack
} from '@chakra-ui/react'

// TopBar component
export const TopBar: FC = () => {
  // Hooks
  const { user } = useUser()

  // JSX
  return (
    <Container height="full">
      <Flex
        justify="space-between"
        align="center"
        height="full"
      >
        <Flex alignItems="center">
          <Avatar src={user?.avatar} name={user?.name} />
          <Heading
            as="h3"
            size="md"
            ml="3"
            textTransform="capitalize"
            textOverflow="ellipsis"
          >
            {user?.name}
          </Heading>
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
