import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { Colors } from '../../../utils/colors';
import { FontFamily, FontSize, FontWeight } from '../../../utils/fonts';
import { Dimensions_ } from '../../../utils/dimensions';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { updateAvatarThunk, updateNameThunk, logoutThunk } from '../authActions';
import CustomInput from '../../../components/CustomInput';
import CustomButton from '../../../components/CustomButton';
import showSnackbar from '../../../utils/showSnackbar';

const ProfileScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    const { user, isLoading } = useAppSelector(state => state.auth);

    const [isEditingName, setIsEditingName] = useState(false);
    const [userName, setUserName] = useState(user?.user_name || '');

    useEffect(() => {
        if (user?.user_name) {
            setUserName(user.user_name);
        }
    }, [user?.user_name]);

    const handleImagePick = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 400,
                height: 400,
                cropping: true,
                mediaType: 'photo',
            });

            if (image.path) {
                dispatch(updateAvatarThunk(image.path))
                    .unwrap()
                    .then(() => showSnackbar.success('Profile image updated successfully'))
                    .catch(err => showSnackbar.error(err.message || 'Failed to update image'));
            }
        } catch (error: any) {
            if (error.code !== 'E_PICKER_CANCELLED') {
                showSnackbar.error('Image picking failed');
            }
        }
    };

    const handleUpdateName = () => {
        if (!userName.trim()) {
            showSnackbar.error('Name cannot be empty');
            return;
        }

        if (userName === user?.user_name) {
            setIsEditingName(false);
            return;
        }

        dispatch(updateNameThunk({ user_name: userName.trim() }))
            .unwrap()
            .then(() => {
                showSnackbar.success('Name updated successfully');
                setIsEditingName(false);
            })
            .catch(err => showSnackbar.error(err.message || 'Failed to update name'));
    };

    const handleLogout = () => {
        dispatch(logoutThunk());
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profile</Text>
                </View>

                <View style={styles.profileSection}>
                    <TouchableOpacity
                        style={styles.imageContainer}
                        onPress={handleImagePick}
                        activeOpacity={0.8}
                    >
                        {user?.profile_image ? (
                            <Image source={{ uri: user.profile_image }} style={styles.profileImage} />
                        ) : (
                            <View style={styles.placeholderImage}>
                                <Text style={styles.placeholderText}>
                                    {user?.user_name?.charAt(0).toUpperCase() || 'U'}
                                </Text>
                            </View>
                        )}
                        <View style={styles.editImageIcon}>
                            <Text style={styles.iconText}>📷</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.infoContainer}>
                        <View style={styles.nameRow}>
                            {isEditingName ? (
                                <View style={styles.editNameContainer}>
                                    <CustomInput
                                        value={userName}
                                        onChangeText={setUserName}
                                        style={styles.nameInput}
                                        autoFocus
                                        placeholder="Enter your name"
                                    />
                                    <TouchableOpacity onPress={handleUpdateName} style={styles.actionIcon}>
                                        <Text style={styles.tickIcon}>✓</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.displayNameContainer}>
                                    <Text style={styles.userNameText}>{user?.user_name || 'No Name'}</Text>
                                    <TouchableOpacity onPress={() => setIsEditingName(true)} style={styles.actionIcon}>
                                        <Text style={styles.editIcon}>✎</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                        <Text style={styles.userEmailText}>{user?.email}</Text>
                        <Text style={styles.userIdText}>ID: {user?.id}</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <CustomButton
                        label="Logout"
                        onPress={handleLogout}
                        variant="danger"
                        style={styles.logoutBtn}
                    />
                </View>
            </ScrollView>

            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={Colors.accent.primary} />
                </View>
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bg.primary,
    },
    scrollContent: {
        padding: Dimensions_.spacing.xl,
        flexGrow: 1,
    },
    header: {
        marginBottom: Dimensions_.spacing['3xl'],
        marginTop: Dimensions_.spacing.lg,
    },
    headerTitle: {
        fontSize: FontSize['4xl'],
        fontFamily: FontFamily.bold,
        fontWeight: FontWeight.bold,
        color: Colors.text.primary,
    },
    profileSection: {
        alignItems: 'center',
        backgroundColor: Colors.bg.card,
        borderRadius: Dimensions_.radius.xl,
        padding: Dimensions_.spacing['2xl'],
        borderWidth: 1,
        borderColor: Colors.border.default,
    },
    imageContainer: {
        marginBottom: Dimensions_.spacing.xl,
        position: 'relative',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: Colors.accent.primary,
    },
    placeholderImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.bg.elevated,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: Colors.border.default,
    },
    placeholderText: {
        fontSize: 48,
        fontFamily: FontFamily.bold,
        color: Colors.text.secondary,
    },
    editImageIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.accent.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: Colors.bg.card,
    },
    infoContainer: {
        width: '100%',
        alignItems: 'center',
    },
    nameRow: {
        width: '100%',
        marginBottom: Dimensions_.spacing.xs,
        justifyContent: 'center',
    },
    displayNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    editNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    nameInput: {
        flex: 1,
        marginBottom: 0,
    },
    userNameText: {
        fontSize: FontSize['2xl'],
        fontFamily: FontFamily.bold,
        fontWeight: FontWeight.bold,
        color: Colors.text.primary,
        textAlign: 'center',
    },
    userEmailText: {
        fontSize: FontSize.base,
        fontFamily: FontFamily.regular,
        color: Colors.text.secondary,
        marginBottom: Dimensions_.spacing.xs,
    },
    userIdText: {
        fontSize: FontSize.xs,
        fontFamily: FontFamily.medium,
        color: Colors.text.muted,
    },
    actionIcon: {
        marginLeft: Dimensions_.spacing.md,
        padding: Dimensions_.spacing.xs,
    },
    editIcon: {
        fontSize: 20,
        color: Colors.accent.primary,
    },
    tickIcon: {
        fontSize: 24,
        color: Colors.status.success,
    },
    iconText: {
        fontSize: 16,
    },
    footer: {
        marginTop: 'auto',
        paddingTop: Dimensions_.spacing['3xl'],
    },
    logoutBtn: {
        marginTop: Dimensions_.spacing.xl,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ProfileScreen;
