import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, KeyRound, ArrowLeft, Send } from 'lucide-react';

const ForgotPasswordPage = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError('No account found with this email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div className="auth-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', background: 'linear-gradient(135deg, var(--warning), #f97316)', padding: 14, borderRadius: 16, marginBottom: 20 }}>
            <KeyRound size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 6 }}>Reset Password</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {sent ? 'Check your email for reset link' : "Enter your email to receive a reset link"}
          </p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>📧</div>
            <p style={{ color: 'var(--success)', marginBottom: 24, fontWeight: 600 }}>Reset link sent to {email}</p>
            <Link to="/login" className="btn-primary" style={{ display: 'inline-flex', textDecoration: 'none' }}>
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label"><Mail size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Email Address</label>
              <input type="email" className="form-input" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            {error && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', textAlign: 'center', marginBottom: 16, padding: '10px', background: 'var(--danger-glow)', borderRadius: 8 }}>{error}</div>}
            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Sending...' : <><Send size={18} /> Send Reset Link</>}
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}><ArrowLeft size={14} style={{ verticalAlign: 'middle' }} /> Back to Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
