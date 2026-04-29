import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, StatusBar,
} from 'react-native';
import { expenseAPI } from '../services/api';
import Colors from '../config/colors';
import Constants from '../config/constants';

const EditExpenseScreen = ({ route, navigation }) => {
  const { expense } = route.params;
  const [amount, setAmount] = useState(String(expense.amount));
  const [category, setCategory] = useState(expense.category);
  const [note, setNote] = useState(expense.note || '');
  const [paymentMethod, setPaymentMethod] = useState(expense.paymentMethod || 'Cash');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    try {
      setLoading(true);
      await expenseAPI.update(expense._id, {
        amount: parseFloat(amount), category, note, paymentMethod,
      });
      Alert.alert('Success', 'Expense updated!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await expenseAPI.delete(expense._id);
            navigation.goBack();
          } catch (err) {
            Alert.alert('Error', 'Failed to delete');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Text style={styles.deleteBtn}>🗑️ Delete</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Edit Expense</Text>

        {/* Amount */}
        <View style={styles.amountCard}>
          <Text style={styles.label}>Amount</Text>
          <View style={styles.amountRow}>
            <Text style={styles.currency}>₹</Text>
            <TextInput style={styles.amountInput} value={amount}
              onChangeText={setAmount} keyboardType="decimal-pad"
              placeholder="0.00" placeholderTextColor={Colors.textMuted} />
          </View>
        </View>

        {/* Category */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.grid}>
          {Constants.CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.name}
              style={[styles.chip, category === cat.name && { backgroundColor: cat.color + '30', borderColor: cat.color }]}
              onPress={() => setCategory(cat.name)}>
              <Text style={styles.chipIcon}>{cat.icon}</Text>
              <Text style={[styles.chipText, category === cat.name && { color: cat.color }]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment */}
        <Text style={styles.label}>Payment Method</Text>
        <View style={styles.payRow}>
          {Constants.PAYMENT_METHODS.map((m) => (
            <TouchableOpacity key={m}
              style={[styles.payChip, paymentMethod === m && styles.payActive]}
              onPress={() => setPaymentMethod(m)}>
              <Text style={[styles.payText, paymentMethod === m && { color: Colors.primary }]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Note */}
        <Text style={styles.label}>Note</Text>
        <TextInput style={styles.noteInput} value={note} onChangeText={setNote}
          placeholder="Add a note..." placeholderTextColor={Colors.textMuted}
          multiline maxLength={200} />

        <TouchableOpacity style={[styles.saveBtn, loading && { opacity: 0.7 }]}
          onPress={handleUpdate} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> :
            <Text style={styles.saveBtnText}>Save Changes</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingTop: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { color: Colors.primary, fontSize: 16, fontWeight: '600' },
  deleteBtn: { color: Colors.error, fontSize: 16, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text, marginBottom: 24 },
  amountCard: { backgroundColor: Colors.card, borderRadius: 20, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: Colors.border },
  label: { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: 12 },
  amountRow: { flexDirection: 'row', alignItems: 'center' },
  currency: { fontSize: 32, fontWeight: '800', color: Colors.primary, marginRight: 8 },
  amountInput: { flex: 1, fontSize: 36, fontWeight: '800', color: Colors.text },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, backgroundColor: Colors.card, borderWidth: 1.5, borderColor: Colors.border },
  chipIcon: { fontSize: 18, marginRight: 6 },
  chipText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  payRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  payChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  payActive: { backgroundColor: Colors.primary + '20', borderColor: Colors.primary },
  payText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  noteInput: { backgroundColor: Colors.card, borderRadius: 16, padding: 16, color: Colors.text, fontSize: 15, minHeight: 80, borderWidth: 1, borderColor: Colors.border, marginBottom: 24, textAlignVertical: 'top' },
  saveBtn: { backgroundColor: Colors.primary, borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  saveBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});

export default EditExpenseScreen;
