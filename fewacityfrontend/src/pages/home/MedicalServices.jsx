import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './MedicalServices.css';

const MedicalServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/services');
        // Get the first 4 services for homepage display
        setServices(response.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching homepage services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section className="features-outer" id="services-section">
      <div className="features-inner">
        <h2>Our Medical Services</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
            <p>Loading medical services...</p>
          </div>
        ) : (
          <div className="features-grid">
            {services.map((service) => (
              <div key={service._id} className="feature-card">
                <div className="icon">
                  <img 
                    src={service.image.startsWith('/uploads/') ? `http://localhost:5000${service.image}` : service.image} 
                    alt={service.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://fch.com.np/wp-content/uploads/2026/02/lab.jpg";
                    }}
                  />
                </div>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
              </div>
            ))}
          </div>
        )}

        <div className="services-btn-wrap">
          <Link to="/services" className="view-all-btn">View All Services</Link>
        </div>
      </div>
    </section>
  );
};

export default MedicalServices;
