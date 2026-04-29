import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import Colors from '../config/colors';

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const menuItems = [
    { icon: '👤', label: 'Edit Profile', subtitle: 'Change name, currency' },
    { icon: '🔒', label: 'Change Password', subtitle: 'Update your password' },
    { icon: '💰', label: 'Monthly Budget', subtitle: `${user?.currency || '₹'}${user?.monthlyBudget || 0}` },
    { icon: '📊', label: 'Export Data', subtitle: 'Download your expenses' },
    { icon: '🔔', label: 'Notifications', subtitle: 'Manage alerts' },
    { icon: 'ℹ️', label: 'About', subtitle: 'Version 1.0.0' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name || 'User'}</Text>
          <Text style={styles.email}>{user?.email || ''}</Text>
          <Text style={styles.joined}>
            Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', {
              month: 'long', year: 'numeric',
            })}
          </Text>
        </View>

        {/* Menu */}
        <View style={styles.menuCard}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuIconBg}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
              </View>
              <View style={styles.menuInfo}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text, marginBottom: 24 },
  profileCard: {
    backgroundColor: Colors.card, borderRadius: 24, padding: 24,
    alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: Colors.border,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: '#fff' },
  name: { fontSize: 22, fontWeight: '700', color: Colors.text },
  email: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  joined: { fontSize: 12, color: Colors.textMuted, marginTop: 8 },
  menuCard: {
    backgroundColor: Colors.card, borderRadius: 20, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.border, marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', padding: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  menuIconBg: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.backgroundLight,
    alignItems: 'center', justifyContent: 'center',
  },
  menuIcon: { fontSize: 20 },
  menuInfo: { flex: 1, marginLeft: 14 },
  menuLabel: { color: Colors.text, fontSize: 15, fontWeight: '600' },
  menuSubtitle: { color: Colors.textMuted, fontSize: 13, marginTop: 2 },
  menuArrow: { color: Colors.textMuted, fontSize: 24 },
  logoutBtn: {
    backgroundColor: Colors.error + '15', borderRadius: 16, height: 56,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.error + '30',
  },
  logoutText: { color: Colors.error, fontSize: 16, fontWeight: '700' },
});

export default ProfileScreen;
