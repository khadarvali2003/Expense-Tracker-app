import React, { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import { BarChart3, PieChart as PieIcon, TrendingUp, Download } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const COLORS = ['#6366f1', '#a855f7', '#22d3ee', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#3b82f6', '#64748b'];

const ReportsPage = () => {
  const { transactions, categories, currency, totalIncome, totalExpenses } = useData();
  const [period, setPeriod] = useState('6');
  const [exporting, setExporting] = useState(false);

  const handleExportPDF = async () => {
    setExporting(true);
    const element = document.getElementById('report-content');
    const canvas = await html2canvas(element, { backgroundColor: '#0a0a0f', scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`ExpensyPro_Report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    setExporting(false);
  };

  // Monthly trend (last N months)
  const monthlyTrend = useMemo(() => {
    const months = [];
    for (let i = parseInt(period) - 1; i >= 0; i--) {
      const d = subMonths(new Date(), i);
      const start = startOfMonth(d);
      const end = endOfMonth(d);
      const income = transactions.filter(t => t.type === 'income' && t.createdAt?.seconds && new Date(t.createdAt.seconds * 1000) >= start && new Date(t.createdAt.seconds * 1000) <= end)
        .reduce((s, t) => s + Number(t.amount), 0);
      const expenses = transactions.filter(t => t.type === 'expense' && t.createdAt?.seconds && new Date(t.createdAt.seconds * 1000) >= start && new Date(t.createdAt.seconds * 1000) <= end)
        .reduce((s, t) => s + Number(t.amount), 0);
      months.push({ month: format(d, 'MMM'), income, expenses, savings: income - expenses });
    }
    return months;
  }, [transactions, period]);

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + Number(t.amount);
    });
    return Object.entries(map).map(([name, value]) => {
      const cat = categories.find(c => c.name === name);
      return { name, value, color: cat?.color || '#64748b', icon: cat?.icon || '📦' };
    }).sort((a, b) => b.value - a.value);
  }, [transactions, categories]);

  const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : 0;

  return (
    <div className="page-container" id="report-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div><h1>Reports & Analytics</h1><p>Detailed financial insights</p></div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-secondary" onClick={handleExportPDF} disabled={exporting}>
            <Download size={16} /> {exporting ? 'Exporting...' : 'Export PDF'}
          </button>
          <select className="form-input" style={{ width: 'auto' }} value={period} onChange={e => setPeriod(e.target.value)}>
            <option value="3">Last 3 months</option>
            <option value="6">Last 6 months</option>
            <option value="12">Last 12 months</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--success)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>Total Income</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success)' }}>{currency}{totalIncome.toLocaleString()}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--danger)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>Total Expenses</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--danger)' }}>{currency}{totalExpenses.toLocaleString()}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>Savings Rate</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>{savingsRate}%</div>
        </div>
      </div>

      {/* Monthly Trend */}
      <motion.div className="glass" style={{ padding: 24, marginBottom: 24 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 20 }}><TrendingUp size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />Monthly Trend</h3>
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrend} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#16161f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9' }} />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#10b981" radius={[4,4,0,0]} barSize={20} />
              <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4,4,0,0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Category Pie */}
        <motion.div className="glass" style={{ padding: 24 }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 20 }}><PieIcon size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />Category Breakdown</h3>
          {categoryBreakdown.length > 0 ? (
            <>
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryBreakdown} innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                      {categoryBreakdown.map((e, i) => <Cell key={i} fill={e.color || COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#16161f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                {categoryBreakdown.map((c, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.color }} />
                      <span>{c.icon} {c.name}</span>
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{currency}{c.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No data</div>
          )}
        </motion.div>

        {/* Savings Analysis */}
        <motion.div className="glass" style={{ padding: 24 }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 20 }}><BarChart3 size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />Savings Analysis</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#16161f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9' }} />
                <Line type="monotone" dataKey="savings" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 4 }} name="Savings" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: 16, padding: 14, background: 'rgba(255,255,255,0.03)', borderRadius: 12, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            💡 Your average monthly savings: <strong style={{ color: 'var(--primary)' }}>{currency}{monthlyTrend.length > 0 ? (monthlyTrend.reduce((s, m) => s + m.savings, 0) / monthlyTrend.length).toFixed(0) : 0}</strong>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportsPage;
