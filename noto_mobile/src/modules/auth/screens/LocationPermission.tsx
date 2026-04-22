import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Colors } from '../../../utils/colors';
import { FontFamily, FontSize, FontWeight } from '../../../utils/fonts';
import { Dimensions_ } from '../../../utils/dimensions';
import { ScreenNames } from '../../../utils/screenNames';
import CustomButton from '../../../components/CustomButton';
import type { AuthNavProp } from '../../../utils/types';

interface Props {
  navigation: AuthNavProp;
}

const LocationPermission: React.FC<Props> = ({ navigation }) => {
  const handleAllow = () => {
    // Request permission via react-native-permissions in real impl
    // PermissionsAndroid.request / request('location') etc.
    navigation.replace(ScreenNames.LOGIN);
  };

  const handleSkip = () => {
    navigation.replace(ScreenNames.LOGIN);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📍</Text>
        </View>

        <Text style={styles.title}>Allow Location Access</Text>
        <Text style={styles.subtitle}>
          Noto uses your location to provide context-aware note suggestions and
          help you remember where your ideas came from.
        </Text>

        <View style={styles.perms}>
          {[
            { icon: '🗺', label: 'Tag notes with location' },
            { icon: '🔒', label: 'Location is never shared' },
            { icon: '⚙️', label: 'Change any time in Settings' },
          ].map(item => (
            <View key={item.label} style={styles.permRow}>
              <Text style={styles.permIcon}>{item.icon}</Text>
              <Text style={styles.permLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <CustomButton
          label="Allow Location Access"
          onPress={handleAllow}
          variant="primary"
          fullWidth
        />
        <CustomButton
          label="Not Now"
          onPress={handleSkip}
          variant="ghost"
          fullWidth
          style={styles.skipBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
    paddingHorizontal: Dimensions_.spacing['2xl'],
    paddingBottom: Dimensions_.spacing['3xl'],
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.bg.elevated,
    borderWidth: 1,
    borderColor: Colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Dimensions_.spacing['2xl'],
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  icon: { fontSize: 42 },
  title: {
    fontSize: FontSize['2xl'],
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Dimensions_.spacing.md,
  },
  subtitle: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Dimensions_.spacing['2xl'],
  },
  perms: {
    width: '100%',
    gap: Dimensions_.spacing.md,
  },
  permRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Dimensions_.spacing.md,
    backgroundColor: Colors.bg.card,
    borderRadius: Dimensions_.radius.md,
    padding: Dimensions_.spacing.base,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  permIcon: { fontSize: 20 },
  permLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.text.secondary,
  },
  actions: {
    gap: Dimensions_.spacing.sm,
  },
  skipBtn: { marginTop: Dimensions_.spacing.xs },
});

export default LocationPermission;
