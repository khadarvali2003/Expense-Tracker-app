import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, orderBy, serverTimestamp, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign, PieChart as PieIcon, List as ListIcon, Activity, Edit2, Filter, Target } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

const Dashboard = ({ user }) => {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New features state
  const [editId, setEditId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [monthlyBudget, setMonthlyBudget] = useState(2000); // Default budget

  const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Others'];
  const COLORS = ['#6366f1', '#a855f7', '#22d3ee', '#10b981', '#f59e0b', '#ef4444', '#94a3b8'];

  useEffect(() => {
    // Simplified query to avoid immediate composite index requirement
    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort manually in JS for now to avoid Firestore index errors
      data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setExpenses(data);
      setLoading(false);
    }, (err) => {
      console.error("Firestore error", err);
      setError("Database Error: Could not sync expenses. This might be due to missing permissions or indexes.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user.uid]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) return;

    try {
      if (editId) {
        // Update existing record
        await updateDoc(doc(db, 'expenses', editId), {
          amount: parseFloat(amount),
          category,
          note
        });
        setEditId(null);
      } else {
        // Add new record
        await addDoc(collection(db, 'expenses'), {
          amount: parseFloat(amount),
          category,
          note,
          userId: user.uid,
          createdAt: serverTimestamp()
        });
      }
      setAmount('');
      setNote('');
      setCategory('Food');
    } catch (err) {
      console.error("Error saving expense", err);
    }
  };

  const handleEditClick = (expense) => {
    setEditId(expense.id);
    setAmount(expense.amount.toString());
    setCategory(expense.category);
    setNote(expense.note || '');
    // Scroll to top for mobile users to see the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'expenses', id));
    } catch (err) {
      console.error("Error deleting expense", err);
    }
  };

  const totalSpent = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  
  const categoryData = categories.map(cat => ({
    name: cat,
    value: expenses
      .filter(e => e.category === cat)
      .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
  })).filter(d => d.value > 0);

  const filteredExpenses = filterCategory === 'All' 
    ? expenses 
    : expenses.filter(e => e.category === filterCategory);
    
  const budgetPercentage = Math.min((totalSpent / monthlyBudget) * 100, 100);
  const isOverBudget = totalSpent > monthlyBudget;

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', gap: '20px' }}>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--primary)', borderTopColor: 'transparent' }}
        />
        <span style={{ color: 'var(--text-muted)' }}>Syncing Cloud Records...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass" style={{ padding: '40px', textAlign: 'center', color: '#ff4444' }}>
        <TrendingDown size={40} style={{ marginBottom: '20px' }} />
        <h3>Data Sync Failed</h3>
        <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
      <div className="main-content">
        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div className="glass" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ background: 'rgba(99,102,241,0.1)', padding: '8px', borderRadius: '8px' }}>
                <TrendingDown size={20} color="var(--primary)" />
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Spending</span>
            </div>
            <h2 style={{ fontSize: '2rem' }}>${totalSpent.toLocaleString()}</h2>
          </div>
          <div className="glass" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ background: 'rgba(34,211,238,0.1)', padding: '8px', borderRadius: '8px' }}>
                <Activity size={20} color="var(--accent)" />
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Monthly Transactions</span>
            </div>
            <h2 style={{ fontSize: '2rem' }}>{expenses.length}</h2>
          </div>
          <div className="glass" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ background: 'rgba(16,185,129,0.1)', padding: '8px', borderRadius: '8px' }}>
                <Target size={20} color={isOverBudget ? "var(--danger)" : "var(--success)"} />
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Budget Goal (${monthlyBudget})</span>
            </div>
            <h2 style={{ fontSize: '2rem', color: isOverBudget ? 'var(--danger)' : 'inherit' }}>
              ${(monthlyBudget - totalSpent).toLocaleString()} {isOverBudget ? 'Over' : 'Left'}
            </h2>
            <div style={{ marginTop: '12px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
               <motion.div 
                 initial={{ width: 0 }} 
                 animate={{ width: `${budgetPercentage}%` }} 
                 style={{ height: '100%', background: isOverBudget ? 'var(--danger)' : 'var(--success)', borderRadius: '3px' }}
               />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div className="glass" style={{ padding: '24px', minHeight: '350px' }}>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><PieIcon size={18} /> Category Analytics</h3>
            <div style={{ height: '250px' }}>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No data yet</div>
              )}
            </div>
          </div>
          <div className="glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
               <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ListIcon size={18} /> Recent Activity</h3>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '8px' }}>
                 <Filter size={14} color="var(--text-muted)" />
                 <select 
                   value={filterCategory} 
                   onChange={(e) => setFilterCategory(e.target.value)}
                   style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: '0.85rem' }}
                 >
                   <option value="All">All Categories</option>
                   {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                 </select>
               </div>
             </div>
             
             <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
                <AnimatePresence>
                  {filteredExpenses.map((expense) => (
                    <motion.div 
                      key={expense.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      style={{ 
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                        padding: '12px', borderBottom: '1px solid var(--border)',
                        background: editId === expense.id ? 'rgba(99,102,241,0.1)' : 'transparent',
                        borderRadius: editId === expense.id ? '8px' : '0'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>{expense.note || expense.category}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{expense.category}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontWeight: 700, color: '#ef4444' }}>-${expense.amount}</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleEditClick(expense)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', opacity: 0.7, padding: '4px' }}>
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(expense.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', opacity: 0.7, padding: '4px' }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {filteredExpenses.length === 0 && <div style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: '40px' }}>No records found</div>}
             </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Add Expense */}
      <div className="sidebar">
        <div className="glass" style={{ padding: '30px', position: 'sticky', top: '120px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {editId ? <Edit2 size={20} color="var(--primary)" /> : <Plus size={20} color="var(--primary)" />} 
              {editId ? 'Edit Record' : 'Log Transaction'}
            </h3>
            {editId && (
              <button 
                onClick={() => { setEditId(null); setAmount(''); setNote(''); setCategory('Food'); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Cancel
              </button>
            )}
          </div>
          <form onSubmit={handleAddExpense}>
            <div className="input-group">
              <label>Amount ($)</label>
              <input 
                type="number" 
                className="premium-input" 
                placeholder="0.00" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                step="0.01"
              />
            </div>
            <div className="input-group">
              <label>Category</label>
              <select 
                className="premium-input" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ appearance: 'none' }}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Note (Optional)</label>
              <input 
                type="text" 
                className="premium-input" 
                placeholder="What was it for?" 
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <button type="submit" className="premium-button" style={{ width: '100%' }}>
              {editId ? <Edit2 size={18} /> : <Plus size={18} />} 
              {editId ? 'Update Record' : 'Add Record'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
