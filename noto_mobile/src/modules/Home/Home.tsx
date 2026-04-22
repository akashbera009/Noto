import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Colors } from '../../utils/colors';
import { FontFamily, FontSize, FontWeight } from '../../utils/fonts';
import { Dimensions_ } from '../../utils/dimensions';
import { useAppSelector, useAppDispatch } from '../../utils/hooks';
import { ScreenNames } from '../../utils/screenNames';
import { logoutThunk } from '../auth/authActions';
import { fetchNotesThunk } from '../notes/notesActions';
import { truncateText } from '../../utils/commonFunctions';
import type { BottomTabNavProp } from '../../utils/types';

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
          <TouchableOpacity style={styles.avatar} onPress={handleLogout}>
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

        {/* Quick action */}
        <TouchableOpacity
          style={styles.quickCreate}
          onPress={() => navigation.navigate(ScreenNames.NOTES_TAB)}
          activeOpacity={0.8}
        >
          <View style={styles.quickCreateInner}>
            <Text style={styles.quickCreatePlaceholder}>Start a new note…</Text>
            <View style={styles.quickCreateBtn}>
              <Text style={styles.quickCreateBtnText}>+</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Recent notes */}
        {recentNotes.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent</Text>
              <TouchableOpacity onPress={() => navigation.navigate(ScreenNames.NOTES_TAB)}>
                <Text style={styles.seeAll}>See all →</Text>
              </TouchableOpacity>
            </View>

            {recentNotes.map(note => (
              <TouchableOpacity
                key={note.id}
                style={styles.recentCard}
                onPress={() => navigation.navigate(ScreenNames.NOTES_TAB)}
                activeOpacity={0.75}
              >
                <View style={styles.recentAccent} />
                <View style={styles.recentBody}>
                  <Text style={styles.recentTitle} numberOfLines={1}>
                    {note.title}
                  </Text>
                  <Text style={styles.recentPreview} numberOfLines={1}>
                    {truncateText(note.content, 80)}
                  </Text>
                  {note.tags.length > 0 && (
                    <Text style={styles.recentTags} numberOfLines={1}>
                      {note.tags.slice(0, 3).map(t => `#${t}`).join(' ')}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {notes?.length === 0 && (
          <View style={styles.emptyHome}>
            <Text style={styles.emptyHomeIcon}>✍️</Text>
            <Text style={styles.emptyHomeText}>Your notes will appear here</Text>
            <Text style={styles.emptyHomeSubtext}>
              Tap the Notes tab or the quick create bar above to get started.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg.primary },
  scroll: {
    padding: Dimensions_.spacing['2xl'],
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickCreateBtnText: {
    fontSize: 22,
    color: Colors.text.inverse,
    lineHeight: 26,
    fontWeight: '300',
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
});

export default Home;
