// Dependencies
import { FC } from 'react'

// Components
import { useColorMode } from '@chakra-ui/react'

// Footer component
export const ThemeSwitch: FC = () => {
  // Hooks
  const { colorMode, toggleColorMode } = useColorMode()

  // JSX
  return (
    <p>Switch - { colorMode }</p>
  )
}