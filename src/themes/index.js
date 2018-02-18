import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import icsTheme from './ics_theme'
import urgestein from './urgestein'

const themes = [
  {
    id: 'light',
    source: lightBaseTheme
  },
  {
    id: 'dark',
    source: darkBaseTheme
  },
  {
    id: 'ics',
    source: icsTheme
  },
  {
    id: 'urgestein',
    source: urgestein
  }
]

export default themes
