import React from 'react';
import './Departments.css';

const Departments = () => {
  const departments = [
    { name: 'Anesthesia', link: '/departments#anesthesia' },
    { name: 'Cardiology', link: '/departments#cardiology' },
    { name: 'Dental', link: '/departments#dental' },
    { name: 'Dermatology', link: '/departments#dermatology' },
    { name: 'ENT', link: '/departments#ent' },
    { name: 'Gastrology', link: '/departments#gastro' },
    { name: 'General Surgery', link: '/departments#surgery' },
    { name: 'Gynecology', link: '/departments#gynecology' },
    { name: 'Internal Medicine', link: '/departments#medicine' },
    { name: 'Neurosurgery', link: '/departments#neuro' },
    { name: 'Orthopedic', link: '/departments#orthopedic' },
    { name: 'Pediatric', link: '/departments#peadiatric' },
    { name: 'Urology', link: '/departments#urology' },
    { name: 'Radiology', link: '/departments#radiology' },
    { name: 'Psychiatric', link: '/departments#psychiatric' },
    { name: 'Opthalmology', link: '/departments#opthalmology' },
    { name: 'Nephorology', link: '/departments#nephrology' },
  ];

  return (
    <section className="departments-section">
      <div className="container">
        {/* Section Title */}
        <div className="section-title">
          <h1>Our Departments</h1>
          <p>Explore the wide range of specialized medical departments at best Hospital in Pokhara. Our expert teams provide top-notch care, advanced treatments, and compassionate services for every patient.</p>
        </div>

        {/* Departments Grid */}
        <div className="departments-grid">
          {departments.map((dept, index) => (
            <a key={index} href={dept.link}>
              <div className="department-card">{dept.name}</div>
            </a>
          ))}
        </div>

        <div className="services-btn-wrap">
          <a href="/departments" className="view-all-btn">View Department Details</a>
        </div>
      </div>
    </section>
  );
};

export default Departments;
