import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import Colors from '../config/colors';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entry animation sequence
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Background decoration circles */}
      <View style={[styles.bgCircle, styles.bgCircle1]} />
      <View style={[styles.bgCircle, styles.bgCircle2]} />
      <View style={[styles.bgCircle, styles.bgCircle3]} />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.View
          style={[styles.iconCircle, { transform: [{ scale: pulseAnim }] }]}
        >
          <Text style={styles.iconText}>💰</Text>
        </Animated.View>
      </Animated.View>

      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.title}>Expense</Text>
        <Text style={styles.titleAccent}>Tracker</Text>
        <Text style={styles.subtitle}>Smart spending starts here</Text>
      </Animated.View>

      <Animated.View style={[styles.loader, { opacity: fadeAnim }]}>
        <View style={styles.loadingBar}>
          <Animated.View
            style={[styles.loadingProgress, { transform: [{ scaleX: pulseAnim }] }]}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgCircle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.05,
  },
  bgCircle1: {
    width: 300,
    height: 300,
    backgroundColor: Colors.primary,
    top: -50,
    right: -100,
  },
  bgCircle2: {
    width: 200,
    height: 200,
    backgroundColor: Colors.secondary,
    bottom: 100,
    left: -80,
  },
  bgCircle3: {
    width: 150,
    height: 150,
    backgroundColor: Colors.accent,
    top: height * 0.4,
    right: -40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  iconText: {
    fontSize: 50,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: 2,
  },
  titleAccent: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 2,
    marginTop: -5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 10,
    letterSpacing: 1,
  },
  loader: {
    position: 'absolute',
    bottom: 80,
    width: width * 0.4,
  },
  loadingBar: {
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingProgress: {
    height: '100%',
    width: '60%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
});

export default SplashScreen;
