import React from 'react';
import './MedicalServices.css';
import labImg from '../../assets/services/lab.png';
import xrayImg from '../../assets/services/xray.png';
import pharmacyImg from '../../assets/services/medical.png';
import icuImg from '../../assets/services/icu.png'; 

const MedicalServices = () => {
  return (
    <section className="features-outer" id="services-section">
      <div className="features-inner">
        <h2>Our Medical Services</h2>

        <div className="features-grid">
          <div className="feature-card">
            <div className="icon">
              <img src={labImg} alt="Laboratory" />
            </div>
            <h3>Laboratory</h3>
            <p>Advanced laboratories for accurate medical testing and analysis. Supporting reliable diagnosis and patient care.</p>
          </div>

          <div className="feature-card">
            <div className="icon">
              <img src={xrayImg} alt="X-Ray" />
            </div>
            <h3>X-Ray</h3>
            <p>Digital X-ray imaging for fast and precise diagnosis. Ensures safety with minimal radiation exposure.</p>
          </div>

          <div className="feature-card">
            <div className="icon">
              <img src={pharmacyImg} alt="Pharmacy" />
            </div>
            <h3>Pharmacy</h3>
            <p>Well-organized pharmacy with essential medicines available. Ensuring safe usage and proper guidance.</p>
          </div>

          <div className="feature-card">
            <div className="icon">
              <img src={icuImg} alt="ICU" />
            </div>
            <h3>ICU</h3>
            <p>Advanced intensive care with continuous patient monitoring. Managed by skilled critical care professionals.</p>
          </div>
        </div>

        <div className="services-btn-wrap">
          <a href="/services" className="view-all-btn">View All Services</a>
        </div>
      </div>
    </section>
  );
};

export default MedicalServices;
