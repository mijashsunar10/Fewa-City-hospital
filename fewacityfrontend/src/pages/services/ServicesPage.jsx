import React, { useState, useMemo, useEffect } from 'react';
import { Search, Info, Calendar, Award, Shield, Check } from 'lucide-react';
import './ServicesPage.css';

const servicesData = [
  {
    title: "Laboratory",
    category: "Diagnostics",
    img: "https://fch.com.np/wp-content/uploads/2026/02/lab.jpg",
    desc: "Advanced laboratories for accurate medical testing and analysis. Supporting reliable diagnosis and patient care."
  },
  {
    title: "X-Ray",
    category: "Diagnostics",
    img: "https://fch.com.np/wp-content/uploads/2026/02/xray.jpg",
    desc: "Digital X-ray imaging for fast and precise diagnosis. Ensures safety with minimal radiation exposure."
  },
  {
    title: "Pharmacy",
    category: "General",
    img: "https://fch.com.np/wp-content/uploads/2026/02/phramacy.jpg",
    desc: "Well-organized pharmacy with essential medicines available. Ensuring safe usage and proper guidance."
  },
  {
    title: "ICU",
    category: "Critical Care",
    img: "https://fch.com.np/wp-content/uploads/2026/02/icu.avif",
    desc: "Advanced intensive care with continuous patient monitoring. Managed by skilled critical care professionals."
  },
  {
    title: "Video Colonoscopy",
    category: "Diagnostics",
    img: "https://fch.com.np/wp-content/uploads/2026/02/colonsocopy.avif",
    desc: "Camera-based examination of the large intestine. Helps in early detection of colorectal conditions."
  },
  {
    title: "Ultrasonography",
    category: "Diagnostics",
    img: "https://fch.com.np/wp-content/uploads/2026/02/ultrasonography.jpeg",
    desc: "Safe imaging using sound waves for diagnosis. Commonly used for organs and pregnancy assessment."
  },
  {
    title: "Laparoscopy",
    category: "Specialized Treatment",
    img: "https://fch.com.np/wp-content/uploads/2026/02/Blausen_0602_Laparoscopy_02.png",
    desc: "Minimally invasive surgical procedure using small incisions. Enables faster recovery and minimal scarring."
  },
  {
    title: "Arthroscopy",
    category: "Specialized Treatment",
    img: "https://fch.com.np/wp-content/uploads/2026/02/arthoscopy.jpg",
    desc: "Joint surgery using a small camera for precision. Improves mobility with quicker healing time."
  },
  {
    title: "CT Scan 160 Slice",
    category: "Diagnostics",
    img: "https://fch.com.np/wp-content/uploads/2026/02/ctscan.jpeg",
    desc: "High-resolution CT imaging for detailed diagnosis. Supports accurate medical evaluation and planning."
  },
  {
    title: "Video Colposcopy",
    category: "Diagnostics",
    img: "https://fch.com.np/wp-content/uploads/2026/02/coloposcopy.jpg",
    desc: "Gynecological screening of cervix and vaginal area. Helps detect abnormalities at an early stage."
  },
  {
    title: "Echocardiography",
    category: "Diagnostics",
    img: "https://fch.com.np/wp-content/uploads/2026/02/echardiography.jpg",
    desc: "Live ultrasound imaging of the heart. Assesses heart function and blood circulation."
  },
  {
    title: "NICU",
    category: "Critical Care",
    img: "https://fch.com.np/wp-content/uploads/2026/02/nicu.jpg",
    desc: "Specialized intensive care for newborn infants. Designed for premature and high-risk babies."
  },
  {
    title: "EEG",
    category: "Diagnostics",
    img: "https://fch.com.np/wp-content/uploads/2026/02/eeg.jpg",
    desc: "Non-invasive test to record brain activity. Used for diagnosing neurological disorders."
  },
  {
    title: "Video Endoscopy",
    category: "Diagnostics",
    img: "https://fch.com.np/wp-content/uploads/2026/02/endoscopy.jpeg",
    desc: "Internal organ examination using a flexible camera. Helps in diagnosis and treatment planning."
  },
  {
    title: "RIRS-HOLLET",
    category: "Specialized Treatment",
    img: "https://fch.com.np/wp-content/uploads/2026/02/rirshollet.jpg",
    desc: "Laser-based kidney stone treatment without open surgery. Ensures quicker recovery and minimal discomfort."
  },
  {
    title: "PFT",
    category: "Diagnostics",
    img: "https://fch.com.np/wp-content/uploads/2026/02/pft.webp",
    desc: "Diagnostic test to evaluate lung function. Helps detect asthma and respiratory conditions."
  },
  {
    title: "TURP / TURBT",
    category: "Specialized Treatment",
    img: "https://fch.com.np/wp-content/uploads/2026/02/turp.jpg",
    desc: "Minimally invasive urological procedures via urethra. Treats prostate enlargement and bladder tumors."
  },
  {
    title: "URS-ICPL",
    category: "Specialized Treatment",
    img: "https://fch.com.np/wp-content/uploads/2026/02/ursicpl.png",
    desc: "Endoscopic treatment for urinary stone removal. Provides effective results with minimal invasion."
  }
];

