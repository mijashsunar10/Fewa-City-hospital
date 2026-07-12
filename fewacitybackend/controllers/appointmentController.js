import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import Department from '../models/Department.js';
import Notification from '../models/Notification.js';
import { sendBookingConfirmationEmail, sendAppointmentStatusUpdateEmail } from '../utils/mailer.js';
import { generatePrescriptionPDF } from '../utils/pdfGenerator.js';

// @desc    Create a new appointment booking
// @route   POST /api/appointments
// @access  Private (Patient)
export const createAppointment = async (req, res) => {
  try {
    const { doctor, department, date, timeSlot, symptoms } = req.body;

    if (!doctor || !department || !date || !timeSlot) {
      return res.status(400).json({ message: 'Please select a doctor, department, date, and time slot.' });
    }

    // Prevent double booking
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const alreadyBooked = await Appointment.findOne({
      doctor,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      timeSlot,
      status: { $ne: 'Cancelled' }
    });

    if (alreadyBooked) {
      return res.status(400).json({ message: 'This slot is already booked for this doctor. Please choose a different slot.' });
    }

    const newAppointment = new Appointment({
      patient: req.user.id,
      doctor,
      department,
      date,
      timeSlot,
      symptoms: symptoms || '',
    });

    const savedAppointment = await newAppointment.save();

    // Populate saved appointment and send booking confirmation email asynchronously
    Appointment.findById(savedAppointment._id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name qualification')
      .populate('department', 'title')
      .then(async (populatedAppt) => {
        if (populatedAppt) {
          sendBookingConfirmationEmail(populatedAppt);
          
          // Create automated notification record
          await Notification.create({
            patient: populatedAppt.patient._id,
            appointment: populatedAppt._id,
            type: 'BookingConfirmation',
            title: 'Appointment Booking Request',
            message: `Your appointment request with Dr. ${populatedAppt.doctor.name} on ${new Date(populatedAppt.date).toLocaleDateString()} at ${populatedAppt.timeSlot} is submitted and pending review.`
          });
        }
      })
      .catch(err => {
        console.error('Failed to handle post-booking tasks:', err.message);
      });

    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to request appointment', error: error.message });
  }
};

// @desc    Get all appointments for the logged-in patient
// @route   GET /api/appointments/my
// @access  Private (Patient)
export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate('doctor', 'name qualification image phone')
      .populate('department', 'title slug')
      .sort({ createdAt: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve appointments', error: error.message });
  }
};

// @desc    Cancel an appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private (Patient / Admin)
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Verify ownership (or if admin)
    if (appointment.patient.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }

    appointment.status = 'Cancelled';
    const updatedAppointment = await appointment.save();

    // Populate and send status update email asynchronously
    Appointment.findById(updatedAppointment._id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name qualification')
      .populate('department', 'title')
      .then(async (populatedAppt) => {
        if (populatedAppt) {
          sendAppointmentStatusUpdateEmail(populatedAppt, { statusChanged: true });

          // Create automated notification record
          await Notification.create({
            patient: populatedAppt.patient._id,
            appointment: populatedAppt._id,
            type: 'Cancelled',
            title: 'Appointment Cancelled',
            message: `Your scheduled appointment with Dr. ${populatedAppt.doctor.name} on ${new Date(populatedAppt.date).toLocaleDateString()} has been cancelled.`
          });
        }
      })
      .catch(err => {
        console.error('Failed to handle post-cancellation tasks:', err.message);
      });

    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel appointment', error: error.message });
  }
};

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private (Admin)
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate('patient', 'name email phone')
      .populate('doctor', 'name qualification')
      .populate('department', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve appointments', error: error.message });
  }
};

