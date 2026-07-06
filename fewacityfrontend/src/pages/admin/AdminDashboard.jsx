import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Shield, Users, Briefcase, LayoutGrid, Activity, Calendar, Mail } from 'lucide-react';
import axios from 'axios';
import './AdminDashboard.css';
import API_BASE_URL from '../../config/api';

const AdminDashboard = () => {
  const { user, token, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    doctors: 0,
    services: 0,
    departments: 0,
    messages: 0,
    unreadMessages: 0
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/admin/login');
    }
  }, [user, loading, navigate]);

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const [docsRes, srvsRes, deptsRes, msgsRes, apptsRes] = await Promise.all([
          axios.get(API_BASE_URL + '/api/doctors'),
          axios.get(API_BASE_URL + '/api/services'),
          axios.get(API_BASE_URL + '/api/departments'),
          axios.get(API_BASE_URL + '/api/messages', config),
          axios.get(API_BASE_URL + '/api/appointments', config)
        ]);
        
        const unread = msgsRes.data.filter(m => !m.isRead).length;
        const pendingAppts = apptsRes.data.filter(a => a.status === 'Pending').length;

        setStats({
          doctors: docsRes.data.length,
          services: srvsRes.data.length,
          departments: deptsRes.data.length,
          messages: msgsRes.data.length,
          unreadMessages: unread,
          appointments: apptsRes.data.length,
          pendingAppointments: pendingAppts
        });
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      }
    };

    if (user && user.role === 'admin') {
      fetchStats();
    }
  }, [user, token]);

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
          <a href="/admin/dashboard" className="menu-item active">
            <Activity className="menu-icon" />
            Dashboard
          </a>
          <a href="/admin/doctors" className="menu-item">
            <Users className="menu-icon" />
            Doctors List
          </a>
          <a href="/admin/services" className="menu-item">
            <Briefcase className="menu-icon" />
            Clinical Services
          </a>
          <a href="/admin/departments" className="menu-item">
            <LayoutGrid className="menu-icon" />
            Departments
          </a>
          <a href="/admin/appointments" className="menu-item">
            <Calendar className="menu-icon" />
            Appointments
            {stats.pendingAppointments > 0 && (
              <span style={{
                marginLeft: 'auto',
                backgroundColor: '#eab308',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 'bold',
                padding: '2px 6px',
                borderRadius: '8px'
              }}>
                {stats.pendingAppointments}
              </span>
            )}
          </a>
          <a href="/admin/messages" className="menu-item">
            <Mail className="menu-icon" />
            Patient Messages
            {stats.unreadMessages > 0 && (
              <span style={{
                marginLeft: 'auto',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 'bold',
                padding: '2px 6px',
                borderRadius: '8px'
              }}>
                {stats.unreadMessages}
              </span>
            )}
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
              <h3 className="stat-value">{stats.doctors}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper services-color">
              <Briefcase className="stat-icon" />
            </div>
            <div className="stat-info">
              <span className="stat-title">Active Services</span>
              <h3 className="stat-value">{stats.services}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper departments-color">
              <LayoutGrid className="stat-icon" />
            </div>
            <div className="stat-info">
              <span className="stat-title">Specialist Departments</span>
              <h3 className="stat-value">{stats.departments}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#fff7ed', color: '#f97316' }}>
              <Mail className="stat-icon" />
            </div>
            <div className="stat-info">
              <span className="stat-title">Patient Inquiry Messages</span>
              <h3 className="stat-value">{stats.messages} {stats.unreadMessages > 0 && (
                <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: 'bold' }}>
                  ({stats.unreadMessages} new)
                </span>
              )}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
              <Calendar className="stat-icon" />
            </div>
            <div className="stat-info">
              <span className="stat-title">Appointments Scheduled</span>
              <h3 className="stat-value">{stats.appointments} {stats.pendingAppointments > 0 && (
                <span style={{ fontSize: '12px', color: '#ca8a04', fontWeight: 'bold' }}>
                  ({stats.pendingAppointments} pending)
                </span>
              )}</h3>
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
              <button onClick={() => navigate('/admin/services')} className="action-btn">
                <Briefcase className="btn-icon" />
                <span>Manage Services</span>
              </button>
              <button onClick={() => navigate('/admin/departments')} className="action-btn">
                <LayoutGrid className="btn-icon" />
                <span>Manage Departments</span>
              </button>
              <button onClick={() => navigate('/admin/appointments')} className="action-btn">
                <Calendar className="btn-icon" />
                <span>Manage Appointments</span>
              </button>
              <button onClick={() => navigate('/admin/messages')} className="action-btn">
                <Mail className="btn-icon" />
                <span>Manage Messages</span>
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

export default AdminDashboard;
