import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit, Trash2, Shield, Users, Briefcase, LayoutGrid, LogOut, ArrowLeft, Upload, FileText, Image as ImageIcon, Search, Mail, Calendar } from 'lucide-react';
import axios from 'axios';
import './AdminDashboard.css';
import './AdminDoctors.css';
import API_BASE_URL from '../../config/api';

const DEPARTMENTS = [
  "Internal Medicine",
  "Surgery",
  "Gynecology",
  "Gastroenterology",
  "Anesthesia",
  "Orthopedics",
  "Pediatrics",
  "Urology",
  "Radiology",
  "ENT",
  "Psychiatry",
  "Ophthalmology",
  "Dermatology",
  "Neurosurgery",
  "Cardiology",
  "Physiotherapy",
  "Dental",
  "Nephrology",
  "Oncology"
];

const AdminDoctors = () => {
  const { user, token, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const displayDepartments = departmentsList.length > 0 ? departmentsList : DEPARTMENTS;

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    qualification: '',
    department: '',
    phone: '9765940555',
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

  // Fetch doctors list
  const fetchDoctors = async () => {
    try {
      setListLoading(true);
      const response = await axios.get(API_BASE_URL + '/api/doctors');
      setDoctors(response.data);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to fetch doctors list');
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchDoctors();
    }
  }, [user]);

  // Fetch departments list for select dropdown
  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const response = await axios.get(API_BASE_URL + '/api/departments');
        const names = response.data.map(d => d.title.replace(' Department', ''));
        setDepartmentsList(names);
        if (names.length > 0) {
          setFormData(prev => ({ 
            ...prev, 
            department: prev.department || names[0] 
          }));
        }
      } catch (err) {
        console.error('Failed to load departments for doctor selection:', err);
      }
    };
    fetchDepts();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Open modal for creating a doctor
  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      name: '',
      qualification: '',
      department: displayDepartments[0] || DEPARTMENTS[0],
      phone: '9765940555',
      imageType: 'url',
      imageUrl: '',
    });
    setImageFile(null);
    setImagePreview(null);
    setActionError('');
    setActionSuccess('');
    setIsModalOpen(true);
  };

  // Open modal for editing a doctor
  const openEditModal = (doctor) => {
    setModalMode('edit');
    setSelectedDoctorId(doctor._id);
    
    const isLocalUpload = doctor.image.startsWith('/uploads/');
    setFormData({
      name: doctor.name,
      qualification: doctor.qualification,
      department: doctor.department,
      phone: doctor.phone || '9765940555',
      imageType: isLocalUpload ? 'upload' : 'url',
      imageUrl: isLocalUpload ? '' : doctor.image,
    });
    setImageFile(null);
    setImagePreview(isLocalUpload ? `${API_BASE_URL}${doctor.image}` : doctor.image);
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
    postData.append('name', formData.name);
    postData.append('qualification', formData.qualification);
    postData.append('department', formData.department);
    postData.append('phone', formData.phone);

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
        await axios.post(API_BASE_URL + '/api/doctors', postData, config);
        setActionSuccess('Doctor successfully created!');
      } else {
        await axios.put(`${API_BASE_URL}/api/doctors/${selectedDoctorId}`, postData, config);
        setActionSuccess('Doctor successfully updated!');
      }

      // Close modal after a short delay and refresh list
      setTimeout(() => {
        setIsModalOpen(false);
        fetchDoctors();
      }, 1000);

    } catch (err) {
      setActionError(err.response?.data?.message || 'Error executing request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting a doctor
  const handleDeleteDoctor = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove Dr. ${name}?`)) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        await axios.delete(`${API_BASE_URL}/api/doctors/${id}`, config);
        setActionSuccess(`Dr. ${name} successfully removed.`);
        fetchDoctors();
        setTimeout(() => setActionSuccess(''), 3000);
      } catch (err) {
        setActionError(err.response?.data?.message || 'Failed to delete doctor.');
        setTimeout(() => setActionError(''), 3000);
      }
    }
  };

  // Filtered doctors list based on search term
  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.qualification.toLowerCase().includes(searchTerm.toLowerCase())
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
          <a href="/admin/doctors" className="menu-item active">
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
            <h1>Manage Specialist Doctors</h1>
          </div>
          <button onClick={openCreateModal} className="add-doctor-action-btn">
            <Plus className="btn-icon" />
            Add New Specialist
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
              placeholder="Search doctors by name, department, or qualification..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="doctors-search-bar-input"
            />
          </div>
        </div>

        {/* DOCTORS LISTING TABLE */}
        <div className="doctors-table-card">
          {listLoading ? (
            <div className="table-loader-wrapper">
              <div className="spinner"></div>
              <p>Fetching doctors roster...</p>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="empty-doctors-state">
              <Users className="empty-icon" />
              <h3>No Specialists Found</h3>
              <p>Try refining your search terms or add a new doctor record.</p>
            </div>
          ) : (
            <table className="doctors-crud-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Qualification</th>
                  <th>WhatsApp</th>
                  <th className="actions-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map((doc) => (
                  <tr key={doc._id}>
                    <td>
                      <img 
                        src={doc.image.startsWith('/uploads/') ? `${API_BASE_URL}${doc.image}` : doc.image} 
                        alt={doc.name} 
                        className="doctor-table-img-thumb"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg";
                        }}
                      />
                    </td>
                    <td className="doctor-table-name">{doc.name}</td>
                    <td><span className="doctor-table-dept-badge">{doc.department}</span></td>
                    <td className="doctor-table-qual">{doc.qualification}</td>
                    <td className="doctor-table-phone">{doc.phone}</td>
                    <td className="doctor-table-actions">
                      <button onClick={() => openEditModal(doc)} className="action-icon-btn edit-color" title="Edit Roster">
                        <Edit className="action-icon" />
                      </button>
                      <button onClick={() => handleDeleteDoctor(doc._id, doc.name)} className="action-icon-btn delete-color" title="Remove Roster">
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
              <h2>{modalMode === 'create' ? 'Add New Doctor' : 'Edit Doctor Details'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="close-modal-btn">&times;</button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="modal-form">
              {actionError && <div className="crud-error-banner">{actionError}</div>}
              {actionSuccess && <div className="crud-success-banner">{actionSuccess}</div>}

              <div className="form-group-grid">
                <div className="form-field-wrapper">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="e.g. Dr. Bhoj Raj Neupane"
                  />
                </div>
                
                <div className="form-field-wrapper">
                  <label>WhatsApp Booking Number</label>
                  <input 
                    type="text" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="e.g. 9765940555"
                  />
                </div>
              </div>

              <div className="form-group-grid">
                <div className="form-field-wrapper">
                  <label>Specialization / Department</label>
                  <select 
                    name="department" 
                    value={formData.department} 
                    onChange={handleInputChange}
                  >
                    {displayDepartments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="form-field-wrapper">
                  <label>Qualifications & Degrees</label>
                  <input 
                    type="text" 
                    name="qualification" 
                    value={formData.qualification} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="e.g. MBBS, MS - General Surgeon"
                  />
                </div>
              </div>

              <div className="image-type-selector-wrapper">
                <label>Doctor Profile Image</label>
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
                      id="doctor-file-uploader" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      required={formData.imageType === 'upload' && !imagePreview}
                    />
                    <label htmlFor="doctor-file-uploader" className="file-uploader-label">
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
                  {isSubmitting ? 'Saving record...' : 'Save Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctors;
