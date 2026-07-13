import './Home.css';
import Hero from './home/Hero';
import AboutUs from './home/AboutUs';
import MedicalServices from './home/MedicalServices';
import Departments from './home/Departments';
import DoctorsSection from './home/DoctorsSection';
import HospitalLocation from './home/HospitalLocation';
import useSEO from '../hooks/useSEO';

const Home = () => {
  useSEO(
    'Home',
    'Fewa City Hospital in Pokhara provides high-quality, compassionate, and affordable clinical healthcare services. Book appointments online.',
    'Fewa City Hospital, Pokhara, best hospital, medical care, doctors Pokhara, clinical services'
  );

  return (
    <div className="home-page">
      <Hero />
      <AboutUs />
      <MedicalServices />
      <Departments />
      <DoctorsSection />
      <HospitalLocation />
    </div>
  );
};

export default Home;


