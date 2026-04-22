import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import { ScreenNames } from './screenNames';

// ─── Navigation Param Lists ───────────────────────────────────────────────────

export type AuthStackParamList = {
  [ScreenNames.SPLASH]: undefined;
  [ScreenNames.LOGIN]: undefined;
  [ScreenNames.LOCATION_PERMISSION]: undefined;
};

export type NotesStackParamList = {
  [ScreenNames.NOTES_LIST]: undefined;
  [ScreenNames.NOTE_DETAIL]: { noteId: string };
  [ScreenNames.CREATE_NOTE]: undefined;
  [ScreenNames.EDIT_NOTE]: { noteId: string };
};

export type HomeStackParamList = {
  [ScreenNames.HOME]: undefined;
};

export type BottomTabParamList = {
  [ScreenNames.HOME_TAB]: undefined;
  [ScreenNames.NOTES_TAB]: undefined;
  [ScreenNames.PROFILE_TAB]: undefined;
};

// ─── Navigation Props ─────────────────────────────────────────────────────────

export type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;
export type NotesNavProp = NativeStackNavigationProp<NotesStackParamList>;
export type HomeNavProp = NativeStackNavigationProp<HomeStackParamList>;
export type BottomTabNavProp = BottomTabNavigationProp<BottomTabParamList>;

export type NoteDetailRouteProp = RouteProp<NotesStackParamList, typeof ScreenNames.NOTE_DETAIL>;
export type EditNoteRouteProp = RouteProp<NotesStackParamList, typeof ScreenNames.EDIT_NOTE>;

// ─── Domain Models ────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email?: string;
  name?: string;
  user_name: string;
  avatar?: string;
  profile_image?: string;
  createdAt?: string;
}

export interface Note {
  id: string;
  title: string;
  tags: string[];
  content: string;
}

export interface NoteExplanation {
  note: string;
  explanation: string;
  mode: string;
}

export interface NoteSummary {
  note: string;
  summary: string;
}

// ─── API Types ────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tags: string[];
}

export interface UpdateNotePayload extends Partial<CreateNotePayload> {}

export interface ExplainResponse {
  simple: string;
  technical: string;
}

// ─── Redux State Types ────────────────────────────────────────────────────────

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
}

export interface NotesState {
  notes: Note[];
  selectedNote: Note | null;
  explanation: NoteExplanation | null;
  summary: NoteSummary | null;
  isLoading: boolean;
  isExplaining: boolean;
  isSummarizing: boolean;
  isSaving: boolean;
  error: string | null;       // CRUD errors
  explainError: string | null;
  summarizeError: string | null;
  searchQuery: string;
}

export interface RootState {
  auth: AuthState;
  notes: NotesState;
}

// ─── Component Prop Types ─────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface CustomButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  style?: object;
}

export interface CustomInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  onBlur?: () => void;
  onFocus?: () => void;
  editable?: boolean;
  autoFocus?: boolean;
  style?: object;
  inputStyle?: object;
}

export interface ToastConfig {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}
