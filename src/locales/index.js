import en_messages from './en'
import de_messages from './de'
import en from 'react-intl/locale-data/en'
import de from 'react-intl/locale-data/de'

const locales = [
  {
    locale: 'en',
    messages: en_messages,
    data: en
  },
  {
    locale: 'de',
    messages: de_messages,
    data: de
  }
]

export default locales
