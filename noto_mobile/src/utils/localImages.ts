/**
 * Central registry for local image/icon assets.
 * Import all local require() calls here to keep asset references clean.
 */
const baseUrl = '../assets/images';

const LocalImages = {
  // Splash / Branding
  // logo: require('../assets/images/logo.png'),
  // splashBg: require('../assets/images/splash_bg.png'),

  // Onboarding
  // onboarding1: require('../assets/images/onboarding_1.png'),

  // Icons (use react-native-vector-icons or SVG in practice)
  // tabHome: require('../assets/icons/tab_home.png'),
  // tabNotes: require('../assets/icons/tab_notes.png'),
  // tabProfile: require('../assets/icons/tab_profile.png'),

  // Placeholder (remove when real assets are added)

  noteIcon: require(baseUrl + '/write.png'),
  homeIcon: require(baseUrl + '/home.png'),
  profileIcon: require(baseUrl + '/profile.png'),

  plus: require(baseUrl + '/plus.png'),
  edit: require(baseUrl + '/edit.png'),
  camera: require(baseUrl + '/camera.png'),
  search: require(baseUrl + '/search.png'),

  ai: require(baseUrl + '/ai.png'),
  edit_note: require(baseUrl + '/edit_note.png'),
  delete: require(baseUrl + '/delete.png'),
  empty_folder: require(baseUrl + '/empty_folder.png'),
  logout: require(baseUrl + '/logout.png'),


  placeholder: null,
} as const;

export default LocalImages;
