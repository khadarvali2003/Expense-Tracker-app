import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, PiggyBank, Target } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';

const AIInsightsPage = () => {
  const { transactions, categories, totalIncome, totalExpenses, budgets, currency } = useData();

  const insights = useMemo(() => {
    const tips = [];

    // Top spending category
    const catMap = {};
    transactions.filter(t => t.type === 'expense').forEach(t => { catMap[t.category] = (catMap[t.category] || 0) + Number(t.amount); });
    const sorted = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
    if (sorted[0]) {
      tips.push({ icon: '🔥', title: 'Top Spending Category', text: `You spent ${currency}${sorted[0][1].toLocaleString()} on ${sorted[0][0]}. Consider setting a budget limit for this category.`, type: 'warning' });
    }

    // Savings rate
    if (totalIncome > 0) {
      const rate = ((totalIncome - totalExpenses) / totalIncome * 100);
      if (rate < 20) {
        tips.push({ icon: '💡', title: 'Low Savings Rate', text: `Your savings rate is ${rate.toFixed(1)}%. Financial experts recommend saving at least 20% of income.`, type: 'danger' });
      } else {
        tips.push({ icon: '🎉', title: 'Great Savings Rate!', text: `You're saving ${rate.toFixed(1)}% of your income. Keep it up!`, type: 'success' });
      }
    }

    // Budget overspend
    if (budgets.monthly > 0 && totalExpenses > budgets.monthly) {
      tips.push({ icon: '⚠️', title: 'Budget Exceeded', text: `You've exceeded your monthly budget by ${currency}${(totalExpenses - budgets.monthly).toLocaleString()}. Review your spending.`, type: 'danger' });
    } else if (budgets.monthly > 0) {
      const remaining = budgets.monthly - totalExpenses;
      tips.push({ icon: '✅', title: 'Within Budget', text: `You have ${currency}${remaining.toLocaleString()} remaining in your monthly budget.`, type: 'success' });
    }

    // Weekend spending
    const weekendSpend = transactions.filter(t => {
      if (t.type !== 'expense' || !t.createdAt?.seconds) return false;
      const day = new Date(t.createdAt.seconds * 1000).getDay();
      return day === 0 || day === 6;
    }).reduce((s, t) => s + Number(t.amount), 0);
    if (weekendSpend > totalExpenses * 0.4 && totalExpenses > 0) {
      tips.push({ icon: '📅', title: 'Weekend Spending High', text: `${((weekendSpend/totalExpenses)*100).toFixed(0)}% of your spending happens on weekends. Plan your weekend activities to save more.`, type: 'warning' });
    }

    // Recommendation
    tips.push({ icon: '🎯', title: 'Budget Recommendation', text: 'Allocate 50% to needs, 30% to wants, and 20% to savings for optimal financial health (50/30/20 rule).', type: 'info' });
    
    // Diversification
    if (sorted.length > 0 && sorted[0][1] > totalExpenses * 0.5) {
      tips.push({ icon: '⚖️', title: 'Spending Concentrated', text: `Over 50% of your expenses are in "${sorted[0][0]}". Try to diversify your spending across categories.`, type: 'warning' });
    }

    // Small expenses
    const smallExpenses = transactions.filter(t => t.type === 'expense' && Number(t.amount) < 100);
    if (smallExpenses.length > 10) {
      const smallTotal = smallExpenses.reduce((s, t) => s + Number(t.amount), 0);
      tips.push({ icon: '🔍', title: 'Small Expenses Add Up', text: `You have ${smallExpenses.length} transactions under ${currency}100 totaling ${currency}${smallTotal.toLocaleString()}. Track these closely!`, type: 'info' });
    }

    return tips;
  }, [transactions, totalIncome, totalExpenses, budgets, currency, categories]);

  const typeColors = { success: 'var(--success)', danger: 'var(--danger)', warning: 'var(--warning)', info: 'var(--primary)' };
  const typeBg = { success: 'var(--success-glow)', danger: 'var(--danger-glow)', warning: 'var(--warning-glow)', info: 'var(--primary-glow)' };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Sparkles size={28} color="var(--warning)" /> AI Insights
        </h1>
        <p>Smart recommendations based on your spending patterns</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {insights.map((tip, i) => (
          <motion.div key={i} className="glass" style={{ padding: 24, borderLeft: `4px solid ${typeColors[tip.type]}` }}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ fontSize: '1.5rem', flexShrink: 0, marginTop: 2 }}>{tip.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6, color: typeColors[tip.type] }}>{tip.title}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{tip.text}</div>
              </div>
            </div>
          </motion.div>
        ))}

        {insights.length === 0 && (
          <div className="glass" style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
            <Sparkles size={40} style={{ marginBottom: 16, opacity: 0.3 }} />
            <div>Add more transactions to get personalized AI insights</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsightsPage;
