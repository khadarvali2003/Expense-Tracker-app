import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Wallet, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
  const { register, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setError('Passwords do not match');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    setError('');
    setLoading(true);
    try {
      await register(email, password);
      await updateUserProfile({ displayName: name });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message?.includes('already') ? 'Email already in use' : err.message);
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
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 6 }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Start tracking your expenses today</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label"><User size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Full Name</label>
            <input type="text" className="form-input" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label"><Mail size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Email</label>
            <input type="email" className="form-input" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label"><Lock size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Password</label>
            <input type="password" className="form-input" placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label"><Lock size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Confirm Password</label>
            <input type="password" className="form-input" placeholder="Repeat password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
          </div>

          {error && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', textAlign: 'center', marginBottom: 16, padding: '10px', background: 'var(--danger-glow)', borderRadius: 8 }}>{error}</div>}

          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating account...' : <><UserPlus size={18} /> Create Account <ArrowRight size={16} /></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