const categories = ["All", "Diagnostics", "Critical Care", "Specialized Treatment", "General"];

const ServicesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredServices = useMemo(() => {
    return servicesData.filter(service => {
      const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            service.desc.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleInquiryLink = (service) => {
    const text = encodeURIComponent(`Hello, I would like to inquire about the ${service.title} service at Fewa City Hospital.`);
    return `https://wa.me/9779765940555?text=${text}`;
  };

  return (
    <div className="services-page-wrapper">
      {/* HERO BANNER */}
      <div className="services-hero-banner">
        <div className="services-banner-overlay"></div>
        <div className="services-hero-content">
          <span className="services-hero-subtitle">Fewa City Hospital Pvt. Ltd.</span>
          <h1 className="services-hero-title">24/7 Hospital Services in Pokhara</h1>
          <p className="services-hero-desc">
            We provide state-of-the-art diagnostic imaging, specialized surgeries, and critical care units staffed round the clock.
          </p>
          <div className="services-hero-badges">
            <div className="hero-badge-item">
              <Award className="badge-icon" />
              <span>24 Hours Available</span>
            </div>
            <div className="hero-badge-item">
              <Shield className="badge-icon" />
              <span>Certified Equipment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="services-page-container">
        {/* CONTROLS CARD */}
        <div className="services-controls-card">
          <div className="services-search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search services (e.g. Lab, ICU, Scan...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="services-search-input"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="services-search-clear"
              >
                &times;
              </button>
            )}
          </div>

          <div className="services-filter-label">Filter by Service Category:</div>
          <div className="services-filters-scroll">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS SUMMARY */}
        <div className="results-summary">
          {filteredServices.length > 0 ? (
            <p>Showing <strong>{filteredServices.length}</strong> medical services</p>
          ) : (
            <p className="no-results-text">No services match your search.</p>
          )}
        </div>

        {/* SERVICES GRID */}
        {filteredServices.length > 0 ? (
          <div className="services-cards-grid">
            {filteredServices.map((service, index) => (
              <div key={index} className="service-item-card">
                <div className="service-card-top-accent"></div>
                <div className="service-card-image-wrapper">
                  <img
                    src={service.img}
                    alt={service.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://fch.com.np/wp-content/uploads/2026/02/lab.jpg";
                    }}
                  />
                  <div className="service-category-tag">{service.category}</div>
                </div>

                <div className="service-card-content">
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                  
                  <div className="service-card-actions">
                    <a
                      href={handleInquiryLink(service)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="service-inquiry-btn"
                    >
                      <Calendar className="btn-icon" />
                      Book / Inquire Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="services-no-results-card">
            <Info className="no-results-icon" />
            <h3>No Services Found</h3>
            <p>We couldn't find any services matching your filters. Please try searching something else or reset the filters below.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="services-reset-btn"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
