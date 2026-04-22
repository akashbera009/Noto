import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { Colors } from '../../../utils/colors';
import { FontFamily, FontSize, FontWeight } from '../../../utils/fonts';
import { Dimensions_ } from '../../../utils/dimensions';
import { useAppSelector } from '../../../utils/hooks';
import { ScreenNames } from '../../../utils/screenNames';
import type { AuthNavProp } from '../../../utils/types';

interface Props {
  navigation: AuthNavProp;
}

const Splash: React.FC<Props> = ({ navigation }) => {
  const { isInitializing, isAuthenticated } = useAppSelector(s => s.auth);
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate in
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1500, useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 0, duration: 1500, useNativeDriver: false }),
      ]),
    ).start();
  }, []);

  // Handle navigation after initialization and animation
  useEffect(() => {
    if (!isInitializing) {
      const timer = setTimeout(() => {
        // RootNavigator will automatically switch to Main if isAuthenticated is true
        // If not, we go to Login
        if (!isAuthenticated) {
          navigation.replace(ScreenNames.LOGIN);
        }
      }, 500); // Small extra delay for smoothness
      return () => clearTimeout(timer);
    }
  }, [isInitializing, isAuthenticated, navigation]);

  const glowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 45],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg.primary} />

      {/* Background glow blob */}
      <Animated.View
        style={[
          styles.glowBlob,
          {
            shadowRadius: glowRadius,
            shadowOpacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.6] }),
          },
        ]}
      />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>N</Text>
        </View>
      </Animated.View>

      {/* App name + tagline */}
      <Animated.View style={{ opacity: logoOpacity, alignItems: 'center' }}>
        <Text style={styles.appName}>Noto</Text>
      </Animated.View>

      <Animated.View style={{ opacity: taglineOpacity, alignItems: 'center' }}>
        <Text style={styles.tagline}>Think clearly. Write freely.</Text>
      </Animated.View>

      {/* Dots loader */}
      <Animated.View style={[styles.loaderContainer, { opacity: taglineOpacity }]}>
        <View style={styles.dot} />
        <View style={[styles.dot, styles.dotMid]} />
        <View style={styles.dot} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowBlob: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.accent.primary,
    opacity: 0.04,
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 0 },
  },
  logoContainer: {
    marginBottom: Dimensions_.spacing.lg,
  },
  logoBox: {
    width: 76,
    height: 76,
    borderRadius: Dimensions_.radius.xl,
    backgroundColor: Colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  logoText: {
    fontSize: 38,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    color: Colors.text.inverse,
  },
  appName: {
    fontSize: FontSize['4xl'],
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.text.muted,
    marginTop: Dimensions_.spacing.xs,
    letterSpacing: 0.5,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.accent.primary,
    opacity: 0.5,
  },
  dotMid: {
    opacity: 1,
    backgroundColor: Colors.accent.primary,
  },
});

export default Splash;
