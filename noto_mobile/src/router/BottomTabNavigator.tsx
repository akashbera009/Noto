import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute, Route } from '@react-navigation/native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Colors } from '../utils/colors';
import { FontFamily, FontSize, FontWeight } from '../utils/fonts';
import { Dimensions_ } from '../utils/dimensions';
import { ScreenNames } from '../utils/screenNames';
import Home from '../modules/Home/Home';
import NotesNavigator from './HomeNavigator';
import { ProfileScreen } from '../modules/auth/screens';
import type { BottomTabParamList } from '../utils/types';

const Tab = createBottomTabNavigator<BottomTabParamList>();

// ─── Custom Tab Bar ───────────────────────────────────────────────────────────

const TAB_ITEMS = [
  { name: ScreenNames.HOME_TAB, label: 'Home', icon: '⌂', iconActive: '⌂' },
  { name: ScreenNames.NOTES_TAB, label: 'Notes', icon: '✎', iconActive: '✎' },
  { name: ScreenNames.PROFILE_TAB, label: 'Profile', icon: '◎', iconActive: '◎' },
] as const;

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.inner}>
        {TAB_ITEMS.map((item, index) => {
          const isFocused = state.index === index;
          return (
            <TouchableOpacity
              key={item.name}
              style={tabStyles.tab}
              onPress={() => navigation.navigate(item.name)}
              activeOpacity={0.7}
            >
              <View style={[tabStyles.iconWrapper, isFocused && tabStyles.iconActive]}>
                <Text style={[tabStyles.icon, isFocused && tabStyles.iconTextActive]}>
                  {isFocused ? item.iconActive : item.icon}
                </Text>
              </View>
              <Text style={[tabStyles.label, isFocused && tabStyles.labelActive]}>
                {item.label}
              </Text>
              {isFocused && <View style={tabStyles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const tabStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: Dimensions_.spacing.xl,
    right: Dimensions_.spacing.xl,
  },
  inner: {
    flexDirection: 'row',
    backgroundColor: Colors.bg.elevated,
    borderRadius: Dimensions_.radius['2xl'],
    paddingVertical: Dimensions_.spacing.md,
    paddingHorizontal: Dimensions_.spacing.base,
    borderWidth: 1,
    borderColor: Colors.border.default,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  iconWrapper: {
    width: 40,
    height: 36,
    borderRadius: Dimensions_.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActive: {
    backgroundColor: Colors.accent.muted,
  },
  icon: {
    fontSize: 20,
    color: Colors.text.muted,
  },
  iconTextActive: {
    color: Colors.accent.primary,
  },
  label: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    color: Colors.text.muted,
  },
  labelActive: {
    color: Colors.accent.primary,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.accent.primary,
    marginTop: 1,
  },
});

// ─── Navigator ────────────────────────────────────────────────────────────────

const BottomTabNavigator: React.FC = () => {
  const isTabBarVisible = (route: Partial<Route<string>>) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    // When routeName is undefined, it means we are at the initial screen of the tab
    // This handles HOME_TAB and PROFILE_TAB as they are direct components
    if (routeName === undefined) {
      return true;
    }
    // For NOTES_TAB, it's a stack, so we only show the tab bar on the list screen
    return routeName === ScreenNames.NOTES_LIST;
  };

  return (
    <Tab.Navigator
      tabBar={props => {
        const route = props.state.routes[props.state.index];
        if (!isTabBarVisible(route)) {
          return null;
        }
        return <CustomTabBar {...props} />;
      }}
      screenOptions={{
        headerShown: false,
      }}
      screenListeners={({ route }) => ({
        focus: () => {
          // Log screen view when tab is focused
          if (route.name) {
            console.log(route.name);
          }else {
            console.log('No route name');
          }
        },
      })}
    >
      <Tab.Screen
        name={ScreenNames.HOME_TAB}
        options={{
          headerShown: false,
        }}
        component={Home}
      />
      <Tab.Screen
        name={ScreenNames.NOTES_TAB}
        options={{
          headerShown: false,
        }}
        component={NotesNavigator}
      />
      <Tab.Screen
        name={ScreenNames.PROFILE_TAB}
        options={{
          headerShown: false,
        }}
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}
export default BottomTabNavigator;
