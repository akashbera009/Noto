import { LinkingOptions } from '@react-navigation/native';
import { ScreenNames } from './screenNames';

export const deepLinkConfig: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: ['noto://', 'https://noto.app'],
  config: {
    screens: {
      [ScreenNames.AUTH_STACK]: {
        screens: {
          [ScreenNames.LOGIN]: 'login',
        },
      },
      [ScreenNames.MAIN_STACK]: {
        screens: {
          [ScreenNames.NOTES_TAB]: {
            screens: {
              [ScreenNames.NOTES_LIST]: 'notes',
              [ScreenNames.NOTE_DETAIL]: 'notes/:noteId',
            },
          },
        },
      },
    },
  },
};
