import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <>
      <footer className="hospital-footer">
        <div className="footer-container">
          {/* LOGO / ABOUT */}
          <div className="footer-box">
            <img src="https://fch.com.np/wp-content/uploads/2026/02/fewa-city.png" alt="Fewa City Hospital" />
            <p>
              We deliver quality healthcare services at affordable rates. Located in Gandaki Province, we cater to the diverse healthcare needs of the entire region.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="footer-box">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/departments">Departments</a></li>
              <li><a href="/team">Our Team</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div className="footer-box">
            <h4>Contact</h4>
            <p>Pokhara, Fewa City</p>
            <p><a style={{ color: 'white' }} href="tel:061582685">061-582685</a></p>
            <p><a style={{ color: 'white' }} href="tel:061582686">061-582686</a></p>
            <p>
              <a style={{ color: 'white' }} href="mailto:fewacitihospital@gmail.com">
                fewacitihospital@gmail.com
              </a>
            </p>
            <p>🗺️ <a style={{ color: 'white' }} href="https://goo.gl/maps/fewacityhospital" target="_blank" rel="noopener noreferrer">View on Map</a></p>
          </div>

          {/* HOURS + SOCIAL */}
          <div className="footer-box">
            <h4>⏰ Visiting Hours</h4>
            <p>24 hours <br /> Open</p>

            <div className="socials">
              <a href="https://www.facebook.com/Fchpkr" className="social fb" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social ig"><i className="fab fa-instagram"></i></a>
              <a href="#" className="social yt"><i className="fab fa-youtube"></i></a>
              <a href="#" className="social wa"><i className="fab fa-whatsapp"></i></a>
            </div>
          </div>
        </div>
      </footer>
      <div className="footer-bottom">
        <a href="https://nitiacademy.edu.np/" target="_blank" rel="noopener noreferrer">
          Designed and Developed by Niti Academy
        </a>
      </div>
    </>
  );
};

export default Footer;
