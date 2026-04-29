import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/DashboardScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditExpenseScreen from '../screens/EditExpenseScreen';
import Colors from '../config/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabIcon = ({ icon, label, focused }) => (
  <View style={styles.tabItem}>
    <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>{icon}</Text>
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    {focused && <View style={styles.tabIndicator} />}
  </View>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🏠" label="Home" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="➕" label="Add" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="📋" label="History" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="👤" label="Profile" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen
        name="EditExpense"
        component={EditExpenseScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: 70,
    paddingBottom: 8,
    paddingTop: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  tabIcon: {
    fontSize: 22,
    opacity: 0.5,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  tabIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginTop: 4,
  },
});

export default MainNavigator;
