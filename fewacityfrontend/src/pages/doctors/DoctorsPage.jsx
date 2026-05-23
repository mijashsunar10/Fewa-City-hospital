import React, { useState, useMemo, useEffect } from 'react';
import { Search, Calendar, Stethoscope, Heart, ShieldAlert, Award, Phone } from 'lucide-react';
import axios from 'axios';
import './DoctorsPage.css';

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
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/doctors');
        setDoctors(res.data);
      } catch (err) {
        console.error('Failed to load live doctors list:', err);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      const docName = doctor.name || '';
      const docPosition = doctor.qualification || doctor.position || '';
      const docDept = doctor.department || '';

      const matchesSearch = docName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            docPosition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            docDept.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDept = selectedDept === 'All' || docDept === selectedDept;

      return matchesSearch && matchesDept;
    });
  }, [doctors, searchTerm, selectedDept]);

  const handleWhatsAppLink = (doctor) => {
    const docPosition = doctor.qualification || doctor.position || '';
    const phone = doctor.phone || '9765940555';
    const text = encodeURIComponent(`Hello, I would like to book an appointment with ${doctor.name} (${docPosition}) at Fewa City Hospital.`);
    return `https://wa.me/977${phone}?text=${text}`;
  };

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
            {departments.map((dept) => (
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
            <div className="flex items-center gap-3 text-slate-500 font-medium">
              <div className="w-5 h-5 border-2 border-slate-300 border-t-emerald-600 rounded-full animate-spin"></div>
              <span>Fetching medical specialists...</span>
            </div>
          ) : filteredDoctors.length > 0 ? (
            <p>Showing <strong>{filteredDoctors.length}</strong> medical specialists</p>
          ) : (
            <p className="no-results-text">No doctors match your query.</p>
          )}
        </div>

        {/* TEAM GRID */}
        {!loading && filteredDoctors.length > 0 ? (
          <div className="doctors-cards-grid">
            {filteredDoctors.map((doctor, index) => {
              const docImg = doctor.image 
                ? (doctor.image.startsWith('/uploads/') ? `http://localhost:5000${doctor.image}` : doctor.image)
                : doctor.img;
              
              const docPosition = doctor.qualification || doctor.position;

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
                    <div className="doctor-dept-tag">{doctor.department}</div>
                  </div>
                  <div className="doctor-card-details">
                    <h3>{doctor.name}</h3>
                    <span className="doctor-position-text">{docPosition}</span>
                    <div className="doctor-divider"></div>
                    
                    <div className="doctor-actions">
                      <a
                        href={handleWhatsAppLink(doctor)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="doctor-book-whatsapp-btn"
                      >
                        <Calendar className="btn-icon" />
                        Book Appointment
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : !loading ? (
          <div className="doctors-no-results-card">
            <ShieldAlert className="no-results-icon" />
            <h3>No Specialists Found</h3>
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
        ) : null}
      </div>
    </section>
  );
};

export default DoctorsPage;
