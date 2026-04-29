import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Plus, ChevronRight, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { format, subDays, startOfDay, isAfter } from 'date-fns';

const COLORS = ['#6366f1', '#a855f7', '#22d3ee', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#3b82f6', '#64748b'];

const DashboardPage = () => {
  const { user } = useAuth();
  const { transactions, categories, totalIncome, totalExpenses, balance, currency, budgets, loading } = useData();
  const navigate = useNavigate();

  const recentTransactions = transactions.slice(0, 5);

  const categoryData = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + Number(t.amount);
    });
    return Object.entries(map).map(([name, value]) => {
      const cat = categories.find(c => c.name === name);
      return { name, value, color: cat?.color || '#64748b' };
    }).sort((a, b) => b.value - a.value);
  }, [transactions, categories]);

  const weeklyData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const day = startOfDay(subDays(new Date(), i));
      const dayExpenses = transactions
        .filter(t => t.type === 'expense' && t.createdAt?.seconds)
        .filter(t => {
          const d = new Date(t.createdAt.seconds * 1000);
          return format(d, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
        })
        .reduce((s, t) => s + Number(t.amount), 0);
      days.push({ day: format(day, 'EEE'), amount: dayExpenses });
    }
    return days;
  }, [transactions]);

  const budgetUsed = budgets.monthly > 0 ? Math.min((totalExpenses / budgets.monthly) * 100, 100) : 0;

  if (loading) {
    return (
      <div className="page-container">
        <div className="grid-3" style={{ marginBottom: 20 }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 16 }} />)}
        </div>
        <div className="grid-2">
          {[1,2].map(i => <div key={i} className="skeleton" style={{ height: 300, borderRadius: 16 }} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Hello, {user?.displayName?.split(' ')[0] || 'there'} 👋</h1>
          <p>Here's your financial overview</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/add')}>
          <Plus size={18} /> Quick Add
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ padding: 10, borderRadius: 12, background: 'var(--success-glow)' }}><TrendingUp size={20} color="var(--success)" /></div>
            <span className="badge badge-success"><ArrowUpRight size={12} /> Income</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{currency}{totalIncome.toLocaleString()}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>Total earnings</div>
        </motion.div>

        <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ padding: 10, borderRadius: 12, background: 'var(--danger-glow)' }}><TrendingDown size={20} color="var(--danger)" /></div>
            <span className="badge badge-danger"><ArrowDownRight size={12} /> Expenses</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{currency}{totalExpenses.toLocaleString()}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>Total spending</div>
        </motion.div>

        <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ padding: 10, borderRadius: 12, background: 'var(--primary-glow)' }}><Wallet size={20} color="var(--primary)" /></div>
            <span className={`badge ${balance >= 0 ? 'badge-success' : 'badge-danger'}`}>{balance >= 0 ? 'Surplus' : 'Deficit'}</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: balance >= 0 ? 'var(--success)' : 'var(--danger)' }}>{currency}{Math.abs(balance).toLocaleString()}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>Remaining balance</div>
        </motion.div>
      </div>

      {/* Budget Progress */}
      {budgets.monthly > 0 && (
        <motion.div className="glass" style={{ padding: 20, marginBottom: 24 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Monthly Budget</span>
            <span style={{ fontSize: '0.85rem', color: budgetUsed >= 100 ? 'var(--danger)' : 'var(--text-muted)' }}>
              {currency}{totalExpenses.toLocaleString()} / {currency}{budgets.monthly.toLocaleString()}
            </span>
          </div>
          <div className="progress-bar">
            <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${budgetUsed}%` }}
              style={{ background: budgetUsed >= 90 ? 'var(--danger)' : budgetUsed >= 70 ? 'var(--warning)' : 'var(--success)' }} />
          </div>
          {budgetUsed >= 90 && <div style={{ fontSize: '0.8rem', color: 'var(--danger)', marginTop: 8 }}>⚠️ You're close to exceeding your budget!</div>}
        </motion.div>
      )}

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Weekly Spending Bar Chart */}
        <motion.div className="glass" style={{ padding: 24 }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <h3 style={{ marginBottom: 20, fontSize: '1rem', fontWeight: 600 }}>Expenses Graph <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.85rem' }}>7 days</span></h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#16161f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9' }} />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {weeklyData.map((entry, i) => (
                    <Cell key={i} fill={i === weeklyData.length - 1 ? '#10b981' : '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Pie Chart */}
        <motion.div className="glass" style={{ padding: 24 }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <h3 style={{ marginBottom: 20, fontSize: '1rem', fontWeight: 600 }}>Expense Categories</h3>
          {categoryData.length > 0 ? (
            <>
              <div style={{ height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value">
                      {categoryData.map((entry, i) => <Cell key={i} fill={entry.color || COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#16161f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                {categoryData.slice(0, 5).map((c, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.color || COLORS[i] }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{c.name}</span>
                    </div>
                    <span style={{ fontWeight: 600 }}>{currency}{c.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No expenses yet</div>
          )}
        </motion.div>
      </div>

      {/* AI Insights + Recent Transactions */}
      <div className="grid-2">
        {/* AI Insights */}
        <motion.div className="glass" style={{ padding: 24 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={18} color="var(--warning)" /> AI Insights
            </h3>
            <button className="btn-secondary" style={{ fontSize: '0.75rem', padding: '6px 12px' }} onClick={() => navigate('/insights')}>
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {totalExpenses > 0 ? (
              <>
                {categoryData[0] && (
                  <div style={{ padding: 14, background: 'rgba(255,255,255,0.03)', borderRadius: 12, fontSize: '0.85rem', color: 'var(--text-secondary)', borderLeft: '3px solid var(--warning)' }}>
                    💡 Your highest spending is <strong style={{ color: 'var(--text-main)' }}>{categoryData[0].name}</strong> at {currency}{categoryData[0].value.toLocaleString()}
                  </div>
                )}
                {budgetUsed > 50 && (
                  <div style={{ padding: 14, background: 'rgba(255,255,255,0.03)', borderRadius: 12, fontSize: '0.85rem', color: 'var(--text-secondary)', borderLeft: '3px solid var(--primary)' }}>
                    📊 You've used <strong style={{ color: 'var(--text-main)' }}>{budgetUsed.toFixed(0)}%</strong> of your monthly budget
                  </div>
                )}
                <div style={{ padding: 14, background: 'rgba(255,255,255,0.03)', borderRadius: 12, fontSize: '0.85rem', color: 'var(--text-secondary)', borderLeft: '3px solid var(--success)' }}>
                  🎯 Tip: Allocate 20% of income to savings for financial health
                </div>
              </>
            ) : (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>Add transactions to get AI-powered insights</div>
            )}
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div className="glass" style={{ padding: 24 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Recent Transactions</h3>
            <button className="btn-secondary" style={{ fontSize: '0.75rem', padding: '6px 12px' }} onClick={() => navigate('/transactions')}>
              View All <ChevronRight size={14} />
            </button>
          </div>
          {recentTransactions.length > 0 ? (
            <div>
              {recentTransactions.map(t => {
                const cat = categories.find(c => c.name === t.category);
                return (
                  <div key={t.id} className="transaction-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${cat?.color || '#64748b'}20`, fontSize: '1.1rem' }}>
                        {cat?.icon || '📦'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.note || t.category}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {t.createdAt?.seconds ? format(new Date(t.createdAt.seconds * 1000), 'MMM dd') : 'Just now'}
                        </div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 700, color: t.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                      {t.type === 'income' ? '+' : '-'}{currency}{Number(t.amount).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No transactions yet. Add your first one!</div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
