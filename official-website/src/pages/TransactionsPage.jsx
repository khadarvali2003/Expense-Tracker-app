import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Edit2, Trash2, ArrowUpRight, ArrowDownRight, X, Check, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const TransactionsPage = () => {
  const { transactions, categories, updateTransaction, deleteTransaction, currency } = useData();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      if (filterCat !== 'All' && t.category !== filterCat) return false;
      if (filterType !== 'All' && t.type !== filterType) return false;
      if (search && !(t.note?.toLowerCase().includes(search.toLowerCase()) || t.category?.toLowerCase().includes(search.toLowerCase()))) return false;
      if (dateFrom && t.createdAt?.seconds) {
        if (new Date(t.createdAt.seconds * 1000) < new Date(dateFrom)) return false;
      }
      if (dateTo && t.createdAt?.seconds) {
        if (new Date(t.createdAt.seconds * 1000) > new Date(dateTo + 'T23:59:59')) return false;
      }
      return true;
    });
  }, [transactions, filterCat, filterType, search, dateFrom, dateTo]);

  const handleEdit = (t) => { setEditId(t.id); setEditData({ amount: t.amount, note: t.note, category: t.category }); };
  const handleSave = async () => {
    await updateTransaction(editId, editData);
    setEditId(null);
  };
  const handleDelete = async (id) => {
    if (window.confirm('Delete this transaction?')) await deleteTransaction(id);
  };

  const uniqueCats = [...new Set(transactions.map(t => t.category))];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Transactions</h1>
        <p>{transactions.length} total records</p>
      </div>

      {/* Search and Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
          <Search size={16} className="search-icon" />
          <input placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className={`btn-secondary ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
          <Filter size={16} /> Filters
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div className="glass" style={{ padding: 20, marginBottom: 20 }} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, minWidth: 140 }}>
                <label className="form-label">Type</label>
                <select className="form-input" value={filterType} onChange={e => setFilterType(e.target.value)}>
                  <option value="All">All Types</option>
                  <option value="expense">Expenses</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <label className="form-label">Category</label>
                <select className="form-input" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                  <option value="All">All Categories</option>
                  {uniqueCats.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <label className="form-label"><Calendar size={10} /> From</label>
                <input type="date" className="form-input" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
              </div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <label className="form-label"><Calendar size={10} /> To</label>
                <input type="date" className="form-input" value={dateTo} onChange={e => setDateTo(e.target.value)} />
              </div>
              <button className="btn-secondary" onClick={() => { setFilterCat('All'); setFilterType('All'); setDateFrom(''); setDateTo(''); setSearch(''); }}>
                <X size={14} /> Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transactions List */}
      <div className="glass" style={{ overflow: 'hidden' }}>
        {filtered.length > 0 ? filtered.map(t => {
          const cat = categories.find(c => c.name === t.category);
          const isEditing = editId === t.id;

          return (
            <motion.div key={t.id} className="transaction-row" layout style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${cat?.color || '#64748b'}15`, fontSize: '1.2rem', flexShrink: 0 }}>
                  {cat?.icon || '📦'}
                </div>
                <div style={{ flex: 1 }}>
                  {isEditing ? (
                    <input className="form-input" value={editData.note} onChange={e => setEditData({ ...editData, note: e.target.value })} style={{ padding: '6px 10px', fontSize: '0.85rem' }} />
                  ) : (
                    <>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.note || t.category}</div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 2 }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.category}</span>
                        {t.paymentMethod && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', padding: '1px 6px', background: 'rgba(255,255,255,0.04)', borderRadius: 4 }}>{t.paymentMethod}</span>}
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {t.createdAt?.seconds ? format(new Date(t.createdAt.seconds * 1000), 'MMM dd, yyyy') : 'Just now'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {isEditing ? (
                  <input type="number" className="form-input" value={editData.amount} onChange={e => setEditData({ ...editData, amount: e.target.value })} style={{ width: 100, padding: '6px 10px', fontSize: '0.85rem' }} />
                ) : (
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: t.type === 'income' ? 'var(--success)' : 'var(--danger)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    {t.type === 'income' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {currency}{Number(t.amount).toLocaleString()}
                  </span>
                )}
                <div style={{ display: 'flex', gap: 4 }}>
                  {isEditing ? (
                    <>
                      <button className="btn-icon" onClick={handleSave} style={{ color: 'var(--success)' }}><Check size={16} /></button>
                      <button className="btn-icon" onClick={() => setEditId(null)}><X size={16} /></button>
                    </>
                  ) : (
                    <>
                      <button className="btn-icon" onClick={() => handleEdit(t)}><Edit2 size={14} /></button>
                      <button className="btn-icon" onClick={() => handleDelete(t.id)} style={{ color: 'var(--danger)' }}><Trash2 size={14} /></button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        }) : (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>📭</div>
            No transactions found
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
