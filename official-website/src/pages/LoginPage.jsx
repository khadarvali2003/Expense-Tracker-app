import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Wallet, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message?.includes('invalid') ? 'Invalid email or password' : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div className="auth-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: 14, borderRadius: 16, marginBottom: 20 }}>
            <Wallet size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 6 }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in to manage your finances</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label"><Mail size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Email</label>
            <input type="email" className="form-input" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label"><Lock size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Password</label>
            <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          <div style={{ textAlign: 'right', marginBottom: 20 }}>
            <Link to="/forgot-password" style={{ color: 'var(--primary)', fontSize: '0.85rem', textDecoration: 'none' }}>Forgot password?</Link>
          </div>

          {error && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', textAlign: 'center', marginBottom: 16, padding: '10px', background: 'var(--danger-glow)', borderRadius: 8 }}>{error}</div>}

          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Signing in...' : <><LogIn size={18} /> Sign In <ArrowRight size={16} /></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
