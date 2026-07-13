import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';
import { CheckCircle2, XCircle, Loader2, ShieldCheck, Receipt } from 'lucide-react';
import './StripeCallback.css';

const StripeCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token, loading: authLoading } = useAuth();
  
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    window.scrollTo(0, 0);

    const verifyPayment = async () => {
      if (!token) {
        setStatus('error');
        setErrorMsg('Authorization token missing. Please log in to complete verification.');
        return;
      }
      if (!sessionId) {
        setStatus('error');
        setErrorMsg('Invalid Stripe redirect data. Missing checkout session_id.');
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const res = await axios.post(
          `${API_BASE_URL}/api/payments/stripe/verify`,
          { sessionId },
          config
        );

        if (res.data.success) {
          setStatus('success');
          setPaymentDetails(res.data.appointment);
        } else {
          setStatus('error');
          setErrorMsg(res.data.message || 'Stripe payment verification failed.');
        }
      } catch (err) {
        console.error('Error verifying Stripe payment:', err);
        setStatus('error');
        setErrorMsg(err.response?.data?.message || 'A network error occurred while verifying the card payment.');
      }
    };

    if (!authLoading) {
      verifyPayment();
    }
  }, [sessionId, token, authLoading]);

  const handleReturnToDashboard = () => {
    navigate('/patient/dashboard?tab=appointments');
  };

  return (
    <div className="stripe-callback-wrapper">
      <div className="stripe-callback-card">
        {status === 'verifying' && (
          <div className="status-container verifying">
            <Loader2 className="spinner-icon" />
            <h2>Verifying Card Payment</h2>
            <p>Please wait while we secure your slot reservation with Stripe Checkout...</p>
            <div className="verification-steps">
              <span className="step active">1. Directing back from Stripe Gateway</span>
              <span className="step active">2. Securing token validation</span>
              <span className="step loading">3. Approving appointment slot</span>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="status-container success">
            <div className="success-badge-animation">
              <CheckCircle2 className="success-icon animate-pop" />
            </div>
            <span className="stripe-badge">Stripe Credit/Debit Card</span>
            <h2>$1.50 Paid</h2>
            <p className="success-sub">Slot Reservation Deposit Completed Successfully!</p>

            {paymentDetails && (
              <div className="receipt-details">
                <h3><Receipt size={16} /> Reservation Receipt</h3>
                <div className="receipt-grid">
                  <div className="receipt-row">
                    <span className="label">Patient Name:</span>
                    <span className="value">{paymentDetails.patient?.name}</span>
                  </div>
                  <div className="receipt-row">
                    <span className="label">Specialist:</span>
                    <span className="value">Dr. {paymentDetails.doctor?.name}</span>
                  </div>
                  <div className="receipt-row">
                    <span className="label">Department:</span>
                    <span className="value">{paymentDetails.department?.title}</span>
                  </div>
                  <div className="receipt-row">
                    <span className="label">Date & Slot:</span>
                    <span className="value">
                      {new Date(paymentDetails.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at {paymentDetails.timeSlot}
                    </span>
                  </div>
                  {sessionId && (
                    <div className="receipt-row">
                      <span className="label">Session ID:</span>
                      <span className="value code">{sessionId.slice(0, 18)}...</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="security-guarantee">
              <ShieldCheck size={14} className="shield-icon" />
              <span>Card payment verified. Your slot is now active and approved!</span>
            </div>

            <button className="primary-dashboard-btn" onClick={handleReturnToDashboard}>
              Return to Patient Portal
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="status-container error">
            <XCircle className="error-icon" />
            <h2>Stripe Payment Unsuccessful</h2>
            <p className="error-sub">We were unable to complete your card deposit reservation.</p>
            
            <div className="error-reason-box">
              <strong>Reason:</strong>
              <p>{errorMsg || 'The card transaction was cancelled or declined.'}</p>
            </div>

            <p className="support-info">
              For any support regarding card transactions, contact Fewa City billing support at <strong>9765940555</strong>.
            </p>

            <div className="error-action-buttons">
              <button className="primary-dashboard-btn" onClick={handleReturnToDashboard}>
                Go to Dashboard
              </button>
              <button className="secondary-retry-btn" onClick={() => navigate('/patient/dashboard?tab=book')}>
                Try Booking Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StripeCallback;
