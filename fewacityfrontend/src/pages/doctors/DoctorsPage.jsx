import React, { useState, useMemo, useEffect } from 'react';
import { Search, Calendar, Stethoscope, Heart, ShieldAlert, Award, Phone } from 'lucide-react';
import './DoctorsPage.css';

const doctorsData = [
  {
    name: "Dr. Bhoj Raj Neupane",
    position: "MBBS, MS - General Surgeon",
    department: "Surgery",
    img: "https://fch.com.np/wp-content/uploads/2026/04/Untitled-design-30.png",
  },
  {
    name: "Dr. Chandika Pandit",
    position: "MBBS, MS, DCH - Gynecologist",
    department: "Gynecology",
    img: "https://fch.com.np/wp-content/uploads/2026/05/DSC03160.jpg",
  },
  {
    name: "Dr. Suresh Thapa",
    position: "MBBS, MD, DM - Gastroenterologist",
    department: "Gastroenterology",
    img: "https://fch.com.np/wp-content/uploads/2026/04/Untitled-design-26.png",
  },
  {
    name: "Dr. Rohini Sigdel",
    position: "MBBS, MS - Anesthetist",
    department: "Anesthesia",
    img: "https://fch.com.np/wp-content/uploads/2026/02/RohinSigdel.jpg",
  },
  {
    name: "Dr. Krishna Bahadur Thapa",
    position: "MBBS, MD – Consultant (Internal Medicine)",
    department: "Internal Medicine",
    img: "https://fch.com.np/wp-content/uploads/2026/04/Krishna-bdr-thapa.png",
  },
  {
    name: "Dr. Sureshraj Paudel",
    position: "MBBS, MS – General Surgeon",
    department: "Surgery",
    img: "https://fch.com.np/wp-content/uploads/2026/04/Untitled-design-28.png",
  },
  {
    name: "Dr. Rabeendra Prasad Shrestha",
    position: "MBBS, MS – Orthopedic Surgeon",
    department: "Orthopedics",
    img: "https://fch.com.np/wp-content/uploads/2026/04/Rabindra-psd-shrestha.png",
  },
  {
    name: "Dr. Dinesh Kumar BK",
    position: "MBBS, MS – (Ortho) Trauma & Joint Replacement Surgeon",
    department: "Orthopedics",
    img: "https://fch.com.np/wp-content/uploads/2026/04/dinesh-kumar-bk.png",
  },
  {
    name: "Dr. Rabimohan Dhakal",
    position: "MBBS, MS – (Ortho) Trauma, Sport Injury & Arthroscopy Surgeon",
    department: "Orthopedics",
    img: "https://fch.com.np/wp-content/uploads/2026/04/rabi-mohan-dhakal.png",
  },
  {
    name: "Dr. Hum Prasad Neupane",
    position: "MBBS, DCH – Pediatrician",
    department: "Pediatrics",
    img: "https://fch.com.np/wp-content/uploads/2026/04/hum-psd-neupane.png",
  },
  {
    name: "Dr. Amrita Ghimire",
    position: "MBBS, MD – Pediatrician",
    department: "Pediatrics",
    img: "https://fch.com.np/wp-content/uploads/2026/04/2.png",
  },
  {
    name: "Dr. Dhurba Bahadur Adhikari",
    position: "MBBS, MS – Urologist",
    department: "Urology",
    img: "https://fch.com.np/wp-content/uploads/2026/04/Dhurba-bdr-adhikari.png",
  },
  {
    name: "Dr. Jeevan Thapa",
    position: "MBBS, MD, DM – Gastroenterologist",
    department: "Gastroenterology",
    img: "https://fch.com.np/wp-content/uploads/2026/04/jiwan-thapa.png",
  },
  {
    name: "Dr. Ananda Bahadur Shrestha",
    position: "MBBS, DMRD – Radiologist",
    department: "Radiology",
    img: "https://fch.com.np/wp-content/uploads/2026/04/1.png",
  },
  {
    name: "Dr. Donjan Bahadur Lamechhine",
    position: "MBBS, MS – ENT",
    department: "ENT",
    img: "https://fch.com.np/wp-content/uploads/2026/04/Donjan-bdr-lamichhane.png",
  },
  {
    name: "Dr. Bonu Gaudel",
    position: "MBBS, MS – ENT",
    department: "ENT",
    img: "https://fch.com.np/wp-content/uploads/2026/04/Bunu-gaudel.png",
  },
  {
    name: "Dr. Jaya Bahadur Khatri",
    position: "MBBS, MD – Psychiatrist",
    department: "Psychiatry",
    img: "https://fch.com.np/wp-content/uploads/2026/04/Jay-bdr-khatri.png",
  },
  {
    name: "Dr. Renu Poudel",
    position: "MBBS, MD – Ophthalmologist",
    department: "Ophthalmology",
    img: "https://fch.com.np/wp-content/uploads/2026/04/renu-poudel.png",
  },
  {
    name: "Dr. Rishna Malla",
    position: "MBBS, MD – Dermatologist",
    department: "Dermatology",
    img: "https://fch.com.np/wp-content/uploads/2026/04/Untitled-design-27.png",
  },
  {
    name: "Dr. Rajan Kumar Sharma",
    position: "MBBS, MD – Neurosurgeon",
    department: "Neurosurgery",
    img: "https://fch.com.np/wp-content/uploads/2026/04/rajan-kumar-sharma.png",
  },
  {
    name: "Dr. Arun Kadel",
    position: "MBBS, MD, DM – Cardiologist",
    department: "Cardiology",
    img: "https://fch.com.np/wp-content/uploads/2026/04/Arun-kandel.png",
  },
  {
    name: "Dr. Bijaya Bhahadur Pradhan",
    position: "Physiotherapist",
    department: "Physiotherapy",
    img: "https://fch.com.np/wp-content/uploads/2026/04/bijay-bdr-pradhan.png",
  },
  {
    name: "Harishchandra Joshi",
    position: "Physiotherapist",
    department: "Physiotherapy",
    img: "https://fch.com.np/wp-content/uploads/2026/04/Harischandra-joshi.png",
  },
  {
    name: "Dr. Niva Shrestha",
    position: "BDS – Dental Surgeon",
    department: "Dental",
    img: "https://fch.com.np/wp-content/uploads/2026/05/NIVASHRESTHA.jpg",
  },
  {
    name: "Dr. Padmaraj Dhungana",
    position: "MBBS, MS – Gynecologist",
    department: "Gynecology",
    img: "https://fch.com.np/wp-content/uploads/2026/05/DSC03168.jpg",
  },
  {
    name: "Dr. Anup Chapagain",
    position: "MBBS, MS, MCH – Urologist",
    department: "Urology",
    img: "https://fch.com.np/wp-content/uploads/2026/05/DSC03153-1.jpg",
  },
  {
    name: "Dr. Madan Thapa",
    position: "MBBS, MD – Radiologist",
    department: "Radiology",
    img: "https://fch.com.np/wp-content/uploads/2026/05/MADANTHAPA.jpg",
  },
  {
    name: "Dr. Buddhi Bahadur Thapa",
    position: "MBBS, MD – Senior Consultant (Internal Medicine)",
    department: "Internal Medicine",
    img: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg",
  },
  {
    name: "Dr. Hari Krishna Bhandari",
    position: "MBBS, MD – Consultant Physician",
    department: "Internal Medicine",
    img: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg",
  },
  {
    name: "Dr. Tumaya Ghale",
    position: "MBBS, MS – Anesthesia",
    department: "Anesthesia",
    img: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg",
  },
  {
    name: "Dr. Susmit Kafle",
    position: "MBBS, MD – Radiologist",
    department: "Radiology",
    img: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg",
  },
  {
    name: "Dr. Krishna Prasad Koirala",
    position: "MBBS, MS – ENT",
    department: "ENT",
    img: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg",
  },
  {
    name: "Dr. Tulika Dube",
    position: "MBBS, MS – ENT",
    department: "ENT",
    img: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg",
  },
  {
    name: "Dr. Anjita Hirachan",
    position: "MBBS, MD – Ophthalmologist",
    department: "Ophthalmology",
    img: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg",
  },
  {
    name: "Dr. Saurav Aryal",
    position: "MBBS, MD – Dermatologist",
    department: "Dermatology",
    img: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg",
  },
  {
    name: "Dr. Madhu Roka",
    position: "MBBS, MD, DM – Cardiologist",
    department: "Cardiology",
    img: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg",
  },
  {
    name: "Dr. Bikash Khatri",
    position: "MBBS, MD, DM – Nephrologist",
    department: "Nephrology",
    img: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg",
  },
  {
    name: "Dr. Deependra Man Simang Gainda",
    position: "Oncologist",
    department: "Oncology",
    img: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg",
  }
];

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredDoctors = useMemo(() => {
    return doctorsData.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            doctor.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            doctor.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDept = selectedDept === 'All' || doctor.department === selectedDept;

      return matchesSearch && matchesDept;
    });
  }, [searchTerm, selectedDept]);

  const handleWhatsAppLink = (doctor) => {
    const text = encodeURIComponent(`Hello, I would like to book an appointment with ${doctor.name} (${doctor.position}) at Fewa City Hospital.`);
    return `https://wa.me/9779765940555?text=${text}`;
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
          {filteredDoctors.length > 0 ? (
            <p>Showing <strong>{filteredDoctors.length}</strong> medical specialists</p>
          ) : (
            <p className="no-results-text">No doctors match your query.</p>
          )}
        </div>

        {/* TEAM GRID */}
        {filteredDoctors.length > 0 ? (
          <div className="doctors-cards-grid">
            {filteredDoctors.map((doctor, index) => (
              <div key={index} className="doctor-item-card">
                <div className="doctor-card-img-wrapper">
                  <img
                    src={doctor.img}
                    alt={`${doctor.name} - ${doctor.position}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg";
                    }}
                  />
                  <div className="doctor-dept-tag">{doctor.department}</div>
                </div>
                <div className="doctor-card-details">
                  <h3>{doctor.name}</h3>
                  <span className="doctor-position-text">{doctor.position}</span>
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
            ))}
          </div>
        ) : (
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
        )}
      </div>
    </section>
  );
};

export default DoctorsPage;
