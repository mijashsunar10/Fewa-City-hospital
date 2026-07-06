import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, Calendar, Stethoscope, Heart, ShieldAlert, Award, Phone } from 'lucide-react';
import axios from 'axios';
import './DoctorsPage.css';
import API_BASE_URL from '../../config/api';
import useSEO from '../../hooks/useSEO';
import { Skeleton, DoctorSkeleton } from '../../components/Skeleton';

const departments = [
  "All",
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

const DoctorsPage = () => {
  useSEO(
    'Specialist Doctors',
    'Meet the expert specialist doctors at Fewa City Hospital Pokhara. View schedules, qualifications, and book doctor appointments online.',
    'doctors Pokhara, medical specialists, hospital doctors, book doctor Pokhara'
  );

  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const displayDepartments = departmentsList.length > 0 ? departmentsList : departments;

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        setLoading(true);
        const [docRes, deptRes] = await Promise.all([
          axios.get(API_BASE_URL + '/api/doctors'),
          axios.get(API_BASE_URL + '/api/departments')
        ]);
        setDoctors(docRes.data);
        const names = deptRes.data.map(d => d.title.replace(' Department', ''));
        setDepartmentsList(["All", ...names]);
      } catch (err) {
        console.error('Failed to load live doctors or departments list:', err);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      const docName = doctor.name || '';
      const docPosition = doctor.qualification || doctor.position || '';
      const docDept = doctor.department?.title?.replace(' Department', '') || doctor.department || '';

      const matchesSearch = docName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            docPosition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            docDept.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDept = selectedDept === 'All' || docDept.toLowerCase() === selectedDept.toLowerCase();

      return matchesSearch && matchesDept;
    });
  }, [doctors, searchTerm, selectedDept]);

  return (
    <section className="doctors-page-section">
      {/* HERO BANNER */}
      <div className="doctors-hero-banner">
        <div className="doctors-banner-overlay"></div>
        <div className="doctors-hero-content">
          <span className="doctors-hero-subtitle">FEWA CITY HOSPITAL Pvt. Ltd.</span>
          <h1 className="doctors-hero-title">Specialist Doctors in Pokhara</h1>
          <p className="doctors-hero-desc">
            Meet our dedicated team of experienced medical professionals providing advanced care with compassion, technology, and excellence.
          </p>
          <div className="doctors-hero-badges">
            <div className="hero-badge-item">
              <Award className="badge-icon" />
              <span>35+ Specialists</span>
            </div>
            <div className="hero-badge-item">
              <Stethoscope className="badge-icon" />
              <span>24/7 Expert Care</span>
            </div>
            <div className="hero-badge-item">
              <Heart className="badge-icon" />
              <span>Compassionate Care</span>
            </div>
          </div>
        </div>
      </div>

      <div className="doctors-page-container">
        {/* SEARCH & FILTER CONTROLS */}
        <div className="doctors-controls-card">
          <div className="doctors-search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search doctors by name, specialty, or qualification..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="doctors-search-input"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="doctors-search-clear"
                aria-label="Clear search"
              >
                &times;
              </button>
            )}
          </div>

          <div className="doctors-filter-label">Filter by Specialization:</div>
          <div className="doctors-filters-scroll">
            {displayDepartments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`filter-pill ${selectedDept === dept ? 'active' : ''}`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS SUMMARY */}
        <div className="results-summary">
          {loading ? (
            <Skeleton height="20px" width="180px" />
          ) : filteredDoctors.length > 0 ? (
            <p>Showing <strong>{filteredDoctors.length}</strong> medical specialists</p>
          ) : (
            <p className="no-results-text">No doctors match your query.</p>
          )}
        </div>

        {/* TEAM GRID */}
        {loading ? (
          <DoctorSkeleton count={6} />
        ) : filteredDoctors.length > 0 ? (
          <div className="doctors-cards-grid">
            {filteredDoctors.map((doctor, index) => {
              const docImg = doctor.image 
                ? (doctor.image.startsWith('/uploads/') ? `${API_BASE_URL}${doctor.image}` : doctor.image)
                : doctor.img;
              
              const docPosition = doctor.qualification || doctor.position;
              const docDept = doctor.department?.title?.replace(' Department', '') || doctor.department || '';

              return (
                <div key={doctor._id || index} className="doctor-item-card">
                  <div className="doctor-card-img-wrapper">
                    <img
                      src={docImg}
                      alt={`${doctor.name} - ${docPosition}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg";
                      }}
                    />
                    <div className="doctor-dept-tag">{docDept}</div>
                  </div>
                  <div className="doctor-card-details">
                    <h3>{doctor.name}</h3>
                    <span className="doctor-position-text">{docPosition}</span>
                    <div className="doctor-divider"></div>
                    
                    <div className="doctor-actions">
                      <button
                        onClick={() => {
                          if (user) {
                            navigate(`/patient/dashboard?tab=book&deptName=${docDept}&docId=${doctor._id}`);
                          } else {
                            navigate('/register');
                          }
                        }}
                        className="doctor-book-whatsapp-btn w-full justify-center border-0 cursor-pointer"
                      >
                        <Calendar className="btn-icon" />
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="doctors-no-results-card">
            <ShieldAlert className="no-results-icon" />
            <h3>No Specialists Found</h3>git push origin main
[main 2a65b52] fix: integrate dynamic SEO hook across all main website pages
 7 files changed, 49 insertions(+)
Enumerating objects: 35, done.
Counting objects: 100% (35/35), done.
Delta compression using up to 8 threads
Compressing objects: 100% (18/18), done.
Writing objects: 100% (18/18), 2.92 KiB | 2.92 MiB/s, done.
Total 18 (delta 13), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (13/13), completed with 13 local objects.
            <p>We couldn't find any specialist matching your search. Please check the spelling or try selecting another department filter.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDept('All');
              }}
              className="doctors-reset-btn"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default DoctorsPage;
