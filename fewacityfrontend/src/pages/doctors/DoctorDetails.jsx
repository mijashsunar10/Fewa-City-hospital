import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Phone, Stethoscope, ChevronRight, Award, Clock, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import './DoctorDetails.css';
import { useAuth } from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';
import useSEO from '../../hooks/useSEO';
import { Skeleton } from '../../components/Skeleton';

const DoctorDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/doctors/${id}`);
        setDoctor(res.data);
      } catch (err) {
        console.error('Error fetching doctor details:', err);
        setError(err.response?.data?.message || 'Doctor not found');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  // Set SEO metadata dynamically based on doctor details
  useSEO(
    doctor ? `${doctor.name} | Specialist Doctor` : 'Loading Specialist...',
    doctor 
      ? `Learn more about ${doctor.name}, ${doctor.qualification} at Fewa City Hospital Pokhara. View schedule and book appointments.`
      : 'Specialist Doctor Profiles at Fewa City Hospital Pokhara.',
    doctor 
      ? `doctor ${doctor.name}, ${doctor.qualification}, doctor Pokhara, fewa city hospital`
      : 'doctors Pokhara, medical specialists Pokhara'
  );

  const handleBookAppointment = () => {
    const docDept = doctor?.department?.title?.replace(' Department', '') || doctor?.department || '';
    const targetUrl = `/patient/dashboard?tab=book&deptName=${encodeURIComponent(docDept)}&docId=${doctor?._id}`;
    if (user) {
      navigate(targetUrl);
    } else {
      navigate(`/login?redirect=${encodeURIComponent(targetUrl)}`);
    }
  };

  if (loading) {
    return (
      <div className="doctor-details-section">
        <div className="doc-details-hero">
          <div className="doc-details-overlay"></div>
          <div className="doc-details-hero-content">
            <Skeleton height="20px" width="150px" style={{ marginBottom: '10px' }} />
            <Skeleton height="45px" width="400px" />
          </div>
        </div>
        <div className="doc-details-container" style={{ marginTop: '40px' }}>
          <div>
            <Skeleton height="350px" borderRadius="24px" style={{ marginBottom: '20px' }} />
            <Skeleton height="80px" borderRadius="14px" />
          </div>
          <div>
            <Skeleton height="200px" borderRadius="24px" style={{ marginBottom: '30px' }} />
            <Skeleton height="150px" borderRadius="24px" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="doctor-details-section flex flex-col items-center justify-center py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">{error || 'Doctor Profile Not Found'}</h2>
          <p className="text-slate-500 mb-6">We could not retrieve this specialist's record. It may have been relocated.</p>
          <Link to="/doctors" className="inline-flex items-center gap-2 bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-800 transition">
            <ArrowLeft size={16} /> Back to Doctors
          </Link>
        </div>
      </div>
    );
  }

  const docImg = doctor.image 
    ? (doctor.image.startsWith('/uploads/') ? `${API_BASE_URL}${doctor.image}` : doctor.image)
    : "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg";

  const docDept = doctor.department?.title || doctor.department || 'Clinical Practice';
  const docPosition = doctor.qualification || 'Specialist Consultant';

  // Format schedule text or fallback
  const docSchedule = doctor.schedule || 'Sunday – Friday (10:00 AM – 3:00 PM)';
  const docBio = doctor.biography || `Dr. ${doctor.name} is a dedicated medical specialist at Fewa City Hospital, Pokhara. With a commitment to patient safety and advanced clinical diagnostic care, they work collaboratively to deliver tailored treatment protocols.`;
  const docExperience = doctor.experience || 'Over 8 years of clinical residency and practice';

  return (
    <section className="doctor-details-section">
      {/* HERO BANNER */}
      <div className="doc-details-hero">
        <div className="doc-details-overlay"></div>
        <div className="doc-details-hero-content">
          <div className="doc-breadcrumbs">
            <Link to="/">Home</Link> <ChevronRight size={12} className="inline mx-1" /> 
            <Link to="/doctors">Doctors</Link> <ChevronRight size={12} className="inline mx-1" /> 
            <span className="opacity-90">{doctor.name}</span>
          </div>
          <h1>{doctor.name}</h1>
          <p className="text-emerald-100 font-medium text-lg">{docPosition}</p>
        </div>
      </div>

      {/* BODY CONTENT CONTAINER */}
      <div className="doc-details-container">
        {/* LEFT COLUMN - CARD */}
        <div className="doc-profile-sticky-card">
          <div className="doc-profile-img-wrap">
            <img 
              src={docImg} 
              alt={doctor.name} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg";
              }}
            />
          </div>
          <div className="doc-profile-quick-info">
            <span className="doc-profile-dept-tag">{docDept.replace(' Department', '')}</span>
            <p className="doc-profile-qual">{docPosition}</p>
            
            <div className="doc-contact-list">
              <div className="doc-contact-item">
                <Phone className="doc-contact-icon" />
                <span className="doc-contact-label">Contact / WhatsApp:</span>
                <span className="doc-contact-value">{doctor.phone || '9765940555'}</span>
              </div>
              <div className="doc-contact-item">
                <Clock className="doc-contact-icon" />
                <span className="doc-contact-label">Availability:</span>
                <span className="doc-contact-value">Active</span>
              </div>
            </div>

            <button onClick={handleBookAppointment} className="doc-details-book-btn">
              <Calendar size={18} /> Book Appointment
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN - DETAILED INFO */}
        <div className="doc-details-content-wrap">
          {/* BIOGRAPHY */}
          <div className="doc-details-card">
            <h2>Professional Profile</h2>
            <p>{docBio}</p>
          </div>

          {/* EXPERIENCE */}
          <div className="doc-details-card">
            <h2>Experience & Qualifications</h2>
            <div className="flex gap-4 items-start mb-4">
              <Award className="text-emerald-600 w-8 h-8 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">Clinical Experience</h3>
                <p className="text-slate-600 m-0">{docExperience}</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <Stethoscope className="text-emerald-600 w-8 h-8 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">Medical Qualifications</h3>
                <p className="text-slate-600 m-0">{docPosition}</p>
              </div>
            </div>
          </div>

          {/* WEEKLY SCHEDULE */}
          <div className="doc-details-card">
            <h2>Weekly Availability</h2>
            <p className="mb-4">Consultation timings and visiting hours at Fewa City Hospital campus:</p>
            <div className="doc-schedule-grid">
              <div className="doc-schedule-row active">
                <span className="schedule-day">OPD Timings</span>
                <span className="schedule-time">{docSchedule}</span>
              </div>
              <div className="doc-schedule-row">
                <span className="schedule-day">Inpatient Rounds</span>
                <span className="schedule-time">Daily (8:30 AM – 9:30 AM)</span>
              </div>
              <div className="doc-schedule-row">
                <span className="schedule-day">Emergency Availability</span>
                <span className="schedule-time">On-Call (24/7 Support)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorDetails;
