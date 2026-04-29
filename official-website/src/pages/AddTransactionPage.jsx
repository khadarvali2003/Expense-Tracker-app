import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, ArrowDownRight, ArrowUpRight, Check, Calendar, CreditCard, FileText, Tag } from 'lucide-react';

const AddTransactionPage = () => {
  const { addTransaction, categories, PAYMENT_METHODS, currency } = useData();
  const navigate = useNavigate();
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const filteredCats = categories.filter(c => {
    if (type === 'income') return c.type === 'income';
    return c.type !== 'income';
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category) return;
    setLoading(true);
    try {
      await addTransaction({
        type,
        amount: parseFloat(amount),
        category,
        note,
        date,
        paymentMethod
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setAmount(''); setNote(''); setCategory('');
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: 600 }}>
      <div className="page-header">
        <h1>Add Transaction</h1>
        <p>Record a new expense or income</p>
      </div>

      {success && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          style={{ padding: 20, background: 'var(--success-glow)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 16, textAlign: 'center', marginBottom: 24, color: 'var(--success)', fontWeight: 600 }}>
          <Check size={24} style={{ marginBottom: 8 }} /><br />Transaction added successfully!
        </motion.div>
      )}

      <motion.div className="glass" style={{ padding: 32 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Type Toggle */}
        <div className="tabs" style={{ marginBottom: 24 }}>
          <button className={`tab ${type === 'expense' ? 'active' : ''}`} onClick={() => { setType('expense'); setCategory(''); }}
            style={type === 'expense' ? { background: 'var(--danger)' } : {}}>
            <ArrowDownRight size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Expense
          </button>
          <button className={`tab ${type === 'income' ? 'active' : ''}`} onClick={() => { setType('income'); setCategory(''); }}
            style={type === 'income' ? { background: 'var(--success)' } : {}}>
            <ArrowUpRight size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Income
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Amount */}
          <div className="form-group">
            <label className="form-label">Amount</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-muted)' }}>{currency}</span>
              <input type="number" className="form-input" value={amount} onChange={e => setAmount(e.target.value)}
                placeholder="0.00" step="0.01" required
                style={{ paddingLeft: 40, fontSize: '1.4rem', fontWeight: 700, height: 56 }} />
            </div>
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label"><Tag size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Category</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {filteredCats.map(cat => (
                <button key={cat.id} type="button"
                  className={`category-chip ${category === cat.name ? 'active' : ''}`}
                  onClick={() => setCategory(cat.name)}
                  style={category === cat.name ? { borderColor: cat.color, background: `${cat.color}20`, color: cat.color } : {}}>
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="form-group">
            <label className="form-label"><Calendar size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Date</label>
            <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
          </div>

          {/* Payment Method */}
          <div className="form-group">
            <label className="form-label"><CreditCard size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Payment Method</label>
            <select className="form-input" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
              {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label"><FileText size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Notes</label>
            <textarea className="form-input" value={note} onChange={e => setNote(e.target.value)} placeholder="What was this for?" rows={2} />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', height: 48, fontSize: '1rem' }} disabled={loading || !amount || !category}>
            {loading ? 'Saving...' : <><Plus size={20} /> Add {type === 'income' ? 'Income' : 'Expense'}</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddTransactionPage;
