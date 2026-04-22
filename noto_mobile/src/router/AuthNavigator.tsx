import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScreenNames } from '../utils/screenNames';
import { Splash, Login } from '../modules/auth/screens';
import type { AuthStackParamList } from '../utils/types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

interface Props {
  initialRouteName?: keyof AuthStackParamList;
}

const AuthNavigator: React.FC<Props> = ({ initialRouteName = ScreenNames.SPLASH }) => (
  <Stack.Navigator 
    initialRouteName={initialRouteName}
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name={ScreenNames.SPLASH} component={Splash} />
    <Stack.Screen name={ScreenNames.LOGIN} component={Login} />
  </Stack.Navigator>
);

export default AuthNavigator;
