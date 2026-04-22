import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
  Clipboard,
} from 'react-native';
import { Colors } from '../utils/colors';
import { FontFamily, FontSize, FontWeight } from '../utils/fonts';
import { Dimensions_ } from '../utils/dimensions';
import Strings from '../utils/strings';
import { useAppDispatch, useAppSelector, useFadeIn } from '../utils/hooks';
import { explainNoteThunk } from '../modules/notes/notesActions';
import { clearExplanation } from '../modules/notes/notesSlice';
import showSnackbar from '../utils/showSnackbar';
import CustomButton from '../components/CustomButton';

interface Props {
  visible: boolean;
  onClose: () => void;
  noteId: string;
}

type ExplainMode = 'simple' | 'technical';

const AIExplainModal: React.FC<Props> = ({ visible, onClose, noteId }) => {
  const dispatch = useAppDispatch();
  const { explanation, isExplaining, explainError } = useAppSelector(s => s.notes);
  const [mode, setMode] = useState<ExplainMode>('simple');
  const fadeOpacity = useFadeIn(300);

  useEffect(() => {
    if (visible && !explanation && !isExplaining) {
      dispatch(explainNoteThunk({ id: noteId, mode }));
    }
    if (!visible) {
      dispatch(clearExplanation());
    }
  }, [visible]);

  // Re-fetch when mode changes
  const handleModeChange = (newMode: ExplainMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    dispatch(explainNoteThunk({ id: noteId, mode: newMode }));
  };

  const currentText = explanation?.explanation ?? '';

  const handleCopy = () => {
    if (!currentText) return;
    Clipboard.setString(currentText);
    showSnackbar.success(Strings.ai.copied);
  };

  const handleRetry = () => {
    dispatch(explainNoteThunk({ id: noteId, mode }));
  };

  const handleRegenerate = () => {
    dispatch(explainNoteThunk({ id: noteId, mode, regenerate: true }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />

        <Animated.View style={[styles.sheet, { opacity: fadeOpacity }]}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.aiIcon}>
                <Text style={styles.aiIconText}>💡</Text>
              </View>
              <View>
                <Text style={styles.headerTitle}>{Strings.ai.aiExplain}</Text>
                <Text style={styles.headerSubtitle}>{Strings.ai.aiSubtitle}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Mode Toggle */}
          <View style={styles.toggle}>
            {(['simple', 'technical'] as ExplainMode[]).map(m => (
              <TouchableOpacity
                key={m}
                style={[styles.toggleBtn, mode === m && styles.toggleActive]}
                onPress={() => handleModeChange(m)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    mode === m && styles.toggleTextActive,
                  ]}
                >
                  {m === 'simple' ? Strings.ai.simpleMode : Strings.ai.technicalMode}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentInner}
          >
            {isExplaining ? (
              <View style={styles.loadingState}>
                <ActivityIndicator color={Colors.accent.primary} size="large" />
                <Text style={styles.loadingText}>{Strings.ai.explaining}</Text>
                <View style={styles.loadingDots}>
                  {[0, 1, 2].map(i => (
                    <View
                      key={i}
                      style={[styles.dot, { opacity: 0.3 + i * 0.3 }]}
                    />
                  ))}
                </View>
              </View>
            ) : explainError ? (
              <View style={styles.errorState}>
                <Text style={styles.errorIcon}>⚠</Text>
                <Text style={styles.errorText}>{Strings.ai.errorExplaining}</Text>
                <CustomButton
                  label={Strings.ai.tryAgain}
                  onPress={handleRetry}
                  variant="secondary"
                  size="sm"
                  fullWidth={false}
                  style={styles.retryBtn}
                />
              </View>
            ) : (
              <Text style={styles.explanationText}>{currentText}</Text>
            )}
          </ScrollView>

          {/* Actions — Copy + Re-generate */}
          {explanation && !isExplaining && (
            <View style={styles.actions}>
              <CustomButton
                label={Strings.ai.copyExplanation}
                onPress={handleCopy}
                variant="secondary"
                size="md"
                style={styles.actionBtn}
              />
              <TouchableOpacity
                style={styles.regenBtn}
                onPress={handleRegenerate}
                activeOpacity={0.75}
              >
                <Text style={styles.regenIcon}>↺</Text>
                <Text style={styles.regenText}>Re-generate</Text>
              </TouchableOpacity>
            </View>
          )}
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
  },
  sheet: {
    backgroundColor: Colors.bg.modal,
    borderTopLeftRadius: Dimensions_.radius['2xl'],
    borderTopRightRadius: Dimensions_.radius['2xl'],
    paddingBottom: Dimensions_.spacing['3xl'],
    borderTopWidth: 1,
    borderColor: Colors.border.default,
    maxHeight: Dimensions_.screenHeight * 0.75,
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
    justifyContent: 'space-between',
    paddingHorizontal: Dimensions_.spacing.xl,
    marginBottom: Dimensions_.spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Dimensions_.spacing.md,
  },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiIconText: {
    fontSize: 18,
  },
  headerTitle: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    color: Colors.text.primary,
  },
  headerSubtitle: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.text.muted,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.bg.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  toggle: {
    flexDirection: 'row',
    marginHorizontal: Dimensions_.spacing.xl,
    backgroundColor: Colors.bg.elevated,
    borderRadius: Dimensions_.radius.lg,
    padding: 4,
    marginBottom: Dimensions_.spacing.lg,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: Dimensions_.spacing.sm,
    alignItems: 'center',
    borderRadius: Dimensions_.radius.md,
  },
  toggleActive: {
    backgroundColor: Colors.accent.primary,
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  toggleText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.text.secondary,
  },
  toggleTextActive: {
    color: Colors.text.inverse,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },
  content: {
    paddingHorizontal: Dimensions_.spacing.xl,
    maxHeight: 300,
  },
  contentInner: {
    paddingBottom: Dimensions_.spacing.base,
  },
  loadingState: {
    alignItems: 'center',
    paddingVertical: Dimensions_.spacing['3xl'],
    gap: Dimensions_.spacing.base,
  },
  loadingText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.text.secondary,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent.primary,
  },
  errorState: {
    alignItems: 'center',
    paddingVertical: Dimensions_.spacing['2xl'],
    gap: Dimensions_.spacing.md,
  },
  errorIcon: {
    fontSize: 32,
  },
  errorText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  retryBtn: { marginTop: Dimensions_.spacing.sm },
  explanationText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: Colors.text.secondary,
    lineHeight: 26,
  },
  actions: {
    paddingHorizontal: Dimensions_.spacing.xl,
    paddingTop: Dimensions_.spacing.base,
    gap: Dimensions_.spacing.sm,
  },
  actionBtn: {
    marginBottom: 0,
  },
  regenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Dimensions_.spacing.sm,
    paddingVertical: Dimensions_.spacing.md,
    borderRadius: Dimensions_.radius.lg,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    backgroundColor: Colors.bg.elevated,
  },
  regenIcon: {
    fontSize: 16,
    color: Colors.text.muted,
  },
  regenText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.text.muted,
  },
});

export default AIExplainModal;
