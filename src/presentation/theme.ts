// Chackra UI dependencies
import { extendTheme, ThemeConfig } from '@chakra-ui/react'
import { mode, Styles } from '@chakra-ui/theme-tools'

// Application color theme
const colors = {
  primary: {
    900: '#21106D',
    800: '#311B84',
    700: '#482BA4',
    600: '#633FC4',
    500: '#8257E5',
    400: '#A580EF',
    300: '#BC9BF7',
    200: '#D6BDFC',
    100: '#EBDEFD'
  },
  secondary: {
    900: '#0E1776',
    800: '#17238F',
    700: '#2435B1',
    600: '#354AD4',
    500: '#4963F7',
    400: '#768BFA',
    300: '#91A5FC',
    200: '#B6C4FE',
    100: '#DAE2FE'
  }
}

// Application default styles
const styles: Styles = {
  global: (props: any) => ({
    html: {
      minHeight: '100%'
    },
    body: {
      bg: mode('#f5f5f5', '#212121')(props),
      color: mode('#212121', '#f5f5f5')(props)
    },
    '#__next': {
      minHeight: '100%'
    }
  })
}

// Theme config
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false
}

// Application components overwrite
const components = {}

// Create app custom theme for chackra based on selected colors
const theme = extendTheme({
  colors,
  components,
  config,
  styles
})

// Exporting app theme
export default theme
