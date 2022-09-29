// Dependencies
import { FC } from 'react'

// Types
import type { CategoryType } from 'domain/models'

// Components
import {
  Box,
  Text,
  useColorModeValue
} from '@chakra-ui/react'

// Component
export const CategoryItemMinified: FC<{
  category: CategoryType,
  onClick?: (id: string) => void
}> = ({
  category,
  onClick = () => {}
}) => {
  // Color Hooks
  const bgBox = useColorModeValue('gray.50', 'gray.800')

  // JSX
  return (
    <Box
      bgColor={bgBox}
      borderRadius="lg"
      px="3"
      py="5"
      onClick={() => onClick(category.id)}
    >
      <Text>
        {category.title}
      </Text>
    </Box>
  )
}