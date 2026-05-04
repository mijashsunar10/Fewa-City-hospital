import React, { useState } from 'react';
import './EmergencyContact.css';

const EmergencyContact = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('emergency-overlay')) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* ================= EMERGENCY FLOAT BUTTON ================= */}
      <div className="emergency-float" id="emergencyBtn" onClick={togglePopup}>
        <img src="https://fch.com.np/wp-content/uploads/2026/02/emergency.png" alt="Emergency" />
      </div>

      {/* ================= BOOK APPOINTMENT BUTTON ================= */}
      <a 
        href="https://wa.me/9779765940555?text=Hello%20I%20want%20to%20book%20an%20appointment"
        target="_blank"
        rel="noopener noreferrer"
        className="appointment-float"
        title="Book Appointment on WhatsApp"
      >
        📅
      </a>

      {/* ================= EMERGENCY POPUP ================= */}
      <div 
        className={`emergency-overlay ${isOpen ? 'active' : ''}`} 
        id="emergencyPopup"
        onClick={handleOverlayClick}
      >
        <div className="emergency-box">
          {/* Siren */}
          <div className="popup-siren">
            <img src="https://fch.com.np/wp-content/uploads/2026/02/emergency.png" alt="Emergency" />
          </div>

          <h2>Emergency</h2>

          <div className="emergency-grid">
            <div className="emergency-item">
              <span>Enquiry No</span>
              <a href="tel:061582686">061582686</a>
            </div>

            <div className="emergency-item">
              <span>🚑 Ambulance No.</span>
              <a href="tel:9842285269">9842285269</a>
            </div>

            <div className="emergency-item">
              <span>🏥 Office.</span>
              <a href="tel:061575260">061-575260</a>
            </div>

            <div className="emergency-item">
              <span>⚠ Emergency No.</span>
              <a href="tel:061588193">061588193</a>
            </div>
          </div>

          {/* Close Button */}
          <button className="close-btn" id="closeEmergency" onClick={() => setIsOpen(false)}>×</button>
        </div>
      </div>
    </>
  );
};

export default EmergencyContact;
