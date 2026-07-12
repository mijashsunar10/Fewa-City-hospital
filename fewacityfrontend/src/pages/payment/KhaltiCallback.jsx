import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';
import { CheckCircle2, XCircle, Loader2, Calendar, ShieldCheck, User, Receipt } from 'lucide-react';
import './KhaltiCallback.css';

const KhaltiCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token, loading: authLoading } = useAuth();
  
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(null);

  const pidx = searchParams.get('pidx');
  const transactionId = searchParams.get('transaction_id');
  const amountPaisa = searchParams.get('amount');
  const khaltiStatus = searchParams.get('status');
  const purchaseOrderId = searchParams.get('purchase_order_id');

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);

    const verifyPayment = async () => {
      if (!pidx) {
        setStatus('error');
        setErrorMsg('Invalid payment redirect data. Missing transaction pidx.');
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const res = await axios.post(
          `${API_BASE_URL}/api/payments/khalti/verify`,
          { pidx },
          config
        );

        if (res.data.success) {
          setStatus('success');
          setPaymentDetails(res.data.appointment);
        } else {
          setStatus('error');
          setErrorMsg(res.data.message || 'Payment verification failed.');
        }
      } catch (err) {
        console.error('Error verifying payment:', err);
        setStatus('error');
        setErrorMsg(err.response?.data?.message || 'A network error occurred while verifying the payment.');
      }
    };

    if (!authLoading) {
      if (token) {
        verifyPayment();
      } else {
        // If not authenticated, we can't call verify safely yet. Wait or ask to redirect.
        setStatus('error');
        setErrorMsg('Authorization token missing. Please log in and try again.');
      }
    }
  }, [pidx, token, authLoading]);

  const handleReturnToDashboard = () => {
    navigate('/patient/dashboard?tab=appointments');
  };

  return (
    <div className="khalti-callback-wrapper">
      <div className="khalti-callback-card">
        {status === 'verifying' && (
          <div className="status-container verifying">
            <Loader2 className="spinner-icon" />
            <h2>Verifying Payment</h2>
            <p>Please wait while we secure your slot reservation with Khalti Gateway...</p>
            <div className="verification-steps">
              <span className="step active">1. Directing back from Khalti</span>
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
            <span className="khalti-badge">Khalti Instant ePayment</span>
            <h2>Rs. {(amountPaisa ? parseInt(amountPaisa) / 100 : 150).toFixed(2)} Paid</h2>
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
                  {transactionId && (
                    <div className="receipt-row">
                      <span className="label">Transaction ID:</span>
                      <span className="value code">{transactionId}</span>
                    </div>
                  )}
                  {pidx && (
                    <div className="receipt-row">
                      <span className="label">Khalti pidx:</span>
                      <span className="value code">{pidx.slice(0, 16)}...</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="security-guarantee">
              <ShieldCheck size={14} className="shield-icon" />
              <span>Slot Locked. You can view your slot details anytime in the dashboard.</span>
            </div>

            <button className="primary-dashboard-btn" onClick={handleReturnToDashboard}>
              Return to Patient Portal
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="status-container error">
            <XCircle className="error-icon" />
            <h2>Payment Unsuccessful</h2>
            <p className="error-sub">We were unable to complete your online slot booking reservation.</p>
            
            <div className="error-reason-box">
              <strong>Reason:</strong>
              <p>{errorMsg || 'The transaction was cancelled or failed at the payment gateway level.'}</p>
            </div>

            <p className="support-info">
              If your bank/wallet was debited, the amount will be automatically refunded by Khalti, or you can contact Fewa City support at <strong>9765940555</strong>.
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

export default KhaltiCallback;
