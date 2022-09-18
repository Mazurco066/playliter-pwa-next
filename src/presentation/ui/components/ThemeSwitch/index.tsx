// Dependencies
import { FC } from 'react'

// Components
import { IconButton, useColorMode } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'

// Footer component
export const ThemeSwitch: FC = () => {
  // Hooks
  const { colorMode, toggleColorMode } = useColorMode()

  // JSX
  return (
    <IconButton
      aria-label="theme-switch"
      icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
      onClick={() => toggleColorMode()}
      variant="ghost"
    />
  )
}
