import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors } from '../../../utils/colors';
import { FontFamily, FontSize, FontWeight } from '../../../utils/fonts';
import { Dimensions_ } from '../../../utils/dimensions';
import Strings from '../../../utils/strings';
import { Constants } from '../../../utils/constants';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { createNoteThunk, updateNoteThunk } from '../notesActions';
import CustomHeader from '../../../components/CustomHeader';
import CustomInput from '../../../components/CustomInput';
import CustomButton from '../../../components/CustomButton';
import showSnackbar from '../../../utils/showSnackbar';
import type { NotesNavProp, EditNoteRouteProp } from '../../../utils/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CreateProps {
  navigation: NotesNavProp;
  route?: undefined;
}

interface EditProps {
  navigation: NotesNavProp;
  route: EditNoteRouteProp;
}

type Props = CreateProps | EditProps;

const NoteEditor: React.FC<Props> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const { isSaving } = useAppSelector(s => s.notes);

  const editingNote = useAppSelector(s =>
    route?.params?.noteId
      ? s.notes.notes.find(n => n.id === route.params.noteId)
      : null,
  );

  const isEditing = Boolean(editingNote);

  const [title, setTitle] = useState(editingNote?.title ?? '');
  const [content, setContent] = useState(editingNote?.content ?? '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(editingNote?.tags ?? []);
  const [errors, setErrors] = useState({ title: '', content: '' });

  const validate = (): boolean => {
    const errs = { title: '', content: '' };
    if (!title.trim()) errs.title = Strings.errors.noteTitle;
    if (!content.trim()) errs.content = Strings.errors.noteContent;
    setErrors(errs);
    return !errs.title && !errs.content;
  };

  const handleSave = async () => {
    if (!validate()) return;

    if (isEditing && editingNote) {
      const result = await dispatch(
        updateNoteThunk({
          id: editingNote.id,
          data: { title: title.trim(), content: content.trim(), tags },
        }),
      );
      if (updateNoteThunk.fulfilled.match(result)) {
        showSnackbar.success('Note updated');
        navigation.goBack();
      } else {
        showSnackbar.error('Failed to update note');
      }
    } else {
      const result = await dispatch(
        createNoteThunk({ title: title.trim(), content: content.trim(), tags }),
      );
      if (createNoteThunk.fulfilled.match(result)) {
        showSnackbar.success('Note saved');
        navigation.goBack();
      } else {
        showSnackbar.error('Failed to save note');
      }
    }
  };

  const addTag = () => {
    const cleaned = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (cleaned && !tags.includes(cleaned) && tags.length < 8) {
      setTags(prev => [...prev, cleaned]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  const insets = useSafeAreaInsets()

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" />

      <CustomHeader
        title={isEditing ? Strings.notes.editNote : Strings.notes.newNote}
        onBack={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity onPress={handleSave} disabled={isSaving}>
            <Text style={[styles.saveText, isSaving && styles.saveDisabled]}>
              {isSaving ? 'Saving…' : 'Save'}
            </Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <CustomInput
          placeholder={Strings.notes.titlePlaceholder}
          value={title}
          onChangeText={setTitle}
          error={errors.title}
          maxLength={Constants.NOTE_TITLE_MAX_LENGTH}
          autoFocus={!isEditing}
          inputStyle={styles.titleInput}
        />

        {/* Tags */}
        <View style={styles.tagsSection}>
          <View style={styles.tagRow}>
            {tags.map(tag => (
              <TouchableOpacity
                key={tag}
                style={styles.tag}
                onPress={() => removeTag(tag)}
              >
                <Text style={styles.tagText}>#{tag} ✕</Text>
              </TouchableOpacity>
            ))}
          </View>
          <CustomInput
            placeholder="Add tag…"
            value={tagInput}
            onChangeText={setTagInput}
            onBlur={addTag}
            autoCapitalize="none"
            style={styles.tagInputWrapper}
          />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Content */}
        <CustomInput
          placeholder={Strings.notes.contentPlaceholder}
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={20}
          error={errors.content}
          maxLength={Constants.NOTE_CONTENT_MAX_LENGTH}
          inputStyle={styles.contentInput}
          style={styles.contentWrapper}
        />
      </ScrollView>

      {/* Bottom action */}
      <View style={[styles.bottomBar, { bottom: insets.bottom }]}>
        <View style={styles.statsRow}>
          <Text style={styles.statsText}>
            {content.split(/\s+/).filter(Boolean).length} words · {content.length} chars
          </Text>
        </View>
        <CustomButton
          label={isEditing ? Strings.notes.update : Strings.notes.save}
          onPress={handleSave}
          loading={isSaving}
          size="md"
          fullWidth={false}
          style={styles.saveBtn}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.bg.primary },
  scroll: {
    padding: Dimensions_.spacing['2xl'],
    paddingBottom: 100,
  },
  titleInput: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    color: Colors.text.primary,
  },
  tagsSection: {
    marginBottom: Dimensions_.spacing.base,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Dimensions_.spacing.sm,
    marginBottom: Dimensions_.spacing.sm,
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
  tagInputWrapper: { marginBottom: 0 },
  divider: {
    height: 1,
    backgroundColor: Colors.border.subtle,
    marginVertical: Dimensions_.spacing.base,
  },
  contentWrapper: { marginBottom: 0 },
  contentInput: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: Colors.text.secondary,
    lineHeight: 26,
    minHeight: 240,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Dimensions_.spacing.xl,
    paddingVertical: Dimensions_.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.subtle,
    backgroundColor: Colors.bg.primary,
  },
  statsRow: {},
  statsText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.text.muted,
  },
  saveBtn: { minWidth: 100 },
  saveText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    color: Colors.accent.primary,
  },
  saveDisabled: { opacity: 0.5 },
});

export default NoteEditor;
