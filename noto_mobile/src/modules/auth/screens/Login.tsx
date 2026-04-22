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
} from 'react-native';
import { Colors } from '../../../utils/colors';
import { FontFamily, FontSize, FontWeight } from '../../../utils/fonts';
import { Dimensions_ } from '../../../utils/dimensions';
import Strings from '../../../utils/strings';
import { isValidEmail } from '../../../utils/commonFunctions';
import { useAppDispatch, useAppSelector, useSlideUp } from '../../../utils/hooks';
import { loginThunk } from '../authActions';
import CustomButton from '../../../components/CustomButton';
import CustomInput from '../../../components/CustomInput';
import { Animated } from 'react-native';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(s => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });

  const { translateY: slideY, opacity } = useSlideUp(32, 500, 100);

  const validate = (): boolean => {
    const errs = { email: '', password: '' };
    if (!email.trim()) errs.email = Strings.errors.emailRequired;
    else if (!isValidEmail(email)) errs.email = Strings.errors.emailInvalid;
    if (!password) errs.password = Strings.errors.passwordRequired;
    else if (password.length < 6) errs.password = Strings.errors.passwordMinLength;
    setFieldErrors(errs);
    return !errs.email && !errs.password;
  };

  const handleLogin = () => {
    if (!validate()) return;
    dispatch(loginThunk({ email: email.trim().toLowerCase(), password }));
  };

  const EyeIcon = () => (
    <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁'}</Text>
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
          <Text style={styles.title}>{Strings.auth.loginTitle}</Text>
          <Text style={styles.subtitle}>{Strings.auth.loginSubtitle}</Text>

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
              label={Strings.auth.password}
              placeholder={Strings.auth.passwordPlaceholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              error={fieldErrors.password}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
                  <EyeIcon />
                </TouchableOpacity>
              }
            />

            <TouchableOpacity style={styles.forgotRow}>
              <Text style={styles.forgotText}>{Strings.auth.forgotPassword}</Text>
            </TouchableOpacity>

            <CustomButton
              label={Strings.auth.login}
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
              style={styles.loginBtn}
            />
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{Strings.auth.orContinueWith}</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social placeholder buttons */}
          <View style={styles.socialRow}>
            {['G', 'A'].map(label => (
              <TouchableOpacity key={label} style={styles.socialBtn}>
                <Text style={styles.socialBtnText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sign up */}
          <View style={styles.signupRow}>
            <Text style={styles.signupPrompt}>{Strings.auth.noAccount} </Text>
            <TouchableOpacity>
              <Text style={styles.signupLink}>{Strings.auth.signUp}</Text>
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
  forgotRow: {
    alignSelf: 'flex-end',
    marginTop: -Dimensions_.spacing.sm,
    marginBottom: Dimensions_.spacing.lg,
  },
  forgotText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.accent.primary,
  },
  loginBtn: {
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
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupPrompt: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.text.secondary,
  },
  signupLink: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    color: Colors.accent.primary,
  },
  eyeText: { fontSize: 16 },
});

export default Login;
