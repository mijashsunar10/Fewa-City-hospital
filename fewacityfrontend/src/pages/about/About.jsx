import AboutUs from '../home/AboutUs';
import Stats from './Stats';
import './About.css';
import useSEO from '../../hooks/useSEO';

const About = () => {
  useSEO(
    'About Us',
    'Learn about Fewa City Hospital, Pokhara. Read our mission, vision, statistics, and dedication to excellence in patient-centric healthcare.',
    'About Fewa City Hospital, hospital history, hospital mission, medical vision, Pokhara healthcare'
  );

  return (
    <div className="about-page">
      {/* <div className="about-header">
        <h1>About Us</h1>
        <p>Home / About Us</p>
      </div> */}
      <AboutUs showLink={false} />
      <Stats />
      
      {/* Additional About Content */}
      <section className="about-details">
        <div className="container">
          <h2>Our Mission & Vision</h2>
          <div className="mission-grid">
            <div className="mission-item">
              <h3>Our Mission</h3>
              <p>To provide high-quality, compassionate healthcare services that are accessible and affordable to all members of our community.</p>
            </div>
            <div className="mission-item">
              <h3>Our Vision</h3>
              <p>To be the leading healthcare provider in Pokhara, recognized for medical excellence, patient safety, and innovation.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
