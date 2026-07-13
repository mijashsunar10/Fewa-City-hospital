import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './DoctorsSection.css';
import API_BASE_URL from '../../config/api';
import { DoctorSkeleton } from '../../components/Skeleton';

const DoctorsSection = () => {
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_BASE_URL + '/api/doctors');
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
        {loading ? (
          <DoctorSkeleton count={4} />
        ) : (
          <div className="home-doctors-grid">
            {featuredDoctors.map((doc, idx) => {
              const docImg = doc.image 
                ? (doc.image.startsWith('/uploads/') ? `${API_BASE_URL}${doc.image}` : doc.image)
                : doc.img;
              const docPosition = doc.qualification || doc.position;
              const docDept = doc.department?.title?.replace(' Department', '') || doc.department || '';

              return (
                <div className="home-doctor-card" key={doc._id || idx}>
                  <Link to={`/doctors/${doc._id}`} className="home-doctor-img-wrapper block decoration-0">
                    <img 
                      src={docImg} 
                      alt={doc.name} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg";
                      }}
                    />
                  </Link>
                  <div className="home-doctor-info">
                    <Link to={`/doctors/${doc._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h3 className="hover:text-emerald-700 transition" style={{ margin: '0 0 6px 0' }}>{doc.name}</h3>
                    </Link>
                    <span className="position">{docPosition}</span>
                    <div className="home-doctor-actions" style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                      <Link 
                        to={`/doctors/${doc._id}`}
                        className="home-doctor-book-btn border-0 cursor-pointer text-center"
                        style={{ flexGrow: 1, backgroundColor: '#f1f5f9', color: '#475569', padding: '10px 0', textDecoration: 'none' }}
                      >
                        Profile
                      </Link>
                      <button 
                        onClick={() => {
                          const targetUrl = `/patient/dashboard?tab=book&deptName=${encodeURIComponent(docDept)}&docId=${doc._id}`;
                          if (user) {
                            navigate(targetUrl);
                          } else {
                            navigate(`/login?redirect=${encodeURIComponent(targetUrl)}`);
                          }
                        }}
                        className="home-doctor-book-btn border-0 cursor-pointer"
                        style={{ flexGrow: 1.2, padding: '10px 0' }}
                      >
                        <Calendar className="btn-icon" />
                        Book
                      </button>
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
