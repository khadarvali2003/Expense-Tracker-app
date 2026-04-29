import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { NotificationProvider } from './context/NotificationContext';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import AddTransactionPage from './pages/AddTransactionPage';
import CategoriesPage from './pages/CategoriesPage';
import ReportsPage from './pages/ReportsPage';
import BudgetPage from './pages/BudgetPage';
import SettingsPage from './pages/SettingsPage';
import WalletsPage from './pages/WalletsPage';
import RecurringPage from './pages/RecurringPage';
import AIInsightsPage from './pages/AIInsightsPage';

// Layout
import AppLayout from './components/AppLayout';

const ThemeWrapper = ({ children }) => {
  const { theme } = useData();
  return (
    <div className={`app-root ${theme === 'classic' ? '' : `theme-${theme}`}`}>
      {children}
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--primary)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading...</span>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <NotificationProvider>
            <ThemeWrapper>
              <Routes>
                {/* Public Auth Routes */}
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
                <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

                {/* Protected App Routes */}
                <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/transactions" element={<TransactionsPage />} />
                  <Route path="/add" element={<AddTransactionPage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/budget" element={<BudgetPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/wallets" element={<WalletsPage />} />
                  <Route path="/recurring" element={<RecurringPage />} />
                  <Route path="/insights" element={<AIInsightsPage />} />
                </Route>

                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </ThemeWrapper>
          </NotificationProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
