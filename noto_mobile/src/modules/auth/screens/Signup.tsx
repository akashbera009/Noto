import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';
import { Colors } from '../../../utils/colors';
import { FontFamily, FontSize, FontWeight } from '../../../utils/fonts';
import { Dimensions_ } from '../../../utils/dimensions';
import Strings from '../../../utils/strings';
import { isValidEmail } from '../../../utils/commonFunctions';
import { useAppDispatch, useAppSelector, useSlideUp } from '../../../utils/hooks';
import { loginThunk, signupThunk } from '../authActions';
import CustomButton from '../../../components/CustomButton';
import CustomInput from '../../../components/CustomInput';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../utils/types';
import { ScreenNames } from '../../../utils/screenNames';
import showSnackbar from '../../../utils/showSnackbar';

type MainStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const Signup: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<MainStackNavigationProp>();
  const { isLoading, error } = useAppSelector(s => s.auth);

  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    userName: '',
    password: '',
    confirmPassword: '',
  });

  const { translateY: slideY, opacity } = useSlideUp(32, 500, 100);

  const validate = (): boolean => {
    const errs = { email: '', userName: '', password: '', confirmPassword: '' };

    if (!email.trim()) errs.email = Strings.errors.emailRequired;
    else if (!isValidEmail(email)) errs.email = Strings.errors.emailInvalid;

    if (!userName.trim()) errs.userName = Strings.errors.userNameRequired;

    if (!password) errs.password = Strings.errors.passwordRequired;
    else if (password.length < 6) errs.password = Strings.errors.passwordMinLength;

    if (!confirmPassword) errs.confirmPassword = Strings.errors.confirmPasswordRequired;
    else if (confirmPassword !== password) errs.confirmPassword = Strings.errors.passwordMismatch;

    setFieldErrors(errs);
    return !errs.email && !errs.userName && !errs.password && !errs.confirmPassword;
  };

  const handleSignup = () => {
    if (!validate()) return;
    dispatch(
      signupThunk({
        email: email.trim().toLowerCase(),
        user_name: userName.trim(),
        password,
      }),
    )
      .unwrap()
      .then(() => {
        showSnackbar.success(Strings.auth.signupSuccess);
      })
      .catch(err => {
        showSnackbar.error(err.message || Strings.errors.generic);
      });
  };

  const EyeIcon = ({ visible }: { visible: boolean }) => (
    <Text style={styles.eyeText}>{visible ? '🙈' : '👁'}</Text>
  );

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg.primary} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand mark */}
        <View style={styles.brand}>
          <View style={styles.logoMark}>
            <Text style={styles.logoLetter}>N</Text>
          </View>
        </View>

        {/* Heading */}
        <Animated.View style={{ opacity, transform: [{ translateY: slideY }] }}>
          <Text style={styles.title}>{Strings.auth.signupTitle}</Text>
          <Text style={styles.subtitle}>{Strings.auth.signupSubtitle}</Text>

          {/* Server error */}
          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          ) : null}

          {/* Form */}
          <View style={styles.form}>
            <CustomInput
              label={Strings.auth.email}
              placeholder={Strings.auth.emailPlaceholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={fieldErrors.email}
            />

            <CustomInput
              label={Strings.auth.userName}
              placeholder={Strings.auth.userNamePlaceholder}
              value={userName}
              onChangeText={setUserName}
              autoCapitalize="none"
              error={fieldErrors.userName}
            />

            <CustomInput
              label={Strings.auth.password}
              placeholder={Strings.auth.passwordPlaceholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              error={fieldErrors.password}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
                  <EyeIcon visible={showPassword} />
                </TouchableOpacity>
              }
            />

            <CustomInput
              label={Strings.auth.confirmPassword}
              placeholder={Strings.auth.confirmPasswordPlaceholder}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              error={fieldErrors.confirmPassword}
              rightIcon={
                <TouchableOpacity onPress={() => setShowConfirmPassword(v => !v)}>
                  <EyeIcon visible={showConfirmPassword} />
                </TouchableOpacity>
              }
            />

            <CustomButton
              label={Strings.auth.signUp}
              onPress={handleSignup}
              loading={isLoading}
              fullWidth
              style={styles.signupBtn}
            />
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{Strings.auth.orContinueWith}</Text>
            <View style={styles.dividerLine} />
          </View>

 
          {/* Sign in */}
          <View style={styles.loginRow}>
            <Text style={styles.loginPrompt}>{Strings.auth.alreadyHaveAccount} </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(ScreenNames.LOGIN)}
              >
              <Text style={styles.loginLink}>{Strings.auth.login}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.bg.primary },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Dimensions_.spacing['2xl'],
    paddingTop: Dimensions_.spacing['5xl'],
    paddingBottom: Dimensions_.spacing['4xl'],
  },
  brand: {
    alignItems: 'center',
    marginBottom: Dimensions_.spacing['3xl'],
  },
  logoMark: {
    width: 60,
    height: 60,
    borderRadius: Dimensions_.radius.lg,
    backgroundColor: Colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  },
  logoLetter: {
    fontSize: FontSize['2xl'],
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    color: Colors.text.inverse,
  },
  title: {
    fontSize: FontSize['3xl'],
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    letterSpacing: 0.3,
    marginBottom: Dimensions_.spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: Colors.text.secondary,
    marginBottom: Dimensions_.spacing['2xl'],
  },
  errorBanner: {
    backgroundColor: 'rgba(255, 77, 106, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 77, 106, 0.3)',
    borderRadius: Dimensions_.radius.md,
    padding: Dimensions_.spacing.md,
    marginBottom: Dimensions_.spacing.base,
  },
  errorBannerText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.status.error,
  },
  form: {
    marginBottom: Dimensions_.spacing.lg,
  },
  signupBtn: {
    marginTop: Dimensions_.spacing.xs,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Dimensions_.spacing.lg,
    gap: Dimensions_.spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border.default,
  },
  dividerText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.text.muted,
    letterSpacing: 0.4,
  },
  socialRow: {
    flexDirection: 'row',
    gap: Dimensions_.spacing.md,
    marginBottom: Dimensions_.spacing['2xl'],
  },
  socialBtn: {
    flex: 1,
    height: 48,
    borderRadius: Dimensions_.radius.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
    backgroundColor: Colors.bg.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialBtnText: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: Colors.text.secondary,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginPrompt: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.text.secondary,
  },
  loginLink: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    color: Colors.accent.primary,
  },
  eyeText: { fontSize: 16 },
});

export default Signup;