import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Pressable,
  Modal
} from 'react-native';
import { Colors } from '../../utils/colors';
import { FontFamily, FontSize, FontWeight } from '../../utils/fonts';
import { Dimensions_ } from '../../utils/dimensions';
import { useAppSelector, useAppDispatch } from '../../utils/hooks';
import { ScreenNames } from '../../utils/screenNames';
import { logoutThunk } from '../auth/authActions';
import { fetchNotesThunk } from '../notes/notesActions';
import { truncateText } from '../../utils/commonFunctions';
import type { BottomTabNavProp, NotesStackParamList } from '../../utils/types';

import LocalImages from '../../utils/localImages';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { NoteCard } from '../notes/screens/NoteCard';

interface Props {
  navigation: BottomTabNavProp;
}

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const Home: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(s => s.auth);
  const { notes } = useAppSelector(s => s.notes);

  // Fetch notes when Home mounts — this is the first screen on app open
  useEffect(() => {
    dispatch(fetchNotesThunk());
  }, []);

  const recentNotes = [...(notes ?? [])].slice(0, 4);

  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  const [isModelOpen, setIsModel] = useState(false)
  const handleModleOpen = () => {
    setIsModel(!isModelOpen)
  }

  const handleCreateNoteNavigation = () => {
    navigation.navigate(ScreenNames.NOTES_TAB, {
      screen: ScreenNames.CREATE_NOTE
    } as any);
  }

  const insets = useSafeAreaInsets()
  const bottomTbaHeight = useBottomTabBarHeight()
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{user?.name ?? 'there'} 👋</Text>
          </View>
          <TouchableOpacity style={styles.avatar}
            onPress={handleModleOpen}
          >
            <Text style={styles.avatarText}>
              {(user?.name ?? 'U').charAt(0).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Notes', value: notes?.length ?? 0 },
            { label: 'Tags', value: [...new Set(notes?.flatMap(n => n.tags) ?? [])].length },
          ].map(stat => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Recent notes */}
        {recentNotes.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent</Text>
              <TouchableOpacity onPress={() => navigation.navigate(ScreenNames.NOTES_TAB)}>
                <Text style={styles.seeAll}>See all →</Text>
              </TouchableOpacity>
            </View>

            {recentNotes.map((note, index) => (
              <NoteCard
                note={note}
                onPress={() => navigation.navigate(ScreenNames.NOTES_TAB, {
                  screen: ScreenNames.NOTE_DETAIL,
                  params: { noteId: note.id }
                } as any)}
                onLongPress={() => { }}
                index={index}
                key={index.toString()}
                showAi={false}
                trunketTextSize={60}
                numOfLinesToTrunk={1}
              />
            ))}
          </>
        )}

        {notes?.length === 0 && (
          <View style={styles.emptyHome}>
            <Image
              source={LocalImages.empty_folder}
              style={styles.emptyFolder} />
            <Text style={styles.emptyHomeText}>Your notes will appear here</Text>
            <Text style={styles.emptyHomeSubtext}>
              Tap the Notes tab or the quick create bar above to get started.
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        onPress={handleCreateNoteNavigation}
        activeOpacity={0.8}
        style={[styles.bottomCreate, { bottom: insets.bottom + 1.5 * bottomTbaHeight }]}
      >
        <View style={styles.quickCreateBtn}>
          <Image
            source={LocalImages.plus}
            style={styles.quickCreateBtnText}
            resizeMode="contain"
            tintColor={Colors.text.secondary}
          />
        </View>
      </TouchableOpacity>

      <Modal
        visible={isModelOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={handleModleOpen}
      >
        <Pressable style={styles.modalOverlay} onPress={handleModleOpen}>
          <View style={styles.modalContent}>
            <View style={styles.profileHeader}>
              <View style={styles.modalAvatarContainer}>
                {user?.profile_image || user?.avatar ? (
                  <Image
                    source={{ uri: user?.profile_image || user?.avatar }}
                    style={styles.modalAvatar}
                  />
                ) : (
                  <View style={styles.modalAvatarPlaceholder}>
                    <Text style={styles.modalAvatarText}>
                      {(user?.name ?? 'U').charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.modalUserName}>{user?.name ?? 'User'}</Text>
              <Text style={styles.modalUserEmail}>{user?.email ?? ''}</Text>
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                handleModleOpen();
                navigation.navigate(ScreenNames.PROFILE_TAB as never);
              }}
            >
              <Image source={LocalImages.profileIcon} style={styles.modalButtonIcon} tintColor={Colors.accent.primary} />
              <Text style={styles.modalButtonText}>View Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.logoutButton]}
              onPress={() => {
                handleModleOpen();
                handleLogout();
              }}
            >
              <Image source={LocalImages.delete} style={styles.modalButtonIcon} tintColor={Colors.status.error} />
              <Text style={[styles.modalButtonText, styles.logoutButtonText]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Colors.bg.primary,
  },
  scroll: {
    padding: Dimensions_.spacing.base,
    paddingTop: Dimensions_.spacing['2xl'],
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Dimensions_.spacing['2xl'],
    marginTop: Dimensions_.spacing.base,
  },
  greeting: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  userName: {
    fontSize: FontSize['2xl'],
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accent.muted,
    borderWidth: 1,
    borderColor: Colors.border.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    color: Colors.accent.primary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Dimensions_.spacing.md,
    marginBottom: Dimensions_.spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.bg.card,
    borderRadius: Dimensions_.radius.lg,
    padding: Dimensions_.spacing.base,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  statValue: {
    fontSize: FontSize['2xl'],
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    color: Colors.accent.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.text.muted,
  },
  quickCreate: {
    backgroundColor: Colors.bg.card,
    borderRadius: Dimensions_.radius.lg,
    borderWidth: 1,
    borderColor: Colors.border.default,
    marginBottom: Dimensions_.spacing['2xl'],
    overflow: 'hidden',
  },
  bottomCreate: {
    position: 'absolute',
    right: Dimensions_.spacing.xl,
  },
  quickCreateInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Dimensions_.spacing.base,
    paddingHorizontal: Dimensions_.spacing.lg,
  },
  quickCreatePlaceholder: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: Colors.text.muted,
  },
  quickCreateBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickCreateBtnText: {
    width: 18,
    height: 18,
    tintColor: Colors.black
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Dimensions_.spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    color: Colors.text.primary,
  },
  seeAll: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.accent.primary,
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.card,
    borderRadius: Dimensions_.radius.md,
    marginBottom: Dimensions_.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.default,
    overflow: 'hidden',
  },
  recentAccent: {
    width: 3,
    alignSelf: 'stretch',
    backgroundColor: Colors.accent.primary,
    opacity: 0.5,
  },
  recentBody: {
    flex: 1,
    padding: Dimensions_.spacing.md,
  },
  recentTitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    color: Colors.text.primary,
    marginBottom: 3,
  },
  recentPreview: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.text.muted,
  },
  recentTags: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.accent.primary,
    opacity: 0.6,
    marginTop: 3,
  },
  emptyHome: {
    alignItems: 'center',
    paddingTop: Dimensions_.spacing['3xl'],
    gap: Dimensions_.spacing.md,
  },
  emptyHomeIcon: { fontSize: 48 },
  emptyFolder: {
    height: 100,
    width: 100,
    opacity: .8,
    marginVertical: 40
  },
  emptyHomeText: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    color: Colors.text.primary,
  },
  emptyHomeSubtext: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.text.muted,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Dimensions_.spacing.base,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Dimensions_.spacing.xl,
  },
  modalContent: {
    width: '85%',
    backgroundColor: Colors.bg.modal,
    borderRadius: Dimensions_.radius['2xl'],
    padding: Dimensions_.spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border.default,
    alignItems: 'center',
    elevation: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: Dimensions_.spacing.xl,
  },
  modalAvatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.bg.elevated,
    borderWidth: 2,
    borderColor: Colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Dimensions_.spacing.md,
    overflow: 'hidden',
  },
  modalAvatar: {
    width: '100%',
    height: '100%',
  },
  modalAvatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.accent.muted,
  },
  modalAvatarText: {
    fontSize: FontSize['3xl'],
    fontFamily: FontFamily.bold,
    color: Colors.accent.primary,
  },
  modalUserName: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  modalUserEmail: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.text.muted,
  },
  modalDivider: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.border.default,
    marginBottom: Dimensions_.spacing.lg,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: Dimensions_.spacing.md,
    borderRadius: Dimensions_.radius.md,
    backgroundColor: Colors.bg.elevated,
    marginBottom: Dimensions_.spacing.sm,
  },
  modalButtonIcon: {
    width: 20,
    height: 20,
    marginRight: Dimensions_.spacing.md,
    resizeMode: 'contain',
  },
  modalButtonText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
    color: Colors.text.primary,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 77, 106, 0.05)',
    marginTop: Dimensions_.spacing.sm,
    borderColor: 'rgba(255, 77, 106, 0.2)',
    borderWidth: 1,
  },
  logoutButtonText: {
    color: Colors.status.error,
  },
});

export default Home;
