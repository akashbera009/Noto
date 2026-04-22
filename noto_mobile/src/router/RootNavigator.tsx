import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppSelector } from '../utils/hooks';
import { ScreenNames } from '../utils/screenNames';
import AuthNavigator from './AuthNavigator';
import BottomTabNavigator from './BottomTabNavigator';
import ToastContainer from '../components/ToastContainer';
import { deepLinkConfig } from '../utils/deepLinkConfig';

const RootNavigator: React.FC = () => {
  const { isAuthenticated, isInitializing } = useAppSelector(s => s.auth);

  return (
    <NavigationContainer linking={deepLinkConfig}>
      {isInitializing ? (
        <AuthNavigator initialRouteName={ScreenNames.SPLASH} />
      ) : isAuthenticated ? (
        <BottomTabNavigator />
      ) : (
        <AuthNavigator />
      )}
      <ToastContainer />
    </NavigationContainer>
  );
};

export default RootNavigator;
