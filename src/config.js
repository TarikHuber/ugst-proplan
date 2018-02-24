import getMenuItems from './menuItems';
import locales from './locales';
import routes from './routes';
import themes from './themes';
import grants from './grants';

const config = {
  firebase_config: {
    apiKey: "AIzaSyA8qQ2p_1UXRJnR3zDZRa7VrSlKVsJUop8",
    authDomain: "ugst-proplan.firebaseapp.com",
    databaseURL: "https://ugst-proplan.firebaseio.com",
    projectId: "ugst-proplan",
    storageBucket: "ugst-proplan.appspot.com",
    messagingSenderId: "604966397909"
  },
  firebase_config_dev: {
    apiKey: "AIzaSyDuJXk0p_44oXmQIa43gObQoMjZWUTgKjM",
    authDomain: "dev-ugst-proplan.firebaseapp.com",
    databaseURL: "https://dev-ugst-proplan.firebaseio.com",
    projectId: "dev-ugst-proplan",
    storageBucket: "dev-ugst-proplan.appspot.com",
    messagingSenderId: "113490407647"
  },
  firebase_providers: [
    'google.com',
    'password'
  ],
  initial_state: {
    theme: 'urgestein',
    locale: 'de',
  },
  drawer_width: 256,
  locales,
  themes,
  grants,
  routes,
  getMenuItems,
  firebaseLoad: () => import('./firebase'),
};

export default config;
