import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/about/About'
import DepartmentsPage from './pages/departments/DepartmentsPage'
import DoctorsPage from './pages/doctors/DoctorsPage'
import CollegePrograms from './pages/college/CollegePrograms'
import ServicesPage from './pages/services/ServicesPage'
import ContactUs from './pages/contact/ContactUs'
import EmergencyContact from './components/EmergencyContact'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-us/" element={<About />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/college-program" element={<CollegePrograms />} />
            <Route path="/pcl-nursing" element={<CollegePrograms />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/" element={<ServicesPage />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/contact-us/" element={<ContactUs />} />
          </Routes>
        </main>

        <Footer />

        <EmergencyContact />
      </div>
    </Router>
  )
}

export default App
