import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables immediately to ensure they are available
dotenv.config();

let transporter = null;

/**
 * Get or initialize the nodemailer transporter lazily
 */
const getTransporter = () => {
  if (!transporter) {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else {
      console.warn('Mailer Warning: EMAIL_USER or EMAIL_PASS not set in environment.');
    }
  }
  return transporter;
};

/**
 * Format date helper
 */
const formatDate = (dateStr) => {
  try {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  } catch (err) {
    return dateStr;
  }
};

/**
 * Send Booking Confirmation Email
 * @param {Object} appointment - Populated appointment object
 */
export const sendBookingConfirmationEmail = async (appointment) => {
  const activeTransporter = getTransporter();
  if (!activeTransporter) {
    console.warn('Mailer Skipped: Transporter not initialized.');
    return;
  }

  const patientName = appointment.patient?.name || 'Valued Patient';
  const patientEmail = appointment.patient?.email;
  const doctorName = appointment.doctor?.name || 'Specialist';
  const departmentName = appointment.department?.title || 'Clinic';
  const dateFormatted = formatDate(appointment.date);
  const timeSlot = appointment.timeSlot;

  if (!patientEmail) {
    console.error('Mailer Error: Patient email is missing for appointment', appointment._id);
    return;
  }

  const mailOptions = {
    from: `"Fewa City Hospital" <${process.env.EMAIL_USER}>`,
    to: patientEmail,
    subject: `Appointment Booking Request Received - Fewa City Hospital`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 40px 10px; color: #334155;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #156619 0%, #0d4610 100%); padding: 35px 20px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;">Fewa City Hospital</h1>
            <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Patient Scheduling Portal</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #0f172a; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 15px;">Appointment Booking Request</h2>
            <p style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 25px;">
              Hello <strong>${patientName}</strong>,<br/>
              Thank you for choosing Fewa City Hospital. We have successfully received your appointment booking request. Our administration team is reviewing it, and we will send you an email notification as soon as the status is updated.
            </p>
            
            <!-- Appointment Details Card -->
            <div style="background-color: #f1f5f9; border-radius: 12px; padding: 25px; margin-bottom: 30px; border-left: 5px solid #156619;">
              <h3 style="color: #0f172a; font-size: 16px; font-weight: 700; margin-top: 0; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Booking Overview</h3>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 14.5px;">
                <tr>
                  <td style="padding: 6px 0; color: #64748b; font-weight: 600; width: 35%;">Specialist:</td>
                  <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">Dr. ${doctorName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Department:</td>
                  <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${departmentName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Preferred Date:</td>
                  <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${dateFormatted}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Preferred Time:</td>
                  <td style="padding: 6px 0; color: #156619; font-weight: 700;">${timeSlot}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Status:</td>
                  <td style="padding: 6px 0;">
                    <span style="background-color: #fef3c7; color: #d97706; padding: 3px 10px; border-radius: 50px; font-size: 12px; font-weight: 700; text-transform: uppercase;">Pending Review</span>
                  </td>
                </tr>
              </table>
            </div>

            ${appointment.symptoms ? `
              <div style="margin-top: 20px; padding: 15px; background-color: #fafafa; border: 1px solid #e2e8f0; border-radius: 8px; color: #475569; font-size: 14px;">
                <strong style="color: #334155; display: block; margin-bottom: 5px;">Reported Symptoms / Notes:</strong>
                <p style="margin: 0; font-style: italic; white-space: pre-wrap;">"${appointment.symptoms}"</p>
              </div>
            ` : ''}
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="background-color: #156619; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-size: 14px; font-weight: 700; display: inline-block; box-shadow: 0 4px 6px rgba(21, 102, 25, 0.15); transition: background-color 0.2s;">
                View Patient Portal
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 25px 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0 0 8px 0; font-weight: 600; color: #64748b;">Fewa City Hospital & Research Center</p>
            <p style="margin: 0 0 15px 0;">Pokhara, Nepal | Tel: +977-61-5940555</p>
            <p style="margin: 0; font-size: 11px; opacity: 0.8;">This is an automated system notification. Please do not reply directly to this email.</p>
          </div>
          
        </div>
      </div>
    `
  };

  try {
    const info = await activeTransporter.sendMail(mailOptions);
    console.log(`Booking Confirmation Email sent successfully to ${patientEmail}: ${info.response}`);
    return info;
  } catch (error) {
    console.error('Nodemailer Error: Failed to send booking confirmation:', error.message);
  }
};

/**
 * Send Status Update Email
 * @param {Object} appointment - The updated and populated appointment
 * @param {Object} changes - Summary of changes made (rescheduled, prescription, note, status)
 */
export const sendAppointmentStatusUpdateEmail = async (appointment, changes = {}) => {
  const activeTransporter = getTransporter();
  if (!activeTransporter) {
    console.warn('Mailer Skipped: Transporter not initialized.');
    return;
  }

  const patientName = appointment.patient?.name || 'Valued Patient';
  const patientEmail = appointment.patient?.email;
  const doctorName = appointment.doctor?.name || 'Specialist';
  const departmentName = appointment.department?.title || 'Clinic';
  const dateFormatted = formatDate(appointment.date);
  const timeSlot = appointment.timeSlot;

  if (!patientEmail) {
    console.error('Mailer Error: Patient email is missing for status update', appointment._id);
    return;
  }

  // Determine email subject and primary header color based on status/changes
  let subject = `Appointment Status Updated - Fewa City Hospital`;
  let headerGradient = `linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)`; // Default Blue
  let statusBadgeStyle = `background-color: #dbeafe; color: #1d4ed8;`;
  let actionTitle = `Appointment Details Updated`;
  let actionDescription = `Your appointment records have been updated by our medical staff. Please review the details below.`;

  if (changes.statusChanged) {
    if (appointment.status === 'Approved') {
      subject = `Appointment CONFIRMED - Dr. ${doctorName}`;
      headerGradient = `linear-gradient(135deg, #10b981 0%, #047857 100%)`; // Green
      statusBadgeStyle = `background-color: #d1fae5; color: #065f46;`;
      actionTitle = `Appointment Approved & Confirmed`;
      actionDescription = `Great news! Your appointment request has been approved and scheduled by the clinical administrators.`;
    } else if (appointment.status === 'Cancelled') {
      subject = `Appointment CANCELLED - Fewa City Hospital`;
      headerGradient = `linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)`; // Red
      statusBadgeStyle = `background-color: #fee2e2; color: #991b1b;`;
      actionTitle = `Appointment Cancelled`;
      actionDescription = `Please be notified that your scheduled appointment has been cancelled. If you believe this is an error or need to reschedule, please contact our helpline.`;
    } else if (appointment.status === 'Completed') {
      subject = `Medical Visit Summary - Fewa City Hospital`;
      headerGradient = `linear-gradient(135deg, #6366f1 0%, #4338ca 100%)`; // Indigo
      statusBadgeStyle = `background-color: #e0e7ff; color: #3730a3;`;
      actionTitle = `Visit Status: Completed`;
      actionDescription = `Thank you for choosing Fewa City Hospital. Your clinical visit with Dr. ${doctorName} is complete. Your prescriptions and details are updated below.`;
    }
  } else if (changes.rescheduled) {
    subject = `Appointment RESCHEDULED - Dr. ${doctorName}`;
    headerGradient = `linear-gradient(135deg, #f59e0b 0%, #d97706 100%)`; // Amber/Orange
    statusBadgeStyle = `background-color: #fef3c7; color: #92400e;`;
    actionTitle = `Appointment Schedule Changed`;
    actionDescription = `Please note that your scheduled appointment date or time has been adjusted by our administration. Details are updated below.`;
  } else if (changes.prescriptionAdded) {
    subject = `New Prescription Added - Fewa City Hospital`;
    headerGradient = `linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)`; // Cyan
    statusBadgeStyle = `background-color: #ecfeff; color: #155e75;`;
    actionTitle = `Prescription & Diagnosis Available`;
    actionDescription = `A physician has added a prescription/treatment plan to your completed visit record. You can view it below.`;
  } else if (changes.notesAdded) {
    subject = `Clinical Notes Updated - Fewa City Hospital`;
    headerGradient = `linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)`; // Purple
    statusBadgeStyle = `background-color: #f3e8ff; color: #5b21b6;`;
    actionTitle = `Clinical Notes Added`;
    actionDescription = `Additional staff instructions or pre-visit guidelines have been updated on your appointment.`;
  }

  // Construct Change Log list to display in email
  let changeAlertsHtml = '';
  if (Object.keys(changes).length > 0) {
    changeAlertsHtml = `
      <div style="background-color: #fffbeb; border: 1px dashed #fcd34d; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
        <strong style="color: #b45309; font-size: 13.5px; display: block; margin-bottom: 5px;">Summary of Modifications:</strong>
        <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #78350f;">
          ${changes.statusChanged ? `<li>Status updated to: <strong>${appointment.status}</strong></li>` : ''}
          ${changes.rescheduled ? `<li>Schedule modified to: <strong>${dateFormatted} @ ${timeSlot}</strong></li>` : ''}
          ${changes.prescriptionAdded ? `<li>Medical Prescription/Diagnosis has been added.</li>` : ''}
          ${changes.notesAdded ? `<li>Administrative clinical notes/comments have been updated.</li>` : ''}
        </ul>
      </div>
    `;
  }

  const mailOptions = {
    from: `"Fewa City Hospital" <${process.env.EMAIL_USER}>`,
    to: patientEmail,
    subject: subject,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 40px 10px; color: #334155;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          
          <!-- Header -->
          <div style="background: ${headerGradient}; padding: 35px 20px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;">Fewa City Hospital</h1>
            <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Schedule & Record Updates</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #0f172a; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 12px;">${actionTitle}</h2>
            <p style="font-size: 14.5px; line-height: 1.6; color: #475569; margin-bottom: 25px;">
              Hello <strong>${patientName}</strong>,<br/>
              ${actionDescription}
            </p>

            <!-- Modifications summary -->
            ${changeAlertsHtml}
            
            <!-- Appointment Details Card -->
            <div style="background-color: #f1f5f9; border-radius: 12px; padding: 25px; margin-bottom: 25px; border-left: 5px solid #3b82f6;">
              <h3 style="color: #0f172a; font-size: 15px; font-weight: 700; margin-top: 0; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Appointment Details</h3>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 6px 0; color: #64748b; font-weight: 600; width: 35%;">Consultant:</td>
                  <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">Dr. ${doctorName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Department:</td>
                  <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${departmentName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Schedule Date:</td>
                  <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${dateFormatted}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Time Slot:</td>
                  <td style="padding: 6px 0; color: #1e40af; font-weight: 700;">${timeSlot}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Current Status:</td>
                  <td style="padding: 6px 0;">
                    <span style="${statusBadgeStyle} padding: 3px 10px; border-radius: 50px; font-size: 11.5px; font-weight: 700; text-transform: uppercase;">${appointment.status}</span>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Prescription Block -->
            ${appointment.prescription ? `
              <div style="margin-bottom: 25px; padding: 20px; background-color: #ecfeff; border: 1px solid #c5f2f7; border-radius: 12px; color: #164e63; font-size: 14.5px;">
                <strong style="color: #0e7490; font-size: 15px; display: block; margin-bottom: 8px;">📋 Diagnosis & Treatment Plan:</strong>
                <p style="margin: 0; white-space: pre-wrap; line-height: 1.6; font-family: Consolas, Monaco, monospace; background-color: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">${appointment.prescription}</p>
              </div>
            ` : ''}

            <!-- Admin Notes Block -->
            ${appointment.adminNotes ? `
              <div style="margin-bottom: 25px; padding: 15px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; color: #475569; font-size: 13.5px;">
                <strong style="color: #334155; display: block; margin-bottom: 5px;">🏥 Hospital Staff Instructions:</strong>
                <p style="margin: 0; font-style: italic;">"${appointment.adminNotes}"</p>
              </div>
            ` : ''}
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="background-color: #1e40af; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-size: 14px; font-weight: 700; display: inline-block; box-shadow: 0 4px 6px rgba(30, 64, 175, 0.15); transition: background-color 0.2s;">
                Open Patient Dashboard
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 25px 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0 0 8px 0; font-weight: 600; color: #64748b;">Fewa City Hospital & Research Center</p>
            <p style="margin: 0 0 15px 0;">Pokhara, Nepal | Tel: +977-61-5940555</p>
            <p style="margin: 0; font-size: 11px; opacity: 0.8;">This is an automated system notification. Please do not reply directly to this email.</p>
          </div>
          
        </div>
      </div>
    `
  };

  try {
    const info = await activeTransporter.sendMail(mailOptions);
    console.log(`Status Update Email sent successfully to ${patientEmail}: ${info.response}`);
    return info;
  } catch (error) {
    console.error('Nodemailer Error: Failed to send status update:', error.message);
  }
};
