import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

const PatientRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Parse redirect query parameter
  const queryParams = new URLSearchParams(window.location.search);
  const redirectUrl = queryParams.get('redirect');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);
    const result = await register(name, email, password, 'user'); // Register as default 'user' (patient)
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMsg('Account registered successfully! Redirecting to dashboard...');
      setTimeout(() => {
        if (redirectUrl) {
          navigate(redirectUrl);
        } else {
          navigate('/patient/dashboard');
        }
      }, 1500);
    } else {
      setErrorMsg(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-[#156619]/10 flex items-center justify-center text-[#156619]">
            <UserPlus className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">Patient Registration</h2>
          <p className="mt-2 text-sm text-slate-500">
            Create an account to book and manage your medical appointments.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <span className="text-sm text-red-700">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <span className="text-sm text-green-700">{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <User className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  id="name"
                  required
                  placeholder="John Doe"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#156619] focus:border-transparent text-slate-900 text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

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
                  placeholder="john@example.com"
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
                  placeholder="Min. 6 characters"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#156619] focus:border-transparent text-slate-900 text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type="password"
                  id="confirmPassword"
                  required
                  placeholder="Repeat your password"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#156619] focus:border-transparent text-slate-900 text-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-[#156619] hover:bg-[#0f4d12] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#156619] transition-colors duration-200 disabled:opacity-50"
            >
              {isSubmitting ? 'Registering...' : 'Register'}
              <UserPlus className="ml-2 h-5 w-5 shrink-0" />
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-slate-600 pt-4 border-t border-slate-100">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#156619] hover:text-[#0f4d12]">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientRegister;
