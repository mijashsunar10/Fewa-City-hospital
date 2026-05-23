import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import axios from 'axios';
import './DoctorsSection.css';

const DoctorsSection = () => {
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/doctors');
        // Sort/filter to display first 4 doctors
        setFeaturedDoctors(res.data.slice(0, 4));
      } catch (err) {
        console.error('Failed to load featured doctors:', err);
        setFeaturedDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="home-doctors-section">
      <div className="container">
        {/* SECTION TITLE */}
        <div className="section-title">
          <h1>Specialist Doctors In Pokhara</h1>
          <p>Meet our dedicated professionals and specialist doctors at Fewa City Hospital. Our team provides expert care, combining experience and compassion to ensure the best health outcomes for our patients.</p>
        </div>

        {/* TEAM GRID */}
        {!loading && (
          <div className="home-doctors-grid">
            {featuredDoctors.map((doc, idx) => {
              const docImg = doc.image 
                ? (doc.image.startsWith('/uploads/') ? `http://localhost:5000${doc.image}` : doc.image)
                : doc.img;
              const docPosition = doc.qualification || doc.position;
              const phone = doc.phone || '9765940555';
              const waLink = `https://wa.me/977${phone}?text=${encodeURIComponent(`Hello, I would like to book an appointment with ${doc.name} (${docPosition}) at Fewa City Hospital.`)}`;

              return (
                <div className="home-doctor-card" key={doc._id || idx}>
                  <div className="home-doctor-img-wrapper">
                    <img 
                      src={docImg} 
                      alt={doc.name} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg";
                      }}
                    />
                  </div>
                  <div className="home-doctor-info">
                    <h3>{doc.name}</h3>
                    <span className="position">{docPosition}</span>
                    <div className="home-doctor-actions">
                      <a 
                        href={waLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="home-doctor-book-btn"
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
        )}

        {/* VIEW ALL TEAM BUTTON */}
        <div className="view-all-doctors-btn-wrap">
          <Link to="/doctors" className="view-doctors-btn">
            View All Doctors
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DoctorsSection;
