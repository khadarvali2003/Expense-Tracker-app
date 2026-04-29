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
  Dimensions,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import Colors from '../config/colors';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }
    clearError();
    const result = await login(email.trim(), password);
    if (!result.success) {
      Alert.alert('Login Failed', result.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Background decoration */}
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
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.subtitleText}>
              Sign in to continue tracking your expenses
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.formCard}>
              {/* Email Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View
                  style={[
                    styles.inputContainer,
                    emailFocused && styles.inputFocused,
                  ]}
                >
                  <Text style={styles.inputIcon}>📧</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor={Colors.textMuted}
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View
                  style={[
                    styles.inputContainer,
                    passwordFocused && styles.inputFocused,
                  ]}
                >
                  <Text style={styles.inputIcon}>🔒</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor={Colors.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    <Text style={styles.eyeIcon}>
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.loginButtonText}>Sign In</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
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
    width: 250,
    height: 250,
    backgroundColor: Colors.primary,
    top: -80,
    right: -60,
  },
  bgCircle2: {
    width: 200,
    height: 200,
    backgroundColor: Colors.accent,
    bottom: 50,
    left: -100,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
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
  formContainer: {
    width: '100%',
  },
  formCard: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputGroup: {
    marginBottom: 20,
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
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    color: Colors.textSecondary,
    fontSize: 15,
  },
  registerLink: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
});

export default LoginScreen;
