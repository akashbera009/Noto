import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Image,
} from 'react-native';
import { Colors } from '../../../utils/colors';
import { FontFamily, FontSize, FontWeight } from '../../../utils/fonts';
import { Dimensions_ } from '../../../utils/dimensions';
import { useAppSelector } from '../../../utils/hooks';
import { ScreenNames } from '../../../utils/screenNames';
import type { AuthNavProp } from '../../../utils/types';
import LocalImages from '../../../utils/localImages';

interface Props {
  navigation: AuthNavProp;
}

const Splash: React.FC<Props> = ({ navigation }) => {
  const { isInitializing, isAuthenticated } = useAppSelector(s => s.auth);
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const glowScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.1)).current;

  // AI thinking dots
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  const fullTagline = "Intelligent Note Taking.";
  const [taglineText, setTaglineText] = useState("");

  useEffect(() => {
    // Typewriter effect
    let i = 0;
    const interval = setTimeout(function type() {
      setTaglineText(fullTagline.slice(0, i + 1));
      i++;
      if (i < fullTagline.length) {
        setTimeout(type, 40); // typing speed
      }
    }, 400); // delay start

    return () => clearTimeout(interval);
  }, []);

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // AI Core "Breathing" Glow
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(glowScale, { toValue: 1.6, duration: 2000, useNativeDriver: true }),
          Animated.timing(glowScale, { toValue: 1, duration: 2000, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(glowOpacity, { toValue: 0.4, duration: 2000, useNativeDriver: true }),
          Animated.timing(glowOpacity, { toValue: 0.1, duration: 2000, useNativeDriver: true }),
        ])
      ])
    ).start();

    // AI Thinking dots animation
    const animateDot = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.delay(400)
        ])
      ).start();
    };

    animateDot(dot1, 0);
    animateDot(dot2, 200);
    animateDot(dot3, 400);
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
      }, 1500); // Give the user time to see the beautiful animation
      return () => clearTimeout(timer);
    }
  }, [isInitializing, isAuthenticated, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg.primary} />

      {/* AI Breathing Core Background */}
      <Animated.View
        style={[
          styles.glowBlob,
          {
            transform: [{ scale: glowScale }],
            opacity: glowOpacity,
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
          <View style={styles.aiBadge}>
            <Image source={LocalImages.ai} style={styles.aiBadgeIcon} tintColor={Colors.bg.primary} />
          </View>
        </View>
      </Animated.View>

      {/* App name + tagline */}
      <Animated.View style={{ opacity: textOpacity, alignItems: 'center' }}>
        <Text style={styles.appName}>Noto</Text>
      </Animated.View>

      <View style={styles.taglineContainer}>
        <Text style={styles.tagline}>{taglineText}</Text>
        {taglineText.length < fullTagline.length && taglineText.length > 0 && (
          <View style={styles.cursor} />
        )}
      </View>

      {/* AI Thinking loader */}
      <Animated.View style={[styles.loaderContainer, { opacity: textOpacity }]}>
        <Animated.View style={[styles.aiDot, { transform: [{ translateY: dot1.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) }] }]} />
        <Animated.View style={[styles.aiDot, { transform: [{ translateY: dot2.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) }] }]} />
        <Animated.View style={[styles.aiDot, { transform: [{ translateY: dot3.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) }] }]} />
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
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.accent.primary,
  },
  logoContainer: {
    marginBottom: Dimensions_.spacing.lg,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: Dimensions_.radius.xl,
    backgroundColor: Colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 12,
  },
  logoText: {
    fontSize: 42,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    color: Colors.text.inverse,
  },
  aiBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: Colors.status.success,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.bg.primary,
  },
  aiBadgeIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: FontSize['4xl'],
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    letterSpacing: 3,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Dimensions_.spacing.xs,
    height: 24,
  },
  tagline: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.accent.primary,
    letterSpacing: 0.5,
  },
  cursor: {
    width: 2,
    height: 14,
    backgroundColor: Colors.accent.primary,
    marginLeft: 2,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 80,
    flexDirection: 'row',
    gap: 8,
  },
  aiDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.status.success,
  },
});

export default Splash;
