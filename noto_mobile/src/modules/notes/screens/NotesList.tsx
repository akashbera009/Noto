import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { Colors } from '../../../utils/colors';
import { FontFamily, FontSize, FontWeight } from '../../../utils/fonts';
import { Dimensions_ } from '../../../utils/dimensions';
import Strings from '../../../utils/strings';
import { useAppDispatch, useAppSelector, useDebounce } from '../../../utils/hooks';
import { fetchNotesThunk } from '../notesActions';
import { setSearchQuery, setSelectedNote } from '../notesSlice';
import { truncateText, countWords } from '../../../utils/commonFunctions';
import { ScreenNames } from '../../../utils/screenNames';
import CustomInput from '../../../components/CustomInput';
import CustomHeader from '../../../components/CustomHeader';
import AIActionSheet from '../../../modals/AIActionSheet';
import AIExplainModal from '../../../modals/AIExplainModal';
import AISummarizeModal from '../../../modals/AISummarizeModal';
import type { Note, NotesNavProp } from '../../../utils/types';
import { Animated } from 'react-native';
import { useFadeIn } from '../../../utils/hooks';

interface Props {
  navigation: NotesNavProp;
}

const NoteCard: React.FC<{
  note: Note;
  onPress: () => void;
  onLongPress: () => void;
  index: number;
}> = ({ note, onPress, onLongPress, index }) => {
  const opacity = useFadeIn(300, index * 60);

  return (
    <Animated.View style={{ opacity }}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onLongPress={onLongPress}
        delayLongPress={400}
        activeOpacity={0.75}
      >
        <Text style={styles.cardTitle} numberOfLines={1}>
          {note.title}
        </Text>

        <Text style={styles.cardPreview} numberOfLines={2}>
          {truncateText(note.content, 120)}
        </Text>

        {note.tags && note.tags.length > 0 && (
          <View style={styles.tagRow}>
            {note.tags.slice(0, 3).map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.cardMeta}>
          <Text style={styles.metaWords}>{countWords(note.content)} words</Text>
          <View style={styles.aiHint}>
            <Text style={styles.aiHintText}>✦ Hold for AI</Text>
          </View>
        </View>

        {/* Accent line */}
        <View style={styles.cardAccent} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const EmptyState: React.FC = () => (
  <View style={styles.empty}>
    <Text style={styles.emptyIcon}>📝</Text>
    <Text style={styles.emptyTitle}>{Strings.notes.noNotes}</Text>
    <Text style={styles.emptySubtitle}>{Strings.notes.noNotesSubtitle}</Text>
  </View>
);

const NotesList: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { notes, isLoading, searchQuery } = useAppSelector(s => s.notes);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // AI sheet state — tracks which note was long-pressed
  const [aiNote, setAiNote] = useState<Note | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showExplain, setShowExplain] = useState(false);
  const [showSummarize, setShowSummarize] = useState(false);

  useEffect(() => {
    dispatch(fetchNotesThunk());
  }, []);

  const filteredNotes = notes
    ?.filter(n => {
      if (!debouncedSearch) return true;
      const q = debouncedSearch.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q))
      );
    });

  const handleNotePress = useCallback(
    (note: Note) => {
      dispatch(setSelectedNote(note));
      navigation.navigate(ScreenNames.NOTE_DETAIL, { noteId: note.id });
    },
    [dispatch, navigation],
  );

  const handleNoteLongPress = useCallback((note: Note) => {
    setAiNote(note);
    setShowActionSheet(true);
  }, []);

  const handleRefresh = useCallback(() => {
    dispatch(fetchNotesThunk());
  }, [dispatch]);

  const closeActionSheet = () => setShowActionSheet(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <CustomHeader
        title={Strings.notes.title}
        rightComponent={
          <TouchableOpacity
            style={styles.newBtn}
            onPress={() => navigation.navigate(ScreenNames.CREATE_NOTE)}
          >
            <Text style={styles.newBtnText}>+</Text>
          </TouchableOpacity>
        }
      />

      {/* Search */}
      <View style={styles.searchBar}>
        <CustomInput
          placeholder={Strings.common.search}
          value={searchQuery}
          onChangeText={q => dispatch(setSearchQuery(q))}
          style={styles.searchInput}
        />
      </View>

      {isLoading && notes?.length === 0 ? (
        <View style={styles.loader}>
          <ActivityIndicator color={Colors.accent.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={filteredNotes}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState />}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              tintColor={Colors.accent.primary}
              colors={[Colors.accent.primary]}
            />
          }
          renderItem={({ item, index }) => (
            <NoteCard
              note={item}
              onPress={() => handleNotePress(item)}
              onLongPress={() => handleNoteLongPress(item)}
              index={index}
            />
          )}
        />
      )}

      {/* AI Action Sheet */}
      {aiNote && (
        <>
          <AIActionSheet
            visible={showActionSheet}
            noteTitle={aiNote.title}
            onClose={closeActionSheet}
            onExplain={() => setShowExplain(true)}
            onSummarize={() => setShowSummarize(true)}
          />
          <AIExplainModal
            visible={showExplain}
            onClose={() => setShowExplain(false)}
            noteId={aiNote.id}
          />
          <AISummarizeModal
            visible={showSummarize}
            onClose={() => setShowSummarize(false)}
            noteId={aiNote.id}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  searchBar: {
    paddingHorizontal: Dimensions_.spacing.base,
    paddingVertical: Dimensions_.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  searchInput: {
    marginBottom: 0,
  },
  list: {
    padding: Dimensions_.spacing.base,
    gap: Dimensions_.spacing.md,
    paddingBottom: 100,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: Colors.bg.card,
    borderRadius: Dimensions_.radius.lg,
    padding: Dimensions_.spacing.base,
    borderWidth: 1,
    borderColor: Colors.border.default,
    overflow: 'hidden',
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 3,
    bottom: 0,
    backgroundColor: Colors.accent.primary,
    opacity: 0.5,
    borderTopLeftRadius: Dimensions_.radius.lg,
    borderBottomLeftRadius: Dimensions_.radius.lg,
  },
  cardTitle: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    color: Colors.text.primary,
    marginBottom: Dimensions_.spacing.xs,
    paddingLeft: Dimensions_.spacing.xs,
  },
  cardPreview: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.text.secondary,
    lineHeight: 20,
    paddingLeft: Dimensions_.spacing.xs,
    marginBottom: Dimensions_.spacing.md,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Dimensions_.spacing.xs,
    paddingLeft: Dimensions_.spacing.xs,
    marginBottom: Dimensions_.spacing.sm,
  },
  tag: {
    backgroundColor: Colors.accent.muted,
    borderRadius: Dimensions_.radius.full,
    paddingHorizontal: Dimensions_.spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.accent.glow,
  },
  tagText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    color: Colors.accent.primary,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: Dimensions_.spacing.xs,
  },
  metaWords: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.text.muted,
  },
  aiHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  aiHintText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.accent.primary,
    opacity: 0.5,
  },
  newBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  newBtnText: {
    fontSize: 24,
    color: Colors.text.inverse,
    lineHeight: 28,
    fontWeight: '300',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: Dimensions_.spacing.md,
  },
  emptyIcon: { fontSize: 48 },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    color: Colors.text.primary,
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.text.muted,
    textAlign: 'center',
  },
});

export default NotesList;
