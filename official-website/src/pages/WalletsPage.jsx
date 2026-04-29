import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import { CreditCard, Plus, X, Check, Wallet } from 'lucide-react';

const WALLET_ICONS = ['💳', '🏦', '💰', '📱', '🪙', '💵'];
const WALLET_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#a855f7', '#22d3ee'];

const WalletsPage = () => {
  const { wallets, saveWallets, currency } = useData();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [icon, setIcon] = useState('💳');
  const [color, setColor] = useState('#6366f1');

  const handleAdd = () => {
    if (!name.trim()) return;
    saveWallets([...wallets, { id: 'w-' + Date.now(), name, balance: parseFloat(balance) || 0, icon, color }]);
    setName(''); setBalance(''); setShowForm(false);
  };

  const totalBalance = wallets.reduce((s, w) => s + (Number(w.balance) || 0), 0);

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1>Wallets & Accounts</h1><p>Manage your bank accounts and wallets</p></div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Wallet</>}
        </button>
      </div>

      {/* Total Balance Card */}
      <motion.div className="glass" style={{ padding: 28, marginBottom: 24, background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))' }}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 8 }}>Total Balance</div>
        <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{currency}{totalBalance.toLocaleString()}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{wallets.length} account{wallets.length !== 1 ? 's' : ''}</div>
      </motion.div>

      {showForm && (
        <motion.div className="glass" style={{ padding: 24, marginBottom: 24 }} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>New Wallet</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: 160 }}>
              <label className="form-label">Name</label>
              <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. HDFC Savings" />
            </div>
            <div style={{ flex: 1, minWidth: 120 }}>
              <label className="form-label">Balance</label>
              <input type="number" className="form-input" value={balance} onChange={e => setBalance(e.target.value)} placeholder="0" />
            </div>
            <button className="btn-primary" onClick={handleAdd}><Check size={16} /> Add</button>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {WALLET_ICONS.map(i => (
              <button key={i} onClick={() => setIcon(i)} style={{ width: 36, height: 36, borderRadius: 8, border: icon === i ? '2px solid var(--primary)' : '1px solid var(--border)', background: 'transparent', fontSize: '1.1rem', cursor: 'pointer' }}>{i}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            {WALLET_COLORS.map(c => (
              <button key={c} onClick={() => setColor(c)} style={{ width: 24, height: 24, borderRadius: '50%', background: c, border: color === c ? '3px solid white' : 'none', cursor: 'pointer' }} />
            ))}
          </div>
        </motion.div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {wallets.map(w => (
          <motion.div key={w.id} className="glass" style={{ padding: 24, borderLeft: `4px solid ${w.color}`, position: 'relative', overflow: 'hidden' }}
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ y: -2 }}>
            <div style={{ position: 'absolute', top: -20, right: -20, fontSize: '5rem', opacity: 0.05 }}>{w.icon}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${w.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{w.icon}</div>
              <div style={{ fontWeight: 600 }}>{w.name}</div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{currency}{Number(w.balance).toLocaleString()}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WalletsPage;
