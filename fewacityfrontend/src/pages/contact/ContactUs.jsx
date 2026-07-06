import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Building, Send, Award, Shield, CheckCircle } from 'lucide-react';
import axios from 'axios';
import './ContactUs.css';
import API_BASE_URL from '../../config/api';
import useSEO from '../../hooks/useSEO';

const ContactUs = () => {
  useSEO(
    'Contact Us',
    'Get in touch with Fewa City Hospital Pokhara. View our address, telephone contacts, email addresses, emergency numbers, and map location.',
    'contact hospital Pokhara, Fewa City Hospital phone number, emergency number Pokhara'
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await axios.post(API_BASE_URL + '/api/messages', formData);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page-wrapper">
      {/* HERO BANNER */}
      <div className="contact-hero-banner">
        <div className="contact-banner-overlay"></div>
        <div className="contact-hero-content">
          <span className="contact-hero-subtitle">Get in Touch</span>
          <h1 className="contact-hero-title">Contact Fewa City Hospital</h1>
          <p className="contact-hero-desc">
            Have questions, feedback, or need assistance? Reach out to our team. We are here to help you 24/7.
          </p>
          <div className="contact-hero-badges">
            <div className="hero-badge-item">
              <Award className="badge-icon" />
              <span>24/7 Emergency Support</span>
            </div>
            <div className="hero-badge-item">
              <Shield className="badge-icon" />
              <span>Patient-Centered Care</span>
            </div>
          </div>
        </div>
      </div>

      {/* HOSPITAL LOCATION & INFO */}
      <section className="hospital-location">
        <div className="location-wrapper">
          {/* LEFT CONTENT */}
          <div className="location-content">
            <h2>Contact Fewa City Hospital in Pokhara</h2>
            <p>
              Providing compassionate and expert healthcare services to the Pokhara community.
              Our team ensures high-quality care, advanced facilities, and patient-centered attention for every visitor.
            </p>

            <div className="contact-box">
              <div className="contact-item">
                <Building className="contact-icon-svg" />
                <span><strong>Fewa City Hospital</strong></span>
              </div>

              <div className="contact-item">
                <MapPin className="contact-icon-svg" />
                <span>Pokhara-9, Naghdhunga</span>
              </div>

              <div className="contact-item phone-item">
                <Phone className="contact-icon-svg" />
                <div className="phone-numbers">
                  <a href="tel:061-582685">061-582685</a>
                  <span className="phone-divider">|</span>
                  <a href="tel:061-582686">061-582686</a>
                </div>
              </div>

              <div className="contact-item">
                <Mail className="contact-icon-svg" />
                <a href="mailto:fewacitihospital@gmail.com">fewacitihospital@gmail.com</a>
              </div>
            </div>
          </div>

          {/* RIGHT MAP */}
          <a 
            className="map-box"
            href="https://www.google.com/maps?q=Fewa%20City%20Hospital%20Pokhara"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open larger map"
          >
            <iframe 
              title="Fewa City Hospital Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3516.02030494916!2d83.97904377548531!3d28.206695675900036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399595aef292ca01%3A0x4d8e6bca7da4da6b!2sFewa%20City%20Hospital!5e0!3m2!1sen!2snp!4v1767611040273!5m2!1sen!2snp"
              loading="lazy"
            ></iframe>
            <div className="map-label">
              🗺️ Tap the map to open full view
            </div>
          </a>
        </div>
      </section>

      {/* INTERACTIVE CONTACT FORM */}
      <section className="contact-form-section">
        <div className="contact-form-container">
          <div className="contact-form-header">
            <h2>Send Us a Message</h2>
            <p>Fill out the form below and our customer relations team will get back to you within 24 hours.</p>
          </div>

          {isSubmitted ? (
            <div className="contact-success-card">
              <CheckCircle className="success-icon" />
              <h3>Message Sent Successfully!</h3>
              <p>Thank you for reaching out. We have received your message and will respond as soon as possible.</p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="back-form-btn"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form-inner">
              {submitError && (
                <div style={{
                  color: '#ef4444',
                  backgroundColor: '#fee2e2',
                  padding: '12px',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  fontSize: '14px',
                  textAlign: 'center',
                  fontWeight: '500',
                  border: '1px solid #fca5a5'
                }}>
                  {submitError}
                </div>
              )}
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Your Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="e.g. +977-98XXXXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    placeholder="How can we help you?"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Your Message *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="5"
                  placeholder="Type your message here..."
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button type="submit" disabled={isSubmitting} className="contact-submit-btn">
                <Send className="btn-icon" />
                {isSubmitting ? 'Submitting Message...' : 'Submit Message'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
