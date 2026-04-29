import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import { RefreshCw, Plus, X, Check, Calendar, Trash2 } from 'lucide-react';

const RecurringPage = () => {
  const { categories, currency, addTransaction, updateSettings } = useData();
  const [recurrings, setRecurrings] = useState([
    { id: 1, name: 'Netflix Subscription', amount: 199, category: 'Entertainment', frequency: 'Monthly', icon: '🎬' },
    { id: 2, name: 'Electricity Bill', amount: 1500, category: 'Bills', frequency: 'Monthly', icon: '⚡' },
    { id: 3, name: 'Gym Membership', amount: 800, category: 'Healthcare', frequency: 'Monthly', icon: '💪' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Bills');
  const [frequency, setFrequency] = useState('Monthly');

  const handleAdd = () => {
    if (!name || !amount) return;
    const cat = categories.find(c => c.name === category);
    setRecurrings([...recurrings, { id: Date.now(), name, amount: parseFloat(amount), category, frequency, icon: cat?.icon || '📦' }]);
    setName(''); setAmount(''); setShowForm(false);
  };

  const handleDelete = (id) => setRecurrings(recurrings.filter(r => r.id !== id));

  const handleLogNow = async (r) => {
    await addTransaction({ type: 'expense', amount: r.amount, category: r.category, note: r.name, paymentMethod: 'Auto', date: new Date().toISOString().split('T')[0] });
  };

  const expenseCats = categories.filter(c => c.type !== 'income');
  const totalRecurring = recurrings.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1>Recurring Expenses</h1><p>Track your subscriptions and recurring bills</p></div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Recurring</>}
        </button>
      </div>

      <motion.div className="glass" style={{ padding: 24, marginBottom: 24, borderLeft: '4px solid var(--warning)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Monthly Recurring</div>
        <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: 4 }}>{currency}{totalRecurring.toLocaleString()}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{recurrings.length} active subscriptions</div>
      </motion.div>

      {showForm && (
        <motion.div className="glass" style={{ padding: 24, marginBottom: 24 }} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 2, minWidth: 180 }}>
              <label className="form-label">Name</label>
              <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Spotify" />
            </div>
            <div style={{ flex: 1, minWidth: 100 }}>
              <label className="form-label">Amount</label>
              <input type="number" className="form-input" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" />
            </div>
            <div style={{ flex: 1, minWidth: 120 }}>
              <label className="form-label">Category</label>
              <select className="form-input" value={category} onChange={e => setCategory(e.target.value)}>
                {expenseCats.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 120 }}>
              <label className="form-label">Frequency</label>
              <select className="form-input" value={frequency} onChange={e => setFrequency(e.target.value)}>
                <option>Weekly</option><option>Monthly</option><option>Yearly</option>
              </select>
            </div>
            <button className="btn-primary" onClick={handleAdd}><Check size={16} /></button>
          </div>
        </motion.div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {recurrings.map(r => {
          const cat = categories.find(c => c.name === r.category);
          return (
            <motion.div key={r.id} className="glass glass-hover" style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${cat?.color || '#64748b'}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{r.icon}</div>
                <div>
                  <div style={{ fontWeight: 600 }}>{r.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.category} · {r.frequency}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{currency}{r.amount.toLocaleString()}</span>
                <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleLogNow(r)}>
                  <RefreshCw size={14} /> Log Now
                </button>
                <button className="btn-icon" onClick={() => handleDelete(r.id)} style={{ color: 'var(--danger)' }}><Trash2 size={14} /></button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RecurringPage;
