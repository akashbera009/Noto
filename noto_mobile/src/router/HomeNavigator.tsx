import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScreenNames } from '../utils/screenNames';
import NotesList from '../modules/notes/screens/NotesList';
import NoteDetail from '../modules/notes/screens/NoteDetail';
import NoteEditor from '../modules/notes/screens/NoteEditor';
import type { NotesStackParamList } from '../utils/types';

const Stack = createNativeStackNavigator<NotesStackParamList>();

const NotesNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ScreenNames.NOTES_LIST} component={NotesList} />
    <Stack.Screen name={ScreenNames.NOTE_DETAIL} component={NoteDetail} />
    <Stack.Screen name={ScreenNames.CREATE_NOTE} component={NoteEditor} />
    <Stack.Screen name={ScreenNames.EDIT_NOTE} component={NoteEditor} />
  </Stack.Navigator>
);

export default NotesNavigator;
