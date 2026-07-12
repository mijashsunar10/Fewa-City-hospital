import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  User, Calendar, FileText, ClipboardList, LogOut, CheckCircle, Clock, XCircle, 
  UserCheck, AlertCircle, Edit, MapPin, Phone, Award, ShieldAlert, BookOpen, ArrowLeft,
  Bell, Check, Activity, Download
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
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Form Booking State
  const [bookingDept, setBookingDept] = useState('');
  const [bookingDoc, setBookingDoc] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingSlot, setBookingSlot] = useState('');
  const [bookingSymptoms, setBookingSymptoms] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState(null);
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);
  const [paymentInitiateError, setPaymentInitiateError] = useState('');

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

  // 30-minute Time Slots
  const ALL_30MIN_SLOTS = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
  ];

  const [bookedSlots, setBookedSlots] = useState([]);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  const [slotCheckError, setSlotCheckError] = useState('');

  // Fetch occupied slots for selected doctor and date
  useEffect(() => {
    const getOccupiedSlots = async () => {
      if (!bookingDoc || !bookingDate || !token) {
        setBookedSlots([]);
        return;
      }
      try {
        setIsFetchingSlots(true);
        setSlotCheckError('');
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const res = await axios.get(
          `${API_BASE_URL}/api/appointments/booked-slots?doctorId=${bookingDoc}&date=${bookingDate}`,
          config
        );
        setBookedSlots(res.data);
      } catch (err) {
        console.error('Error checking booked slots:', err);
        setSlotCheckError('Failed to fetch slot occupancy status.');
      } finally {
        setIsFetchingSlots(false);
      }
    };
    getOccupiedSlots();
  }, [bookingDoc, bookingDate, token]);

  const selectedDoctorObj = useMemo(() => {
    return doctors.find(d => d._id === bookingDoc);
  }, [doctors, bookingDoc]);

  const selectedDayOfWeek = useMemo(() => {
    if (!bookingDate) return '';
    const parts = bookingDate.split('-');
    const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dateObj.getDay()];
  }, [bookingDate]);

  const isDoctorAvailableOnDay = useMemo(() => {
    if (!selectedDoctorObj || !selectedDayOfWeek) return true;
    const days = selectedDoctorObj.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return days.includes(selectedDayOfWeek);
  }, [selectedDoctorObj, selectedDayOfWeek]);

  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (hours === 12) {
      hours = modifier === 'AM' ? 0 : 12;
    } else if (modifier === 'PM') {
      hours += 12;
    }
    return hours * 60 + minutes;
  };

  const filteredSlots = useMemo(() => {
    if (!selectedDoctorObj) return ALL_30MIN_SLOTS;
    const startMin = timeToMinutes(selectedDoctorObj.workingStart || '09:00 AM');
    const endMin = timeToMinutes(selectedDoctorObj.workingEnd || '05:00 PM');
    return ALL_30MIN_SLOTS.filter(slot => {
      const slotMin = timeToMinutes(slot);
      return slotMin >= startMin && slotMin < endMin;
    });
  }, [selectedDoctorObj]);

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

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const res = await axios.get(`${API_BASE_URL}/api/notifications`, config);
      setNotifications(res.data);
      const unreads = res.data.filter(n => !n.isRead).length;
      setUnreadCount(unreads);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const handleMarkAsRead = async (notifId) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.put(`${API_BASE_URL}/api/notifications/${notifId}/read`, {}, config);
      setNotifications(prev => 
        prev.map(n => n._id === notifId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.put(`${API_BASE_URL}/api/notifications/read-all`, {}, config);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  useEffect(() => {
    if (user && user.role === 'user') {
      fetchData();
      fetchNotifications();
    }
  }, [user, token]);

  // Set up live polling (every 10 seconds) for updates
  useEffect(() => {
    if (user && user.role === 'user' && token) {
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [user, token]);

  useEffect(() => {
    if (activeTab === 'book' && departments.length > 0) {
      const deptName = searchParams.get('deptName');
      const docId = searchParams.get('docId');
      
      if (deptName) {
        const cleanStringForMatching = (str) => {
          if (!str) return '';
          return str
            .toString()
            .toLowerCase()
            .replace(/departments?/gi, '')
            .replace(/s\b/gi, '')
            .replace(/[^a-z0-9]/gi, '')
            .trim();
        };

        const cleanQuery = cleanStringForMatching(deptName);
        const matchedDept = departments.find(d => {
          const cleanTitle = cleanStringForMatching(d.title);
          const cleanSlug = cleanStringForMatching(d.slug);
          return cleanTitle === cleanQuery || cleanSlug === cleanQuery || cleanTitle.includes(cleanQuery) || cleanQuery.includes(cleanTitle);
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
    setCreatedAppointment(null);
    setPaymentInitiateError('');
    setProfileSuccess('');
    setProfileError('');
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingSuccess('');
    setBookingError('');
    setCreatedAppointment(null);
    setPaymentInitiateError('');

    if (!bookingDept || !bookingDoc || !bookingDate || !bookingSlot) {
      setBookingError('Please fill out all required booking fields.');
      return;
    }

    setIsSubmittingBooking(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const res = await axios.post(API_BASE_URL + '/api/appointments', {
        department: bookingDept,
        doctor: bookingDoc,
        date: bookingDate,
        timeSlot: bookingSlot,
        symptoms: bookingSymptoms
      }, config);

      setBookingSuccess('Appointment requested successfully!');
      setCreatedAppointment(res.data);

      // Refresh appointments list in the background
      fetchData();
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to submit appointment booking.');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const handleInitiateKhalti = async (appointmentId) => {
    setIsInitiatingPayment(true);
    setPaymentInitiateError('');
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const res = await axios.post(
        `${API_BASE_URL}/api/payments/khalti/initiate`,
        { appointmentId },
        config
      );
      if (res.data.success && res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        setPaymentInitiateError('Failed to retrieve payment redirect URL from Khalti.');
      }
    } catch (err) {
      console.error('Error initiating payment:', err);
      setPaymentInitiateError(err.response?.data?.message || 'Khalti ePayment service is currently unavailable.');
    } finally {
      setIsInitiatingPayment(false);
    }
  };

  const handleSkipPayment = () => {
    setCreatedAppointment(null);
    setBookingSuccess('');
    setBookingDept('');
    setBookingDoc('');
    setBookingDate('');
    setBookingSlot('');
    setBookingSymptoms('');
    setSearchParams({ tab: 'appointments' });
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

  const [downloadingIds, setDownloadingIds] = useState({});
  const [expandedAppts, setExpandedAppts] = useState({});

  const toggleExpandAppt = (id) => {
    setExpandedAppts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDownloadPrescription = async (apptId, doctorName) => {
    try {
      setDownloadingIds((prev) => ({ ...prev, [apptId]: true }));
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      };
      const res = await axios.get(
        `${API_BASE_URL}/api/appointments/${apptId}/prescription/download`,
        config
      );

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;

      // Format file name professionally
      const cleanDocName = doctorName ? doctorName.replace(/\s+/g, '_').replace(/Dr\._?/g, '') : 'Doctor';
      link.setAttribute('download', `FCH_Prescription_${cleanDocName}_${apptId.slice(-6)}.pdf`);

      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download prescription PDF:', error);
      alert('Failed to download prescription PDF. Please try again.');
    } finally {
      setDownloadingIds((prev) => ({ ...prev, [apptId]: false }));
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

  const patientAge = useMemo(() => {
    if (!user || !user.dob) return 'N/A';
    const birthDate = new Date(user.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} years`;
  }, [user]);

  const latestNotification = useMemo(() => {
    if (!notifications || notifications.length === 0) return null;
    const unread = notifications.find(n => !n.isRead);
    return unread || notifications[0];
  }, [notifications]);

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
            onClick={() => handleTabChange('notifications')}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'notifications'
                ? 'bg-[#156619] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell className="h-4.5 w-4.5" />
              <span>Notifications Center</span>
            </div>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                {unreadCount}
              </span>
            )}
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Welcome Back, {user.name.split(' ')[0]}!
                    </h1>
                    <p className="text-slate-500 text-sm">Access your clinical reports, appointment status, and health records below.</p>
                  </div>
                  <div className="text-xs text-slate-500 font-semibold bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm self-start md:self-auto flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>System Status: Online & Synchronized</span>
                  </div>
                </div>

                {/* LATEST UNREAD NOTIFICATION BANNER */}
                {latestNotification && !latestNotification.isRead && (
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 flex items-start justify-between gap-3 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-emerald-100/80 text-emerald-800 rounded-lg shrink-0 mt-0.5">
                        <Bell className="h-4.5 w-4.5 animate-bounce" />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded tracking-wider">
                          Latest Clinical Update
                        </span>
                        <h4 className="text-sm font-extrabold text-slate-900 mt-1">
                          {latestNotification.title}
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-medium">
                          {latestNotification.message}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleMarkAsRead(latestNotification._id);
                        handleTabChange('notifications');
                      }}
                      className="text-xs font-bold text-emerald-700 hover:text-[#156619] shrink-0 hover:underline flex items-center gap-1 bg-white hover:bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg shadow-sm"
                    >
                      View Hub &rarr;
                    </button>
                  </div>
                )}

                {/* STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-all hover:scale-[1.01] hover:shadow">
                    <div className="p-3 bg-[#156619]/10 text-[#156619] rounded-lg">
                      <ClipboardList className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Consults</span>
                      <h4 className="text-2xl font-black text-slate-800">{totalAppointments}</h4>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-all hover:scale-[1.01] hover:shadow">
                    <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Requests</span>
                      <h4 className="text-2xl font-black text-slate-800">{pendingAppointments}</h4>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-all hover:scale-[1.01] hover:shadow">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Approved Visits</span>
                      <h4 className="text-2xl font-black text-slate-800">{approvedAppointments}</h4>
                    </div>
                  </div>
                </div>

                {/* NEXT APPOINTMENT / BANNER */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 bg-gradient-to-br from-[#156619] to-emerald-900 text-white p-6 md:p-8 rounded-xl shadow-md flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                      <Calendar className="h-48 w-48 animate-pulse" />
                    </div>
                    <div className="relative z-10">
                      <h2 className="text-xl md:text-2xl font-bold">Schedule an Appointment</h2>
                      <p className="mt-2 text-emerald-100/90 text-sm max-w-md leading-relaxed">
                        Book direct visits or follow-ups with Pokhara's top medical specialists. Specify symptoms for personalized clinical care.
                      </p>
                    </div>
                    <button
                      onClick={() => handleTabChange('book')}
                      className="mt-6 w-fit bg-[#facc15] hover:bg-[#eab308] text-slate-900 px-5 py-2.5 rounded-lg font-bold text-sm transition-all hover:scale-105 shadow-md hover:shadow-lg relative z-10"
                    >
                      Book New Consult
                    </button>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between transition-all hover:shadow">
                    <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-3 uppercase tracking-wider">Next Scheduled Visit</h3>
                    {nextAppointment ? (
                      <div className="mt-4 flex-grow flex flex-col justify-between gap-4">
                        <div>
                          <div className="font-bold text-slate-900 text-base">{nextAppointment.doctor?.name || 'Assigned Specialist'}</div>
                          <div className="text-xs text-[#156619] font-bold mt-0.5">{nextAppointment.department?.title || 'Clinic'}</div>
                          
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                              <Calendar className="h-4 w-4 text-[#156619]" />
                              <span>{new Date(nextAppointment.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                              <Clock className="h-4 w-4 text-[#156619]" />
                              <span>{nextAppointment.timeSlot}</span>
                            </div>
                          </div>
                        </div>
                        <span className={`w-fit text-[10px] uppercase font-extrabold px-3 py-1 rounded-full border ${
                          nextAppointment.status === 'Approved'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}>
                          {nextAppointment.status}
                        </span>
                      </div>
                    ) : (
                      <div className="my-auto py-8 flex flex-col items-center justify-center text-center">
                        <Calendar className="h-10 w-10 text-slate-300 stroke-[1.5]" />
                        <p className="mt-2 text-xs text-slate-400 font-semibold">No active bookings.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* CLINICAL SUMMARY & HELPLINES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                      <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2 uppercase tracking-wider">
                        <Activity className="h-4 w-4 text-[#156619]" />
                        Personal Clinical Summary
                      </h3>
                      <button
                        onClick={() => handleTabChange('profile')}
                        className="text-xs text-[#156619] hover:underline font-bold"
                      >
                        Edit Details
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs mb-4">
                      <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100 text-center">
                        <span className="text-[9px] text-slate-400 font-bold block uppercase mb-1">Blood Group</span>
                        <span className="text-sm font-extrabold text-red-600 flex items-center justify-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"></span>
                          {user.bloodGroup || 'Not Set'}
                        </span>
                      </div>
                      
                      <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100 text-center">
                        <span className="text-[9px] text-slate-400 font-bold block uppercase mb-1">Calculated Age</span>
                        <span className="text-sm font-extrabold text-slate-800">{patientAge}</span>
                      </div>

                      <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100 text-center">
                        <span className="text-[9px] text-slate-400 font-bold block uppercase mb-1">Gender</span>
                        <span className="text-sm font-extrabold text-slate-800">{user.gender || 'Not Set'}</span>
                      </div>
                      
                      <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100 text-center">
                        <span className="text-[9px] text-slate-400 font-bold block uppercase mb-1">Address</span>
                        <span className="text-sm font-bold text-slate-800 truncate block">{user.address || 'Not Set'}</span>
                      </div>
                    </div>
                    
                    {user.medicalHistory ? (
                      <div className="p-4 bg-red-50/30 border border-red-100 rounded-lg text-xs">
                        <strong className="text-red-800 block mb-1 uppercase tracking-wider text-[10px]">Medical History & Chronics:</strong>
                        <p className="text-slate-600 leading-relaxed italic">"{user.medicalHistory}"</p>
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-50 border border-slate-200 border-dashed rounded-lg text-xs text-slate-400 text-center">
                        No chronic complications or allergies declared in your profile.
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between transition-all hover:shadow">
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-3 mb-4 uppercase tracking-wider">
                        Hospital Helpline
                      </h3>
                      <div className="space-y-4 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 shrink-0">
                            <Phone className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">24/7 Desk Reception</p>
                            <p className="text-[10px] text-slate-500 font-semibold">+977-61-5940555</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 shrink-0">
                            <MapPin className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">Fewa City Location</p>
                            <p className="text-[10px] text-slate-500 font-semibold">Nagdhunga, Pokhara, Nepal</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 leading-normal">
                      For immediate trauma, cardiac issues or major accidents, reach our emergency wing at once.
                    </div>
                  </div>
                </div>

                {/* RECENT VISITS TIMELINE */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow">
                  <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-3 mb-4 uppercase tracking-wider">Recent Consultations</h3>
                  {appointments.length > 0 ? (
                    <div className="space-y-4">
                      {appointments.slice(0, 3).map((appt) => (
                        <div key={appt._id} className="flex justify-between items-center p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg border shrink-0 ${
                              appt.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                              appt.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                              appt.status === 'Completed' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                              {appt.status === 'Approved' ? <CheckCircle className="h-4.5 w-4.5" /> :
                               appt.status === 'Pending' ? <Clock className="h-4.5 w-4.5" /> :
                               appt.status === 'Completed' ? <UserCheck className="h-4.5 w-4.5" /> : <XCircle className="h-4.5 w-4.5" />}
                            </div>
                            <div>
                              <div className="font-bold text-sm text-slate-900">Dr. {appt.doctor?.name || 'Specialist'}</div>
                              <div className="text-[11px] text-slate-400 font-semibold mt-0.5">
                                {new Date(appt.date).toLocaleDateString()} &bull; {appt.timeSlot}
                              </div>
                            </div>
                          </div>
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase ${
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
                          className="w-full text-center text-xs font-bold text-[#156619] hover:underline pt-2 block"
                        >
                          View All Consultations History &rarr;
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm text-center py-6">You have no appointment history.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'book' && (
              <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm max-w-2xl">
                {createdAppointment ? (
                  <div className="checkout-payment-panel space-y-6">
                    <div className="text-center pb-4 border-b border-slate-100">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mb-4">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-black text-slate-900">Appointment Requested!</h2>
                      <p className="text-slate-500 text-sm mt-1">Your slot reservation request has been registered.</p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/60 text-sm space-y-3">
                      <h3 className="font-extrabold text-slate-800 text-base mb-2 border-b border-slate-200/50 pb-2">Booking Summary</h3>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Specialist Doctor:</span>
                        <span className="font-bold text-slate-800">
                          Dr. {doctors.find(d => d._id === createdAppointment.doctor)?.name || 'Specialist'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Clinical Department:</span>
                        <span className="font-bold text-slate-800">
                          {departments.find(d => d._id === createdAppointment.department)?.title || 'Clinical'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Date & Slot:</span>
                        <span className="font-bold text-slate-800 text-right">
                          {new Date(createdAppointment.date).toLocaleDateString()} at {createdAppointment.timeSlot}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-slate-200/50">
                        <span className="text-slate-500 font-medium">Reservation Deposit Fee:</span>
                        <span className="font-extrabold text-[#5c2d91] text-base">Rs. 150.00</span>
                      </div>
                    </div>

                    {paymentInitiateError && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-red-700 font-semibold">{paymentInitiateError}</span>
                      </div>
                    )}

                    <div className="space-y-3">
                      <button
                        onClick={() => handleInitiateKhalti(createdAppointment._id)}
                        disabled={isInitiatingPayment}
                        className="w-full flex items-center justify-center gap-2 bg-[#5c2d91] hover:bg-[#4c2479] text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all text-sm disabled:opacity-50"
                      >
                        {isInitiatingPayment ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span>Directing to Khalti...</span>
                          </>
                        ) : (
                          <>
                            <span className="bg-white/20 text-white rounded px-2 py-0.5 text-[10px] font-extrabold mr-1">Rs. 150</span>
                            <span>Pay Booking Deposit via Khalti</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleSkipPayment}
                        disabled={isInitiatingPayment}
                        className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3.5 px-4 rounded-xl transition-colors text-sm disabled:opacity-50"
                      >
                        Skip & Pay Offline / Counter
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
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
                            onChange={(e) => {
                              setBookingDate(e.target.value);
                              setBookingSlot(''); // Reset selected slot when date changes
                            }}
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Preferred Time Slot *
                          </label>
                          
                          {!bookingDoc || !bookingDate ? (
                            <div className="bg-slate-50 border border-dashed border-slate-200 text-center py-6 text-sm text-slate-500 rounded-xl">
                              Please select a specialist doctor and preferred date first.
                            </div>
                          ) : isFetchingSlots ? (
                            <div className="flex items-center gap-2 py-4 justify-center text-sm text-slate-500">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-700 border-t-transparent"></div>
                              Checking slot availability...
                            </div>
                          ) : !isDoctorAvailableOnDay ? (
                            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-sm">
                              <p className="font-semibold mb-1">
                                Dr. {selectedDoctorObj?.name} is not available on {selectedDayOfWeek}s.
                              </p>
                              <p className="text-xs text-amber-700">
                                Available days: {(selectedDoctorObj?.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']).join(', ')}
                              </p>
                            </div>
                          ) : (
                            <div>
                              {slotCheckError && <p className="text-xs text-red-600 mb-2">{slotCheckError}</p>}
                              {filteredSlots.length === 0 ? (
                                <div className="bg-slate-50 border border-slate-200 text-center py-4 text-sm text-slate-500 rounded-xl">
                                  No slots configured for this doctor's hours.
                                </div>
                              ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                  {filteredSlots.map(slot => {
                                    const isBooked = bookedSlots.includes(slot);
                                    const isSelected = bookingSlot === slot;
                                    return (
                                      <button
                                        key={slot}
                                        type="button"
                                        disabled={isBooked}
                                        onClick={() => setBookingSlot(slot)}
                                        className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                                          isBooked 
                                            ? 'bg-slate-100 border-slate-200 text-slate-400 line-through cursor-not-allowed'
                                            : isSelected
                                              ? 'bg-[#156619] border-[#156619] text-white shadow-sm font-bold'
                                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                      >
                                        {slot} {isBooked && <span className="block text-[9px] opacity-75">(Booked)</span>}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
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
                  </>
                )}
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
                            <td className="p-3 space-y-1.5">
                              <div>
                                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded border uppercase inline-block ${
                                  appt.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                                  appt.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                  appt.status === 'Completed' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-red-50 text-red-700 border-red-200'
                                }`}>
                                  {appt.status}
                                </span>
                              </div>
                              <div>
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase inline-block ${
                                  appt.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                  appt.paymentStatus === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                  'bg-slate-50 text-slate-600 border-slate-200'
                                }`}>
                                  {appt.paymentStatus === 'Paid' ? 'Paid (Khalti)' : appt.paymentStatus === 'Pending' ? 'Pay Pending' : 'Unpaid'}
                                </span>
                              </div>
                            </td>
                            <td className="p-3 max-w-[200px] text-xs">
                              {appt.symptoms && (
                                <div className="text-slate-600 mb-1">
                                  <strong>Symptoms:</strong> {appt.symptoms}
                                </div>
                              )}
                              {appt.prescription ? (
                                <div className="mt-2 space-y-2">
                                  <button
                                    onClick={() => toggleExpandAppt(appt._id)}
                                    className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold transition-all shadow-sm"
                                  >
                                    <FileText className="h-3.5 w-3.5" />
                                    <span>{expandedAppts[appt._id] ? 'Hide Rx E-Slip' : 'View Rx E-Slip'}</span>
                                  </button>
                                  
                                  {expandedAppts[appt._id] && (
                                    <div className="mt-2 space-y-2 max-w-sm transition-all duration-300">
                                      <div className="bg-white border-2 border-slate-200 rounded-xl shadow-md overflow-hidden font-mono text-slate-800 select-text">
                                        {/* Header */}
                                        <div className="bg-slate-50 p-3 border-b border-slate-200 flex justify-between items-center text-[10px] font-bold">
                                          <span className="text-slate-900 tracking-wider">FEWA CITY HOSPITAL</span>
                                          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 text-[9px] font-extrabold uppercase shrink-0">
                                            Rx E-Slip
                                          </span>
                                        </div>
                                        
                                        {/* Doc info */}
                                        <div className="p-3 bg-slate-50/50 border-b border-slate-100 flex justify-between text-[10px] font-medium leading-relaxed">
                                          <div>
                                            <p className="font-extrabold text-slate-950">Dr. {appt.doctor?.name || 'Specialist'}</p>
                                            <p className="text-[9px] text-slate-400 font-semibold">{appt.doctor?.qualification}</p>
                                          </div>
                                          <div className="text-right text-slate-500 font-bold text-[9px]">
                                            <p>{new Date(appt.date).toLocaleDateString()}</p>
                                          </div>
                                        </div>

                                        {/* Rx symbol & clinical instructions */}
                                        <div className="p-4 bg-white">
                                          <div className="text-xl font-serif font-black text-[#156619] mb-2">Rx</div>
                                          <p className="text-xs font-sans leading-relaxed whitespace-pre-wrap text-slate-700 border-l-2 border-[#156619]/20 pl-2">
                                            {appt.prescription}
                                          </p>
                                        </div>

                                        {/* Signature footer */}
                                        <div className="p-2.5 bg-slate-50/20 border-t border-dashed border-slate-200 flex justify-between items-center text-[8px] text-slate-400">
                                          <span className="italic">* Electronic Signature Verified</span>
                                          <span className="font-serif font-bold text-[#156619]">FCH Nepal</span>
                                        </div>
                                      </div>
                                      
                                      <button
                                        onClick={() => handleDownloadPrescription(appt._id, appt.doctor?.name)}
                                        disabled={downloadingIds[appt._id]}
                                        className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-[#156619] text-white font-bold py-2 px-4 rounded-lg shadow-sm hover:shadow transition-all text-xs disabled:opacity-50"
                                      >
                                        {downloadingIds[appt._id] ? (
                                          <>
                                            <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"></div>
                                            <span>Generating PDF...</span>
                                          </>
                                        ) : (
                                          <>
                                            <Download className="h-3.5 w-3.5" />
                                            <span>Download Prescription PDF</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  )}
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
                              <div className="flex flex-col items-end gap-2">
                                {appt.paymentStatus !== 'Paid' && appt.status !== 'Cancelled' && (
                                  <button
                                    onClick={() => handleInitiateKhalti(appt._id)}
                                    className="text-xs font-extrabold text-white bg-[#5c2d91] hover:bg-[#4c2479] py-1.5 px-3 rounded-lg transition-all shadow-sm inline-flex items-center gap-1 shrink-0"
                                  >
                                    Pay Rs. 150
                                  </button>
                                )}
                                {(appt.status === 'Pending' || appt.status === 'Approved') && (
                                  <button
                                    onClick={() => handleCancelAppointment(appt._id)}
                                    className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 py-1.5 px-3 rounded-lg transition-colors shrink-0"
                                  >
                                    Cancel Request
                                  </button>
                                )}
                              </div>
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

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900">Notifications Hub</h2>
                    <p className="text-slate-500 text-sm">Stay updated on your booking status, schedule changes, and prescriptions.</p>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-105 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all border border-slate-200"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>

                {notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.map((notif) => {
                      // Determine theme colors based on type
                      let iconColor = 'text-blue-600 bg-blue-50 border-blue-200';
                      let barColor = 'border-l-blue-500';
                      let statusIcon = <Bell className="h-5 w-5" />;

                      if (notif.type === 'BookingConfirmation') {
                        iconColor = 'text-amber-600 bg-amber-50 border-amber-200';
                        barColor = 'border-l-amber-500';
                      } else if (notif.type === 'Approved') {
                        iconColor = 'text-green-600 bg-green-50 border-green-200';
                        barColor = 'border-l-green-500';
                        statusIcon = <CheckCircle className="h-5 w-5" />;
                      } else if (notif.type === 'Cancelled') {
                        iconColor = 'text-red-600 bg-red-50 border-red-200';
                        barColor = 'border-l-red-500';
                        statusIcon = <XCircle className="h-5 w-5" />;
                      } else if (notif.type === 'Completed') {
                        iconColor = 'text-indigo-600 bg-indigo-50 border-indigo-200';
                        barColor = 'border-l-indigo-500';
                        statusIcon = <UserCheck className="h-5 w-5" />;
                      } else if (notif.type === 'Rescheduled') {
                        iconColor = 'text-orange-600 bg-orange-50 border-orange-200';
                        barColor = 'border-l-orange-500';
                        statusIcon = <Clock className="h-5 w-5" />;
                      } else if (notif.type === 'PrescriptionAdded') {
                        iconColor = 'text-cyan-600 bg-cyan-50 border-cyan-200';
                        barColor = 'border-l-cyan-500';
                        statusIcon = <FileText className="h-5 w-5" />;
                      } else if (notif.type === 'NotesAdded') {
                        iconColor = 'text-purple-600 bg-purple-50 border-purple-200';
                        barColor = 'border-l-purple-500';
                        statusIcon = <ClipboardList className="h-5 w-5" />;
                      }

                      return (
                        <div
                          key={notif._id}
                          className={`flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-100 transition-all ${
                            !notif.isRead 
                              ? `bg-slate-50/50 shadow-sm border-l-4 ${barColor}`
                              : 'bg-white text-slate-600'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`p-2.5 rounded-lg border ${iconColor} shrink-0`}>
                              {statusIcon}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className={`text-sm font-bold ${!notif.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                                  {notif.title}
                                </h4>
                                {!notif.isRead && (
                                  <span className="bg-red-500 w-1.5 h-1.5 rounded-full shrink-0 animate-ping"></span>
                                )}
                              </div>
                              <p className="text-xs md:text-sm leading-relaxed text-slate-600">
                                {notif.message}
                              </p>
                              <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5 mt-1">
                                <span>{new Date(notif.createdAt).toLocaleDateString()}</span>
                                <span>&bull;</span>
                                <span>{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>
                          </div>

                          {!notif.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notif._id)}
                              className="p-1 hover:bg-slate-100 text-slate-400 hover:text-[#156619] rounded-full shrink-0 transition-colors"
                              title="Mark as read"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-16 space-y-4">
                    <div className="p-4 bg-slate-50 text-slate-300 rounded-full border border-slate-100">
                      <Bell className="h-10 w-10" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Your notifications inbox is empty</p>
                      <p className="text-xs text-slate-400 mt-1">We will notify you here when the status of your bookings change.</p>
                    </div>
                  </div>
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
