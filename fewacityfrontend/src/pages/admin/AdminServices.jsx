import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit, Trash2, Shield, Users, Briefcase, LayoutGrid, LogOut, ArrowLeft, Upload, FileText, Image as ImageIcon, Search, Mail, Calendar } from 'lucide-react';
import axios from 'axios';
import './AdminDashboard.css';
import './AdminServices.css';
import API_BASE_URL from '../../config/api';

const CATEGORIES = [
  "Diagnostics",
  "Critical Care",
  "Specialized Treatment",
  "General"
];

const AdminServices = () => {
  const { user, token, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    category: CATEGORIES[0],
    desc: '',
    imageType: 'url', // 'url' or 'upload'
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Error/Success Message States
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to login if not authenticated as admin
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/admin/login');
    }
  }, [user, loading, navigate]);

  // Fetch services list
  const fetchServices = async () => {
    try {
      setListLoading(true);
      const response = await axios.get(API_BASE_URL + '/api/services');
      setServices(response.data);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to fetch services list');
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchServices();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Open modal for creating a service
  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      title: '',
      category: CATEGORIES[0],
      desc: '',
      imageType: 'url',
      imageUrl: '',
    });
    setImageFile(null);
    setImagePreview(null);
    setActionError('');
    setActionSuccess('');
    setIsModalOpen(true);
  };

  // Open modal for editing a service
  const openEditModal = (service) => {
    setModalMode('edit');
    setSelectedServiceId(service._id);
    
    const isLocalUpload = service.image.startsWith('/uploads/');
    setFormData({
      title: service.title,
      category: service.category,
      desc: service.desc,
      imageType: isLocalUpload ? 'upload' : 'url',
      imageUrl: isLocalUpload ? '' : service.image,
    });
    setImageFile(null);
    setImagePreview(isLocalUpload ? `${API_BASE_URL}${service.image}` : service.image);
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
    postData.append('category', formData.category);
    postData.append('desc', formData.desc);

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
        await axios.post(API_BASE_URL + '/api/services', postData, config);
        setActionSuccess('Service successfully created!');
      } else {
        await axios.put(`${API_BASE_URL}/api/services/${selectedServiceId}`, postData, config);
        setActionSuccess('Service successfully updated!');
      }

      // Close modal after a short delay and refresh list
      setTimeout(() => {
        setIsModalOpen(false);
        fetchServices();
      }, 1000);

    } catch (err) {
      setActionError(err.response?.data?.message || 'Error executing request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting a service
  const handleDeleteService = async (id, title) => {
    if (window.confirm(`Are you sure you want to remove the ${title} service?`)) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        await axios.delete(`${API_BASE_URL}/api/services/${id}`, config);
        setActionSuccess(`Service "${title}" successfully removed.`);
        fetchServices();
        setTimeout(() => setActionSuccess(''), 3000);
      } catch (err) {
        setActionError(err.response?.data?.message || 'Failed to delete service.');
        setTimeout(() => setActionError(''), 3000);
      }
    }
  };

  // Filtered services list based on search term
  const filteredServices = services.filter(srv => 
    srv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    srv.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    srv.desc.toLowerCase().includes(searchTerm.toLowerCase())
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
            Doctors Roster
          </a>
          <a href="/admin/services" className="menu-item active">
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
            <h1>Manage Clinical Services</h1>
          </div>
          <button onClick={openCreateModal} className="add-doctor-action-btn">
            <Plus className="btn-icon" />
            Add New Service
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
              placeholder="Search services by title, category, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="doctors-search-bar-input"
            />
          </div>
        </div>

        {/* SERVICES LISTING TABLE */}
        <div className="doctors-table-card">
          {listLoading ? (
            <div className="table-loader-wrapper">
              <div className="spinner"></div>
              <p>Fetching services roster...</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="empty-doctors-state">
              <Briefcase className="empty-icon" />
              <h3>No Services Found</h3>
              <p>Try refining your search terms or add a new service record.</p>
            </div>
          ) : (
            <table className="doctors-crud-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Service Title</th>
                  <th>Category</th>
                  <th>Description Preview</th>
                  <th className="actions-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((srv) => (
                  <tr key={srv._id}>
                    <td>
                      <img 
                        src={srv.image.startsWith('/uploads/') ? `${API_BASE_URL}${srv.image}` : srv.image} 
                        alt={srv.title} 
                        className="doctor-table-img-thumb"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://fch.com.np/wp-content/uploads/2026/02/lab.jpg";
                        }}
                      />
                    </td>
                    <td className="doctor-table-name">{srv.title}</td>
                    <td><span className="doctor-table-dept-badge">{srv.category}</span></td>
                    <td className="doctor-table-qual" title={srv.desc}>{srv.desc}</td>
                    <td className="doctor-table-actions">
                      <button onClick={() => openEditModal(srv)} className="action-icon-btn edit-color" title="Edit Service">
                        <Edit className="action-icon" />
                      </button>
                      <button onClick={() => handleDeleteService(srv._id, srv.title)} className="action-icon-btn delete-color" title="Remove Service">
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
              <h2>{modalMode === 'create' ? 'Add New Clinical Service' : 'Edit Service Details'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="close-modal-btn">&times;</button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="modal-form">
              {actionError && <div className="crud-error-banner">{actionError}</div>}
              {actionSuccess && <div className="crud-success-banner">{actionSuccess}</div>}

              <div className="form-group-grid">
                <div className="form-field-wrapper">
                  <label>Service Title</label>
                  <input 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="e.g. Video Colonoscopy"
                  />
                </div>
                
                <div className="form-field-wrapper">
                  <label>Category</label>
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleInputChange}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-field-wrapper" style={{ marginBottom: '20px' }}>
                <label>Description</label>
                <textarea 
                  name="desc" 
                  value={formData.desc} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="Detail the scope of this medical service..."
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
                    height: '100px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div className="image-type-selector-wrapper">
                <label>Service Display Image</label>
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
                      id="service-file-uploader" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      required={formData.imageType === 'upload' && !imagePreview}
                    />
                    <label htmlFor="service-file-uploader" className="file-uploader-label">
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
                  {isSubmitting ? 'Saving record...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
