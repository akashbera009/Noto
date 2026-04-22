import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { Colors } from '../../utils/colors';
import { FontFamily, FontSize } from '../../utils/fonts';
import { Dimensions_ } from '../../utils/dimensions';

interface Props {
  placeholder?: string;
  onSubmit: (value: string) => void;
  loading?: boolean;
}

const EnterAddressBar: React.FC<Props> = ({
  placeholder = 'Enter address…',
  onSubmit,
  loading = false,
}) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = React.useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(borderAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  };
  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(borderAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.border.default, Colors.border.focus],
  });

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  return (
    <Animated.View style={[styles.container, { borderColor }]}>
      <Text style={styles.pin}>📍</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor={Colors.text.muted}
        onFocus={handleFocus}
        onBlur={handleBlur}
        returnKeyType="go"
        onSubmitEditing={handleSubmit}
        selectionColor={Colors.accent.primary}
      />
      {value.length > 0 && (
        <TouchableOpacity
          style={styles.clearBtn}
          onPress={() => setValue('')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.clearText}>✕</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[styles.goBtn, loading && styles.goBtnDisabled]}
        onPress={handleSubmit}
        disabled={loading || !value.trim()}
      >
        <Text style={styles.goText}>{loading ? '…' : '→'}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.input,
    borderRadius: Dimensions_.radius.lg,
    borderWidth: 1.5,
    paddingHorizontal: Dimensions_.spacing.md,
    height: 52,
    gap: Dimensions_.spacing.sm,
  },
  pin: { fontSize: 16 },
  input: {
    flex: 1,
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: Colors.text.primary,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  clearText: {
    fontSize: FontSize.xs,
    color: Colors.text.muted,
  },
  goBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goBtnDisabled: {
    opacity: 0.45,
  },
  goText: {
    fontSize: FontSize.base,
    color: Colors.text.inverse,
    fontFamily: FontFamily.bold,
  },
});

export default EnterAddressBar;
