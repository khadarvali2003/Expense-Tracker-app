import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '../firebase';
import {
  collection, query, where, onSnapshot, addDoc, deleteDoc,
  doc, updateDoc, serverTimestamp, getDocs
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);
export const useData = () => useContext(DataContext);

const DEFAULT_CATEGORIES = [
  { id: 'food', name: 'Food', icon: '🍔', color: '#f59e0b' },
  { id: 'transport', name: 'Transport', icon: '🚗', color: '#6366f1' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#a855f7' },
  { id: 'bills', name: 'Bills', icon: '📄', color: '#ef4444' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#22d3ee' },
  { id: 'health', name: 'Healthcare', icon: '🏥', color: '#10b981' },
  { id: 'education', name: 'Education', icon: '📚', color: '#3b82f6' },
  { id: 'travel', name: 'Travel', icon: '✈️', color: '#ec4899' },
  { id: 'salary', name: 'Salary', icon: '💰', color: '#10b981', type: 'income' },
  { id: 'freelance', name: 'Freelance', icon: '💻', color: '#8b5cf6', type: 'income' },
  { id: 'investment', name: 'Investment', icon: '📈', color: '#06b6d4', type: 'income' },
  { id: 'others', name: 'Others', icon: '📦', color: '#64748b' },
];

const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Wallet'];

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [budgets, setBudgets] = useState({ monthly: 5000, categories: {} });
  const [wallets, setWallets] = useState([
    { id: 'main', name: 'Main Wallet', balance: 0, icon: '💳', color: '#6366f1' }
  ]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState('₹');
  const [theme, setTheme] = useState('classic');

  // Subscribe to transactions
  useEffect(() => {
    if (!user) { setTransactions([]); setLoading(false); return; }
    const q = query(collection(db, 'transactions'), where('userId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setTransactions(data);
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, [user]);

  // Load user settings (budgets, categories, currency)
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, 'userSettings', user.uid), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        if (d.budgets) setBudgets(d.budgets);
        if (d.customCategories) setCategories([...DEFAULT_CATEGORIES, ...d.customCategories]);
        if (d.currency) setCurrency(d.currency);
        if (d.wallets) setWallets(d.wallets);
        if (d.theme) setTheme(d.theme);
      }
    }, () => {});
    return unsub;
  }, [user]);

  const addTransaction = async (data) => {
    if (!user) return;
    await addDoc(collection(db, 'transactions'), {
      ...data,
      userId: user.uid,
      createdAt: serverTimestamp()
    });
  };

  const updateTransaction = async (id, data) => {
    await updateDoc(doc(db, 'transactions', id), data);
  };

  const deleteTransaction = async (id) => {
    await deleteDoc(doc(db, 'transactions', id));
  };

  const updateSettings = async (settings) => {
    if (!user) return;
    const { setDoc } = await import('firebase/firestore');
    await setDoc(doc(db, 'userSettings', user.uid), settings, { merge: true });
  };

  const saveBudgets = (b) => { setBudgets(b); updateSettings({ budgets: b }); };
  const saveCurrency = (c) => { setCurrency(c); updateSettings({ currency: c }); };
  const addCustomCategory = (cat) => {
    const custom = categories.filter(c => !DEFAULT_CATEGORIES.find(d => d.id === c.id));
    custom.push(cat);
    setCategories([...DEFAULT_CATEGORIES, ...custom]);
    updateSettings({ customCategories: custom });
  };
  const saveWallets = (w) => { setWallets(w); updateSettings({ wallets: w }); };
  const saveTheme = (t) => { setTheme(t); updateSettings({ theme: t }); };

  // Computed values
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + (Number(t.amount) || 0), 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + (Number(t.amount) || 0), 0);
  const balance = totalIncome - totalExpenses;

  return (
    <DataContext.Provider value={{
      transactions, categories, budgets, wallets, loading, currency, theme,
      totalIncome, totalExpenses, balance,
      addTransaction, updateTransaction, deleteTransaction,
      saveBudgets, saveCurrency, addCustomCategory, saveWallets, saveTheme,
      updateSettings, PAYMENT_METHODS, DEFAULT_CATEGORIES,
    }}>
      {children}
    </DataContext.Provider>
  );
};
