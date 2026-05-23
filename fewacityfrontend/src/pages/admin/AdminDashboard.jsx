import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Shield, Users, Briefcase, LayoutGrid, Settings, Activity, Calendar } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/admin/login');
    }
  }, [user, loading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (loading || !user) {
    return (
      <div className="admin-loading-screen">
        <div className="spinner"></div>
        <p>Loading Portal Access...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <Shield className="brand-shield-icon" />
          <span>Fewa City Admin</span>
        </div>
        <div className="sidebar-user-info">
          <div className="user-avatar-placeholder">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <h4 className="user-name">{user.name}</h4>
            <span className="user-role">{user.role}</span>
          </div>
        </div>
        <nav className="sidebar-menu">
          <a href="#dashboard" className="menu-item active">
            <Activity className="menu-icon" />
            Dashboard
          </a>
          <a href="/admin/doctors" className="menu-item">
            <Users className="menu-icon" />
            Doctors List
          </a>
          <a href="/services" className="menu-item">
            <Briefcase className="menu-icon" />
            Clinical Services
          </a>
          <a href="/departments" className="menu-item">
            <LayoutGrid className="menu-icon" />
            Departments
          </a>
        </nav>
        <button onClick={handleLogout} className="sidebar-logout-btn">
          <LogOut className="menu-icon" />
          Logout Portal
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="admin-main-content">
        <header className="admin-content-header">
          <h1>System Overview</h1>
          <div className="current-date-badge">
            <Calendar className="calendar-icon" />
            <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </header>

        {/* STATISTICS CARDS */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper doctors-color">
              <Users className="stat-icon" />
            </div>
            <div className="stat-info">
              <span className="stat-title">Registered Doctors</span>
              <h3 className="stat-value">38</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper services-color">
              <Briefcase className="stat-icon" />
            </div>
            <div className="stat-info">
              <span className="stat-title">Active Services</span>
              <h3 className="stat-value">18</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper departments-color">
              <LayoutGrid className="stat-icon" />
            </div>
            <div className="stat-info">
              <span className="stat-title">Specialist Departments</span>
              <h3 className="stat-value">16</h3>
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS PANEL */}
        <section className="dashboard-content-grid">
          <div className="content-card quick-actions-card">
            <h2>Administrative Quick Actions</h2>
            <p className="actions-subtitle">Easily manage clinical records and listings on the main website.</p>
            <div className="actions-buttons-grid">
              <button onClick={() => navigate('/admin/doctors')} className="action-btn">
                <Users className="btn-icon" />
                <span>Manage Doctors</span>
              </button>
              <button onClick={() => navigate('/services')} className="action-btn">
                <Briefcase className="btn-icon" />
                <span>Manage Services</span>
              </button>
              <button onClick={() => navigate('/departments')} className="action-btn">
                <LayoutGrid className="btn-icon" />
                <span>Manage Departments</span>
              </button>
              <button onClick={() => navigate('/admin/register')} className="action-btn outline-btn">
                <UserPlusIcon className="btn-icon" />
                <span>Add Admin Account</span>
              </button>
            </div>
          </div>

          <div className="content-card welcome-banner-card">
            <div className="welcome-banner-inner">
              <h2>Welcome back, {user.name}!</h2>
              <p>You have full read/write permission to modify doctors, services, and academic courses. Ensure all data is accurate before publishing changes.</p>
              <div className="security-notice">
                <Shield className="security-shield" />
                <span>Secure HTTPS Session Active</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// Helper for local icon usage
const UserPlusIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" x2="19" y1="8" y2="14" />
    <line x1="22" x2="16" y1="11" y2="11" />
  </svg>
);

export default AdminDashboard;
