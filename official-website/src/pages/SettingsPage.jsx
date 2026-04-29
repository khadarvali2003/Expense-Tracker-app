import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Globe, LogOut, Shield, Bell, Download, ChevronRight, Sparkles } from 'lucide-react';

const CURRENCIES = [
  { symbol: '₹', name: 'INR - Indian Rupee' },
  { symbol: '$', name: 'USD - US Dollar' },
  { symbol: '€', name: 'EUR - Euro' },
  { symbol: '£', name: 'GBP - British Pound' },
  { symbol: '¥', name: 'JPY - Japanese Yen' },
];

const SettingsPage = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const { currency, saveCurrency, transactions, theme, saveTheme } = useData();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      await updateUserProfile({ displayName });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleExportCSV = () => {
    console.log('Exporting transactions:', transactions);
    if (!transactions || transactions.length === 0) {
      alert('No transactions found to export. Please add some data first!');
      return;
    }
    
    try {
      const header = 'Date,Type,Category,Amount,Note,PaymentMethod\n';
      const rows = transactions.map(t => {
        let dateStr = '';
        try {
          if (t.createdAt?.seconds) {
            dateStr = new Date(t.createdAt.seconds * 1000).toLocaleDateString().replace(/\//g, '-');
          } else if (t.date) {
            dateStr = new Date(t.date).toLocaleDateString().replace(/\//g, '-');
          } else {
            dateStr = new Date().toLocaleDateString().replace(/\//g, '-');
          }
        } catch (e) {
          dateStr = 'N/A';
        }

        const type = t.type || 'N/A';
        const category = t.category || 'Uncategorized';
        const amount = t.amount || 0;
        const note = String(t.note || '').replace(/"/g, '""').replace(/\n/g, ' ');
        const paymentMethod = t.paymentMethod || 'N/A';

        return `${dateStr},${type},${category},${amount},"${note}",${paymentMethod}`;
      }).join('\n');
      
      // Add UTF-8 BOM for Excel compatibility
      const blob = new Blob(['\ufeff' + header + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().split('T')[0];
      
      link.href = url;
      link.setAttribute('download', `ExpensyPro_Export_${timestamp}.csv`);
      document.body.appendChild(link);
      link.click();
      
      // Success feedback
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
      alert('Success! Your transaction report has been generated.');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to generate CSV. Error: ' + error.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="page-container" style={{ maxWidth: 700 }}>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <motion.div className="glass" style={{ padding: 28, marginBottom: 20 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <User size={18} color="var(--primary)" /> Profile
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: 'white', flexShrink: 0 }}>
            {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{user?.displayName || 'User'}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user?.email}</div>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Display Name</label>
          <input className="form-input" value={displayName} onChange={e => setDisplayName(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={handleUpdateProfile} disabled={saving}>
          {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Update Profile'}
        </button>
      </motion.div>

      {/* Currency */}
      <motion.div className="glass" style={{ padding: 28, marginBottom: 20 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Globe size={18} color="var(--accent)" /> Currency
        </h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CURRENCIES.map(c => (
            <button key={c.symbol} className={`category-chip ${currency === c.symbol ? 'active' : ''}`}
              onClick={() => saveCurrency(c.symbol)}
              style={currency === c.symbol ? { borderColor: 'var(--primary)', background: 'var(--primary-glow)' } : {}}>
              <span style={{ fontSize: '1.1rem' }}>{c.symbol}</span> {c.name}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Appearance / Theme */}
      <motion.div className="glass" style={{ padding: 28, marginBottom: 20 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={18} color="var(--secondary)" /> Appearance
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>Choose your favorite look for the dashboard.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
          {[
            { id: 'classic', name: 'Classic Dark', color: '#6366f1' },
            { id: 'light', name: 'Light Mode', color: '#f8fafc' },
            { id: 'midnight', name: 'Midnight', color: '#38bdf8' },
            { id: 'forest', name: 'Forest', color: '#10b981' },
            { id: 'sunset', name: 'Sunset', color: '#f97316' },
          ].map(t => (
            <button key={t.id} className={`theme-card ${theme === t.id ? 'active' : ''}`}
              onClick={() => saveTheme(t.id)}
              style={{
                background: theme === t.id ? 'var(--surface-hover)' : 'rgba(255,255,255,0.02)',
                border: theme === t.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                padding: '16px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center'
              }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: t.color, margin: '0 auto 8px', border: t.id === 'light' ? '1px solid #ddd' : 'none' }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: theme === t.id ? 'var(--text-main)' : 'var(--text-muted)' }}>{t.name}</div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Export */}
      <motion.div className="glass" style={{ padding: 28, marginBottom: 20 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Download size={18} color="var(--success)" /> Export Data
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>Download all your transactions as a CSV file for spreadsheets or backup.</p>
        <button className="btn-secondary" onClick={handleExportCSV}>
          <Download size={16} /> Export as CSV
        </button>
      </motion.div>

      {/* Account Actions */}
      <motion.div className="glass" style={{ padding: 28 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={18} color="var(--danger)" /> Account
        </h3>
        <button className="btn-danger" onClick={handleLogout}>
          <LogOut size={16} /> Sign Out
        </button>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
