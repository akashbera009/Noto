import React, { useEffect } from 'react';
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
import { summarizeNoteThunk } from '../modules/notes/notesActions';
import { clearSummary } from '../modules/notes/notesSlice';
import showSnackbar from '../utils/showSnackbar';
import CustomButton from '../components/CustomButton';

interface Props {
  visible: boolean;
  onClose: () => void;
  noteId: string;
}

const AISummarizeModal: React.FC<Props> = ({ visible, onClose, noteId }) => {
  const dispatch = useAppDispatch();
  const { summary, isSummarizing, summarizeError } = useAppSelector(s => s.notes);
  const fadeOpacity = useFadeIn(300);

  useEffect(() => {
    if (visible && !summary && !isSummarizing) {
      dispatch(summarizeNoteThunk({ id: noteId }));
    }
    if (!visible) {
      dispatch(clearSummary());
    }
  }, [visible]);

  const handleCopy = () => {
    if (!summary?.summary) return;
    Clipboard.setString(summary.summary);
    showSnackbar.success(Strings.ai.copied);
  };

  const handleRetry = () => {
    dispatch(summarizeNoteThunk({ id: noteId }));
  };

  const handleRegenerate = () => {
    dispatch(summarizeNoteThunk({ id: noteId, regenerate: true }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          onPress={onClose}
          activeOpacity={1}
        />

        <Animated.View style={[styles.sheet, { opacity: fadeOpacity }]}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.aiIcon}>
                <Text style={styles.aiIconText}>⚡</Text>
              </View>
              <View>
                <Text style={styles.headerTitle}>{Strings.ai.aiSummarize}</Text>
                <Text style={styles.headerSubtitle}>{Strings.ai.aiSubtitle}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentInner}
          >
            {isSummarizing ? (
              <View style={styles.loadingState}>
                <ActivityIndicator color={Colors.accent.primary} size="large" />
                <Text style={styles.loadingText}>{Strings.ai.summarizing}</Text>
                <View style={styles.loadingDots}>
                  {[0, 1, 2].map(i => (
                    <View
                      key={i}
                      style={[styles.dot, { opacity: 0.3 + i * 0.3 }]}
                    />
                  ))}
                </View>
              </View>
            ) : summarizeError ? (
              <View style={styles.errorState}>
                <Text style={styles.errorIcon}>⚠</Text>
                <Text style={styles.errorText}>{Strings.ai.errorSummarizing}</Text>
                <CustomButton
                  label={Strings.ai.tryAgain}
                  onPress={handleRetry}
                  variant="secondary"
                  size="sm"
                  fullWidth={false}
                  style={styles.retryBtn}
                />
              </View>
            ) : summary ? (
              <View>
                <View style={styles.summaryBadge}>
                  <Text style={styles.summaryBadgeText}>Summary</Text>
                </View>
                <Text style={styles.summaryText}>{summary.summary}</Text>
              </View>
            ) : null}
          </ScrollView>

          {/* Actions — Copy + Re-generate */}
          {summary && !isSummarizing && (
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
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
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
  summaryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderRadius: Dimensions_.radius.full,
    paddingHorizontal: Dimensions_.spacing.md,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    marginBottom: Dimensions_.spacing.base,
  },
  summaryBadgeText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    color: 'rgb(6, 182, 212)',
  },
  summaryText: {
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

export default AISummarizeModal;
