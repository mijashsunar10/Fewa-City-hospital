import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import './DoctorsSection.css';

const featuredDoctors = [
  {
    name: "Dr. Bhoj Raj Neupane",
    position: "MBBS, MS - General Surgeon",
    img: "https://fch.com.np/wp-content/uploads/2026/04/Untitled-design-30.png",
    waLink: "https://wa.me/9779765940555?text=Hello%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Bhoj%20Raj%20Neupane%20(General%20Surgeon)%20at%20Fewa%20City%20Hospital."
  },
  {
    name: "Dr. Chandika Pandit",
    position: "MBBS, MS, DCH - Gynecologist",
    img: "https://fch.com.np/wp-content/uploads/2026/05/DSC03160.jpg",
    waLink: "https://wa.me/9779765940555?text=Hello%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Chandika%20Pandit%20(Gynecologist)%20at%20Fewa%20City%20Hospital."
  },
  {
    name: "Dr. Suresh Thapa",
    position: "MBBS, MD, DM - Gastroenterologist",
    img: "https://fch.com.np/wp-content/uploads/2026/04/Untitled-design-26.png",
    waLink: "https://wa.me/9779765940555?text=Hello%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Suresh%20Thapa%20(Gastroenterologist)%20at%20Fewa%20City%20Hospital."
  },
  {
    name: "Dr. Rohini Sigdel",
    position: "MBBS, MS - Anesthetist",
    img: "https://fch.com.np/wp-content/uploads/2026/02/RohinSigdel.jpg",
    waLink: "https://wa.me/9779765940555?text=Hello%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Rohini%20Sigdel%20(Anesthetist)%20at%20Fewa%20City%20Hospital."
  }
];

const DoctorsSection = () => {
  return (
    <section className="home-doctors-section">
      <div className="container">
        {/* SECTION TITLE */}
        <div className="section-title">
          <h1>Specialist Doctors In Pokhara</h1>
          <p>Meet our dedicated professionals and specialist doctors at Fewa City Hospital. Our team provides expert care, combining experience and compassion to ensure the best health outcomes for our patients.</p>
        </div>

        {/* TEAM GRID */}
        <div className="home-doctors-grid">
          {featuredDoctors.map((doc, idx) => (
            <div className="home-doctor-card" key={idx}>
              <div className="home-doctor-img-wrapper">
                <img src={doc.img} alt={doc.name} />
              </div>
              <div className="home-doctor-info">
                <h3>{doc.name}</h3>
                <span className="position">{doc.position}</span>
                <div className="home-doctor-actions">
                  <a 
                    href={doc.waLink} 
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
          ))}
        </div>

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
