import { apiClient } from './apiClient';
import { Endpoints } from '../utils/endpoints';
import type {
  Note,
  NoteExplanation,
  NoteSummary,
  CreateNotePayload,
  UpdateNotePayload,
} from '../utils/types';

export const notesService = {
  getNotes: async (): Promise<Note[]> => {
    const res = await apiClient.get<Note[]>(Endpoints.notes.list);
    return res;
  },

  getNoteById: async (id: string): Promise<Note> => {
    return apiClient.get<Note>(Endpoints.notes.detail(id));
  },

  createNote: async (payload: CreateNotePayload): Promise<Note> => {
    return apiClient.post<Note>(Endpoints.notes.create, payload);
  },

  updateNote: async (id: string, payload: UpdateNotePayload): Promise<Note> => {
    return apiClient.patch<Note>(Endpoints.notes.update(id), payload);
  },

  deleteNote: async (id: string): Promise<void> => {
    await apiClient.delete<void>(Endpoints.notes.delete(id));
  },

  // ─── AI ──────────────────────────────────────────────────────────────────────

  explainNote: async (
    id: string,
    mode: 'simple' | 'technical',
    regenerate = false,
  ): Promise<NoteExplanation> => {
    const url = regenerate
      ? `${Endpoints.ai.explain(id)}?regenerate=true`
      : Endpoints.ai.explain(id);
    return apiClient.post<NoteExplanation>(url, { mode });
  },

  summarizeNote: async (id: string, regenerate = false): Promise<NoteSummary> => {
    const url = regenerate
      ? `${Endpoints.ai.summarize(id)}?regenerate=true`
      : Endpoints.ai.summarize(id);
    return apiClient.post<NoteSummary>(url);
  },
};
