import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Departments.css';
import API_BASE_URL from '../../config/api';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_BASE_URL + '/api/departments');
        setDepartments(response.data);
      } catch (err) {
        console.error('Failed to fetch departments for homepage:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepts();
  }, []);

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
          {loading ? (
            <div className="col-span-full text-center py-6 text-slate-500 font-medium">
              Loading departments...
            </div>
          ) : departments.length > 0 ? (
            departments.map((dept) => (
              <Link key={dept._id} to={`/departments/${dept.slug}`}>
                <div className="department-card">{dept.title.replace(' Department', '')}</div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-6 text-slate-500 font-medium">
              No departments registered.
            </div>
          )}
        </div>

        <div className="services-btn-wrap">
          <Link to="/departments" className="view-all-btn">View Department Details</Link>
        </div>
      </div>
    </section>
  );
};

export default Departments;
