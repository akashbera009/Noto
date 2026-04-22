import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Colors } from '../../../utils/colors';
import { FontFamily, FontSize, FontWeight } from '../../../utils/fonts';
import { Dimensions_ } from '../../../utils/dimensions';
import Strings from '../../../utils/strings';
import CustomButton from '../../../components/CustomButton';

interface Props {
  visible: boolean;
  onClose: () => void;
  onVerify: (code: string) => void;
  loading?: boolean;
  email?: string;
}

const CODE_LENGTH = 6;

const VerificationModal: React.FC<Props> = ({
  visible,
  onClose,
  onVerify,
  loading = false,
  email,
}) => {
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/\D/g, '').slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const fullCode = code.join('');
    if (fullCode.length === CODE_LENGTH) onVerify(fullCode);
  };

  const handleReset = () => {
    setCode(Array(CODE_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />

        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Lock icon */}
          <View style={styles.icon}>
            <Text style={styles.iconText}>🔐</Text>
          </View>

          <Text style={styles.title}>{Strings.auth.verificationTitle}</Text>
          <Text style={styles.subtitle}>
            {email
              ? `Code sent to ${email}`
              : Strings.auth.verificationSubtitle}
          </Text>

          {/* OTP inputs */}
          <View style={styles.otpRow}>
            {code.map((digit, i) => (
              <TextInput
                key={i}
                ref={el => { inputRefs.current[i] = el; }}
                style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                value={digit}
                onChangeText={t => handleChange(t, i)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                keyboardType="number-pad"
                maxLength={1}
                selectionColor={Colors.accent.primary}
                textAlign="center"
              />
            ))}
          </View>

          <CustomButton
            label={Strings.auth.verify}
            onPress={handleVerify}
            loading={loading}
            disabled={code.join('').length < CODE_LENGTH}
            fullWidth
            style={styles.verifyBtn}
          />

          <View style={styles.resendRow}>
            <Text style={styles.resendPrompt}>Didn't receive the code? </Text>
            <TouchableOpacity onPress={handleReset}>
              <Text style={styles.resendLink}>{Strings.auth.resendCode}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
  },
  sheet: {
    backgroundColor: Colors.bg.modal,
    borderTopLeftRadius: Dimensions_.radius['2xl'],
    borderTopRightRadius: Dimensions_.radius['2xl'],
    padding: Dimensions_.spacing['2xl'],
    paddingBottom: Dimensions_.spacing['4xl'],
    borderTopWidth: 1,
    borderColor: Colors.border.default,
    alignItems: 'center',
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: Colors.border.default,
    borderRadius: 2,
    marginBottom: Dimensions_.spacing.xl,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.bg.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Dimensions_.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  iconText: { fontSize: 28 },
  title: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Dimensions_.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Dimensions_.spacing['2xl'],
  },
  otpRow: {
    flexDirection: 'row',
    gap: Dimensions_.spacing.md,
    marginBottom: Dimensions_.spacing['2xl'],
  },
  otpBox: {
    width: 44,
    height: 54,
    borderRadius: Dimensions_.radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border.default,
    backgroundColor: Colors.bg.input,
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  otpBoxFilled: {
    borderColor: Colors.accent.primary,
    backgroundColor: Colors.accent.muted,
  },
  verifyBtn: { marginBottom: Dimensions_.spacing.lg },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendPrompt: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.text.secondary,
  },
  resendLink: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    color: Colors.accent.primary,
  },
});

export default VerificationModal;
