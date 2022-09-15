// Dependencies
import { FC } from 'react'

// Components
import { Button, useColorMode } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'

// Footer component
export const ThemeSwitch: FC = () => {
  // Hooks
  const { colorMode, toggleColorMode } = useColorMode()

  // JSX
  return (
    <Button variant="outline" onClick={() => toggleColorMode()}>
      { colorMode === 'dark' ? <SunIcon /> : <MoonIcon /> }
    </Button>
  )
}
