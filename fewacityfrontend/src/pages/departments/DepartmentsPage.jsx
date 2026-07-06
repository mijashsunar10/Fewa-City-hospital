import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, Info } from 'lucide-react';
import axios from 'axios';
import './DepartmentsPage.css';
import API_BASE_URL from '../../config/api';
import useSEO from '../../hooks/useSEO';

const DepartmentsPage = () => {
  useSEO(
    'Medical Departments',
    'Browse our specialized medical departments at Fewa City Hospital Pokhara, including Cardiology, Orthopedics, Urology, ENT, and Gynecology.',
    'medical departments Pokhara, cardiology, orthopedics, urology, gynecology Pokhara'
  );

  const { user } = useAuth();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [activeDeptId, setActiveDeptId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch departments and doctors in parallel
        const [deptRes, docRes] = await Promise.all([
          axios.get(API_BASE_URL + '/api/departments'),
          axios.get(API_BASE_URL + '/api/doctors')
        ]);
        
        setDepartments(deptRes.data);
        setDoctors(docRes.data);

        // Select initial department based on hash or default to first
        const hash = location.hash.replace('#', '');
        if (hash) {
          const matchedDept = deptRes.data.find(d => d.slug === hash);
          if (matchedDept) {
            setActiveDeptId(matchedDept._id);
          } else if (deptRes.data.length > 0) {
            setActiveDeptId(deptRes.data[0]._id);
          }
        } else if (deptRes.data.length > 0) {
          setActiveDeptId(deptRes.data[0]._id);
        }
      } catch (err) {
        console.error('Failed to fetch departments/doctors data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Update active department if hash changes
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && departments.length > 0) {
      const matchedDept = departments.find(d => d.slug === hash);
      if (matchedDept) {
        setActiveDeptId(matchedDept._id);
        window.scrollTo(0, 0);
      }
    }
  }, [location, departments]);

  // Clean title/string for comparison
  const cleanStr = (str) => {
    if (!str) return '';
    return str.toLowerCase().replace(' department', '').replace('s', '').trim();
  };

  // Map doctors to departments dynamically
  const deptDataMapped = useMemo(() => {
    return departments.map(dept => {
      const deptClean = cleanStr(dept.title);
      const matchedDocs = doctors.filter(doc => {
        const docDeptClean = cleanStr(doc.department);
        return (
          docDeptClean === deptClean ||
          docDeptClean === dept.slug ||
          docDeptClean.includes(deptClean) ||
          deptClean.includes(docDeptClean)
        );
      });

      return {
        ...dept,
        doctors: matchedDocs
      };
    });
  }, [departments, doctors]);

  // Filtered departments based on search query
  const filteredDepartments = useMemo(() => {
    return deptDataMapped.filter(dept => {
      const matchesSearch = 
        dept.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.doctors.some(doc => doc.name.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });
  }, [deptDataMapped, searchTerm]);

  // Handle active department change
  const handleDeptChange = (deptId) => {
    setActiveDeptId(deptId);
  };

  // Find currently active department
  const currentDept = useMemo(() => {
    return filteredDepartments.find(d => d._id === activeDeptId) || filteredDepartments[0] || null;
  }, [filteredDepartments, activeDeptId]);

  // Auto-select first filtered department if the active one is filtered out
  useEffect(() => {
    if (filteredDepartments.length > 0 && !filteredDepartments.some(d => d._id === activeDeptId)) {
      setActiveDeptId(filteredDepartments[0]._id);
    }
  }, [filteredDepartments, activeDeptId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4" style={{ padding: '80px 20px' }}>
        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-semibold text-lg">Loading departments & medical roster...</p>
      </div>
    );
  }

  return (
    <section className="department-section">
      <div className="department-container">
        {/* LEFT SIDE */}
        <aside className="department-list">
          {/* SEARCH BAR */}
          <div className="dept-search-wrapper">
            <Search className="dept-search-icon" />
            <input
              type="text"
              placeholder="Search departments or doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="dept-search-input"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="dept-search-clear"
              >
                &times;
              </button>
            )}
          </div>

          {/* MOBILE DROPDOWN */}
          {filteredDepartments.length > 0 && (
            <select 
              className="dept-dropdown" 
              value={activeDeptId} 
              onChange={(e) => handleDeptChange(e.target.value)}
            >
              {filteredDepartments.map(dept => (
                <option key={dept._id} value={dept._id}>
                  {dept.title.replace(' Department', '')}
                </option>
              ))}
            </select>
          )}

          {/* DESKTOP BUTTONS */}
          <div className="dept-buttons">
            {filteredDepartments.map(dept => (
              <button 
                key={dept._id}
                className={`dept-btn ${activeDeptId === dept._id ? 'active' : ''}`}
                onClick={() => handleDeptChange(dept._id)}
              >
                {dept.title.replace(' Department', '')}
              </button>
            ))}
            {filteredDepartments.length === 0 && (
              <div className="dept-no-match-sidebar">No departments match.</div>
            )}
          </div>
        </aside>

        {/* RIGHT SIDE */}
        <div className="department-content">
          {filteredDepartments.length > 0 && currentDept ? (
            <div className="dept-panel active">
              <div className="dept-top">
                <div className="dept-text">
                  <h2>{currentDept.title}</h2>
                  <p>{currentDept.description}</p>
                  {currentDept.extra && <p>{currentDept.extra}</p>}
                  {currentDept.points && currentDept.points.length > 0 && (
                    <ul className="dept-points">
                      {currentDept.points.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="dept-images">
                  <img 
                    src={currentDept.image.startsWith('/uploads/') ? `${API_BASE_URL}${currentDept.image}` : currentDept.image} 
                    alt={currentDept.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://fch.com.np/wp-content/uploads/2026/02/anaesthesia1.jpg";
                    }}
                  />
                </div>
              </div>

              <div className="dept-doctors">
                <h3>Available Specialists</h3>
                {currentDept.doctors && currentDept.doctors.length > 0 ? (
                  <div className="doctor-grid">
                    {currentDept.doctors.map((doc) => {
                      const docImg = doc.image 
                        ? (doc.image.startsWith('/uploads/') ? `${API_BASE_URL}${doc.image}` : doc.image)
                        : "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg";
                      
                      return (
                        <div className="doctor-card" key={doc._id}>
                          <img 
                            src={docImg} 
                            alt={doc.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg";
                            }}
                          />
                          <h4>{doc.name}</h4>
                          <span>{doc.qualification || doc.position}</span>
                          <button 
                            className="book-btn w-full text-center border-0 cursor-pointer" 
                            onClick={() => {
                              if (user) {
                                navigate(`/patient/dashboard?tab=book&deptName=${currentDept.title}&docId=${doc._id}`);
                              } else {
                                navigate('/register');
                              }
                            }}
                          >
                            Book Appointment
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-slate-500 font-medium py-4">
                    No doctors currently registered under this department.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="dept-no-results-panel">
              <Info className="no-results-icon" />
              <h3>No Departments Found</h3>
              <p>We couldn't find any departments or doctors matching "{searchTerm}". Please try a different search query.</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="dept-reset-btn"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DepartmentsPage;
