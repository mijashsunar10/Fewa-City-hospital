import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Users, Briefcase, LayoutGrid, LogOut, ArrowLeft, Search, Mail, Trash2, Calendar, Eye } from 'lucide-react';
import axios from 'axios';
import './AdminDashboard.css';
import './AdminDepartments.css';

const AdminMessages = () => {
  const { user, token, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Success/Error Feedback States
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Redirect to login if not authenticated as admin
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/admin/login');
    }
  }, [user, loading, navigate]);

  // Fetch messages list
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setListLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const response = await axios.get('http://localhost:5000/api/messages', config);
        setMessages(response.data);
      } catch (err) {
        setActionError(err.response?.data?.message || 'Failed to fetch messages list');
      } finally {
        setListLoading(false);
      }
    };

    if (user && user.role === 'admin') {
      fetchMessages();
    }
  }, [user, token]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Open message details and mark as read
  const handleOpenMessage = async (msg) => {
    setSelectedMessage(msg);
    setIsModalOpen(true);

    if (!msg.isRead) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        await axios.put(`http://localhost:5000/api/messages/${msg._id}/read`, {}, config);
        
        // Update local state to reflect read status
        setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, isRead: true } : m));
      } catch (err) {
        console.error('Failed to mark message as read:', err);
      }
    }
  };

  // Delete message
  const handleDeleteMessage = async (e, id, senderName) => {
    e.stopPropagation(); // Avoid opening the details modal when clicking delete
    if (window.confirm(`Are you sure you want to delete the message from ${senderName}?`)) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        await axios.delete(`http://localhost:5000/api/messages/${id}`, config);
        setActionSuccess(`Message from "${senderName}" successfully deleted.`);
        
        // Remove from local state
        setMessages(prev => prev.filter(m => m._id !== id));
        if (selectedMessage && selectedMessage._id === id) {
          setIsModalOpen(false);
        }
        
        setTimeout(() => setActionSuccess(''), 3000);
      } catch (err) {
        setActionError(err.response?.data?.message || 'Failed to delete message.');
        setTimeout(() => setActionError(''), 3000);
      }
    }
  };

  // Filter messages based on search term
  const filteredMessages = messages.filter(msg =>
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <a href="/admin/dashboard" className="menu-item">
            <LayoutGrid className="menu-icon" />
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
          <a href="/admin/messages" className="menu-item active">
            <Mail className="menu-icon" />
            Patient Messages
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
          <div className="header-title-area">
            <button onClick={() => navigate('/admin/dashboard')} className="back-to-dashboard-btn">
              <ArrowLeft className="back-arrow-icon" />
              Back
            </button>
            <h1>Patient Contact Messages</h1>
          </div>
        </header>

        {/* NOTIFICATION FEEDBACKS */}
        {actionSuccess && <div className="crud-success-banner">{actionSuccess}</div>}
        {actionError && <div className="crud-error-banner">{actionError}</div>}

        {/* SEARCH BAR */}
        <div className="doctors-list-controls">
          <div className="search-box-wrapper">
            <Search className="search-box-icon" />
            <input 
              type="text" 
              placeholder="Search messages by name, email, subject, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="doctors-search-bar-input"
            />
          </div>
        </div>

        {/* MESSAGES LISTING TABLE */}
        <div className="doctors-table-card">
          {listLoading ? (
            <div className="table-loader-wrapper">
              <div className="spinner"></div>
              <p>Fetching messages inbox...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="empty-doctors-state">
              <Mail className="empty-icon" />
              <h3>No Messages Found</h3>
              <p>Try refining your search terms or wait for new feedback/submissions.</p>
            </div>
          ) : (
            <table className="doctors-crud-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Patient Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message Snippet</th>
                  <th className="actions-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((msg) => (
                  <tr 
                    key={msg._id} 
                    onClick={() => handleOpenMessage(msg)}
                    style={{ 
                      cursor: 'pointer',
                      fontWeight: msg.isRead ? 'normal' : '600',
                      backgroundColor: msg.isRead ? 'transparent' : 'rgba(16, 185, 129, 0.04)' 
                    }}
                  >
                    <td>
                      {!msg.isRead ? (
                        <span style={{ 
                          backgroundColor: '#10b981', 
                          color: '#ffffff', 
                          padding: '4px 8px', 
                          borderRadius: '12px', 
                          fontSize: '11px',
                          fontWeight: 'bold'
                        }}>
                          Unread
                        </span>
                      ) : (
                        <span style={{ 
                          backgroundColor: '#94a3b8', 
                          color: '#ffffff', 
                          padding: '4px 8px', 
                          borderRadius: '12px', 
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          Read
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: '13px', color: '#64748b' }}>
                      {new Date(msg.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="doctor-table-name" style={{ color: msg.isRead ? '#1e293b' : '#0f172a' }}>
                      {msg.name}
                    </td>
                    <td style={{ color: '#64748b', fontSize: '13px' }}>
                      {msg.email}
                    </td>
                    <td style={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {msg.subject}
                    </td>
                    <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#64748b', fontSize: '13px' }}>
                      {msg.message}
                    </td>
                    <td className="doctor-table-actions" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => handleOpenMessage(msg)} className="action-icon-btn edit-color" title="Read Message">
                        <Eye className="action-icon" />
                      </button>
                      <button onClick={(e) => handleDeleteMessage(e, msg._id, msg.name)} className="action-icon-btn delete-color" title="Delete Message">
                        <Trash2 className="action-icon" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* MESSAGE DETAILS MODAL */}
      {isModalOpen && selectedMessage && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: '600px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Mail size={12} /> Contact Message Inquiry
                </span>
                <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '4px 0 0 0', color: '#0f172a' }}>
                  {selectedMessage.subject}
                </h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="close-modal-btn">&times;</button>
            </div>

            <div className="modal-form" style={{ marginTop: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>SENDER NAME</span>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '15px', marginTop: '2px' }}>{selectedMessage.name}</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>PHONE NUMBER</span>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '15px', marginTop: '2px' }}>{selectedMessage.phone || 'N/A'}</div>
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>EMAIL ADDRESS</span>
                <div style={{ marginTop: '2px' }}>
                  <a href={`mailto:${selectedMessage.email}`} style={{ fontWeight: '700', color: '#3b82f6', textDecoration: 'none', fontSize: '15px' }}>
                    {selectedMessage.email}
                  </a>
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>MESSAGE CONTENT</span>
                  <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={11} /> {new Date(selectedMessage.createdAt).toLocaleString()}
                  </span>
                </div>
                <div style={{ 
                  whiteSpace: 'pre-wrap', 
                  color: '#334155', 
                  fontSize: '14.5px', 
                  lineHeight: '1.6', 
                  marginTop: '4px',
                  backgroundColor: '#ffffff',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px dashed #cbd5e1'
                }}>
                  {selectedMessage.message}
                </div>
              </div>

              <div className="modal-footer-actions" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: '0' }}>
                <button 
                  type="button" 
                  onClick={(e) => handleDeleteMessage(e, selectedMessage._id, selectedMessage.name)} 
                  className="modal-cancel-btn" 
                  style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5' }}
                >
                  <Trash2 size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} /> Delete Inquiry
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="modal-submit-btn">
                  Close Inquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
