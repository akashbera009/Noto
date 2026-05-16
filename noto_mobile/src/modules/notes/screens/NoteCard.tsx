import { Animated, Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useFadeIn } from "../../../utils/hooks";
import { Note } from "../../../utils/types";
import LocalImages from "../../../utils/localImages";
import { truncateText, countWords } from '../../../utils/commonFunctions';
import { Dimensions_ } from '../../../utils/dimensions';
import { FontFamily, FontSize, FontWeight } from "../../../utils/fonts";
import { Colors } from "../../../utils/colors";

export const NoteCard: React.FC<{
    note: Note;
    onPress: () => void;
    onLongPress: () => void;
    index: number;
    showAi?: boolean
    trunketTextSize?: number
    numOfLinesToTrunk?: number
}> = ({ note, onPress, onLongPress, index, showAi = true, trunketTextSize = 120, numOfLinesToTrunk = 2 }) => {
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

                <Text style={styles.cardPreview} numberOfLines={numOfLinesToTrunk}>
                    {truncateText(note.content, trunketTextSize)}
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
                {showAi &&
                    <View style={styles.cardMeta}>
                        <Text style={styles.metaWords}>{countWords(note.content)} words</Text>
                        <View style={styles.aiHint}>
                            <Image source={LocalImages.ai} style={{ width: 16, height: 16, tintColor: Colors.text.success }} />
                            <Text style={styles.aiHintText}> Hold for AI</Text>
                        </View>
                    </View>
                }
                {/* Accent line */}
                <View style={styles.cardAccent} />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({

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
        fontSize: FontSize.sm,
        fontFamily: FontFamily.regular,
        color: Colors.text.success,
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
})