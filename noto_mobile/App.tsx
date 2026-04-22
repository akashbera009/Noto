import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';
import store from './src/store';
import { RootNavigator } from './src/router';
import { Colors } from './src/utils/colors';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initializeAuth } from './src/modules/auth/authActions';

const App: React.FC = () => {
  useEffect(() => {
    // @ts-ignore - store dispatch type mismatch with thunk
    store.dispatch(initializeAuth());
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
            <StatusBar
              barStyle="light-content"
              backgroundColor={Colors.bg.primary}
              translucent={false}
            />
        <RootNavigator />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
