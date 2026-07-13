import './HospitalLocation.css';

const HospitalLocation = () => {
  return (
    <section className="hospital-location">
      <div className="location-wrapper">
        {/* LEFT CONTENT */}
        <div className="location-content">
          <h2>Contact Fewa City Hospital</h2>
          <p>
            Providing compassionate and expert healthcare services to the Pokhara community.
            Our team ensures high-quality care, advanced facilities, and patient-centered attention for every visitor.
          </p>

          <div className="contact-box">
            <div className="contact-item">
              <span>🏥</span>
              <strong>Fewa City Hospital</strong>
            </div>

            <div className="contact-item">
              <span>📍</span>
              Pokhara-9, Naghdhunga
            </div>

            <div className="contact-item phone-item">
              <span>📞</span>
              <div className="phone-numbers">
                <a href="tel:061-582685">061-582685</a>
                <a href="tel:061-582686">061-582686</a>
              </div>
            </div>

            <div className="contact-item">
              <span>📧</span>
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
            title="Fewa City Hospital Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3516.02030494916!2d83.97904377548531!3d28.206695675900036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399595aef292ca01%3A0x4d8e6bca7da4da6b!2sFewa%20City%20Hospital!5e0!3m2!1sen!2snp!4v1767611040273!5m2!1sen!2snp"
            loading="lazy"
          ></iframe>

          <div className="map-label">
            🗺️ Tap the map to open full view
          </div>
        </a>
      </div>
    </section>
  );
};

export default HospitalLocation;
