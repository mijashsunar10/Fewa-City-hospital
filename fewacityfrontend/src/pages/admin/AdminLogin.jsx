import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setErrorMsg(result.error);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-logo-circle">
            <Shield className="logo-shield-icon" />
          </div>
          <h2>Hospital Portal</h2>
          <p>Admin Authorization Access Only</p>
        </div>

        {errorMsg && (
          <div className="auth-error-alert">
            <AlertCircle className="error-alert-icon" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="auth-input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-field-icon" />
              <input
                type="email"
                id="email"
                required
                placeholder="admin@fewacity.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label htmlFor="password">Secret Password</label>
            <div className="input-with-icon">
              <Lock className="input-field-icon" />
              <input
                type="password"
                id="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="auth-submit-btn"
          >
            {isSubmitting ? 'Verifying...' : 'Access Portal'}
            <LogIn className="btn-arrow-icon" />
          </button>
        </form>

        <div className="admin-login-footer">
          <p>Need a new admin account? <Link to="/admin/register">Register Admin</Link></p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
