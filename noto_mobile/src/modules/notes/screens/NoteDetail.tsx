import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { Colors } from '../../../utils/colors';
import { FontFamily, FontSize, FontWeight } from '../../../utils/fonts';
import { Dimensions_ } from '../../../utils/dimensions';
import Strings from '../../../utils/strings';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { deleteNoteThunk } from '../notesActions';
import { countWords } from '../../../utils/commonFunctions';
import { ScreenNames } from '../../../utils/screenNames';
import CustomHeader from '../../../components/CustomHeader';
import showSnackbar from '../../../utils/showSnackbar';
import AIExplainModal from '../../../modals/AIExplainModal';
import AISummarizeModal from '../../../modals/AISummarizeModal';
import AIActionSheet from '../../../modals/AIActionSheet';
import type { NotesNavProp, NoteDetailRouteProp } from '../../../utils/types';

interface Props {
  navigation: NotesNavProp;
  route: NoteDetailRouteProp;
}

const NoteDetail: React.FC<Props> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showExplain, setShowExplain] = useState(false);
  const [showSummarize, setShowSummarize] = useState(false);

  const note = useAppSelector(s =>
    s.notes.notes.find(n => n.id === route.params.noteId) ??
    s.notes.selectedNote,
  );

  if (!note) {
    return (
      <View style={styles.container}>
        <CustomHeader title="Note" onBack={() => navigation.goBack()} />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Note not found.</Text>
        </View>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      Strings.notes.confirmDelete,
      Strings.notes.confirmDeleteSubtitle,
      [
        { text: Strings.notes.cancel, style: 'cancel' },
        {
          text: Strings.notes.delete,
          style: 'destructive',
          onPress: async () => {
            await dispatch(deleteNoteThunk(note.id));
            showSnackbar.success('Note deleted');
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <CustomHeader
        title=""
        onBack={() => navigation.goBack()}
        rightComponent={
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() =>
                navigation.navigate(ScreenNames.EDIT_NOTE, { noteId: note.id })
              }
            >
              <Text style={styles.headerBtnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerBtn, styles.deleteBtn]}
              onPress={handleDelete}
            >
              <Text style={styles.deleteBtnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Long-press area wraps the scroll content */}
      {/* <TouchableOpacity
        activeOpacity={1}
        onLongPress={() => setShowActionSheet(true)}
        delayLongPress={400}
        style={styles.flex}
      > */}
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <Text style={styles.title}>{note.title}</Text>

          {/* Meta row */}
          <View style={styles.meta}>
            <Text style={styles.metaText}>{countWords(note.content)} words</Text>
            <View style={styles.metaDot} />
            <Text style={styles.metaText}>{note.content.length} chars</Text>
          </View>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <View style={styles.tags}>
              {note.tags.map(tag => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Content */}
          <Text style={styles.content}>{note.content}</Text>

          {/* Long press hint */}
          <Text style={styles.longPressHint}>Hold to open AI tools</Text>
        </ScrollView>
      {/* </TouchableOpacity> */}

      {/* AI FAB — always visible */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowActionSheet(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.fabIcon}>✦</Text>
          <Text style={styles.fabLabel}>AI Tools</Text>
        </TouchableOpacity>
      </View>

      {/* AI Action Sheet (picker) */}
      <AIActionSheet
        visible={showActionSheet}
        noteTitle={note.title}
        onClose={() => setShowActionSheet(false)}
        onExplain={() => setShowExplain(true)}
        onSummarize={() => setShowSummarize(true)}
      />

      {/* AI Explain Modal */}
      <AIExplainModal
        visible={showExplain}
        onClose={() => setShowExplain(false)}
        noteId={note.id}
      />

      {/* AI Summarize Modal */}
      <AISummarizeModal
        visible={showSummarize}
        onClose={() => setShowSummarize(false)}
        noteId={note.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  flex: { flex: 1 },
  scroll: {
    padding: Dimensions_.spacing['2xl'],
    paddingBottom: 140,
  },
  title: {
    fontSize: FontSize['3xl'],
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    lineHeight: 40,
    marginBottom: Dimensions_.spacing.md,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Dimensions_.spacing.sm,
    marginBottom: Dimensions_.spacing.base,
  },
  metaText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.text.muted,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.text.muted,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Dimensions_.spacing.sm,
    marginBottom: Dimensions_.spacing.base,
  },
  tag: {
    backgroundColor: Colors.accent.muted,
    borderRadius: Dimensions_.radius.full,
    paddingHorizontal: Dimensions_.spacing.md,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.accent.glow,
  },
  tagText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    color: Colors.accent.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.subtle,
    marginBottom: Dimensions_.spacing.xl,
  },
  content: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: Colors.text.secondary,
    lineHeight: 26,
  },
  longPressHint: {
    marginTop: Dimensions_.spacing['2xl'],
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.text.muted,
    textAlign: 'center',
    opacity: 0.4,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: FontSize.base,
    color: Colors.text.muted,
  },
  headerActions: {
    position: 'absolute',
    flexDirection: 'row',
    gap: Dimensions_.spacing.sm,
  },
  headerBtn: {
    justifyContent: 'center',
    paddingHorizontal: Dimensions_.spacing.md,
    paddingVertical: Dimensions_.spacing.xs,
    borderRadius: Dimensions_.radius.sm,
    backgroundColor: Colors.bg.elevated,
  },
  headerBtnText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.accent.primary,
  },
  deleteBtn: {
    backgroundColor: 'rgba(255,77,106,0.12)',
  },
  deleteBtnText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.status.error,
  },
  fabContainer: {
    position: 'absolute',
    bottom: Dimensions_.spacing['2xl'],
    alignSelf: 'center',
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Dimensions_.spacing.sm,
    backgroundColor: Colors.bg.elevated,
    borderWidth: 1,
    borderColor: Colors.border.accent,
    borderRadius: Dimensions_.radius.full,
    paddingHorizontal: Dimensions_.spacing.xl,
    paddingVertical: Dimensions_.spacing.md,
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  fabIcon: {
    fontSize: 16,
    color: Colors.accent.primary,
  },
  fabLabel: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    color: Colors.accent.primary,
  },
});

export default NoteDetail;
