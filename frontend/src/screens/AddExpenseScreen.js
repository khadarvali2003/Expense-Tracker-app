import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, StatusBar,
} from 'react-native';
import { expenseAPI } from '../services/api';
import Colors from '../config/colors';
import Constants from '../config/constants';

const AddExpenseScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    try {
      setLoading(true);
      await expenseAPI.create({
        amount: parseFloat(amount),
        category,
        date: new Date().toISOString(),
        note,
        paymentMethod,
      });
      Alert.alert('Success', 'Expense added!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Add Expense</Text>
        <Text style={styles.subtitle}>Track your spending</Text>

        {/* Amount */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount</Text>
          <View style={styles.amountRow}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor={Colors.textMuted}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Categories */}
        <Text style={styles.sectionLabel}>Category</Text>
        <View style={styles.categoryGrid}>
          {Constants.CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.name}
              style={[
                styles.categoryChip,
                category === cat.name && { backgroundColor: cat.color + '30', borderColor: cat.color },
              ]}
              onPress={() => setCategory(cat.name)}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={[styles.categoryText, category === cat.name && { color: cat.color }]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Method */}
        <Text style={styles.sectionLabel}>Payment Method</Text>
        <View style={styles.paymentRow}>
          {Constants.PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method}
              style={[
                styles.paymentChip,
                paymentMethod === method && styles.paymentChipActive,
              ]}
              onPress={() => setPaymentMethod(method)}
            >
              <Text style={[
                styles.paymentText,
                paymentMethod === method && styles.paymentTextActive,
              ]}>
                {method}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Note */}
        <Text style={styles.sectionLabel}>Note</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="What was this expense for?"
          placeholderTextColor={Colors.textMuted}
          value={note}
          onChangeText={setNote}
          multiline
          maxLength={200}
        />

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Add Expense</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text },
  subtitle: { fontSize: 15, color: Colors.textSecondary, marginBottom: 24 },
  amountCard: {
    backgroundColor: Colors.card, borderRadius: 20, padding: 20,
    marginBottom: 24, borderWidth: 1, borderColor: Colors.border,
  },
  amountLabel: { fontSize: 14, color: Colors.textSecondary, marginBottom: 8 },
  amountRow: { flexDirection: 'row', alignItems: 'center' },
  currencySymbol: { fontSize: 32, fontWeight: '800', color: Colors.primary, marginRight: 8 },
  amountInput: { flex: 1, fontSize: 36, fontWeight: '800', color: Colors.text },
  sectionLabel: { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: 12 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  categoryChip: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 14, backgroundColor: Colors.card, borderWidth: 1.5, borderColor: Colors.border,
  },
  categoryIcon: { fontSize: 18, marginRight: 6 },
  categoryText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  paymentRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  paymentChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12,
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
  },
  paymentChipActive: { backgroundColor: Colors.primary + '20', borderColor: Colors.primary },
  paymentText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  paymentTextActive: { color: Colors.primary },
  noteInput: {
    backgroundColor: Colors.card, borderRadius: 16, padding: 16,
    color: Colors.text, fontSize: 15, minHeight: 80,
    borderWidth: 1, borderColor: Colors.border, marginBottom: 24, textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: Colors.primary, borderRadius: 16, height: 56,
    alignItems: 'center', justifyContent: 'center', marginBottom: 40,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  submitText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});

export default AddExpenseScreen;
