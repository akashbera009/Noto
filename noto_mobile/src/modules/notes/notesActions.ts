import { createAsyncThunk } from '@reduxjs/toolkit';
import { notesService } from '../../services/notesService';
import type {
  Note,
  NoteExplanation,
  NoteSummary,
  CreateNotePayload,
  UpdateNotePayload,
} from '../../utils/types';
import Strings from '../../utils/strings';

export const fetchNotesThunk = createAsyncThunk<
  Note[],
  void,
  { rejectValue: { status: number; message: string } }
>('notes/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await notesService.getNotes();
  } catch (error: any) {
    return rejectWithValue({
      status: error?.status ?? 0,
      message: error?.message ?? Strings.errors.generic,
    });
  }
});

export const createNoteThunk = createAsyncThunk<
  Note,
  CreateNotePayload,
  { rejectValue: { status: number; message: string } }
>('notes/create', async (payload, { rejectWithValue }) => {
  try {
    return await notesService.createNote(payload);
  } catch (error: any) {
    return rejectWithValue({
      status: error?.status ?? 0,
      message: error?.message ?? Strings.errors.generic,
    });
  }
});

export const updateNoteThunk = createAsyncThunk<
  Note,
  { id: string; data: UpdateNotePayload },
  { rejectValue: { status: number; message: string } }
>('notes/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await notesService.updateNote(id, data);
  } catch (error: any) {
    return rejectWithValue({
      status: error?.status ?? 0,
      message: error?.message ?? Strings.errors.generic,
    });
  }
});

export const deleteNoteThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: { status: number; message: string } }
>('notes/delete', async (noteId, { rejectWithValue }) => {
  try {
    await notesService.deleteNote(noteId);
    return noteId;
  } catch (error: any) {
    return rejectWithValue({
      status: error?.status ?? 0,
      message: error?.message ?? Strings.errors.generic,
    });
  }
});

export const explainNoteThunk = createAsyncThunk<
  NoteExplanation,
  { id: string; mode: 'simple' | 'technical'; regenerate?: boolean },
  { rejectValue: { status: number; message: string } }
>('notes/explain', async ({ id, mode, regenerate = false }, { rejectWithValue }) => {
  try {
    return await notesService.explainNote(id, mode, regenerate);
  } catch (error: any) {
    return rejectWithValue({
      status: error?.status ?? 0,
      message: error?.message ?? Strings.ai.errorExplaining,
    });
  }
});

export const summarizeNoteThunk = createAsyncThunk<
  NoteSummary,
  { id: string; regenerate?: boolean },
  { rejectValue: { status: number; message: string } }
>('notes/summarize', async ({ id, regenerate = false }, { rejectWithValue }) => {
  try {
    return await notesService.summarizeNote(id, regenerate);
  } catch (error: any) {
    return rejectWithValue({
      status: error?.status ?? 0,
      message: error?.message ?? Strings.ai.errorSummarizing,
    });
  }
});
