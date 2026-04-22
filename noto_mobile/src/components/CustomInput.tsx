import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Colors } from '../utils/colors';
import { FontFamily, FontSize } from '../utils/fonts';
import { Dimensions_ } from '../utils/dimensions';
import type { CustomInputProps } from '../utils/types';

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  rightIcon,
  leftIcon,
  onBlur,
  onFocus,
  editable = true,
  autoFocus = false,
  style,
  inputStyle,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onBlur?.();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? Colors.status.error : Colors.border.default,
      error ? Colors.status.error : Colors.border.focus,
    ],
  });

  return (
    <View style={[styles.wrapper, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Animated.View
        style={[
          styles.inputContainer,
          multiline && styles.multilineContainer,
          { borderColor },
          isFocused && styles.focusedContainer,
          !editable && styles.disabledContainer,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            leftIcon ? styles.inputWithLeft : null,
            rightIcon ? styles.inputWithRight : null,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.text.muted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          maxLength={maxLength}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={editable}
          autoFocus={autoFocus}
          selectionColor={Colors.accent.primary}
          cursorColor={Colors.accent.primary}
        />

        {rightIcon && (
          <TouchableOpacity style={styles.rightIcon}>{rightIcon}</TouchableOpacity>
        )}
      </Animated.View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {maxLength && (
        <Text style={styles.charCount}>
          {value.length}/{maxLength}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Dimensions_.spacing.base,
  },
  label: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.text.secondary,
    marginBottom: Dimensions_.spacing.xs,
    letterSpacing: 0.3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.input,
    borderRadius: Dimensions_.radius.md,
    borderWidth: 1.5,
    paddingHorizontal: Dimensions_.spacing.base,
    minHeight: 48,
  },
  multilineContainer: {
    alignItems: 'flex-start',
    paddingVertical: Dimensions_.spacing.md,
    minHeight: 100,
  },
  focusedContainer: {
    backgroundColor: Colors.bg.elevated,
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  disabledContainer: {
    opacity: 0.5,
  },
  input: {
    flex: 1,
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: Colors.text.primary,
    paddingVertical: 0,
  },
  multilineInput: {
    textAlignVertical: 'top',
    paddingTop: 2,
  },
  inputWithLeft: {
    paddingLeft: Dimensions_.spacing.sm,
  },
  inputWithRight: {
    paddingRight: Dimensions_.spacing.sm,
  },
  leftIcon: {
    marginRight: Dimensions_.spacing.sm,
  },
  rightIcon: {
    padding: Dimensions_.spacing.xs,
    marginLeft: Dimensions_.spacing.xs,
  },
  errorText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.status.error,
    marginTop: Dimensions_.spacing.xs,
    marginLeft: 2,
  },
  charCount: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.text.muted,
    textAlign: 'right',
    marginTop: Dimensions_.spacing.xs,
  },
});

export default CustomInput;
