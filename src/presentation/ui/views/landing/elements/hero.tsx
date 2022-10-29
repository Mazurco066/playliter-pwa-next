// Dependencies
import { FC } from 'react'

// Components
import { Box } from '@chakra-ui/react'

// Component
export const Hero: FC = () => {
  // JSX
  return (
    <Box
      height="calc(100vh - 80px)"
      bgColor="primary.500"
      color="gray.100"
    >
      <p>Conteúdo do hero em breve aqui</p>
    </Box>
  )
}
