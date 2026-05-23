import React, { useEffect } from 'react';
import { Award, BookOpen, Clock, Phone, GraduationCap, Users, Landmark, School, CheckCircle, Shield } from 'lucide-react';
import './CollegePrograms.css';

const CollegePrograms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Smooth scroll handler for anchor links
  const handleScrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="college-programs-page">
      {/* HERO BANNER */}
      <div className="college-hero-banner">
        <div className="college-banner-overlay"></div>
        <div className="college-hero-content">
          <span className="college-hero-subtitle">Fewa City Hospital Pvt. Ltd.</span>
          <h1 className="college-hero-title">Academic & College Programmes</h1>
          <p className="college-hero-desc">
            Empowering the next generation of healthcare professionals through CTEVT-affiliated, high-quality, clinical-focused medical training programs.
          </p>
          <div className="college-hero-badges">
            <div className="hero-badge-item">
              <Award className="badge-icon" />
              <span>CTEVT Affiliated</span>
            </div>
            <div className="hero-badge-item">
              <Shield className="badge-icon" />
              <span>100% Practical Exposure</span>
            </div>
          </div>
        </div>
      </div>

      {/* OVERVIEW SECTION & CARDS */}
      <section className="program-cards-section">
        <div className="college-container">
          <div className="section-title">
            <h1>Our College Programs</h1>
            <p className="section-subtitle-p">Select a specialized course below to explore details, duration, capacity, and academic structure.</p>
          </div>

          <div className="program-cards-container">
            {/* PCL NURSING CARD */}
            <a 
              href="#pcl-nursing" 
              onClick={(e) => handleScrollToSection(e, 'pcl-nursing')}
              className="program-main-card"
            >
              <div className="program-image">
                <img src="https://fch.com.np/wp-content/uploads/2026/05/pclnn.jpg" alt="PCL Nursing" />
              </div>

              <div className="program-card-top">
                <div className="program-icon">🩺</div>
                <span className="program-badge">CTEVT Affiliated</span>
              </div>

              <h2>PCL Nursing</h2>
              <p>
                The PCL Nursing program provides professional nursing education with
                strong theoretical knowledge, practical hospital training, patient care,
                and community health services.
              </p>

              <div className="program-details">
                <div>
                  <Clock className="detail-mini-icon" />
                  <strong>Duration:</strong> 3 Years
                </div>
                <div>
                  <Phone className="detail-mini-icon" />
                  <strong>Contact:</strong> 061-575247
                </div>
              </div>

              <div className="program-link">Explore Program →</div>
            </a>

            {/* HEALTH ASSISTANT CARD */}
            <a 
              href="#health-assistant" 
              onClick={(e) => handleScrollToSection(e, 'health-assistant')}
              className="program-main-card"
            >
              <div className="program-image">
                <img src="https://fch.com.np/wp-content/uploads/2026/05/jeathasistatnt.jpg" alt="Health Assistant" />
              </div>

              <div className="program-card-top">
                <div className="program-icon">💉</div>
                <span className="program-badge">CTEVT Affiliated</span>
              </div>

              <h2>Health Assistant</h2>
              <p>
                The Health Assistant program focuses on community healthcare, diagnosis,
                treatment support, preventive care, and field-based medical training
                for rural and urban health services.
              </p>

              <div className="program-details">
                <div>
                  <Clock className="detail-mini-icon" />
                  <strong>Duration:</strong> 3 Years
                </div>
                <div>
                  <Phone className="detail-mini-icon" />
                  <strong>Contact:</strong> 061-575247
                </div>
              </div>

              <div className="program-link">Explore Program →</div>
            </a>

            {/* LAB TECHNICIAN CARD */}
            <a 
              href="#lab-technician" 
              onClick={(e) => handleScrollToSection(e, 'lab-technician')}
              className="program-main-card"
            >
              <div className="program-image">
                <img src="https://fch.com.np/wp-content/uploads/2026/05/lantech.webp" alt="Lab Technician" />
              </div>

              <div className="program-card-top">
                <div className="program-icon">🧪</div>
                <span className="program-badge">CTEVT Affiliated</span>
              </div>

              <h2>Lab Technician</h2>
              <p>
                The Lab Technician program trains students in laboratory science,
                diagnostic testing, sample analysis, and modern medical equipment
                handling with hands-on practical experience.
              </p>

              <div className="program-details">
                <div>
                  <Clock className="detail-mini-icon" />
                  <strong>Duration:</strong> 3 Years
                </div>
                <div>
                  <Phone className="detail-mini-icon" />
                  <strong>Contact:</strong> 061-575247
                </div>
              </div>

              <div className="program-link">Explore Program →</div>
            </a>
          </div>
        </div>
      </section>

      {/* =========================
      PCL NURSING DETAIL SECTION (LEFT IMAGE)
      ========================= */}
      <section id="pcl-nursing" className="program-detail-section">
        <div className="detail-container left-layout">
          <div className="detail-image">
            <img src="https://fch.com.np/wp-content/uploads/2026/05/pclnn.jpg" alt="PCL Nursing Program" />
          </div>

          <div className="detail-content">
            <span className="detail-badge">CTEVT Affiliated</span>
            <h2>PCL Nursing Program</h2>
            <p>
              The PCL Nursing program is designed to prepare skilled nurses with
              strong theoretical understanding and real hospital-based experience.
              Students learn patient care, medical procedures, and community health
              practices.
            </p>
            <p>
              Graduates are capable of working in hospitals, clinics, NGOs, and
              healthcare institutions across Nepal and abroad with professional
              competence and ethics.
            </p>

            <div className="detail-info-grid">
              <div className="info-grid-item">
                <strong>Duration:</strong> 3 Years
              </div>
              <div className="info-grid-item">
                <strong>Total Seats:</strong> 40
              </div>
              <div className="info-grid-item">
                <strong>Scholarship:</strong> 4 Seats
              </div>
              <div className="info-grid-item">
                <strong>Paid Seats:</strong> 36
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card primary">
                <GraduationCap className="stat-icon-svg" />
                <h3>10K+</h3>
                <p>Graduates</p>
              </div>

              <div className="stat-card">
                <Users className="stat-icon-svg green-icon" />
                <h3>30+</h3>
                <p>Faculty Members</p>
              </div>

              <div className="stat-card">
                <Landmark className="stat-icon-svg green-icon" />
                <h3>10+</h3>
                <p>Training Centers</p>
              </div>

              <div className="stat-card">
                <School className="stat-icon-svg green-icon" />
                <h3>20+</h3>
                <p>Classrooms</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
      HEALTH ASSISTANT DETAIL SECTION (RIGHT IMAGE)
      ========================= */}
      <section id="health-assistant" className="program-detail-section alt-bg">
        <div className="detail-container right-layout">
          <div className="detail-content">
            <span className="detail-badge">CTEVT Affiliated</span>
            <h2>Health Assistant Program</h2>
            <p>
              The Health Assistant program prepares students for real-world
              healthcare services through clinical training, field visits, and
              hospital practice.
            </p>
            <p>
              Students gain the skills required to work in health posts, hospitals,
              and community healthcare centers, providing crucial primary health services.
            </p>

            <div className="detail-info-grid">
              <div className="info-grid-item">
                <strong>Duration:</strong> 3 Years
              </div>
              <div className="info-grid-item">
                <strong>CTEVT:</strong> Affiliated
              </div>
              <div className="info-grid-item">
                <strong>Training:</strong> Clinical Practice
              </div>
              <div className="info-grid-item">
                <strong>Career:</strong> Healthcare Jobs
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card primary">
                <CheckCircle className="stat-icon-svg" />
                <h3>95%</h3>
                <p>Practical Training</p>
              </div>

              <div className="stat-card">
                <Landmark className="stat-icon-svg green-icon" />
                <h3>15+</h3>
                <p>Partner Hospitals</p>
              </div>

              <div className="stat-card">
                <BookOpen className="stat-icon-svg green-icon" />
                <h3>100+</h3>
                <p>Clinical Sessions</p>
              </div>

              <div className="stat-card">
                <GraduationCap className="stat-icon-svg green-icon" />
                <h3>Career</h3>
                <p>Focused Learning</p>
              </div>
            </div>
          </div>

          <div className="detail-image">
            <img src="https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?q=80&w=1400&auto=format&fit=crop" alt="Health Assistant Program" />
          </div>
        </div>
      </section>

      {/* =========================
      LAB TECHNICIAN DETAIL SECTION (LEFT IMAGE)
      ========================= */}
      <section id="lab-technician" className="program-detail-section">
        <div className="detail-container left-layout">
          <div className="detail-image">
            <img src="https://images.unsplash.com/photo-1579165466741-7f35e4755660?q=80&w=1400&auto=format&fit=crop" alt="Lab Technician Program" />
          </div>

          <div className="detail-content">
            <span className="detail-badge">CTEVT Affiliated</span>
            <h2>Lab Technician Program</h2>
            <p>
              Students are trained in laboratory procedures, sample testing,
              pathology techniques, and diagnostic methods using modern equipment.
            </p>
            <p>
              The program prepares students for medical career pathways in research
              labs, hospitals, diagnostic centers, and blood transfusion centers.
            </p>

            <div className="detail-info-grid">
              <div className="info-grid-item">
                <strong>Duration:</strong> 3 Years
              </div>
              <div className="info-grid-item">
                <strong>Focus:</strong> Lab Practice
              </div>
              <div className="info-grid-item">
                <strong>Training:</strong> Practical
              </div>
              <div className="info-grid-item">
                <strong>Career:</strong> Diagnostics
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card primary">
                <School className="stat-icon-svg" />
                <h3>Modern</h3>
                <p>Lab Setup</p>
              </div>

              <div className="stat-card">
                <BookOpen className="stat-icon-svg green-icon" />
                <h3>50+</h3>
                <p>Practical Sessions</p>
              </div>

              <div className="stat-card">
                <Shield className="stat-icon-svg green-icon" />
                <h3>Advanced</h3>
                <p>Equipment</p>
              </div>

              <div className="stat-card">
                <CheckCircle className="stat-icon-svg green-icon" />
                <h3>100%</h3>
                <p>Skill Based</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CollegePrograms;
