import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Mail, Lock } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p style={{ color: 'var(--text-muted)' }}>Enter your credentials to access the portal</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label><Mail size={14} style={{ marginRight: 5, verticalAlign: 'middle' }} /> Email Address</label>
          <input 
            type="email" 
            className="premium-input" 
            placeholder="name@company.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <div className="input-group">
          <label><Lock size={14} style={{ marginRight: 5, verticalAlign: 'middle' }} /> Password</label>
          <input 
            type="password" 
            className="premium-input" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>

        {error && <div style={{ color: '#ff4444', marginBottom: '20px', fontSize: '0.85rem', textAlign: 'center' }}>{error}</div>}

        <button type="submit" className="premium-button" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Processing...' : isLogin ? <><LogIn size={18} /> Sign In</> : <><UserPlus size={18} /> Join Now</>}
        </button>
      </form>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.9rem' }}
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