// @desc    Update appointment status/prescription/notes
// @route   PUT /api/appointments/:id
// @access  Private (Admin)
export const updateAppointment = async (req, res) => {
  try {
    const { status, prescription, adminNotes, date, timeSlot } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Capture original values for change detection
    const originalStatus = appointment.status;
    const originalDate = appointment.date ? new Date(appointment.date).getTime() : 0;
    const originalTimeSlot = appointment.timeSlot;
    const originalPrescription = appointment.prescription;
    const originalNotes = appointment.adminNotes;

    if (status) appointment.status = status;
    if (prescription !== undefined) appointment.prescription = prescription;
    if (adminNotes !== undefined) appointment.adminNotes = adminNotes;
    if (date) appointment.date = date;
    if (timeSlot) appointment.timeSlot = timeSlot;

    const updatedAppointment = await appointment.save();

    // Populate updated details to send back
    const populated = await Appointment.findById(updatedAppointment._id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name qualification')
      .populate('department', 'title');

    // Detect changes to send email
    const statusChanged = populated.status !== originalStatus;
    const newDateVal = populated.date ? new Date(populated.date).getTime() : 0;
    const dateChanged = newDateVal !== originalDate;
    const timeSlotChanged = populated.timeSlot !== originalTimeSlot;
    const rescheduled = dateChanged || timeSlotChanged;
    const prescriptionAdded = populated.prescription && populated.prescription !== originalPrescription;
    const notesAdded = populated.adminNotes && populated.adminNotes !== originalNotes;

    if (statusChanged || rescheduled || prescriptionAdded || notesAdded) {
      sendAppointmentStatusUpdateEmail(populated, {
        statusChanged,
        rescheduled,
        prescriptionAdded,
        notesAdded
      }).catch(err => {
        console.error('Failed to send status update email:', err.message);
      });

      // Automated dashboard notification logging
      try {
        if (statusChanged) {
          let customMsg = `Your appointment status was updated to ${populated.status}.`;
          if (populated.status === 'Approved') {
            customMsg = `Your appointment with Dr. ${populated.doctor.name} on ${new Date(populated.date).toLocaleDateString()} at ${populated.timeSlot} has been approved and scheduled.`;
          } else if (populated.status === 'Completed') {
            customMsg = `Your appointment with Dr. ${populated.doctor.name} is marked as completed. Thank you for visiting!`;
          } else if (populated.status === 'Cancelled') {
            customMsg = `Your appointment with Dr. ${populated.doctor.name} on ${new Date(populated.date).toLocaleDateString()} has been cancelled.`;
          }

          await Notification.create({
            patient: populated.patient._id,
            appointment: populated._id,
            type: populated.status,
            title: `Appointment ${populated.status}`,
            message: customMsg
          });
        }

        if (rescheduled && !statusChanged) {
          await Notification.create({
            patient: populated.patient._id,
            appointment: populated._id,
            type: 'Rescheduled',
            title: 'Appointment Rescheduled',
            message: `Your appointment with Dr. ${populated.doctor.name} was rescheduled to ${new Date(populated.date).toLocaleDateString()} at ${populated.timeSlot}.`
          });
        }

        if (prescriptionAdded) {
          await Notification.create({
            patient: populated.patient._id,
            appointment: populated._id,
            type: 'PrescriptionAdded',
            title: 'New Prescription/Diagnosis',
            message: `Dr. ${populated.doctor.name} has uploaded a new prescription & diagnosis for your visit.`
          });
        }

        if (notesAdded) {
          await Notification.create({
            patient: populated.patient._id,
            appointment: populated._id,
            type: 'NotesAdded',
            title: 'Clinical Notes Update',
            message: `Clinical instructions or preparation guidelines have been updated for your appointment.`
          });
        }
      } catch (notifErr) {
        console.error('Failed to create DB notification logs:', notifErr.message);
      }
    }

    res.status(200).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update appointment', error: error.message });
  }
};

// @desc    Get all booked time slots for a doctor on a specific date
// @route   GET /api/appointments/booked-slots
// @access  Private (Patient)
export const getBookedSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({ message: 'Please provide doctorId and date query parameters.' });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      doctor: doctorId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $ne: 'Cancelled' }
    }).select('timeSlot');

    const bookedSlots = appointments.map(appt => appt.timeSlot);
    res.status(200).json(bookedSlots);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve booked slots', error: error.message });
  }
};

// @desc    Download prescription PDF
// @route   GET /api/appointments/:id/prescription/download
// @access  Private (Patient / Admin)
export const downloadPrescriptionPDF = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone dob gender bloodGroup')
      .populate('doctor', 'name qualification')
      .populate('department', 'title');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Verify ownership (only the matching patient or admin can download)
    if (appointment.patient._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to download this prescription' });
    }

    // Check if prescription or completion is present
    if (!appointment.prescription && appointment.status !== 'Completed') {
      return res.status(400).json({ message: 'Prescription is not available for this appointment' });
    }

    // Set response headers for PDF stream
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Prescription_${appointment._id}.pdf`
    );

    // Stream prescription PDF directly to client response
    await generatePrescriptionPDF(appointment, res);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Failed to generate PDF prescription', error: error.message });
    }
  }
};

