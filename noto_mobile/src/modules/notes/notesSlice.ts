import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { NotesState, Note, NoteExplanation, NoteSummary } from '../../utils/types';
import {
  fetchNotesThunk,
  createNoteThunk,
  updateNoteThunk,
  deleteNoteThunk,
  explainNoteThunk,
  summarizeNoteThunk,
} from './notesActions';

const initialState: NotesState = {
  notes: [],
  selectedNote: null,
  explanation: null,
  summary: null,
  isLoading: false,
  isExplaining: false,
  isSummarizing: false,
  isSaving: false,
  error: null,
  explainError: null,
  summarizeError: null,
  searchQuery: '',
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setSelectedNote(state, action: PayloadAction<Note | null>) {
      state.selectedNote = action.payload;
      state.explanation = null;
      state.summary = null;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    clearExplanation(state) {
      state.explanation = null;
      state.explainError = null;
    },
    clearSummary(state) {
      state.summary = null;
      state.summarizeError = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    // Fetch notes
    builder
      .addCase(fetchNotesThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notes = action.payload;
      })
      .addCase(fetchNotesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message as string;
      });

    // Create note
    builder
      .addCase(createNoteThunk.pending, state => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(createNoteThunk.fulfilled, (state, action) => {
        state.isSaving = false;
        state.notes?.unshift(action.payload);
      })
      .addCase(createNoteThunk.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload?.message as string;
      });

    // Update note
    builder
      .addCase(updateNoteThunk.pending, state => {
        state.isSaving = true;
      })
      .addCase(updateNoteThunk.fulfilled, (state, action) => {
        state.isSaving = false;
        const idx = state.notes.findIndex(n => n.id === action.payload.id);
        if (idx !== -1) state.notes[idx] = action.payload;
        if (state.selectedNote?.id === action.payload.id) {
          state.selectedNote = action.payload;
        }
      })
      .addCase(updateNoteThunk.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload?.message as string;
      });

    // Delete note
    builder
      .addCase(deleteNoteThunk.fulfilled, (state, action) => {
        state.notes = state.notes.filter(n => n.id !== action.payload);
        if (state.selectedNote?.id === action.payload) {
          state.selectedNote = null;
        }
      })
      .addCase(deleteNoteThunk.rejected, (state, action) => {
        state.error = action.payload?.message as string;
      });

    // Explain note
    builder
      .addCase(explainNoteThunk.pending, state => {
        state.isExplaining = true;
        state.explanation = null;
        state.explainError = null;       // ← own error field
      })
      .addCase(explainNoteThunk.fulfilled, (state, action) => {
        state.isExplaining = false;
        state.explanation = action.payload;
      })
      .addCase(explainNoteThunk.rejected, (state, action) => {
        state.isExplaining = false;
        state.explainError = action.payload?.message as string;
      });

    // Summarize note
    builder
      .addCase(summarizeNoteThunk.pending, state => {
        state.isSummarizing = true;
        state.summary = null;
        state.summarizeError = null;     // ← own error field
      })
      .addCase(summarizeNoteThunk.fulfilled, (state, action) => {
        state.isSummarizing = false;
        state.summary = action.payload;
      })
      .addCase(summarizeNoteThunk.rejected, (state, action) => {
        state.isSummarizing = false;
        state.summarizeError = action.payload?.message as string;
      });
  },
});

export const {
  setSelectedNote,
  setSearchQuery,
  clearExplanation,
  clearSummary,
  clearError,
} = notesSlice.actions;
export default notesSlice.reducer;
