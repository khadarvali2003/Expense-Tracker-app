import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import Colors from '../config/colors';

const RegisterScreen = ({ navigation }) => {
  const { register, isLoading, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    if (!password.trim() || password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    clearError();
    const result = await register(name.trim(), email.trim(), password);
    if (!result.success) {
      Alert.alert('Registration Failed', result.message);
    }
  };

  const renderInput = (
    icon,
    placeholder,
    value,
    onChangeText,
    fieldName,
    options = {}
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{fieldName}</Text>
      <View
        style={[
          styles.inputContainer,
          focusedField === fieldName && styles.inputFocused,
        ]}
      >
        <Text style={styles.inputIcon}>{icon}</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocusedField(fieldName)}
          onBlur={() => setFocusedField(null)}
          {...options}
        />
        {options.secureTextEntry !== undefined && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Text style={styles.eyeIcon}>
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={[styles.bgCircle, styles.bgCircle1]} />
      <View style={[styles.bgCircle, styles.bgCircle2]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Create Account</Text>
            <Text style={styles.subtitleText}>
              Start your financial journey today
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formCard}>
            {renderInput('👤', 'Enter your name', name, setName, 'Name', {
              autoCapitalize: 'words',
            })}
            {renderInput('📧', 'Enter your email', email, setEmail, 'Email', {
              keyboardType: 'email-address',
              autoCapitalize: 'none',
              autoCorrect: false,
            })}
            {renderInput(
              '🔒',
              'Create a password',
              password,
              setPassword,
              'Password',
              { secureTextEntry: !showPassword }
            )}
            {renderInput(
              '🔐',
              'Confirm password',
              confirmPassword,
              setConfirmPassword,
              'Confirm Password',
              { secureTextEntry: !showPassword }
            )}

            <TouchableOpacity
              style={[styles.registerButton, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.registerButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  bgCircle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.06,
  },
  bgCircle1: {
    width: 200,
    height: 200,
    backgroundColor: Colors.secondary,
    top: -50,
    left: -80,
  },
  bgCircle2: {
    width: 250,
    height: 250,
    backgroundColor: Colors.primary,
    bottom: -50,
    right: -80,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  formCard: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    height: 56,
  },
  inputFocused: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
  },
  eyeButton: {
    padding: 4,
  },
  eyeIcon: {
    fontSize: 18,
  },
  registerButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    color: Colors.textSecondary,
    fontSize: 15,
  },
  loginLink: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
});

export default RegisterScreen;
