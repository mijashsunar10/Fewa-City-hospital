import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 220) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="w-full font-sans">
      {/* TOP BAR */}
      <div className="bg-[#156619] text-white text-sm py-2 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <span>24 Hours Emergency & Ambulance Service : +977-9842285269</span>
          <div className="flex gap-4">
            <a href="#" className="hover:opacity-80"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="hover:opacity-80"><i className="fab fa-instagram"></i></a>
            <a href="#" className="hover:opacity-80 text-xs font-semibold">Webmail</a>
          </div>
        </div>
      </div>

      {/* MIDDLE BAR */}
      <div className="bg-white border-b border-gray-100 hidden md:block">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img 
              src="https://fch.com.np/wp-content/uploads/2026/02/Hospitalfewa.png" 
              alt="Fewa City Logo" 
              className="h-24"
            />
            <div className="flex flex-col leading-tight text-[#156619]">
              <span className="text-3xl font-extrabold tracking-wider">FEWA CITY</span>
              <span className="text-xl font-semibold">Hospital Pvt. Ltd.</span>
              <span className="text-sm text-gray-500 font-normal">Pokhara-09, Nagdhunga</span>
            </div>
          </div>

          <div className="flex gap-8">
            <QuickAction icon="fa-calendar-check" text1="Request" text2="Appointment" href={user ? "/patient/dashboard?tab=book" : "/login"} />
            <QuickAction icon="fa-user-doctor" text1="Doctor" text2="Consultation" href="/departments" />
            <QuickAction icon="fa-ambulance" text1="Ambulance" text2="+977 9842285269" href="tel:+9779842285269" />
            <QuickAction icon="fa-clock" text1="24 / 7" text2="Service" href="/services" />
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <nav 
        className={`bg-[#156619] transition-all duration-300 z-[999] ${
          isSticky 
            ? 'fixed top-0 left-0 w-full rounded-none' 
            : 'md:rounded-full md:w-fit md:mx-auto md:my-0'
        }`}
      >
        {/* MOBILE HEADER */}
        <div className="md:hidden flex justify-between items-center p-3">
          <div className="flex items-center gap-3">
            <img src="https://fch.com.np/wp-content/uploads/2026/02/fewa-city.png" className="h-12" alt="Mobile Logo" />
            <div className="flex flex-col text-white leading-none">
              <span className="text-base font-bold">FEWA CITY</span>
              <span className="text-xs opacity-90">Hospital Pvt. Ltd.</span>
            </div>
          </div>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white text-2xl"
          >
            <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
        </div>

        {/* MENU */}
        <ul className={`
          md:flex md:gap-8 md:px-10 md:py-3.5 justify-center items-center font-semibold text-white
          ${isMenuOpen ? 'flex flex-col p-5 gap-4' : 'hidden md:flex'}
        `}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about-us/">About Us</NavLink>
          <NavLink to="/departments">Departments</NavLink>
          <NavLink to="/doctors">Doctors</NavLink>
          <NavLink to="/services/">Services</NavLink>
          <NavLink to="/college-program">College Programme</NavLink>
          <NavLink to="/gallery">Gallery</NavLink>
          <NavLink to="/contact-us/">Contact Us</NavLink>
          
          {/* AUTHENTICATION PATHS */}
          {user ? (
            user.role === 'admin' ? (
              <NavLink to="/admin/dashboard">
                <span className="flex items-center gap-1.5 text-[#facc15] font-bold">
                  <i className="fa-solid fa-circle-user text-lg"></i>
                  Admin: {user.name.split(' ')[0]}
                </span>
              </NavLink>
            ) : (
              <NavLink to="/patient/dashboard">
                <span className="flex items-center gap-1.5 text-[#facc15] font-bold">
                  <i className="fa-solid fa-circle-user text-lg"></i>
                  Dashboard: {user.name.split(' ')[0]}
                </span>
              </NavLink>
            )
          ) : (
            <>
              <span className="hidden md:inline text-white/20">|</span>
              <NavLink to="/login">Patient Login</NavLink>
              <NavLink to="/register">Register</NavLink>
              <span className="hidden md:inline text-white/20">|</span>
              <NavLink to="/admin/login" className="text-[#facc15] hover:text-[#fbbf24] font-semibold">Admin Portal</NavLink>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

const QuickAction = ({ icon, text1, text2, href }) => (
  <a href={href} className="flex items-center gap-3 group">
    <div className="w-14 h-14 bg-[#d97706] text-white rounded-full flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform">
      <i className={`fa-solid ${icon}`}></i>
    </div>
    <div className="flex flex-col font-bold text-[#156619] leading-tight">
      <span className="text-sm">{text1}</span>
      <span className="text-sm">{text2}</span>
    </div>
  </a>
);

const NavLink = ({ to, children }) => (
  <li>
    <Link to={to} className="hover:text-[#facc15] transition-colors whitespace-nowrap">
      {children}
    </Link>
  </li>
);

export default Header;
