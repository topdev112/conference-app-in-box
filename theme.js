import { Platform, Dimensions } from 'react-native'

const dimensions = Dimensions.get('window')

const primaryDark = 'rgba(14, 20, 43, 1)'
const primary = 'rgba(18, 25, 50, 1)'
const primary2 = 'rgba(27, 37, 77, 1)'
const primaryOpaque = opacity => `rgba(18, 25, 50, ${opacity})`

const highlight = '#61dafb'

const colors = {
  primary,
  highlight,
  primary2,
  primaryDark,
  primaryOpaque
}

const typography = {
  primary: Platform.select({
    ios: "Gotham Rounded",
    android: "gothamrounded",
  }),
  secondary: Platform.select({
    ios: "Gotham Rounded",
    android: "gothamrounded",
  }),
}


export {
  colors,
  typography,
  dimensions
}