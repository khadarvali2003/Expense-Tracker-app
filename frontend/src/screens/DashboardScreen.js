import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, StatusBar, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Colors from '../config/colors';
import Constants from '../config/constants';

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [sRes, cRes] = await Promise.all([
        dashboardAPI.getSummary(),
        dashboardAPI.getCategoryBreakdown(),
      ]);
      setSummary(sRes.data.data);
      setCategories(cRes.data.data.categories);
    } catch (e) {
      console.error('Dashboard error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchData(); }, []));

  const fmt = (a) => `${user?.currency || '₹'}${(a || 0).toLocaleString('en-IN')}`;
  const getCat = (n) => Constants.CATEGORIES.find((c) => c.name === n) || { icon: '📦', color: '#9CA3AF' };

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={s.loadText}>Loading dashboard...</Text>
      </View>
    );
  }

  const trend = summary?.comparison?.trend;
  const tIcon = trend === 'up' ? '📈' : trend === 'down' ? '📉' : '➡️';

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={Colors.primary} colors={[Colors.primary]} />}
        contentContainerStyle={s.scroll}
      >
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>Hello,</Text>
            <Text style={s.userName}>{user?.name || 'User'} 👋</Text>
          </View>
          <View style={s.notifBtn}><Text style={{ fontSize: 22 }}>🔔</Text></View>
        </View>

        {/* Total Card */}
        <View style={s.totalCard}>
          <View style={s.glow} />
          <Text style={s.totalLabel}>Total Spent This Month</Text>
          <Text style={s.totalAmt}>{fmt(summary?.summary?.totalSpent)}</Text>
          <View style={s.statsRow}>
            <View style={s.stat}>
              <Text style={s.statVal}>{summary?.summary?.expenseCount || 0}</Text>
              <Text style={s.statLbl}>Transactions</Text>
            </View>
            <View style={s.divider} />
            <View style={s.stat}>
              <Text style={s.statVal}>{fmt(summary?.summary?.averageExpense)}</Text>
              <Text style={s.statLbl}>Average</Text>
            </View>
            <View style={s.divider} />
            <View style={s.stat}>
              <Text style={s.statVal}>{tIcon} {Math.abs(summary?.comparison?.percentageChange || 0)}%</Text>
              <Text style={s.statLbl}>vs Last Month</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={s.qRow}>
          <View style={s.qCard}>
            <Text style={{ fontSize: 24 }}>⬆️</Text>
            <Text style={s.qVal}>{fmt(summary?.summary?.highestExpense)}</Text>
            <Text style={s.qLbl}>Highest</Text>
          </View>
          <View style={s.qCard}>
            <Text style={{ fontSize: 24 }}>⬇️</Text>
            <Text style={s.qVal}>{fmt(summary?.summary?.lowestExpense)}</Text>
            <Text style={s.qLbl}>Lowest</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={s.secHead}>
          <Text style={s.secTitle}>Category Breakdown</Text>
        </View>
        {categories.length > 0 ? categories.map((cat) => {
          const cf = getCat(cat.category);
          return (
            <View key={cat.category} style={s.catCard}>
              <View style={s.catLeft}>
                <View style={[s.catIconBg, { backgroundColor: cf.color + '20' }]}>
                  <Text style={{ fontSize: 22 }}>{cf.icon}</Text>
                </View>
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={s.catName}>{cat.category}</Text>
                  <Text style={s.catCount}>{cat.count} transaction{cat.count !== 1 ? 's' : ''}</Text>
                </View>
              </View>
              <View style={s.catRight}>
                <Text style={s.catAmt}>{fmt(cat.totalAmount)}</Text>
                <Text style={[s.catPct, { color: cf.color }]}>{cat.percentage}%</Text>
              </View>
              <View style={s.progBg}><View style={[s.prog, { width: `${cat.percentage}%`, backgroundColor: cf.color }]} /></View>
            </View>
          );
        }) : (
          <View style={s.empty}><Text style={{ fontSize: 40 }}>📊</Text><Text style={s.emptyText}>No expenses this month</Text></View>
        )}

        {/* Recent */}
        <View style={s.secHead}>
          <Text style={s.secTitle}>Recent Expenses</Text>
          <TouchableOpacity onPress={() => navigation.navigate('History')}>
            <Text style={s.viewAll}>View All →</Text>
          </TouchableOpacity>
        </View>
        {summary?.recentExpenses?.map((exp) => {
          const cf = getCat(exp.category);
          return (
            <View key={exp._id} style={s.expItem}>
              <View style={[s.expIconBg, { backgroundColor: cf.color + '20' }]}>
                <Text style={{ fontSize: 22 }}>{cf.icon}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={s.expCat}>{exp.category}</Text>
                <Text style={s.expNote}>{exp.note || 'No note'}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={s.expAmt}>-{fmt(exp.amount)}</Text>
                <Text style={s.expDate}>{new Date(exp.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</Text>
              </View>
            </View>
          );
        })}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },
  loadText: { color: Colors.textSecondary, marginTop: 12, fontSize: 16 },
  scroll: { paddingHorizontal: 20, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting: { fontSize: 16, color: Colors.textSecondary },
  userName: { fontSize: 26, fontWeight: '800', color: Colors.text, marginTop: 2 },
  notifBtn: { width: 48, height: 48, borderRadius: 16, backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  totalCard: { backgroundColor: Colors.primary, borderRadius: 24, padding: 24, marginBottom: 20, overflow: 'hidden' },
  glow: { position: 'absolute', top: -50, right: -50, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.1)' },
  totalLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '500', marginBottom: 8 },
  totalAmt: { color: '#fff', fontSize: 36, fontWeight: '800', letterSpacing: 1, marginBottom: 20 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  stat: { flex: 1, alignItems: 'center' },
  statVal: { color: '#fff', fontSize: 14, fontWeight: '700' },
  statLbl: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 4 },
  divider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.2)' },
  qRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  qCard: { flex: 1, borderRadius: 18, padding: 16, alignItems: 'center', backgroundColor: '#1a2940', borderWidth: 1, borderColor: Colors.border },
  qVal: { color: Colors.text, fontSize: 16, fontWeight: '700', marginTop: 8 },
  qLbl: { color: Colors.textSecondary, fontSize: 12, marginTop: 4 },
  secHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  secTitle: { fontSize: 20, fontWeight: '700', color: Colors.text },
  viewAll: { color: Colors.primary, fontSize: 14, fontWeight: '600' },
  catCard: { backgroundColor: Colors.card, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: Colors.border },
  catLeft: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  catIconBg: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  catName: { color: Colors.text, fontSize: 16, fontWeight: '600' },
  catCount: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  catRight: { position: 'absolute', right: 16, top: 16, alignItems: 'flex-end' },
  catAmt: { color: Colors.text, fontSize: 16, fontWeight: '700' },
  catPct: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  progBg: { height: 4, backgroundColor: Colors.border, borderRadius: 2, marginTop: 4 },
  prog: { height: 4, borderRadius: 2 },
  empty: { alignItems: 'center', paddingVertical: 30, backgroundColor: Colors.card, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: Colors.border },
  emptyText: { color: Colors.textSecondary, fontSize: 16, fontWeight: '600', marginTop: 10 },
  expItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: Colors.border },
  expIconBg: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  expCat: { color: Colors.text, fontSize: 15, fontWeight: '600' },
  expNote: { color: Colors.textMuted, fontSize: 13, marginTop: 2 },
  expAmt: { color: Colors.error, fontSize: 15, fontWeight: '700' },
  expDate: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
});

export default DashboardScreen;
