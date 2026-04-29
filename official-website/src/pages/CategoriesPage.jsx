import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import { Tags, Plus, Trash2, Edit2, X, Check } from 'lucide-react';

const PRESET_COLORS = ['#6366f1', '#a855f7', '#22d3ee', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#3b82f6', '#f97316', '#14b8a6'];
const PRESET_ICONS = ['🍔', '🚗', '🛍️', '📄', '🎬', '🏥', '📚', '✈️', '💰', '🏠', '👕', '⚽', '🎵', '💻', '🐕', '💊', '🎁', '☕'];

const CategoriesPage = () => {
  const { categories, addCustomCategory, DEFAULT_CATEGORIES } = useData();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📦');
  const [color, setColor] = useState('#6366f1');
  const [catType, setCatType] = useState('expense');

  const handleAdd = () => {
    if (!name.trim()) return;
    addCustomCategory({ id: name.toLowerCase().replace(/\s/g, '-') + '-' + Date.now(), name, icon, color, type: catType === 'income' ? 'income' : undefined });
    setName(''); setIcon('📦'); setShowForm(false);
  };

  const expenseCats = categories.filter(c => c.type !== 'income');
  const incomeCats = categories.filter(c => c.type === 'income');

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1>Categories</h1><p>Manage your transaction categories</p></div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Category</>}
        </button>
      </div>

      {showForm && (
        <motion.div className="glass" style={{ padding: 24, marginBottom: 24 }} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>New Category</h3>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label className="form-label">Name</label>
              <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="Category name" />
            </div>
            <div>
              <label className="form-label">Type</label>
              <select className="form-input" value={catType} onChange={e => setCatType(e.target.value)}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <button className="btn-primary" onClick={handleAdd} disabled={!name.trim()}><Check size={16} /> Save</button>
          </div>
          <div style={{ marginTop: 16 }}>
            <label className="form-label">Icon</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {PRESET_ICONS.map(i => (
                <button key={i} onClick={() => setIcon(i)} style={{ width: 36, height: 36, borderRadius: 8, border: icon === i ? '2px solid var(--primary)' : '1px solid var(--border)', background: icon === i ? 'var(--primary-glow)' : 'transparent', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {i}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label className="form-label">Color</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {PRESET_COLORS.map(c => (
                <button key={c} onClick={() => setColor(c)} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: color === c ? '3px solid white' : '2px solid transparent', cursor: 'pointer' }} />
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: '1rem', marginBottom: 16, color: 'var(--text-secondary)' }}>Expense Categories</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {expenseCats.map(cat => (
            <div key={cat.id} className="glass glass-hover" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12, cursor: 'default' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${cat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{cat.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cat.name}</div>
                <div style={{ width: 20, height: 4, borderRadius: 2, background: cat.color, marginTop: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '1rem', marginBottom: 16, color: 'var(--text-secondary)' }}>Income Categories</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {incomeCats.map(cat => (
            <div key={cat.id} className="glass glass-hover" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12, cursor: 'default' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${cat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{cat.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cat.name}</div>
                <div style={{ width: 20, height: 4, borderRadius: 2, background: cat.color, marginTop: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
