import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  RefreshControl, StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { expenseAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Colors from '../config/colors';
import Constants from '../config/constants';

const HistoryScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchExpenses = async (reset = false) => {
    try {
      const p = reset ? 1 : page;
      const res = await expenseAPI.getAll({ sort, page: p, limit: 15 });
      const data = res.data.data;
      if (reset) {
        setExpenses(data.expenses);
        setPage(2);
      } else {
        setExpenses((prev) => [...prev, ...data.expenses]);
        setPage(p + 1);
      }
      setHasMore(data.pagination.current < data.pagination.pages);
    } catch (err) {
      console.error('Fetch expenses error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchExpenses(true);
    }, [sort])
  );

  const handleDelete = (id) => {
    Alert.alert('Delete Expense', 'Are you sure you want to delete this expense?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await expenseAPI.delete(id);
            setExpenses((prev) => prev.filter((e) => e._id !== id));
          } catch (err) {
            Alert.alert('Error', 'Failed to delete expense');
          }
        },
      },
    ]);
  };

  const getCatConfig = (name) =>
    Constants.CATEGORIES.find((c) => c.name === name) || { icon: '📦', color: '#9CA3AF' };

  const formatCurrency = (amount) => `${user?.currency || '₹'}${amount?.toLocaleString('en-IN')}`;

  const sortOptions = [
    { key: 'latest', label: 'Latest' },
    { key: 'oldest', label: 'Oldest' },
    { key: 'highest', label: 'Highest' },
    { key: 'lowest', label: 'Lowest' },
  ];

  const renderItem = ({ item }) => {
    const config = getCatConfig(item.category);
    return (
      <TouchableOpacity
        style={styles.expenseCard}
        onLongPress={() => handleDelete(item._id)}
        onPress={() => navigation.navigate('EditExpense', { expense: item })}
        activeOpacity={0.7}
      >
        <View style={[styles.iconBg, { backgroundColor: config.color + '20' }]}>
          <Text style={styles.icon}>{config.icon}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.note}>{item.note || 'No note'}</Text>
          <Text style={styles.meta}>
            {item.paymentMethod} · {new Date(item.date).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </Text>
        </View>
        <Text style={styles.amount}>-{formatCurrency(item.amount)}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <Text style={styles.count}>{expenses.length} expenses</Text>
      </View>

      {/* Sort Tabs */}
      <View style={styles.sortRow}>
        {sortOptions.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.sortChip, sort === opt.key && styles.sortChipActive]}
            onPress={() => setSort(opt.key)}
          >
            <Text style={[styles.sortText, sort === opt.key && styles.sortTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchExpenses(true); }}
            tintColor={Colors.primary} colors={[Colors.primary]} />
        }
        onEndReached={() => hasMore && fetchExpenses(false)}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 40 }}>📭</Text>
            <Text style={styles.emptyText}>No expenses found</Text>
          </View>
        }
        ListFooterComponent={hasMore ? <ActivityIndicator color={Colors.primary} style={{ padding: 20 }} /> : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },
  header: { paddingHorizontal: 20, paddingTop: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text },
  count: { fontSize: 14, color: Colors.textMuted },
  sortRow: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
  sortChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  sortChipActive: { backgroundColor: Colors.primary + '20', borderColor: Colors.primary },
  sortText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  sortTextActive: { color: Colors.primary },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  expenseCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card,
    borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: Colors.border,
  },
  iconBg: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 24 },
  info: { flex: 1, marginLeft: 12 },
  category: { color: Colors.text, fontSize: 15, fontWeight: '600' },
  note: { color: Colors.textMuted, fontSize: 13, marginTop: 2 },
  meta: { color: Colors.textMuted, fontSize: 11, marginTop: 4 },
  amount: { color: Colors.error, fontSize: 16, fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { color: Colors.textSecondary, fontSize: 16, marginTop: 10 },
});

export default HistoryScreen;
