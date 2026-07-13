import Appointment from '../models/Appointment.js';
import Stripe from 'stripe';

// @desc    Initiate Khalti Payment for an appointment
// @route   POST /api/payments/khalti/initiate
// @access  Private
export const initiateKhaltiPayment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ message: 'Appointment ID is required' });
    }

    const appointment = await Appointment.findById(appointmentId).populate('doctor department patient');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Verify ownership (unless admin)
    if (appointment.patient._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to pay for this appointment' });
    }

    if (appointment.paymentStatus === 'Paid') {
      return res.status(400).json({ message: 'Appointment is already paid' });
    }

    // Fixed Booking/Deposit Fee of Rs. 150 (15000 Paisa)
    const amountInRs = 150;
    const amountInPaisa = amountInRs * 100;

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const initiateUrl = process.env.KHALTI_INITIATE_URL || 'https://a.khalti.com/api/v2/epayment/initiate/';
    const secretKey = process.env.KHALTI_SECRET_KEY || 'Key 82cd489c6d50487182a477715266d8ec';

    const payload = {
      return_url: `${frontendUrl}/payment/khalti/callback`,
      website_url: frontendUrl,
      amount: amountInPaisa,
      purchase_order_id: appointment._id.toString(),
      purchase_order_name: `Reservation Deposit - Dr. ${appointment.doctor.name}`,
      customer_info: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || '9800000000',
      },
    };

    const response = await fetch(initiateUrl, {
      method: 'POST',
      headers: {
        'Authorization': secretKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.payment_url) {
      console.error('Khalti initiate error response:', data);
      const errorMsg = data.detail || (data.error_key ? `${data.error_key}: ${JSON.stringify(data.remarks)}` : '');
      return res.status(400).json({
        message: `Khalti payment initiation failed${errorMsg ? `: ${errorMsg}` : ''}`,
        error: data,
      });
    }

    // Update appointment with payment pending state
    appointment.khaltiPidx = data.pidx;
    appointment.paymentStatus = 'Pending';
    appointment.paymentMethod = 'Khalti';
    appointment.amount = amountInRs;
    await appointment.save();

    res.status(200).json({
      success: true,
      paymentUrl: data.payment_url,
      pidx: data.pidx,
      amount: amountInRs,
    });
  } catch (err) {
    console.error('Error initiating Khalti payment:', err);
    res.status(500).json({ message: 'Internal server error during payment initiation' });
  }
};

// @desc    Verify Khalti Payment
// @route   POST /api/payments/khalti/verify
// @access  Private
export const verifyKhaltiPayment = async (req, res) => {
  try {
    const { pidx } = req.body;

    if (!pidx) {
      return res.status(400).json({ message: 'Payment transaction pidx is required' });
    }

    const lookupUrl = process.env.KHALTI_LOOKUP_URL || 'https://a.khalti.com/api/v2/epayment/lookup/';
    const secretKey = process.env.KHALTI_SECRET_KEY || 'Key 82cd489c6d50487182a477715266d8ec';

    const response = await fetch(lookupUrl, {
      method: 'POST',
      headers: {
        'Authorization': secretKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pidx }),
    });

    const data = await response.json();

    if (!response.ok || data.status !== 'Completed') {
      console.error('Khalti verify lookup error response:', data);
      return res.status(400).json({
        message: 'Payment verification failed or is incomplete',
        status: data.status,
      });
    }

    // Find appointment by pidx
    const appointment = await Appointment.findOne({ khaltiPidx: pidx }).populate('doctor department patient');
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment associated with this payment not found' });
    }

    // Update payment details
    appointment.paymentStatus = 'Paid';
    appointment.khaltiTransactionId = data.transaction_id || '';
    // Automatically approve slot since it is paid!
    if (appointment.status === 'Pending') {
      appointment.status = 'Approved';
    }
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully and slot approved!',
      appointment,
    });
  } catch (err) {
    console.error('Error verifying Khalti payment:', err);
    res.status(500).json({ message: 'Internal server error during payment verification' });
  }
};

// @desc    Initiate Stripe Checkout Session for an appointment
// @route   POST /api/payments/stripe/initiate
// @access  Private
export const initiateStripePayment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ message: 'Appointment ID is required' });
    }

    const appointment = await Appointment.findById(appointmentId).populate('doctor department patient');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Verify ownership (unless admin)
    if (appointment.patient._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to pay for this appointment' });
    }

    if (appointment.paymentStatus === 'Paid') {
      return res.status(400).json({ message: 'Appointment is already paid' });
    }

    // Fixed Booking/Deposit Fee of USD 1.50 (150 cents)
    const depositAmountInCents = 150;

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return res.status(500).json({ message: 'Stripe configuration missing on server' });
    }

    const stripe = new Stripe(stripeSecretKey);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Reservation Deposit - Dr. ${appointment.doctor.name}`,
              description: `Appointment Deposit for ${appointment.department.title} consultation`,
            },
            unit_amount: depositAmountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${frontendUrl}/payment/stripe/callback?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/patient-dashboard?payment=cancelled`,
      client_reference_id: appointment._id.toString(),
      customer_email: req.user.email,
    });

    // Update appointment with Stripe session info
    appointment.stripeSessionId = session.id;
    appointment.paymentMethod = 'Stripe';
    appointment.amount = 1.50; // Amount in USD
    await appointment.save();

    res.status(200).json({
      success: true,
      paymentUrl: session.url,
    });
  } catch (err) {
    console.error('Error initiating Stripe payment:', err);
    res.status(400).json({
      message: `Stripe payment initiation failed: ${err.message}`,
      error: err,
    });
  }
};

// @desc    Verify Stripe Payment
// @route   POST /api/payments/stripe/verify
// @access  Private
export const verifyStripePayment = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return res.status(500).json({ message: 'Stripe configuration missing on server' });
    }

    const stripe = new Stripe(stripeSecretKey);

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== 'paid') {
      return res.status(400).json({
        message: 'Stripe payment is incomplete or not paid',
        paymentStatus: session ? session.payment_status : 'unknown',
      });
    }

    // Find appointment by sessionId
    const appointment = await Appointment.findOne({ stripeSessionId: sessionId }).populate('doctor department patient');
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment associated with this Stripe session not found' });
    }

    // Update payment details
    appointment.paymentStatus = 'Paid';
    appointment.stripePaymentIntentId = session.payment_intent || '';
    
    // Automatically approve slot since it is paid!
    if (appointment.status === 'Pending') {
      appointment.status = 'Approved';
    }
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Stripe payment verified successfully and slot approved!',
      appointment,
    });
  } catch (err) {
    console.error('Error verifying Stripe payment:', err);
    res.status(500).json({ message: 'Internal server error during Stripe payment verification' });
  }
};