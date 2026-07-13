import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Shield, Users, Briefcase, LayoutGrid, Activity, Calendar, Mail, TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import axios from 'axios';
import './AdminDashboard.css';
import API_BASE_URL from '../../config/api';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const AdminDashboard = () => {
  const { user, token, logout, loading } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    doctors: 0,
    services: 0,
    departments: 0,
    messages: 0,
    unreadMessages: 0,
    appointments: 0,
    pendingAppointments: 0
  });

  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [timeframe, setTimeframe] = useState('all');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/admin/login');
    }
  }, [user, loading, navigate]);

  // Fetch stats and analytical lists from API
  const fetchStats = useCallback(async () => {
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

      setAppointments(apptsRes.data);
      setMessages(msgsRes.data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    }
  }, [token]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      const timer = setTimeout(() => {
        fetchStats();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [user, fetchStats]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Appointment status updates handler
  const handleUpdateStatus = async (id, status) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const res = await axios.put(`${API_BASE_URL}/api/appointments/${id}`, { status }, config);
      
      // Update local appointments state
      setAppointments(prev => prev.map(appt => appt._id === id ? res.data : appt));
    } catch (err) {
      console.error('Failed to update appointment status:', err);
      alert('Error updating status: ' + (err.response?.data?.message || err.message));
    }
  };

  // Mark message as read handler
  const handleMarkMessageRead = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await axios.put(`${API_BASE_URL}/api/messages/${id}/read`, {}, config);
      
      // Update local messages state
      setMessages(prev => prev.map(msg => msg._id === id ? { ...msg, isRead: true } : msg));
      
      // Update unread count in stats immediately
      setStats(prev => ({
        ...prev,
        unreadMessages: Math.max(0, prev.unreadMessages - 1)
      }));
    } catch (err) {
      console.error('Failed to mark message as read:', err);
      alert('Error updating message status: ' + (err.response?.data?.message || err.message));
    }
  };

  // Filter appointments by selected timeframe
  const filteredAppointments = useMemo(() => {
    if (timeframe === 'all') return appointments;
    
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return appointments.filter(appt => {
      if (!appt.date) return false;
      const apptDate = new Date(appt.date);
      const apptDateStr = appt.date.split('T')[0];
      
      if (timeframe === 'today') {
        return apptDateStr === todayStr;
      }
      if (timeframe === 'week') {
        return apptDate >= sevenDaysAgo;
      }
      return true;
    });
  }, [appointments, timeframe]);

  // Filter messages by selected timeframe
  const filteredMessages = useMemo(() => {
    if (timeframe === 'all') return messages;
    
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return messages.filter(msg => {
      if (!msg.createdAt) return false;
      const msgDateStr = msg.createdAt.split('T')[0];
      const msgDate = new Date(msg.createdAt);
      
      if (timeframe === 'today') {
        return msgDateStr === todayStr;
      }
      if (timeframe === 'week') {
        return msgDate >= sevenDaysAgo;
      }
      return true;
    });
  }, [messages, timeframe]);

  // Derive dynamic stats counts based on selected timeframe
  const activeStats = useMemo(() => {
    const unread = filteredMessages.filter(m => !m.isRead).length;
    const pendingAppts = filteredAppointments.filter(a => a.status === 'Pending').length;
    return {
      doctors: stats.doctors,
      services: stats.services,
      departments: stats.departments,
      messages: filteredMessages.length,
      unreadMessages: unread,
      appointments: filteredAppointments.length,
      pendingAppointments: pendingAppts
    };
  }, [stats.doctors, stats.services, stats.departments, filteredAppointments, filteredMessages]);

  // 1. Department Share calculations
  const deptChartData = useMemo(() => {
    if (!filteredAppointments.length) return [];
    const counts = {};
    filteredAppointments.forEach(appt => {
      const deptTitle = appt.department?.title || 'General / Unassigned';
      counts[deptTitle] = (counts[deptTitle] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / filteredAppointments.length) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredAppointments]);

  // 2. Weekly Booking Trend calculations (Last 7 days of actual calendar)
  const weeklyTrendData = useMemo(() => {
    const data = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const label = `${daysOfWeek[d.getDay()]} ${d.getDate()}`;
      
      const count = filteredAppointments.filter(appt => {
        if (!appt.date) return false;
        const apptDateStr = appt.date.split('T')[0];
        return apptDateStr === dateStr;
      }).length;

      data.push({ dateStr, label, count });
    }
    return data;
  }, [filteredAppointments]);

  // 3. Appointment status breakdown calculations
  const statusData = useMemo(() => {
    const statusCounts = {
      Pending: 0,
      Approved: 0,
      Completed: 0,
      Cancelled: 0
    };
    
    filteredAppointments.forEach(appt => {
      if (statusCounts[appt.status] !== undefined) {
        statusCounts[appt.status]++;
      }
    });

    const total = filteredAppointments.length || 1;
    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: Math.round((count / total) * 100),
      color: status === 'Pending' ? '#ca8a04' : // Amber
             status === 'Approved' ? '#3b82f6' : // Blue
             status === 'Completed' ? '#10b981' : // Emerald
             '#ef4444' // Red
    }));
  }, [filteredAppointments]);

  // 4. Busiest specialists (Top 4 doctors with most appointments in filtered set)
  const topDoctors = useMemo(() => {
    if (!filteredAppointments.length) return [];
    const counts = {};
    filteredAppointments.forEach(appt => {
      if (appt.doctor) {
        const docId = appt.doctor._id;
        const name = appt.doctor.name || 'Unknown Doctor';
        const qualification = appt.doctor.qualification || '';
        
        if (!counts[docId]) {
          counts[docId] = {
            id: docId,
            name,
            qualification,
            count: 0
          };
        }
        counts[docId].count++;
      }
    });

    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [filteredAppointments]);

  // 5. Monthly Earnings / Patient Growth calculations (Simulated based on appointments)
  const monthlyFinanceData = useMemo(() => {
    const monthlyData = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Pre-populate last 6 months to make it look full and dynamic
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[key] = {
        monthKey: key,
        label: `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`,
        patients: 0,
        earnings: 0
      };
    }

    appointments.forEach(appt => {
      if (!appt.date) return;
      const d = new Date(appt.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      
      // Standard simulated consulting fee per department
      const deptName = appt.department?.title || 'General';
      let fee = 50; // default base fee
      if (deptName.includes('Cardi')) fee = 120;
      else if (deptName.includes('Radi')) fee = 90;
      else if (deptName.includes('Dental')) fee = 70;
      else if (deptName.includes('Surge')) fee = 150;
      else if (deptName.includes('Pediat')) fee = 80;

      if (monthlyData[key]) {
        monthlyData[key].patients += 1;
        if (appt.status === 'Completed' || appt.status === 'Approved') {
          monthlyData[key].earnings += fee;
        }
      } else {
        const label = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
        monthlyData[key] = {
          monthKey: key,
          label,
          patients: 1,
          earnings: (appt.status === 'Completed' || appt.status === 'Approved') ? fee : 0
        };
      }
    });

    return Object.values(monthlyData)
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
      .slice(-6); // Only show the last 6 months
  }, [appointments]);

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
            {activeStats.pendingAppointments > 0 && (
              <span style={{
                marginLeft: 'auto',
                backgroundColor: '#eab308',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 'bold',
                padding: '2px 6px',
                borderRadius: '8px'
              }}>
                {activeStats.pendingAppointments}
              </span>
            )}
          </a>
          <a href="/admin/messages" className="menu-item">
            <Mail className="menu-icon" />
            Patient Messages
            {activeStats.unreadMessages > 0 && (
              <span style={{
                marginLeft: 'auto',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 'bold',
                padding: '2px 6px',
                borderRadius: '8px'
              }}>
                {activeStats.unreadMessages}
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
        <header className="admin-content-header" style={{ flexWrap: 'wrap', gap: '15px' }}>
          <h1>System Overview</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div className="timeframe-filter-container">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="timeframe-select-dropdown"
                style={{
                  padding: '10px 16px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  outline: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                <option value="all">📅 All Time Records</option>
                <option value="today">☀️ Today's Activity</option>
                <option value="week">📅 Last 7 Days Activity</option>
              </select>
            </div>
            <div className="current-date-badge">
              <Calendar className="calendar-icon" />
              <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
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
              <h3 className="stat-value">{activeStats.doctors}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper services-color">
              <Briefcase className="stat-icon" />
            </div>
            <div className="stat-info">
              <span className="stat-title">Active Services</span>
              <h3 className="stat-value">{activeStats.services}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper departments-color">
              <LayoutGrid className="stat-icon" />
            </div>
            <div className="stat-info">
              <span className="stat-title">Specialist Departments</span>
              <h3 className="stat-value">{activeStats.departments}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#fff7ed', color: '#f97316' }}>
              <Mail className="stat-icon" />
            </div>
            <div className="stat-info">
              <span className="stat-title">Patient Inquiry Messages</span>
              <h3 className="stat-value">{activeStats.messages} {activeStats.unreadMessages > 0 && (
                <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: 'bold' }}>
                  ({activeStats.unreadMessages} new)
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
              <h3 className="stat-value">{activeStats.appointments} {activeStats.pendingAppointments > 0 && (
                <span style={{ fontSize: '12px', color: '#ca8a04', fontWeight: 'bold' }}>
                  ({activeStats.pendingAppointments} pending)
                </span>
              )}</h3>
            </div>
          </div>
        </section>

        {/* VISUAL ANALYTICS PANEL */}
        <section className="analytics-grid">
          {/* Chart 1: Appointments Over Time */}
          <div className="content-card analytics-card">
            <div className="card-header-with-icon" style={{ marginBottom: '20px' }}>
              <div className="header-title-area">
                <TrendingUp className="header-icon trend-color" />
                <div>
                  <h2>Appointments Over Time</h2>
                  <p className="card-subtitle">Appointment traffic spline trend line (7 days)</p>
                </div>
              </div>
            </div>
            <div className="chart-container" style={{ minHeight: '260px' }}>
              {filteredAppointments.length === 0 ? (
                <div className="no-chart-data">
                  <p>No appointment data available.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={weeklyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                      labelStyle={{ fontWeight: 'bold', color: '#34d399' }}
                    />
                    <Line type="monotone" dataKey="count" name="Appointments" stroke="#10b981" strokeWidth={3} activeDot={{ r: 6 }} dot={{ stroke: '#10b981', strokeWidth: 2, r: 4, fill: '#fff' }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Chart 2: Most Visited Departments */}
          <div className="content-card analytics-card">
            <div className="card-header-with-icon" style={{ marginBottom: '20px' }}>
              <div className="header-title-area">
                <PieChartIcon className="header-icon dept-color" />
                <div>
                  <h2>Department Visit Share</h2>
                  <p className="card-subtitle">Appointment distribution across clinics</p>
                </div>
              </div>
            </div>
            <div className="chart-container" style={{ minHeight: '260px' }}>
              {deptChartData.length === 0 ? (
                <div className="no-chart-data">
                  <p>No department data available.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={deptChartData.slice(0, 5)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="count"
                    >
                      {deptChartData.slice(0, 5).map((entry, index) => {
                        const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];
                        return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                      })}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={40} 
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => {
                        const dept = deptChartData.find(d => d.name === value);
                        return <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748b' }}>{value} ({dept?.count || 0})</span>;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Chart 3: Monthly Earnings & Patient Growth */}
          <div className="content-card analytics-card">
            <div className="card-header-with-icon" style={{ marginBottom: '20px' }}>
              <div className="header-title-area">
                <BarChart3 className="header-icon status-color" />
                <div>
                  <h2>Earnings & Patient Growth</h2>
                  <p className="card-subtitle">Monthly revenue and registrations comparison (6 months)</p>
                </div>
              </div>
            </div>
            <div className="chart-container" style={{ minHeight: '260px' }}>
              {monthlyFinanceData.length === 0 ? (
                <div className="no-chart-data">
                  <p>No financial data available.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={monthlyFinanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" stroke="#3b82f6" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                    />
                    <Legend verticalAlign="bottom" height={40} iconType="rect" iconSize={10} />
                    <Bar yAxisId="left" dataKey="earnings" name="Earnings ($)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="patients" name="Patients" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </section>

        {/* Chart 4: Status Breakdown Section */}
        <section className="status-analytics-section content-card" style={{ marginBottom: '40px' }}>
          <div className="card-header-with-icon" style={{ marginBottom: '24px' }}>
            <div className="header-title-area">
              <PieChartIcon className="header-icon status-color" />
              <div>
                <h2>Appointment Processing Status</h2>
                <p className="card-subtitle">Performance breakdown of scheduling workflow statuses</p>
              </div>
            </div>
          </div>

          <div className="status-progress-grid">
            {statusData.map(status => {
              const radius = 30;
              const circumference = 2 * Math.PI * radius;
              const strokeDashoffset = circumference - (status.percentage / 100) * circumference;
              
              return (
                <div key={status.status} className="status-metric-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                  <div className="status-progress-ring-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="76" height="76" className="progress-ring-svg">
                      <circle
                        cx="38"
                        cy="38"
                        r={radius}
                        stroke="#e2e8f0"
                        strokeWidth="6"
                        fill="transparent"
                      />
                      <circle
                        cx="38"
                        cy="38"
                        r={radius}
                        stroke={status.color}
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        style={{
                          transform: 'rotate(-90deg)',
                          transformOrigin: '38px 38px',
                          transition: 'stroke-dashoffset 0.8s ease-in-out'
                        }}
                      />
                      <text
                        x="38"
                        y="42"
                        textAnchor="middle"
                        fill="#0f172a"
                        fontSize="11.5px"
                        fontWeight="800"
                      >
                        {status.percentage}%
                      </text>
                    </svg>
                  </div>
                  <div className="status-metric-info">
                    <span className="status-metric-label" style={{ color: status.color, fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {status.status}
                    </span>
                    <h3 className="status-metric-value" style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '4px 0 0 0' }}>{status.count}</h3>
                    <span className="status-metric-subtext" style={{ fontSize: '12px', color: '#64748b' }}>Appointments total</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* RECENT ACTIVITY & MESSAGES SECTION */}
        <section className="dashboard-activity-grid">
          {/* Recent Appointments Quick Actions */}
          <div className="content-card recent-appointments-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-header-with-icon" style={{ marginBottom: '18px' }}>
              <div>
                <h2>Recent Appointment Requests</h2>
                <p className="card-subtitle">Latest registration submissions and processing actions</p>
              </div>
              <span style={{ backgroundColor: activeStats.pendingAppointments > 0 ? '#fef08a' : '#f1f5f9', color: activeStats.pendingAppointments > 0 ? '#854d0e' : '#64748b', fontSize: '12px', fontWeight: '700', padding: '6px 12px', borderRadius: '50px' }}>
                {activeStats.pendingAppointments} Pending
              </span>
            </div>
            
            <div className="table-responsive" style={{ overflowX: 'auto', flexGrow: 1 }}>
              <table className="activity-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9', fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: '700' }}>
                    <th style={{ padding: '12px 8px' }}>Patient</th>
                    <th style={{ padding: '12px 8px' }}>Specialist Doctor</th>
                    <th style={{ padding: '12px 8px' }}>Date & Slot</th>
                    <th style={{ padding: '12px 8px' }}>Status</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.slice(0, 5).map(appt => (
                    <tr key={appt._id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '13.5px' }}>
                      <td style={{ padding: '14px 8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: '700', color: '#0f172a' }}>{appt.patient?.name || 'Guest User'}</span>
                          <span style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>{appt.patient?.phone || appt.patient?.email}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: '600', color: '#334155' }}>Dr. {appt.doctor?.name || 'Unassigned'}</span>
                          <span style={{ fontSize: '11.5px', color: '#64748b' }}>{appt.department?.title}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: '500', color: '#334155' }}>
                            {appt.date ? new Date(appt.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                          </span>
                          <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '700' }}>{appt.timeSlot}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 8px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '50px',
                          fontSize: '11px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          backgroundColor: appt.status === 'Pending' ? '#fef3c7' :
                                           appt.status === 'Approved' ? '#dbeafe' :
                                           appt.status === 'Completed' ? '#d1fae5' : '#fee2e2',
                          color: appt.status === 'Pending' ? '#b45309' :
                                 appt.status === 'Approved' ? '#1d4ed8' :
                                 appt.status === 'Completed' ? '#047857' : '#b91c1c'
                        }}>
                          {appt.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 8px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          {appt.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(appt._id, 'Approved')}
                                style={{
                                  padding: '5px 9px',
                                  borderRadius: '8px',
                                  border: 'none',
                                  backgroundColor: '#10b981',
                                  color: '#ffffff',
                                  fontWeight: 'bold',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  transition: 'background-color 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
                                title="Approve"
                              >
                                ✓
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(appt._id, 'Cancelled')}
                                style={{
                                  padding: '5px 9px',
                                  borderRadius: '8px',
                                  border: 'none',
                                  backgroundColor: '#ef4444',
                                  color: '#ffffff',
                                  fontWeight: 'bold',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  transition: 'background-color 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
                                title="Cancel"
                              >
                                ✕
                              </button>
                            </>
                          )}
                          {appt.status === 'Approved' && (
                            <button
                              onClick={() => handleUpdateStatus(appt._id, 'Completed')}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '8px',
                                border: '1px solid #10b981',
                                backgroundColor: 'transparent',
                                color: '#10b981',
                                fontWeight: '700',
                                cursor: 'pointer',
                                fontSize: '11px',
                                transition: 'all 0.2s'
                              }}
                              onMouseOver={(e) => { e.target.style.backgroundColor = '#10b981'; e.target.style.color = '#ffffff'; }}
                              onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#10b981'; }}
                            >
                              Complete
                            </button>
                          )}
                          {appt.status === 'Completed' && (
                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Archived</span>
                          )}
                          {appt.status === 'Cancelled' && (
                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>None</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredAppointments.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ padding: '24px 0', textAlignment: 'center', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' }}>
                        No appointment requests found for this timeframe.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column Stack: Top Doctors & Messages */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Card A: Busiest Specialists */}
            <div className="content-card top-doctors-card">
              <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>Busiest Specialists</h2>
              <p className="card-subtitle" style={{ marginBottom: '16px' }}>Doctors with the most active patient bookings</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {topDoctors.map((doc, idx) => {
                  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];
                  const themeColor = colors[idx] || '#64748b';
                  return (
                    <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                      <div style={{ width: '26px', height: '26px', borderRadius: '50px', backgroundColor: themeColor, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '12px' }}>
                        {idx + 1}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#0f172a' }}>Dr. {doc.name}</span>
                        <span style={{ fontSize: '11.5px', color: '#64748b' }}>{doc.qualification}</span>
                      </div>
                      <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155' }}>
                        {doc.count} {doc.count === 1 ? 'booking' : 'bookings'}
                      </span>
                    </div>
                  );
                })}
                {topDoctors.length === 0 && (
                  <div style={{ padding: '16px 0', textAlignment: 'center', color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>
                    No bookings logged.
                  </div>
                )}
              </div>
            </div>

            {/* Card B: Recent Messages */}
            <div className="content-card recent-messages-card">
              <div className="card-header-with-icon" style={{ marginBottom: '14px' }}>
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>Recent Inquiries</h2>
                  <p className="card-subtitle">Latest messages from patient contacts</p>
                </div>
                {activeStats.unreadMessages > 0 && (
                  <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '50px' }}>
                    {activeStats.unreadMessages} unread
                  </span>
                )}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {filteredMessages.slice(0, 3).map(msg => (
                  <div key={msg._id} style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    backgroundColor: msg.isRead ? '#ffffff' : '#f0fdf4',
                    border: msg.isRead ? '1px solid #f1f5f9' : '1px solid #bcf0da',
                    position: 'relative'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{msg.name}</span>
                      <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>
                        {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '4px' }}>
                      {msg.subject || 'General Inquiry'}
                    </span>
                    <p style={{
                      fontSize: '11.5px',
                      color: '#64748b',
                      margin: '0 0 8px 0',
                      lineHeight: '1.4',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {msg.message}
                    </p>
                    {!msg.isRead && (
                      <button
                        onClick={() => handleMarkMessageRead(msg._id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#10b981',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                ))}
                {filteredMessages.length === 0 && (
                  <div style={{ padding: '16px 0', textAlignment: 'center', color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>
                    No messages received.
                  </div>
                )}
              </div>
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
