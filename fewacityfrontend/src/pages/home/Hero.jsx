import './Hero.css';
import landingImg from '../../assets/landing/landing.png';

const Hero = () => {
  return (
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
  );
};

export default Hero;
