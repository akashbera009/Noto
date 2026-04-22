import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../utils/colors';
import { FontFamily, FontSize } from '../utils/fonts';
import { Dimensions_ } from '../utils/dimensions';
import { toastBus } from '../utils/showSnackbar';
import type { ToastConfig } from '../utils/types';

const ICON_MAP = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
} as const;

const COLOR_MAP = {
  success: Colors.status.success,
  error: Colors.status.error,
  info: Colors.accent.primary,
  warning: Colors.status.warning,
} as const;

const ToastItem: React.FC<{ toast: ToastConfig; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  const translateY = useRef(new Animated.Value(-80)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 70,
        friction: 10,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => dismiss(), toast.duration ?? 3000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -80,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss(toast.id));
  };

  const accent = COLOR_MAP[toast.type];

  return (
    <Animated.View
      style={[styles.toast, { transform: [{ translateY }], opacity }]}
    >
      <View style={[styles.indicator, { backgroundColor: accent }]} />
      <View style={styles.iconContainer}>
        <Text style={[styles.icon, { color: accent }]}>{ICON_MAP[toast.type]}</Text>
      </View>
      <Text style={styles.message} numberOfLines={2}>
        {toast.message}
      </Text>
      <TouchableOpacity onPress={dismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={styles.close}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  useEffect(() => {
    const unsubShow = toastBus.onShow(toast => {
      setToasts(prev => [toast, ...prev].slice(0, 3));
    });
    const unsubDismiss = toastBus.onDismiss(id => {
      setToasts(prev => prev.filter(t => t.id !== id));
    });
    return () => {
      unsubShow();
      unsubDismiss();
    };
  }, []);

  if (!toasts.length) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={id => setToasts(prev => prev.filter(t => t.id !== id))}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Dimensions_.statusBarHeight + Dimensions_.spacing.base,
    left: Dimensions_.spacing.base,
    right: Dimensions_.spacing.base,
    zIndex: 9999,
    gap: Dimensions_.spacing.sm,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.elevated,
    borderRadius: Dimensions_.radius.lg,
    paddingVertical: Dimensions_.spacing.md,
    paddingHorizontal: Dimensions_.spacing.base,
    borderWidth: 1,
    borderColor: Colors.border.default,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: Dimensions_.radius.lg,
    borderBottomLeftRadius: Dimensions_.radius.lg,
  },
  iconContainer: {
    marginRight: Dimensions_.spacing.md,
    marginLeft: Dimensions_.spacing.xs,
  },
  icon: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  message: {
    flex: 1,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.text.primary,
    lineHeight: 18,
  },
  close: {
    fontSize: FontSize.xs,
    color: Colors.text.muted,
    marginLeft: Dimensions_.spacing.sm,
  },
});

export default ToastContainer;
