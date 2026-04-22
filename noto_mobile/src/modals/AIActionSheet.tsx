import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Pressable,
} from 'react-native';
import { Colors } from '../utils/colors';
import { FontFamily, FontSize, FontWeight } from '../utils/fonts';
import { Dimensions_ } from '../utils/dimensions';

interface Props {
  visible: boolean;
  noteTitle: string;
  onClose: () => void;
  onExplain: () => void;
  onSummarize: () => void;
}

const AIActionSheet: React.FC<Props> = ({
  visible,
  noteTitle,
  onClose,
  onExplain,
  onSummarize,
}) => {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 12,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleExplain = () => {
    onClose();
    setTimeout(onExplain, 200);
  };

  const handleSummarize = () => {
    onClose();
    setTimeout(onSummarize, 200);
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.aiIconBadge}>
              <Text style={styles.aiIconText}>✦</Text>
            </View>
            <View style={styles.headerTextBlock}>
              <Text style={styles.headerTitle}>AI Tools</Text>
              <Text style={styles.headerNote} numberOfLines={1}>
                {noteTitle}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Action: Explain */}
          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleExplain}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, styles.explainIcon]}>
              <Text style={styles.actionEmoji}>💡</Text>
            </View>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Explain Note</Text>
              <Text style={styles.actionSubtitle}>
                Get a simple or technical explanation
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {/* Action: Summarize */}
          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleSummarize}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, styles.summarizeIcon]}>
              <Text style={styles.actionEmoji}>⚡</Text>
            </View>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Summarize Note</Text>
              <Text style={styles.actionSubtitle}>
                Condense into a concise summary
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>✦ Powered by local AI</Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    backgroundColor: Colors.bg.modal,
    borderTopLeftRadius: Dimensions_.radius['2xl'],
    borderTopRightRadius: Dimensions_.radius['2xl'],
    paddingBottom: Dimensions_.spacing['3xl'],
    borderTopWidth: 1,
    borderColor: Colors.border.accent,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: Colors.border.default,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Dimensions_.spacing.md,
    marginBottom: Dimensions_.spacing.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Dimensions_.spacing.xl,
    marginBottom: Dimensions_.spacing.base,
    gap: Dimensions_.spacing.md,
  },
  aiIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.accent.muted,
    borderWidth: 1,
    borderColor: Colors.border.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiIconText: {
    fontSize: 18,
    color: Colors.accent.primary,
  },
  headerTextBlock: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    color: Colors.text.primary,
  },
  headerNote: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.text.muted,
    marginTop: 2,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.bg.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.subtle,
    marginHorizontal: Dimensions_.spacing.xl,
    marginBottom: Dimensions_.spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Dimensions_.spacing.xl,
    paddingVertical: Dimensions_.spacing.base,
    gap: Dimensions_.spacing.md,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: Dimensions_.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  explainIcon: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  summarizeIcon: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  actionEmoji: {
    fontSize: 22,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    color: Colors.text.primary,
  },
  actionSubtitle: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.text.muted,
    marginTop: 2,
  },
  chevron: {
    fontSize: 22,
    color: Colors.text.muted,
    fontWeight: '300',
  },
  footer: {
    alignItems: 'center',
    marginTop: Dimensions_.spacing.lg,
  },
  footerText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.text.muted,
    opacity: 0.6,
  },
});

export default AIActionSheet;
