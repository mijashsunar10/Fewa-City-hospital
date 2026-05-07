import React from 'react';
import './Home.css';
import Hero from './home/Hero';
import AboutUs from './home/AboutUs';
import MedicalServices from './home/MedicalServices';
import Departments from './home/Departments';
import HospitalLocation from './home/HospitalLocation';

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <AboutUs />
      <MedicalServices />
      <Departments />
      <HospitalLocation />
      
      {/* You can add more sections here */}
    </div>
  );
};

export default Home;


