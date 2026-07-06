import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, User, Mail, Lock, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import './AdminRegister.css';

const AdminRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminSecretKey, setAdminSecretKey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);
    const result = await register(name, email, password, 'admin', adminSecretKey); // Register as 'admin' with key
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMsg('Admin account registered successfully!');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);
    } else {
      setErrorMsg(result.error);
    }
  };

  return (
    <div className="admin-register-wrapper">
      <div className="admin-register-card">
        <div className="admin-register-header">
          <div className="admin-logo-circle">
            <UserPlus className="logo-register-icon" />
          </div>
          <h2>Create Admin</h2>
          <p>Register a new hospital portal administrator</p>
        </div>

        {errorMsg && (
          <div className="auth-error-alert">
            <AlertCircle className="error-alert-icon" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="auth-success-alert">
            <CheckCircle className="success-alert-icon" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-register-form">
          <div className="auth-input-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-with-icon">
              <User className="input-field-icon" />
              <input
                type="text"
                id="name"
                required
                placeholder="Dr. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-field-icon" />
              <input
                type="email"
                id="email"
                required
                placeholder="john@fewacity.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock className="input-field-icon" />
              <input
                type="password"
                id="password"
                required
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-with-icon">
              <Lock className="input-field-icon" />
              <input
                type="password"
                id="confirmPassword"
                required
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label htmlFor="adminSecretKey">Admin Registration Secret Key</label>
            <div className="input-with-icon">
              <Shield className="input-field-icon" />
              <input
                type="password"
                id="adminSecretKey"
                required
                placeholder="Enter admin registration secret"
                value={adminSecretKey}
                onChange={(e) => setAdminSecretKey(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="auth-submit-btn"
          >
            {isSubmitting ? 'Registering...' : 'Register Account'}
            <UserPlus className="btn-arrow-icon" />
          </button>
        </form>

        <div className="admin-register-footer">
          <p>Already have an admin account? <Link to="/admin/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
