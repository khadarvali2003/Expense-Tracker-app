import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import { Target, Plus, AlertTriangle, Check, Edit2 } from 'lucide-react';

const BudgetPage = () => {
  const { budgets, saveBudgets, categories, transactions, currency, totalExpenses } = useData();
  const [editingMonthly, setEditingMonthly] = useState(false);
  const [monthlyValue, setMonthlyValue] = useState(budgets.monthly.toString());
  const [showCatBudget, setShowCatBudget] = useState(false);
  const [catName, setCatName] = useState('');
  const [catBudgetVal, setCatBudgetVal] = useState('');

  const handleSaveMonthly = () => {
    saveBudgets({ ...budgets, monthly: parseFloat(monthlyValue) || 0 });
    setEditingMonthly(false);
  };

  const handleAddCatBudget = () => {
    if (!catName || !catBudgetVal) return;
    const updated = { ...budgets, categories: { ...budgets.categories, [catName]: parseFloat(catBudgetVal) } };
    saveBudgets(updated);
    setCatName(''); setCatBudgetVal(''); setShowCatBudget(false);
  };

  const expenseCategories = categories.filter(c => c.type !== 'income');
  const monthlyUsed = budgets.monthly > 0 ? (totalExpenses / budgets.monthly) * 100 : 0;

  const getCatSpent = (catName) => transactions.filter(t => t.type === 'expense' && t.category === catName).reduce((s, t) => s + Number(t.amount), 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Budget</h1>
        <p>Set spending limits and track your goals</p>
      </div>

      {/* Monthly Budget */}
      <motion.div className="glass" style={{ padding: 28, marginBottom: 24 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Target size={20} color="var(--primary)" /> Monthly Budget
          </h3>
          <button className="btn-secondary" onClick={() => setEditingMonthly(!editingMonthly)}>
            <Edit2 size={14} /> {editingMonthly ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editingMonthly ? (
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label className="form-label">Budget Amount</label>
              <input type="number" className="form-input" value={monthlyValue} onChange={e => setMonthlyValue(e.target.value)} />
            </div>
            <button className="btn-primary" onClick={handleSaveMonthly}><Check size={16} /> Save</button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800 }}>{currency}{totalExpenses.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ {currency}{budgets.monthly.toLocaleString()}</span></div>
              <span className={`badge ${monthlyUsed >= 100 ? 'badge-danger' : monthlyUsed >= 75 ? 'badge-warning' : 'badge-success'}`}>
                {monthlyUsed.toFixed(0)}% used
              </span>
            </div>
            <div className="progress-bar" style={{ height: 12 }}>
              <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${Math.min(monthlyUsed, 100)}%` }}
                style={{ background: monthlyUsed >= 100 ? 'var(--danger)' : monthlyUsed >= 75 ? 'var(--warning)' : 'linear-gradient(90deg, var(--success), var(--accent))' }} />
            </div>
            {monthlyUsed >= 90 && (
              <div style={{ marginTop: 12, padding: 12, background: 'var(--danger-glow)', borderRadius: 10, fontSize: '0.85rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={16} /> Warning: You're about to exceed your monthly budget!
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Category Budgets */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Category Budgets</h3>
        <button className="btn-primary" style={{ fontSize: '0.85rem', padding: '8px 16px' }} onClick={() => setShowCatBudget(!showCatBudget)}>
          <Plus size={14} /> Add
        </button>
      </div>

      {showCatBudget && (
        <motion.div className="glass" style={{ padding: 20, marginBottom: 20 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: 160 }}>
              <label className="form-label">Category</label>
              <select className="form-input" value={catName} onChange={e => setCatName(e.target.value)}>
                <option value="">Select...</option>
                {expenseCategories.map(c => <option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 120 }}>
              <label className="form-label">Limit</label>
              <input type="number" className="form-input" value={catBudgetVal} onChange={e => setCatBudgetVal(e.target.value)} placeholder="0" />
            </div>
            <button className="btn-primary" onClick={handleAddCatBudget}><Check size={14} /></button>
          </div>
        </motion.div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {Object.entries(budgets.categories || {}).map(([cat, limit]) => {
          const spent = getCatSpent(cat);
          const pct = limit > 0 ? (spent / limit) * 100 : 0;
          const catInfo = categories.find(c => c.name === cat);
          return (
            <motion.div key={cat} className="glass" style={{ padding: 20 }} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${catInfo?.color || '#64748b'}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                  {catInfo?.icon || '📦'}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cat}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currency}{spent.toLocaleString()} / {currency}{limit.toLocaleString()}</div>
                </div>
                <span className={`badge ${pct >= 100 ? 'badge-danger' : pct >= 75 ? 'badge-warning' : 'badge-success'}`} style={{ marginLeft: 'auto' }}>
                  {pct.toFixed(0)}%
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${Math.min(pct, 100)}%`, background: pct >= 100 ? 'var(--danger)' : pct >= 75 ? 'var(--warning)' : catInfo?.color || 'var(--primary)' }} />
              </div>
            </motion.div>
          );
        })}
        {Object.keys(budgets.categories || {}).length === 0 && (
          <div className="glass" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1/-1' }}>
            No category budgets set. Click "Add" to create one.
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetPage;
