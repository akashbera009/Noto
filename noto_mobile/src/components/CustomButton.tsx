import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
  Animated,
} from 'react-native';
import { Colors } from '../utils/colors';
import { FontFamily, FontSize, FontWeight } from '../utils/fonts';
import { Dimensions_ } from '../utils/dimensions';
import { usePressScale } from '../utils/hooks';
import type { CustomButtonProps } from '../utils/types';

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
  style,
}) => {
  const { scale, onPressIn, onPressOut } = usePressScale(0.97);
  const isDisabled = disabled || loading;

  const containerStyle = [
    styles.base,
    styles[`size_${size}`],
    styles[`variant_${variant}`],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.label,
    styles[`labelSize_${size}`],
    styles[`labelVariant_${variant}`],
    isDisabled && styles.labelDisabled,
  ];

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={isDisabled}
        style={containerStyle}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === 'primary' ? Colors.text.inverse : Colors.accent.primary}
            size="small"
          />
        ) : (
          <View style={styles.content}>
            {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
            <Text style={textStyle}>{label}</Text>
            {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Dimensions_.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: Dimensions_.spacing.sm,
  },
  rightIcon: {
    marginLeft: Dimensions_.spacing.sm,
  },

  // Sizes
  size_sm: {
    paddingVertical: Dimensions_.spacing.sm,
    paddingHorizontal: Dimensions_.spacing.base,
    minHeight: 36,
  },
  size_md: {
    paddingVertical: Dimensions_.spacing.md,
    paddingHorizontal: Dimensions_.spacing.xl,
    minHeight: 48,
  },
  size_lg: {
    paddingVertical: Dimensions_.spacing.base,
    paddingHorizontal: Dimensions_.spacing['2xl'],
    minHeight: 56,
  },

  // Variants
  variant_primary: {
    backgroundColor: Colors.accent.primary,
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  variant_secondary: {
    backgroundColor: Colors.bg.elevated,
    borderWidth: 1,
    borderColor: Colors.border.accent,
  },
  variant_ghost: {
    backgroundColor: Colors.transparent,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  variant_danger: {
    backgroundColor: Colors.status.error,
    shadowColor: Colors.status.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },

  // Labels
  label: {
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    letterSpacing: 0.3,
  },
  labelSize_sm: { fontSize: FontSize.sm },
  labelSize_md: { fontSize: FontSize.base },
  labelSize_lg: { fontSize: FontSize.lg },
  labelVariant_primary: { color: Colors.text.inverse },
  labelVariant_secondary: { color: Colors.accent.primary },
  labelVariant_ghost: { color: Colors.text.secondary },
  labelVariant_danger: { color: Colors.white },

  // Disabled
  disabled: {
    opacity: 0.45,
  },
  labelDisabled: {
    opacity: 0.6,
  },
});

export default CustomButton;
