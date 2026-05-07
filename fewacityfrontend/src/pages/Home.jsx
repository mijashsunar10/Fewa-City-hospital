import React from 'react';
import './Home.css';
import Hero from './home/Hero';
import AboutUs from './home/AboutUs';
import MedicalServices from './home/MedicalServices';

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <AboutUs />
      <MedicalServices />
      
      {/* You can add more sections here */}
    </div>
  );
};

export default Home;
