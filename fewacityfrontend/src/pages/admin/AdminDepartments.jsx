import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit, Trash2, Shield, Users, Briefcase, LayoutGrid, LogOut, ArrowLeft, Upload, Image as ImageIcon, Search, Mail, Calendar } from 'lucide-react';
import axios from 'axios';
import './AdminDashboard.css';
import './AdminDepartments.css';
import API_BASE_URL from '../../config/api';

const AdminDepartments = () => {
  const { user, token, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorsList, setDoctorsList] = useState([]);
  const [selectedDoctors, setSelectedDoctors] = useState([]);

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedDeptId, setSelectedDeptId] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    extra: '',
    pointsRaw: '', // User will input points separated by newlines
    imageType: 'url', // 'url' or 'upload'
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Error/Success Message States
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clean title/string for comparison
  const cleanStr = (str) => {
    if (!str) return '';
    return str.toLowerCase().replace(' department', '').replace('s', '').trim();
  };

  const getDepartmentSpecialists = (dept) => {
    if (!dept) return [];
    const deptClean = cleanStr(dept.title);
    return doctorsList.filter(doc => {
      // Match by ObjectId if doctor.department is populated as an object or is a raw ID string
      const docDeptId = doc.department?._id || doc.department;
      if (docDeptId && docDeptId.toString() === dept._id.toString()) {
        return true;
      }

      // Fallback to name-based string match
      const docDeptText = doc.department?.title || doc.department || '';
      const docDeptClean = cleanStr(docDeptText);
      return (
        docDeptClean === deptClean ||
        docDeptClean.includes(deptClean) ||
        deptClean.includes(docDeptClean)
      );
    });
  };

  // Redirect to login if not authenticated as admin
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/admin/login');
    }
  }, [user, loading, navigate]);

  // Fetch departments list
  const fetchDepartments = async () => {
    try {
      setListLoading(true);
      const response = await axios.get(API_BASE_URL + '/api/departments');
      setDepartments(response.data);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to fetch departments list');
    } finally {
      setListLoading(false);
    }
  };

  // Fetch doctors list
  const fetchDoctors = async () => {
    try {
      const response = await axios.get(API_BASE_URL + '/api/doctors');
      setDoctorsList(response.data);
    } catch (err) {
      console.error('Failed to fetch doctors list:', err);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchDepartments();
      fetchDoctors();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Open modal for creating a department
  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      title: '',
      description: '',
      extra: '',
      pointsRaw: '',
      imageType: 'url',
      imageUrl: '',
    });
    setSelectedDoctors([]);
    setImageFile(null);
    setImagePreview(null);
    setActionError('');
    setActionSuccess('');
    setIsModalOpen(true);
  };

  // Open modal for editing a department
  const openEditModal = (dept) => {
    setModalMode('edit');
    setSelectedDeptId(dept._id);
    
    const isLocalUpload = dept.image && dept.image.startsWith('/uploads/');
    const pointsString = dept.points ? dept.points.join('\n') : '';

    setFormData({
      title: dept.title,
      description: dept.description,
      extra: dept.extra || '',
      pointsRaw: pointsString,
      imageType: isLocalUpload ? 'upload' : 'url',
      imageUrl: isLocalUpload ? '' : (dept.image || ''),
    });

    // Determine which doctors are currently selected for this department
    const deptClean = cleanStr(dept.title);
    const selectedDocIds = doctorsList
      .filter(doc => {
        // Match by ObjectId if doctor.department is populated as an object or is a raw ID string
        const docDeptId = doc.department?._id || doc.department;
        if (docDeptId && docDeptId.toString() === dept._id.toString()) {
          return true;
        }

        // Fallback string match
        const docDeptText = doc.department?.title || doc.department || '';
        const docDeptClean = cleanStr(docDeptText);
        return (
          docDeptClean === deptClean ||
          docDeptClean.includes(deptClean) ||
          deptClean.includes(docDeptClean)
        );
      })
      .map(doc => doc._id);
    setSelectedDoctors(selectedDocIds);

    setImageFile(null);
    setImagePreview(isLocalUpload ? `${API_BASE_URL}${dept.image}` : dept.image);
    setActionError('');
    setActionSuccess('');
    setIsModalOpen(true);
  };

  // Handle image type toggling
  const handleImageTypeChange = (type) => {
    setFormData(prev => ({ ...prev, imageType: type }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle CRUD submissions
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');
    setIsSubmitting(true);

    const postData = new FormData();
    postData.append('title', formData.title);
    postData.append('description', formData.description);
    postData.append('extra', formData.extra);

    // Convert pointsRaw from newline-separated string to an array or JSON string
    const pointsArray = formData.pointsRaw
      .split('\n')
      .map(p => p.trim())
      .filter(Boolean);
    
    // Append points array. In FormData we can append a JSON string
    postData.append('points', JSON.stringify(pointsArray));
    postData.append('doctorIds', JSON.stringify(selectedDoctors));

    if (formData.imageType === 'upload' && imageFile) {
      postData.append('image', imageFile);
    } else if (formData.imageType === 'url') {
      postData.append('image', formData.imageUrl);
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      };

      if (modalMode === 'create') {
        await axios.post(API_BASE_URL + '/api/departments', postData, config);
        setActionSuccess('Department successfully created!');
      } else {
        await axios.put(`${API_BASE_URL}/api/departments/${selectedDeptId}`, postData, config);
        setActionSuccess('Department successfully updated!');
      }

      // Close modal after a short delay and refresh list
      setTimeout(() => {
        setIsModalOpen(false);
        fetchDepartments();
        fetchDoctors();
      }, 1000);

    } catch (err) {
      setActionError(err.response?.data?.message || 'Error executing request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting a department
  const handleDeleteDept = async (id, title) => {
    if (window.confirm(`Are you sure you want to remove the ${title}?`)) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        await axios.delete(`${API_BASE_URL}/api/departments/${id}`, config);
        setActionSuccess(`Department "${title}" successfully removed.`);
        fetchDepartments();
        setTimeout(() => setActionSuccess(''), 3000);
      } catch (err) {
        setActionError(err.response?.data?.message || 'Failed to delete department.');
        setTimeout(() => setActionError(''), 3000);
      }
    }
  };

  // Filtered departments list based on search term
  const filteredDepts = departments.filter(dept => 
    dept.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase())
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
          <a href="/admin/departments" className="menu-item active">
            <LayoutGrid className="menu-icon" />
            Departments
          </a>
          <a href="/admin/appointments" className="menu-item">
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
            <h1>Manage Specialist Departments</h1>
          </div>
          <button onClick={openCreateModal} className="add-doctor-action-btn">
            <Plus className="btn-icon" />
            Add New Department
          </button>
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
              placeholder="Search departments by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="doctors-search-bar-input"
            />
          </div>
        </div>

        {/* DEPARTMENTS LISTING TABLE */}
        <div className="doctors-table-card">
          {listLoading ? (
            <div className="table-loader-wrapper">
              <div className="spinner"></div>
              <p>Fetching departments roster...</p>
            </div>
          ) : filteredDepts.length === 0 ? (
            <div className="empty-doctors-state">
              <LayoutGrid className="empty-icon" />
              <h3>No Departments Found</h3>
              <p>Try refining your search terms or add a new department record.</p>
            </div>
          ) : (
            <table className="doctors-crud-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Department Title</th>
                  <th>Description Preview</th>
                  <th>Key Focus Points</th>
                  <th>Specialists</th>
                  <th className="actions-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDepts.map((dept) => (
                  <tr key={dept._id}>
                    <td>
                      {dept.image ? (
                        <img 
                          src={dept.image.startsWith('/uploads/') ? `${API_BASE_URL}${dept.image}` : dept.image} 
                          alt={dept.title} 
                          className="doctor-table-img-thumb"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://fch.com.np/wp-content/uploads/2026/02/anaesthesia1.jpg";
                          }}
                        />
                      ) : (
                        <div className="doctor-table-img-thumb flex items-center justify-center bg-slate-100 text-slate-400">
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </td>
                    <td className="doctor-table-name" style={{ fontWeight: '600' }}>{dept.title}</td>
                    <td className="doctor-table-qual" title={dept.description} style={{ maxWidth: '300px' }}>
                      {dept.description}
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1" style={{ maxWidth: '200px' }}>
                        {dept.points && dept.points.map((pt, i) => (
                          <span key={i} className="doctor-table-dept-badge" style={{ margin: '2px', display: 'inline-block' }}>
                            {pt}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1" style={{ maxWidth: '200px' }}>
                        {getDepartmentSpecialists(dept).map((doc) => (
                          <span key={doc._id} className="doctor-table-dept-badge" style={{ margin: '2px', display: 'inline-block', backgroundColor: '#e2e8f0', color: '#1e293b', fontWeight: '500' }}>
                            {doc.name}
                          </span>
                        ))}
                        {getDepartmentSpecialists(dept).length === 0 && (
                          <span className="text-slate-400 text-xs italic">No specialists</span>
                        )}
                      </div>
                    </td>
                    <td className="doctor-table-actions">
                      <button onClick={() => openEditModal(dept)} className="action-icon-btn edit-color" title="Edit Department">
                        <Edit className="action-icon" />
                      </button>
                      <button onClick={() => handleDeleteDept(dept._id, dept.title)} className="action-icon-btn delete-color" title="Remove Department">
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

      {/* CREATE / EDIT MODAL OVERLAY */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>{modalMode === 'create' ? 'Add New Department' : 'Edit Department Details'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="close-modal-btn">&times;</button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="modal-form">
              {actionError && <div className="crud-error-banner">{actionError}</div>}
              {actionSuccess && <div className="crud-success-banner">{actionSuccess}</div>}

              <div className="form-field-wrapper">
                <label>Department Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="e.g. Cardiology Department"
                />
              </div>

              <div className="form-field-wrapper" style={{ marginBottom: '15px' }}>
                <label>Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="Describe the department scope, focus area, and clinical significance..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    backgroundColor: '#f8fafc',
                    outline: 'none',
                    transition: 'all 0.2s',
                    color: '#1e293b',
                    height: '80px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div className="form-field-wrapper" style={{ marginBottom: '15px' }}>
                <label>Extra Information / Special Note (Optional)</label>
                <textarea 
                  name="extra" 
                  value={formData.extra} 
                  onChange={handleInputChange} 
                  placeholder="e.g. We offer preventive care, diagnostic services, and interventional procedures..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    backgroundColor: '#f8fafc',
                    outline: 'none',
                    transition: 'all 0.2s',
                    color: '#1e293b',
                    height: '60px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div className="form-field-wrapper" style={{ marginBottom: '15px' }}>
                <label>Key Focus Points / Services (One item per line)</label>
                <textarea 
                  name="pointsRaw" 
                  value={formData.pointsRaw} 
                  onChange={handleInputChange} 
                  placeholder="e.g.&#10;Comprehensive cardiac care&#10;Heart health assessment&#10;Diagnostic services"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    backgroundColor: '#f8fafc',
                    outline: 'none',
                    transition: 'all 0.2s',
                    color: '#1e293b',
                    height: '80px',
                    resize: 'vertical',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              <div className="form-field-wrapper" style={{ marginBottom: '20px' }}>
                <label>Available Specialists / Doctors</label>
                <div style={{
                  maxHeight: '150px',
                  overflowY: 'auto',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  backgroundColor: '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {doctorsList.length === 0 ? (
                    <span style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>
                      No doctors available. Add doctors first in Doctors List.
                    </span>
                  ) : (
                    doctorsList.map(doc => {
                      const isChecked = selectedDoctors.includes(doc._id);
                      return (
                        <label key={doc._id} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: '#1e293b'
                        }}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedDoctors(prev => [...prev, doc._id]);
                              } else {
                                setSelectedDoctors(prev => prev.filter(id => id !== doc._id));
                              }
                            }}
                            style={{ cursor: 'pointer' }}
                          />
                          <span>{doc.name} <span style={{ color: '#64748b', fontSize: '12px' }}>({doc.qualification})</span></span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="image-type-selector-wrapper">
                <label>Department Display Image</label>
                <div className="type-toggle-buttons">
                  <button 
                    type="button" 
                    className={formData.imageType === 'url' ? 'toggle-active' : ''}
                    onClick={() => handleImageTypeChange('url')}
                  >
                    <ImageIcon className="toggle-icon" /> Image Link URL
                  </button>
                  <button 
                    type="button" 
                    className={formData.imageType === 'upload' ? 'toggle-active' : ''}
                    onClick={() => handleImageTypeChange('upload')}
                  >
                    <Upload className="toggle-icon" /> Upload File
                  </button>
                </div>

                {formData.imageType === 'url' ? (
                  <div className="form-field-wrapper url-input-wrapper">
                    <input 
                      type="text" 
                      name="imageUrl" 
                      value={formData.imageUrl} 
                      onChange={handleInputChange} 
                      placeholder="Paste image URL (e.g. https://domain.com/image.png)"
                      required={formData.imageType === 'url'}
                    />
                  </div>
                ) : (
                  <div className="file-upload-drag-area">
                    <input 
                      type="file" 
                      id="dept-file-uploader" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      required={formData.imageType === 'upload' && !imagePreview}
                    />
                    <label htmlFor="dept-file-uploader" className="file-uploader-label">
                      <Upload className="drag-upload-icon" />
                      <span>{imageFile ? imageFile.name : 'Select or drop image file here'}</span>
                    </label>
                  </div>
                )}

                {imagePreview && (
                  <div className="image-form-preview-wrapper">
                    <span>Preview:</span>
                    <img src={imagePreview} alt="Selected preview" />
                  </div>
                )}
              </div>

              <div className="modal-footer-actions">
                <button type="button" onClick={() => setIsModalOpen(false)} className="modal-cancel-btn">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="modal-submit-btn">
                  {isSubmitting ? 'Saving record...' : 'Save Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDepartments;
