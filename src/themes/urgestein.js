import {
  purple700,
  grey600,
  green600,
  green700,
  fullWhite
} from 'material-ui/styles/colors'
import { fade } from 'material-ui/utils/colorManipulator'

export default {
  palette: {
    primary1Color: '#8f2ba3',
    primary2Color: purple700,
    primary3Color: grey600,
    accent1Color: '#69B20B',
    accent2Color: green700,
    accent3Color: green600,
    textColor: fullWhite,
    secondaryTextColor: fade(fullWhite, 0.7),
    alternateTextColor: '#303030',
    canvasColor: '#303030',
    borderColor: fade(fullWhite, 0.3),
    disabledColor: fade(fullWhite, 0.3),
    pickerHeaderColor: fade(fullWhite, 0.12),
    clockCircleColor: fade(fullWhite, 0.12)
  }
}
