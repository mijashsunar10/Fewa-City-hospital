import React from 'react';
import './Home.css';
import Hero from './home/Hero';
import AboutUs from './home/AboutUs';
import MedicalServices from './home/MedicalServices';
import Departments from './home/Departments';
import DoctorsSection from './home/DoctorsSection';
import HospitalLocation from './home/HospitalLocation';

const Home = () => {
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


