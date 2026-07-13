import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const PatientLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Parse redirect query parameter
  const queryParams = new URLSearchParams(window.location.search);
  const redirectUrl = queryParams.get('redirect');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate('/patient/dashboard');
      }
    }
  }, [user, navigate, redirectUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate('/patient/dashboard');
      }
    } else {
      setErrorMsg(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-[#156619]/10 flex items-center justify-center text-[#156619]">
            <Activity className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">Patient Portal</h2>
          <p className="mt-2 text-sm text-slate-500">
            Log in to manage appointments, view prescriptions, and update health records.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <span className="text-sm text-red-700">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="yourname@example.com"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#156619] focus:border-transparent text-slate-900 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type="password"
                  id="password"
                  required
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#156619] focus:border-transparent text-slate-900 text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-[#156619] hover:bg-[#0f4d12] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#156619] transition-colors duration-200 disabled:opacity-50"
            >
              {isSubmitting ? 'Verifying...' : 'Log In'}
              <LogIn className="ml-2 h-5 w-5 shrink-0" />
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-slate-600 pt-4 border-t border-slate-100">
          <p>
            New patient?{' '}
            <Link 
              to={redirectUrl ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : "/register"} 
              className="font-semibold text-[#156619] hover:text-[#0f4d12]"
            >
              Create an Account
            </Link>
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Are you a clinical admin?{' '}
            <Link to="/admin/login" className="font-semibold text-slate-600 hover:text-slate-800 underline">
              Admin Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;
