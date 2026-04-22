/**
 * Central registry for local image/icon assets.
 * Import all local require() calls here to keep asset references clean.
 */

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
  placeholder: null,
} as const;

export default LocalImages;
