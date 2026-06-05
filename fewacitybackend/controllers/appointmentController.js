import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import Department from '../models/Department.js';

// @desc    Create a new appointment booking
// @route   POST /api/appointments
// @access  Private (Patient)
export const createAppointment = async (req, res) => {
  try {
    const { doctor, department, date, timeSlot, symptoms } = req.body;

    if (!doctor || !department || !date || !timeSlot) {
      return res.status(400).json({ message: 'Please select a doctor, department, date, and time slot.' });
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
    const { status, prescription, adminNotes } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (status) appointment.status = status;
    if (prescription !== undefined) appointment.prescription = prescription;
    if (adminNotes !== undefined) appointment.adminNotes = adminNotes;

    const updatedAppointment = await appointment.save();

    // Populate updated details to send back
    const populated = await Appointment.findById(updatedAppointment._id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name qualification')
      .populate('department', 'title');

    res.status(200).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update appointment', error: error.message });
  }
};
