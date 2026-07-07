import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  User, Calendar, FileText, ClipboardList, LogOut, CheckCircle, Clock, XCircle, 
  UserCheck, AlertCircle, Edit, MapPin, Phone, Award, ShieldAlert, BookOpen, ArrowLeft
} from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

const PatientDashboard = () => {
  const { user, token, logout, loading, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  // State
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);

  // Form Booking State
  const [bookingDept, setBookingDept] = useState('');
  const [bookingDoc, setBookingDoc] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingSlot, setBookingSlot] = useState('');
  const [bookingSymptoms, setBookingSymptoms] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Profile Edit State
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileGender, setProfileGender] = useState('');
  const [profileDob, setProfileDob] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [profileBloodGroup, setProfileBloodGroup] = useState('');
  const [profileHistory, setProfileHistory] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Time Slots
  const timeSlots = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM'
  ];

  // Auth Guard
  useEffect(() => {
    if (!loading && (!user || user.role !== 'user')) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Load Profile fields when user changes
  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfileEmail(user.email || '');
      setProfilePhone(user.phone || '');
      setProfileGender(user.gender || '');
      setProfileAddress(user.address || '');
      setProfileBloodGroup(user.bloodGroup || '');
      setProfileHistory(user.medicalHistory || '');
      if (user.dob) {
        setProfileDob(new Date(user.dob).toISOString().split('T')[0]);
      } else {
        setProfileDob('');
      }
    }
  }, [user]);

  // Fetch data
  const fetchData = async () => {
    if (!token) return;
    setIsLoadingDetails(true);
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    // Load each resource independently so that a failure in one (e.g. rate limiting on appointments)
    // does not block others (doctors and departments lists) from loading successfully.
    try {
      const apptRes = await axios.get(API_BASE_URL + '/api/appointments/my', config);
      setAppointments(apptRes.data);
    } catch (err) {
      console.error('Error fetching patient appointments:', err);
    }

    try {
      const docsRes = await axios.get(API_BASE_URL + '/api/doctors');
      setDoctors(docsRes.data);
    } catch (err) {
      console.error('Error fetching doctors roster:', err);
    }

    try {
      const deptsRes = await axios.get(API_BASE_URL + '/api/departments');
      setDepartments(deptsRes.data);
    } catch (err) {
      console.error('Error fetching departments list:', err);
    }

    setIsLoadingDetails(false);
  };

  useEffect(() => {
    if (user && user.role === 'user') {
      fetchData();
    }
  }, [user, token]);

  useEffect(() => {
    if (activeTab === 'book' && departments.length > 0) {
      const deptName = searchParams.get('deptName');
      const docId = searchParams.get('docId');
      
      if (deptName) {
        const cleanName = deptName.toLowerCase().replace(' department', '').replace('s', '').trim();
        const matchedDept = departments.find(d => {
          const titleClean = d.title.toLowerCase().replace(' department', '').replace('s', '').trim();
          const slugClean = d.slug.toLowerCase().replace(' department', '').replace('s', '').trim();
          return titleClean === cleanName || slugClean === cleanName || titleClean.includes(cleanName) || cleanName.includes(titleClean);
        });

        if (matchedDept) {
          setBookingDept(matchedDept._id);
          if (docId) {
            setBookingDoc(docId);
          }
        }
      }
    }
  }, [searchParams, departments, activeTab]);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
    // Reset alerts
    setBookingSuccess('');
    setBookingError('');
    setProfileSuccess('');
    setProfileError('');
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingSuccess('');
    setBookingError('');

    if (!bookingDept || !bookingDoc || !bookingDate || !bookingSlot) {
      setBookingError('Please fill out all required booking fields.');
      return;
    }

    setIsSubmittingBooking(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.post(API_BASE_URL + '/api/appointments', {
        department: bookingDept,
        doctor: bookingDoc,
        date: bookingDate,
        timeSlot: bookingSlot,
        symptoms: bookingSymptoms
      }, config);

      setBookingSuccess('Appointment requested successfully! Wait for admin approval.');
      setBookingDept('');
      setBookingDoc('');
      setBookingDate('');
      setBookingSlot('');
      setBookingSymptoms('');

      // Refresh appointments
      fetchData();
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to submit appointment booking.');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');
    setIsUpdatingProfile(true);

    const result = await updateProfile({
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
      gender: profileGender,
      dob: profileDob || null,
      address: profileAddress,
      bloodGroup: profileBloodGroup,
      medicalHistory: profileHistory
    });

    setIsUpdatingProfile(false);

    if (result.success) {
      setProfileSuccess('Profile details updated successfully!');
    } else {
      setProfileError(result.error);
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.put(`${API_BASE_URL}/api/appointments/${id}/cancel`, {}, config);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel appointment.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#156619]"></div>
        <p className="mt-4 text-slate-600 font-semibold">Loading Portal...</p>
      </div>
    );
  }

  // Filter doctors based on selected department slug or ID
  const filteredDoctors = doctors.filter(doc => {
    if (!bookingDept) return false;
    
    // Check by ID if doctor.department is populated as an object or is a raw ID string
    const docDeptId = doc.department?._id || doc.department;
    if (docDeptId && docDeptId.toString() === bookingDept.toString()) {
      return true;
    }
    
    // Fallback comparison by department title or slug matching
    const docDeptTitle = doc.department?.title || doc.department || '';
    const selectedDept = departments.find(d => d._id === bookingDept);
    if (!selectedDept) return false;
    
    const cleanDocTitle = docDeptTitle.toString().toLowerCase().replace(' department', '').trim();
    const cleanSelectedTitle = selectedDept.title.toLowerCase().replace(' department', '').trim();
    const cleanSelectedSlug = selectedDept.slug.toLowerCase().replace(' department', '').trim();
    
    return cleanDocTitle === cleanSelectedTitle || cleanDocTitle === cleanSelectedSlug;
  });

  // Overview stats calculation
  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter(a => a.status === 'Pending').length;
  const approvedAppointments = appointments.filter(a => a.status === 'Approved').length;
  const nextAppointment = appointments.find(a => a.status === 'Approved' || a.status === 'Pending');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3 text-[#156619]">
            <User className="h-8 w-8 bg-[#156619]/10 p-1.5 rounded-full" />
            <div>
              <h2 className="font-extrabold text-lg text-slate-800 tracking-wide">My Dashboard</h2>
              <span className="text-xs font-semibold uppercase text-[#156619]">Patient Portal</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <div className="text-sm font-bold text-slate-800">{user.name}</div>
          <div className="text-xs text-slate-500 truncate">{user.email}</div>
        </div>

        <nav className="flex-grow p-4 space-y-1.5">
          <button
            onClick={() => handleTabChange('overview')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'overview'
                ? 'bg-[#156619] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Clock className="h-4.5 w-4.5" />
            Overview
          </button>

          <button
            onClick={() => handleTabChange('book')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'book'
                ? 'bg-[#156619] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Calendar className="h-4.5 w-4.5" />
            Book Appointment
          </button>

          <button
            onClick={() => handleTabChange('appointments')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'appointments'
                ? 'bg-[#156619] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ClipboardList className="h-4.5 w-4.5" />
            My Appointments
          </button>

          <button
            onClick={() => handleTabChange('profile')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'profile'
                ? 'bg-[#156619] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <User className="h-4.5 w-4.5" />
            Health Profile
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200 mt-auto space-y-1">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            Back to Website
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4.5 w-4.5" />
            Log Out Portal
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow p-6 md:p-10 max-w-6xl">
        {isLoadingDetails ? (
          <div className="h-64 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#156619]"></div>
            <p className="mt-2 text-slate-500 text-sm">Syncing records...</p>
          </div>
        ) : (
          <div>
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Welcome, {user.name.split(' ')[0]}!</h1>
                  <p className="text-slate-500 text-sm">Here is a quick overview of your medical records and appointments.</p>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-[#156619]/10 text-[#156619] rounded-lg">
                      <ClipboardList className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase">Total Visits</span>
                      <h4 className="text-2xl font-bold text-slate-800">{totalAppointments}</h4>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase">Pending Requests</span>
                      <h4 className="text-2xl font-bold text-slate-800">{pendingAppointments}</h4>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase">Approved Visits</span>
                      <h4 className="text-2xl font-bold text-slate-800">{approvedAppointments}</h4>
                    </div>
                  </div>
                </div>

                {/* NEXT APPOINTMENT / BANNER */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 bg-gradient-to-r from-[#156619] to-emerald-800 text-white p-6 md:p-8 rounded-xl shadow-md flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold">Book a Consult Anytime</h2>
                      <p className="mt-2 text-white/80 text-sm max-w-md">
                        Schedule slots with our experienced clinical specialists. Submit symptoms to receive pre-visit guidance.
                      </p>
                    </div>
                    <button
                      onClick={() => handleTabChange('book')}
                      className="mt-6 w-fit bg-[#facc15] hover:bg-[#eab308] text-slate-900 px-5 py-2 rounded-lg font-bold text-sm transition-colors shadow"
                    >
                      Schedule New Visit
                    </button>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">Next Scheduled Visit</h3>
                    {nextAppointment ? (
                      <div className="mt-4 flex-grow flex flex-col justify-between gap-4">
                        <div>
                          <div className="font-bold text-slate-800">{nextAppointment.doctor?.name || 'Assigned Specialist'}</div>
                          <div className="text-xs text-slate-400 font-semibold">{nextAppointment.department?.title || 'Clinic'}</div>
                          <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                            <Calendar className="h-4 w-4 text-[#156619]" />
                            <span>{new Date(nextAppointment.date).toLocaleDateString()}</span>
                          </div>
                          <div className="mt-1.5 flex items-center gap-2 text-sm text-slate-600">
                            <Clock className="h-4 w-4 text-[#156619]" />
                            <span>{nextAppointment.timeSlot}</span>
                          </div>
                        </div>
                        <span className={`w-fit text-xs font-bold px-2.5 py-1 rounded-full border ${
                          nextAppointment.status === 'Approved'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}>
                          {nextAppointment.status}
                        </span>
                      </div>
                    ) : (
                      <div className="mt-8 flex flex-col items-center justify-center text-center">
                        <Calendar className="h-10 w-10 text-slate-300" />
                        <p className="mt-2 text-xs text-slate-400 font-semibold">No active bookings.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* RECENT VISITS TIMELINE */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 text-md border-b border-slate-100 pb-3 mb-4">Recent Appointments</h3>
                  {appointments.length > 0 ? (
                    <div className="space-y-4">
                      {appointments.slice(0, 3).map((appt) => (
                        <div key={appt._id} className="flex justify-between items-center p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              appt.status === 'Approved' ? 'bg-green-100 text-green-700' :
                              appt.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                              appt.status === 'Completed' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {appt.status === 'Approved' ? <CheckCircle className="h-4 w-4" /> :
                               appt.status === 'Pending' ? <Clock className="h-4 w-4" /> :
                               appt.status === 'Completed' ? <UserCheck className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                            </div>
                            <div>
                              <div className="font-bold text-sm text-slate-800">{appt.doctor?.name || 'Specialist'}</div>
                              <div className="text-xs text-slate-400">{new Date(appt.date).toLocaleDateString()} &bull; {appt.timeSlot}</div>
                            </div>
                          </div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                            appt.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                            appt.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            appt.status === 'Completed' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {appt.status}
                          </span>
                        </div>
                      ))}
                      {appointments.length > 3 && (
                        <button
                          onClick={() => handleTabChange('appointments')}
                          className="w-full text-center text-sm font-semibold text-[#156619] hover:underline pt-2 block"
                        >
                          View all appointments
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm text-center py-6">You have no appointment history.</p>
                  )}
                </div>
              </div>
            )}

            {/* BOOK APPOINTMENT TAB */}
            {activeTab === 'book' && (
              <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm max-w-2xl">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <h2 className="text-2xl font-extrabold text-slate-900">Request Appointment</h2>
                  <p className="text-slate-500 text-sm">Submit your appointment details. Our administration team will review and approve the request.</p>
                </div>

                {bookingSuccess && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md mb-6 flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-green-700 font-semibold">{bookingSuccess}</span>
                  </div>
                )}

                {bookingError && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-red-700 font-semibold">{bookingError}</span>
                  </div>
                )}

                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Clinical Department *
                      </label>
                      <select
                        required
                        className="block w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#156619]"
                        value={bookingDept}
                        onChange={(e) => {
                          setBookingDept(e.target.value);
                          setBookingDoc('');
                        }}
                      >
                        <option value="">-- Choose Department --</option>
                        {departments.map(dept => (
                          <option key={dept._id} value={dept._id}>{dept.title}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Specialist Doctor *
                      </label>
                      <select
                        required
                        disabled={!bookingDept}
                        className="block w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#156619] disabled:bg-slate-50"
                        value={bookingDoc}
                        onChange={(e) => setBookingDoc(e.target.value)}
                      >
                        <option value="">-- Select Specialist --</option>
                        {filteredDoctors.map(doc => (
                          <option key={doc._id} value={doc._id}>{doc.name} ({doc.qualification})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="block w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#156619]"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Preferred Time Slot *
                      </label>
                      <select
                        required
                        className="block w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#156619]"
                        value={bookingSlot}
                        onChange={(e) => setBookingSlot(e.target.value)}
                      >
                        <option value="">-- Choose Time Preference --</option>
                        {timeSlots.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Describe Symptoms / Reasons for Visit
                    </label>
                    <textarea
                      placeholder="List any symptoms, current complications, or health inquiries here..."
                      rows={4}
                      className="block w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#156619] resize-none"
                      value={bookingSymptoms}
                      onChange={(e) => setBookingSymptoms(e.target.value)}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingBooking}
                    className="w-full sm:w-auto px-6 py-3 border border-transparent font-bold text-sm rounded-lg text-white bg-[#156619] hover:bg-[#0f4d12] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#156619] disabled:opacity-50"
                  >
                    {isSubmittingBooking ? 'Submitting...' : 'Submit Booking Request'}
                  </button>
                </form>
              </div>
            )}

            {/* APPOINTMENTS LIST TAB */}
            {activeTab === 'appointments' && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <h2 className="text-2xl font-extrabold text-slate-900">Your Appointment History</h2>
                  <p className="text-slate-500 text-sm">A list of all your scheduled, pending, and completed visits.</p>
                </div>

                {appointments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/50">
                          <th className="p-3 text-xs font-extrabold text-slate-400 uppercase">Consulting Doctor</th>
                          <th className="p-3 text-xs font-extrabold text-slate-400 uppercase">Date & Time</th>
                          <th className="p-3 text-xs font-extrabold text-slate-400 uppercase">Department</th>
                          <th className="p-3 text-xs font-extrabold text-slate-400 uppercase">Status</th>
                          <th className="p-3 text-xs font-extrabold text-slate-400 uppercase">Details & Prescriptions</th>
                          <th className="p-3 text-xs font-extrabold text-slate-400 uppercase text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((appt) => (
                          <tr key={appt._id} className="border-b border-slate-100 hover:bg-slate-50/30 transition-colors">
                            <td className="p-3">
                              <div className="font-bold text-slate-800 text-sm">{appt.doctor?.name || 'Unassigned'}</div>
                              <div className="text-xs text-slate-400 truncate max-w-[150px]">{appt.doctor?.qualification}</div>
                            </td>
                            <td className="p-3 text-slate-600 text-sm font-medium">
                              <div>{new Date(appt.date).toLocaleDateString()}</div>
                              <div className="text-xs text-slate-400">{appt.timeSlot}</div>
                            </td>
                            <td className="p-3 text-slate-500 text-sm">{appt.department?.title || 'N/A'}</td>
                            <td className="p-3">
                              <span className={`text-xs font-bold px-2.5 py-0.5 rounded border inline-block ${
                                appt.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                                appt.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                appt.status === 'Completed' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-red-50 text-red-700 border-red-200'
                              }`}>
                                {appt.status}
                              </span>
                            </td>
                            <td className="p-3 max-w-[200px] text-xs">
                              {appt.symptoms && (
                                <div className="text-slate-600 mb-1">
                                  <strong>Symptoms:</strong> {appt.symptoms}
                                </div>
                              )}
                              {appt.prescription ? (
                                <div className="bg-blue-50 p-2.5 rounded border border-blue-100 text-blue-900 mt-1">
                                  <strong>Diagnosis & Prescription:</strong>
                                  <p className="mt-1 whitespace-pre-wrap">{appt.prescription}</p>
                                </div>
                              ) : (
                                appt.status === 'Completed' && <span className="text-slate-400">Prescription not specified.</span>
                              )}
                              {appt.adminNotes && (
                                <div className="text-slate-500 mt-1 font-medium">
                                  <strong>Staff Notes:</strong> {appt.adminNotes}
                                </div>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              {(appt.status === 'Pending' || appt.status === 'Approved') && (
                                <button
                                  onClick={() => handleCancelAppointment(appt._id)}
                                  className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 py-1 px-2.5 rounded transition-colors"
                                >
                                  Cancel Request
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm text-center py-12">No appointment history found.</p>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm max-w-3xl">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <h2 className="text-2xl font-extrabold text-slate-900">Health Profile</h2>
                  <p className="text-slate-500 text-sm">Keep your personal contact and medical history details up-to-date for your consultants.</p>
                </div>

                {profileSuccess && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md mb-6 flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-green-700 font-semibold">{profileSuccess}</span>
                  </div>
                )}

                {profileError && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-red-700 font-semibold">{profileError}</span>
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <h3 className="text-sm font-extrabold text-[#156619] tracking-wider uppercase border-b border-slate-100 pb-1.5">Personal details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        className="block w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#156619]"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        className="block w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#156619]"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="block w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#156619]"
                        value={profilePhone}
                        placeholder="e.g. 98xxxxxxxx"
                        onChange={(e) => setProfilePhone(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Gender
                      </label>
                      <select
                        className="block w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#156619]"
                        value={profileGender}
                        onChange={(e) => setProfileGender(e.target.value)}
                      >
                        <option value="">-- Choose Gender --</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        className="block w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#156619]"
                        value={profileDob}
                        onChange={(e) => setProfileDob(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Permanent Address
                      </label>
                      <input
                        type="text"
                        className="block w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#156619]"
                        value={profileAddress}
                        placeholder="City, District"
                        onChange={(e) => setProfileAddress(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Blood Group
                      </label>
                      <input
                        type="text"
                        className="block w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#156619]"
                        value={profileBloodGroup}
                        placeholder="e.g. O+, A-"
                        onChange={(e) => setProfileBloodGroup(e.target.value)}
                      />
                    </div>
                  </div>

                  <h3 className="text-sm font-extrabold text-[#156619] tracking-wider uppercase border-b border-slate-100 pb-1.5 mt-8">Medical Context</h3>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Chronic Illnesses, Allergies, or Past Operations
                    </label>
                    <textarea
                      placeholder="Specify your known health complications, long-term medication, drug allergies etc..."
                      rows={4}
                      className="block w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#156619] resize-none"
                      value={profileHistory}
                      onChange={(e) => setProfileHistory(e.target.value)}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="px-6 py-3 border border-transparent font-bold text-sm rounded-lg text-white bg-[#156619] hover:bg-[#0f4d12] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#156619] disabled:opacity-50"
                  >
                    {isUpdatingProfile ? 'Updating Details...' : 'Save Profile Changes'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientDashboard;
