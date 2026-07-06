import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Info, Calendar, Award, Shield, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './ServicesPage.css';
import API_BASE_URL from '../../config/api';
import useSEO from '../../hooks/useSEO';
import { Skeleton, ServiceSkeleton } from '../../components/Skeleton';

const categories = ["All", "Diagnostics", "Critical Care", "Specialized Treatment", "General"];

const ServicesPage = () => {
  useSEO(
    'Hospital Services',
    'Explore the medical and clinical services offered at Fewa City Hospital Pokhara, including 24/7 emergency care, ICU, pathology lab, and surgical specialties.',
    'clinical services, emergency care Pokhara, ICU, pathology lab Pokhara, surgery Pokhara'
  );

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_BASE_URL + '/api/services');
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching clinical services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            service.desc.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, selectedCategory]);

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
          {loading ? (
            <Skeleton height="20px" width="160px" />
          ) : filteredServices.length > 0 ? (
            <p>Showing <strong>{filteredServices.length}</strong> medical services</p>
          ) : (
            <p className="no-results-text">No services match your search.</p>
          )}
        </div>

        {/* SERVICES GRID */}
        {loading ? (
          <ServiceSkeleton count={6} />
        ) : filteredServices.length > 0 ? (
          <div className="services-cards-grid">
            {filteredServices.map((service) => (
              <div key={service._id} className="service-item-card">
                <div className="service-card-top-accent"></div>
                <div className="service-card-image-wrapper">
                  <img
                    src={service.image.startsWith('/uploads/') ? `${API_BASE_URL}${service.image}` : service.image}
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
                    <button
                      onClick={() => {
                        if (user) {
                          navigate('/patient/dashboard?tab=book');
                        } else {
                          navigate('/register');
                        }
                      }}
                      className="service-inquiry-btn border-0 cursor-pointer w-full"
                    >
                      <Calendar className="btn-icon" />
                      Book / Inquire Now
                    </button>
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
