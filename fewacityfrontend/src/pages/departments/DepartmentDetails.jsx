import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Calendar, Shield, Users, CheckCircle, PhoneCall, Award, Activity, Heart, Sparkles } from 'lucide-react';
import axios from 'axios';
import './DepartmentDetails.css';
import API_BASE_URL from '../../config/api';
import useSEO from '../../hooks/useSEO';

const DepartmentDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch departments and doctors in parallel
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [deptRes, docRes] = await Promise.all([
          axios.get(API_BASE_URL + '/api/departments'),
          axios.get(API_BASE_URL + '/api/doctors')
        ]);
        setDepartments(deptRes.data);
        setDoctors(docRes.data);
      } catch (err) {
        console.error('Failed to fetch data for department details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Find current department by slug
  const currentDept = useMemo(() => {
    return departments.find(d => d.slug === slug);
  }, [departments, slug]);

  // Clean title for comparison
  const cleanStr = (str) => {
    if (!str) return '';
    return str
      .toString()
      .toLowerCase()
      .replace(/departments?/gi, '')
      .replace(/s\b/gi, '')
      .replace(/[^a-z0-9]/gi, '')
      .trim();
  };

  // Find doctors assigned to this department
  const assignedDoctors = useMemo(() => {
    if (!currentDept) return [];
    const deptClean = cleanStr(currentDept.title);
    return doctors.filter(doc => {
      const docDeptId = doc.department?._id || doc.department;
      if (docDeptId && currentDept._id && docDeptId.toString() === currentDept._id.toString()) {
        return true;
      }
      const docDeptText = doc.department?.title || doc.department || '';
      const docDeptClean = cleanStr(docDeptText);
      if (!docDeptClean) return false;
      return (
        docDeptClean === deptClean ||
        docDeptClean.includes(deptClean) ||
        deptClean.includes(docDeptClean)
      );
    });
  }, [currentDept, doctors]);

  // Dynamic SEO Setup
  useSEO(
    currentDept ? `${currentDept.title} | Fewa City Hospital` : 'Medical Department Details',
    currentDept ? currentDept.description : 'Explore specialized medical departments and clinical rosters at Fewa City Hospital Pokhara.',
    currentDept ? `${currentDept.slug}, fewa city hospital, Pokhara medical departments, doctors` : 'medical departments, Pokhara, doctors'
  );

  if (loading) {
    return (
      <div className="dept-details-loader">
        <div className="dept-details-spinner"></div>
        <p>Loading clinical profile & roster...</p>
      </div>
    );
  }

  if (!currentDept) {
    return (
      <div className="dept-details-error">
        <div className="error-card">
          <ArrowLeft className="error-back-icon" onClick={() => navigate('/departments')} />
          <h2>Department Not Found</h2>
          <p>We couldn't locate the department you were looking for. It may have been renamed or moved.</p>
          <button onClick={() => navigate('/departments')} className="error-btn">
            Browse All Departments
          </button>
        </div>
      </div>
    );
  }

  const handleBookRedirect = (docId) => {
    const targetUrl = `/patient/dashboard?tab=book&deptName=${encodeURIComponent(currentDept.title)}` + (docId ? `&docId=${docId}` : '');
    if (user) {
      navigate(targetUrl);
    } else {
      navigate(`/login?redirect=${encodeURIComponent(targetUrl)}`);
    }
  };

  const deptImage = currentDept.image 
    ? (currentDept.image.startsWith('/uploads/') ? `${API_BASE_URL}${currentDept.image}` : currentDept.image)
    : "https://fch.com.np/wp-content/uploads/2026/02/anaesthesia1.jpg";

  // Pre-configured mock clinical equipment based on department slug to make it advanced
  const getEquipment = () => {
    const defaultEquip = [
      { name: "Modern Diagnostic Suites", desc: "High-resolution screening and tracking tools." },
      { name: "State-of-the-Art Care Systems", desc: "Constant electronic vital monitoring." },
      { name: "Surgical Recovery Devices", desc: "For post-operative stabilization and safety." }
    ];

    switch (slug) {
      case 'cardiology':
        return [
          { name: "Electrocardiogram (ECG) Systems", desc: "Precision measurement of cardiac electrical activity." },
          { name: "Echocardiography Machines", desc: "Ultrasound scan of heart structures and real-time blood flow." },
          { name: "Cardiac Stress Test Units", desc: "Monitors coronary health under physical loads." },
          { name: "Holter Monitors", desc: "24/48-hour ambulatory tracking for arrhythmia detection." }
        ];
      case 'dental':
        return [
          { name: "Intraoral Cameras & Digital X-Ray", desc: "High-fidelity imaging with 90% less radiation exposure." },
          { name: "Ultrasonic Scalers", desc: "Painless plaque and calculus removal tools." },
          { name: "Dental Operative Microscopes", desc: "Enhanced visibility for micro-invasive root canal therapies." }
        ];
      case 'gynecology':
        return [
          { name: "4D Obstetrical Ultrasonography", desc: "Live high-definition volumetric fetal monitoring." },
          { name: "Colposcopes", desc: "High-magnification cervical examinations and diagnostics." },
          { name: "Fetal Doppler Monitors", desc: "Continuous fetal heart rate monitoring during prenatal visits." }
        ];
      case 'orthopedic':
        return [
          { name: "C-Arm Imaging Systems", desc: "Real-time intraoperative X-ray fluoroscopy." },
          { name: "Arthroscopic Camera Systems", desc: "High-definition keyhole visualization for joint repairs." },
          { name: "Advanced Physio-Recovery Gear", desc: "Post-operative mobility aids and joint recovery stimulation." }
        ];
      case 'radiology':
        return [
          { name: "128-Slice CT Scanner", desc: "High-speed, low-dose volumetric body diagnostics." },
          { name: "1.5T High-Field MRI Scanner", desc: "Superb contrast resolution for neuro, muscular, and spine scans." },
          { name: "Advanced Mammography Units", desc: "High-accuracy breast cancer screenings." },
          { name: "Digital X-Ray Systems", desc: "Instantaneous, cloud-sharable diagnostic imaging." }
        ];
      default:
        return defaultEquip;
    }
  };

  return (
    <div className="dept-details-wrapper">
      {/* HERO SECTION */}
      <section className="dept-hero-section" style={{ backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.95)), url(${deptImage})` }}>
        <div className="dept-hero-container">
          <Link to="/departments" className="back-link">
            <ArrowLeft size={16} /> Back to Departments
          </Link>
          <div className="hero-content">
            <span className="hero-badge"><Activity size={14} className="animate-pulse" /> Specialized Care</span>
            <h1>{currentDept.title}</h1>
            <p className="hero-desc">{currentDept.description}</p>
            {currentDept.extra && <p className="hero-extra">{currentDept.extra}</p>}
          </div>
        </div>
      </section>

      {/* DETAILED CONTENT SECTION */}
      <section className="dept-body-section">
        <div className="dept-body-container">
          {/* MAIN COLUMN */}
          <div className="dept-main-col">
            {/* SERVICES / POINTS */}
            <div className="dept-details-card">
              <h2 className="card-title"><Heart size={20} className="card-title-icon" /> Core Focus & Treatments</h2>
              {currentDept.points && currentDept.points.length > 0 ? (
                <div className="points-grid">
                  {currentDept.points.map((point, index) => (
                    <div className="point-item" key={index}>
                      <CheckCircle size={18} className="point-icon" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-points-text">General medical consultation and treatment options under specialized clinical supervisors.</p>
              )}
            </div>

            {/* CLINICAL EQUIPMENT */}
            <div className="dept-details-card">
              <h2 className="card-title"><Sparkles size={20} className="card-title-icon" /> Advanced Clinical Equipment & Facilities</h2>
              <p className="equipment-intro-text">
                Fewa City Hospital utilizes cutting-edge medical technologies inside our {currentDept.title} to deliver safe, rapid, and precise patient care.
              </p>
              <div className="equipment-grid">
                {getEquipment().map((equip, index) => (
                  <div className="equipment-card" key={index}>
                    <Shield size={20} className="equip-card-icon" />
                    <h4>{equip.name}</h4>
                    <p>{equip.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SPECIALISTS TEAM */}
            <div className="dept-details-card">
              <h2 className="card-title"><Users size={20} className="card-title-icon" /> Our Specialist Roster</h2>
              {assignedDoctors.length > 0 ? (
                <div className="details-doc-grid">
                  {assignedDoctors.map((doc) => {
                    const docImg = doc.image 
                      ? (doc.image.startsWith('/uploads/') ? `${API_BASE_URL}${doc.image}` : doc.image)
                      : "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg";
                    return (
                      <div className="details-doc-card" key={doc._id}>
                        <div className="details-doc-img-wrapper">
                          <img 
                            src={docImg} 
                            alt={doc.name} 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg";
                            }}
                          />
                        </div>
                        <div className="details-doc-info">
                          <h4>{doc.name}</h4>
                          <span className="doc-qual">{doc.qualification || doc.position}</span>
                          <span className="doc-exp"><Award size={14} /> {doc.experience || 'Experienced Specialist'}</span>
                          <div className="doc-card-actions">
                            <Link to={`/doctors/${doc._id}`} className="doc-profile-btn">Profile</Link>
                            <button onClick={() => handleBookRedirect(doc._id)} className="doc-book-btn">
                              <Calendar size={14} /> Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-roster-box">
                  <p>No medical specialists are currently assigned to this department online. Please contact the front desk for general consultations.</p>
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR COLUMN */}
          <aside className="dept-sidebar-col">
            {/* BOOKING CALL-TO-ACTION */}
            <div className="sidebar-action-card">
              <h3>Consult a Specialist</h3>
              <p>Schedule an in-person appointment with one of our {currentDept.title} doctors today.</p>
              <button onClick={() => handleBookRedirect()} className="sidebar-action-btn">
                <Calendar size={18} /> Schedule Appointment
              </button>
            </div>

            {/* EMERGENCY CONTACT CARD */}
            <div className="sidebar-contact-card">
              <PhoneCall className="contact-card-icon" />
              <h3>Need Immediate Help?</h3>
              <p>For emergencies or booking inquiries, please contact our 24/7 helpdesk support line.</p>
              <span className="contact-phone">+977-61-578500</span>
              <span className="contact-phone-alt">+977-61-574900</span>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default DepartmentDetails;
