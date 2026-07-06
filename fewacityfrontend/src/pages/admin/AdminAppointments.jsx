import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Users, Briefcase, LayoutGrid, LogOut, ArrowLeft, Search, Mail, Calendar, Eye, Edit2, Check, X } from 'lucide-react';
import axios from 'axios';
import './AdminDashboard.css';
import API_BASE_URL from '../../config/api';

const AdminAppointments = () => {
  const { user, token, logout, loading } = useAuth();
  const navigate = useNavigate();
  
  const [appointments, setAppointments] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Edit Form State
  const [editStatus, setEditStatus] = useState('');
  const [editPrescription, setEditPrescription] = useState('');
  const [editAdminNotes, setEditAdminNotes] = useState('');
  
  // Feedback states
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  // Redirect to login if not authenticated as admin
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/admin/login');
    }
  }, [user, loading, navigate]);

  // Fetch all appointments
  const fetchAppointments = async () => {
    try {
      setListLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get(API_BASE_URL + '/api/appointments', config);
      setAppointments(response.data);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAppointments();
    }
  }, [user, token]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Open modal and load fields
  const handleOpenEdit = (appt) => {
    setSelectedAppt(appt);
    setEditStatus(appt.status || 'Pending');
    setEditPrescription(appt.prescription || '');
    setEditAdminNotes(appt.adminNotes || '');
    setIsModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');
    setIsSubmittingAction(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.put(`${API_BASE_URL}/api/appointments/${selectedAppt._id}`, {
        status: editStatus,
        prescription: editPrescription,
        adminNotes: editAdminNotes
      }, config);

      setActionSuccess('Appointment updated successfully.');
      
      // Update local state list
      setAppointments(prev => prev.map(a => a._id === selectedAppt._id ? response.data : a));
      setIsModalOpen(false);
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to update appointment.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // Quick Action Buttons
  const handleQuickStatusChange = async (id, status) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.put(`${API_BASE_URL}/api/appointments/${id}`, {
        status
      }, config);

      setActionSuccess(`Appointment successfully marked as ${status}.`);
      setAppointments(prev => prev.map(a => a._id === id ? response.data : a));
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to update appointment status.');
      setTimeout(() => setActionError(''), 3000);
    }
  };

  // Filtering
  const filteredAppointments = appointments.filter(appt => {
    const pName = appt.patient?.name || '';
    const pEmail = appt.patient?.email || '';
    const dName = appt.doctor?.name || '';
    const dept = appt.department?.title || '';
    const search = searchTerm.toLowerCase();

    return pName.toLowerCase().includes(search) || 
           pEmail.toLowerCase().includes(search) || 
           dName.toLowerCase().includes(search) || 
           dept.toLowerCase().includes(search);
  });

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
          <a href="/admin/appointments" className="menu-item active">
            <Calendar className="menu-icon" />
            Appointments
          </a>
          <a href="/admin/messages" className="menu-item">
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
            <h1>Patient Appointments</h1>
          </div>
        </header>

        {/* NOTIFICATIONS */}
        {actionSuccess && <div className="crud-success-banner">{actionSuccess}</div>}
        {actionError && <div className="crud-error-banner">{actionError}</div>}

        {/* SEARCH & FILTERS */}
        <div className="doctors-list-controls">
          <div className="search-box-wrapper">
            <Search className="search-box-icon" />
            <input 
              type="text" 
              placeholder="Search by patient name, doctor, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="doctors-search-bar-input"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="doctors-table-card">
          {listLoading ? (
            <div className="table-loader-wrapper">
              <div className="spinner"></div>
              <p>Fetching appointments...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="empty-doctors-state">
              <Calendar className="empty-icon" />
              <h3>No Appointments Found</h3>
              <p>No patient records or schedule match the search filters.</p>
            </div>
          ) : (
            <table className="doctors-crud-table">
              <thead>
                <tr>
                  <th>Patient Details</th>
                  <th>Clinical Dept.</th>
                  <th>Assigned Doctor</th>
                  <th>Date & Preference</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appt) => (
                  <tr key={appt._id}>
                    <td>
                      <div className="doctor-table-name">{appt.patient?.name || 'Unknown Patient'}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{appt.patient?.email}</div>
                      {appt.patient?.phone && <div style={{ fontSize: '11px', color: '#64748b' }}>Tel: {appt.patient.phone}</div>}
                    </td>
                    <td>{appt.department?.title || 'Unknown Department'}</td>
                    <td>
                      <div style={{ fontWeight: '600', color: '#334155' }}>{appt.doctor?.name || 'Unassigned'}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>{appt.doctor?.qualification}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{new Date(appt.date).toLocaleDateString()}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{appt.timeSlot}</div>
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: appt.status === 'Approved' ? '#15803d' : 
                               appt.status === 'Pending' ? '#a16207' : 
                               appt.status === 'Completed' ? '#1d4ed8' : '#b91c1c',
                        backgroundColor: appt.status === 'Approved' ? '#f0fdf4' : 
                                         appt.status === 'Pending' ? '#fef9c3' : 
                                         appt.status === 'Completed' ? '#eff6ff' : '#fef2f2',
                        border: `1px solid ${appt.status === 'Approved' ? '#bbf7d0' : 
                                              appt.status === 'Pending' ? '#fef08a' : 
                                              appt.status === 'Completed' ? '#bfdbfe' : '#fecaca'}`
                      }}>
                        {appt.status}
                      </span>
                    </td>
                    <td className="doctor-table-actions">
                      {appt.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleQuickStatusChange(appt._id, 'Approved')} 
                            className="action-icon-btn edit-color" 
                            title="Approve Booking"
                            style={{ color: '#10b981', backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }}
                          >
                            <Check className="action-icon" />
                          </button>
                          <button 
                            onClick={() => handleQuickStatusChange(appt._id, 'Cancelled')} 
                            className="action-icon-btn delete-color" 
                            title="Cancel Booking"
                            style={{ color: '#ef4444', backgroundColor: '#fdf2f2', borderColor: '#fca5a5' }}
                          >
                            <X className="action-icon" />
                          </button>
                        </>
                      )}
                      
                      <button onClick={() => handleOpenEdit(appt)} className="action-icon-btn edit-color" title="Edit / Prescribe">
                        <Edit2 className="action-icon" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* EDIT MODAL */}
      {isModalOpen && selectedAppt && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: '650px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Modify Appointment Status</h2>
              <button onClick={() => setIsModalOpen(false)} className="close-modal-btn">&times;</button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="modal-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label>Patient</label>
                  <input type="text" readOnly className="modal-input" style={{ backgroundColor: '#f1f5f9' }} value={selectedAppt.patient?.name || ''} />
                </div>
                <div>
                  <label>Doctor / Specialty</label>
                  <input type="text" readOnly className="modal-input" style={{ backgroundColor: '#f1f5f9' }} value={`${selectedAppt.doctor?.name || ''} (${selectedAppt.department?.title || ''})`} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label>Date & Slot</label>
                  <input type="text" readOnly className="modal-input" style={{ backgroundColor: '#f1f5f9' }} value={`${new Date(selectedAppt.date).toLocaleDateString()} @ ${selectedAppt.timeSlot}`} />
                </div>
                <div>
                  <label>Booking Status</label>
                  <select 
                    className="modal-input" 
                    value={editStatus} 
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    <option value="Pending">Pending Review</option>
                    <option value="Approved">Approved / Scheduled</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Completed">Completed / Visited</option>
                  </select>
                </div>
              </div>

              {selectedAppt.symptoms && (
                <div style={{ marginBottom: '16px' }}>
                  <label>Reported Symptoms</label>
                  <textarea readOnly className="modal-input" style={{ backgroundColor: '#f8fafc', resize: 'none', height: '60px' }} value={selectedAppt.symptoms} />
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label>Diagnosis & Prescription</label>
                <textarea 
                  className="modal-input" 
                  placeholder="Enter medical prescription or treatment plan..." 
                  style={{ height: '100px', resize: 'none' }}
                  value={editPrescription}
                  onChange={(e) => setEditPrescription(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label>Internal Administrator Notes</label>
                <textarea 
                  className="modal-input" 
                  placeholder="Enter comments about reschedule details, staff instructions etc..." 
                  style={{ height: '60px', resize: 'none' }}
                  value={editAdminNotes}
                  onChange={(e) => setEditAdminNotes(e.target.value)}
                />
              </div>

              <div className="modal-footer-actions">
                <button type="button" onClick={() => setIsModalOpen(false)} className="modal-cancel-btn">Cancel</button>
                <button type="submit" disabled={isSubmittingAction} className="modal-submit-btn">
                  {isSubmittingAction ? 'Updating...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;
