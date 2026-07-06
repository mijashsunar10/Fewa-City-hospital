import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/about/About'
import DepartmentsPage from './pages/departments/DepartmentsPage'
import DoctorsPage from './pages/doctors/DoctorsPage'
import CollegePrograms from './pages/college/CollegePrograms'
import ServicesPage from './pages/services/ServicesPage'
import ContactUs from './pages/contact/ContactUs'
import Gallery from './pages/gallery/Gallery'
import AdminLogin from './pages/admin/AdminLogin'
import AdminRegister from './pages/admin/AdminRegister'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminDoctors from './pages/admin/AdminDoctors'
import AdminServices from './pages/admin/AdminServices'
import AdminDepartments from './pages/admin/AdminDepartments'
import AdminMessages from './pages/admin/AdminMessages'
import AdminAppointments from './pages/admin/AdminAppointments'
import PatientLogin from './pages/patient/PatientLogin'
import PatientRegister from './pages/patient/PatientRegister'
import PatientDashboard from './pages/patient/PatientDashboard'
import { AuthProvider } from './context/AuthContext'
import EmergencyContact from './components/EmergencyContact'

function AppContent() {
  const location = useLocation();
  const hideHeaderFooter = location.pathname.startsWith('/admin') || location.pathname.startsWith('/patient/dashboard');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {!hideHeaderFooter && <Header />}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/college-program" element={<CollegePrograms />} />
          <Route path="/pcl-nursing" element={<CollegePrograms />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/login" element={<PatientLogin />} />
          <Route path="/register" element={<PatientRegister />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/doctors" element={<AdminDoctors />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/departments" element={<AdminDepartments />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />
        </Routes>
      </main>

      {!hideHeaderFooter && <Footer />}
      {!hideHeaderFooter && <EmergencyContact />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
