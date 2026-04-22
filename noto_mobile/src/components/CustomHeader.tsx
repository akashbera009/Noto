import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Colors } from '../utils/colors';
import { FontFamily, FontSize, FontWeight } from '../utils/fonts';
import { Dimensions_ } from '../utils/dimensions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CustomHeaderProps {
  title: string;
  subtitle?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  onBack?: () => void;
  transparent?: boolean;
  centerTitle?: boolean;
}

const BackArrow = () => (
  <View style={backArrow.container}>
    <View style={[backArrow.line, backArrow.topLine]} />
    <View style={[backArrow.line, backArrow.bottomLine]} />
  </View>
);

const backArrow = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: 10,
    height: 1.8,
    backgroundColor: Colors.text.primary,
    borderRadius: 2,
  },
  topLine: {
    transform: [{ rotate: '-45deg' }, { translateY: 3 }],
  },
  bottomLine: {
    transform: [{ rotate: '45deg' }, { translateY: -3 }],
  },
});

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  subtitle,
  leftComponent,
  rightComponent,
  onBack,
  transparent = false,
  centerTitle = false,
}) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, transparent && styles.transparent , {marginTop: insets.top }]}>
      {/* Left */}
      <View style={styles.side}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backButton} hitSlop={20}>
            <Text style={styles.backButtonText}>く</Text>
          </TouchableOpacity>
        ) : (
          leftComponent
        )}
      </View>

      {/* Title */}
      <View style={[styles.titleContainer, centerTitle && styles.titleCenter]}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right */}
      <View style={[styles.side, styles.rightSide]}>{rightComponent}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions_.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Dimensions_.spacing.base,
    backgroundColor: Colors.bg.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  transparent: {
    backgroundColor: Colors.transparent,
    borderBottomColor: Colors.transparent,
  },
  side: {
    width: 48,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backButtonText:{
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: Colors.text.primary,
  },
  rightSide: {
    alignItems: 'flex-end',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleCenter: {
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    color: Colors.text.primary,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.text.secondary,
    marginTop: 1,
  },
  backButton: {
    padding: Dimensions_.spacing.xs,
    borderRadius: Dimensions_.radius.sm,
    backgroundColor: Colors.bg.elevated,
  },
  hitSlop: {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  },
});

export default CustomHeader;
