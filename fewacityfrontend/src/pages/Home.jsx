import React from 'react';
import './Home.css';
import landingImg from '../assets/landing/landing.png';
import aboutImg from '../assets/landing/about.png';

const Home = () => {
  return (
    <div className="home-page">
      <section className="landing-hero">
        {/* Video Background */}
        <video 
          className="landing-video" 
          autoPlay 
          muted 
          loop 
          playsInline
          poster={landingImg}
        >
          <source src="http://sunilghartimire.com.np/wp-content/uploads/2026/01/fewa-city-drone-.mp4" type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="landing-overlay"></div>

        {/* Content */}
        <div className="landing-content">
          {/* Experience */}
          <div className="experience-badge">
            <i className="fa-solid fa-award"></i>
            <span>25+ Years of Trusted Healthcare</span>
          </div>

          <h1 style={{ color: 'white' }}>
            Best Hospital in <span>Pokhara</span>
          </h1>

          <p>
            We Are a leading Best Hospital in Pokhara Providing 24/7 Emergency Services, ICU Care, Advanced Diagnostics, And Specialized Treatments With Experienced Doctors And Modern Technology.
          </p>

          <div className="hero-actions">
            <a href="#appointment" className="landing-btn primary">Book Appointment</a>
            <a href="#services" className="landing-btn secondary">Our Services</a>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="alka-hero">
        <div className="alka-wrap">
          {/* LEFT IMAGE */}
          <div className="alka-image">
            <img src={aboutImg} alt="Best Hospital in Pokhara" />
          </div>

          {/* RIGHT CONTENT */}
          <div className="alka-content">
            <span className="tag">Fewa City Hospital</span>
            <h1> Why Choose Fewa City Hospital?</h1>

            <div className="heartbeat">
              <i className="fa-solid fa-heart-pulse"></i>
            </div>

            <p>
              Welcome to Fewa City Hospital, established in 2057 B.S with a mission to
              deliver quality healthcare services at affordable rates. Located in
              Gandaki Province, we Provide Affordable Treatment And Emergency Support 24/7.
            </p>

            <a href="#about" className="btn">More About Us</a>
          </div>
        </div>
      </section>
      
      {/* You can add more sections here */}
    </div>
  );
};

export default Home;
