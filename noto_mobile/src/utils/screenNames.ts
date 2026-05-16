export const ScreenNames = {
  // Auth
  SPLASH: 'Splash',
  LOGIN: 'Login',
  SIGNUP: 'Signup',
  LOCATION_PERMISSION: 'LocationPermission',

  // Main Tabs
  HOME_TAB: 'HomeTab',
  NOTES_TAB: 'NotesTab',
  PROFILE_TAB: 'ProfileTab',

  // Home
  HOME: 'Home',

  // Notes
  NOTES_LIST: 'NotesList',
  NOTE_DETAIL: 'NoteDetail',
  CREATE_NOTE: 'CreateNote',
  EDIT_NOTE: 'EditNote',

  // Navigators
  ROOT: 'Root',
  AUTH_STACK: 'AuthStack',
  MAIN_STACK: 'MainStack',
  HOME_STACK: 'HomeStack',
  NOTES_STACK: 'NotesStack',
} as const;

export type ScreenName = (typeof ScreenNames)[keyof typeof ScreenNames];
