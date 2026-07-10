import mongoose from 'mongoose';
import Department from '../models/Department.js';
import Doctor from '../models/Doctor.js';

const seedDoctors = [
  { name: "Dr. Bhoj Raj Neupane", qualification: "MBBS, MS - General Surgeon", department: "Surgery", image: "https://fch.com.np/wp-content/uploads/2026/04/Untitled-design-30.png" },
  { name: "Dr. Chandika Pandit", qualification: "MBBS, MS, DCH - Gynecologist", department: "Gynecology", image: "https://fch.com.np/wp-content/uploads/2026/05/DSC03160.jpg" },
  { name: "Dr. Suresh Thapa", qualification: "MBBS, MD, DM - Gastroenterologist", department: "Gastroenterology", image: "https://fch.com.np/wp-content/uploads/2026/04/Untitled-design-26.png" },
  { name: "Dr. Rohini Sigdel", qualification: "MBBS, MS - Anesthetist", department: "Anesthesia", image: "https://fch.com.np/wp-content/uploads/2026/02/RohinSigdel.jpg" },
  { name: "Dr. Krishna Bahadur Thapa", qualification: "MBBS, MD – Consultant (Internal Medicine)", department: "Internal Medicine", image: "https://fch.com.np/wp-content/uploads/2026/04/Krishna-bdr-thapa.png" },
  { name: "Dr. Sureshraj Paudel", qualification: "MBBS, MS – General Surgeon", department: "Surgery", image: "https://fch.com.np/wp-content/uploads/2026/04/Untitled-design-28.png" },
  { name: "Dr. Rabeendra Prasad Shrestha", qualification: "MBBS, MS – Orthopedic Surgeon", department: "Orthopedics", image: "https://fch.com.np/wp-content/uploads/2026/04/Rabindra-psd-shrestha.png" },
  { name: "Dr. Dinesh Kumar BK", qualification: "MBBS, MS – (Ortho) Trauma & Joint Replacement Surgeon", department: "Orthopedics", image: "https://fch.com.np/wp-content/uploads/2026/04/dinesh-kumar-bk.png" },
  { name: "Dr. Rabimohan Dhakal", qualification: "MBBS, MS – (Ortho) Trauma, Sport Injury & Arthroscopy Surgeon", department: "Orthopedics", image: "https://fch.com.np/wp-content/uploads/2026/04/rabi-mohan-dhakal.png" },
  { name: "Dr. Hum Prasad Neupane", qualification: "MBBS, DCH – Pediatrician", department: "Pediatrics", image: "https://fch.com.np/wp-content/uploads/2026/04/hum-psd-neupane.png" },
  { name: "Dr. Amrita Ghimire", qualification: "MBBS, MD – Pediatrician", department: "Pediatrics", image: "https://fch.com.np/wp-content/uploads/2026/04/2.png" },
  { name: "Dr. Dhurba Bahadur Adhikari", qualification: "MBBS, MS – Urologist", department: "Urology", image: "https://fch.com.np/wp-content/uploads/2026/04/Dhurba-bdr-adhikari.png" },
  { name: "Dr. Jeevan Thapa", qualification: "MBBS, MD, DM – Gastroenterologist", department: "Gastroenterology", image: "https://fch.com.np/wp-content/uploads/2026/04/jiwan-thapa.png" },
  { name: "Dr. Ananda Bahadur Shrestha", qualification: "MBBS, DMRD – Radiologist", department: "Radiology", image: "https://fch.com.np/wp-content/uploads/2026/04/1.png" },
  { name: "Dr. Donjan Bahadur Lamechhine", qualification: "MBBS, MS – ENT", department: "ENT", image: "https://fch.com.np/wp-content/uploads/2026/04/Donjan-bdr-lamichhane.png" },
  { name: "Dr. Bonu Gaudel", qualification: "MBBS, MS – ENT", department: "ENT", image: "https://fch.com.np/wp-content/uploads/2026/04/Bunu-gaudel.png" },
  { name: "Dr. Jaya Bahadur Khatri", qualification: "MBBS, MD – Psychiatrist", department: "Psychiatry", image: "https://fch.com.np/wp-content/uploads/2026/04/Jay-bdr-khatri.png" },
  { name: "Dr. Renu Poudel", qualification: "MBBS, MD – Ophthalmologist", department: "Ophthalmology", image: "https://fch.com.np/wp-content/uploads/2026/04/renu-poudel.png" },
  { name: "Dr. Rishna Malla", qualification: "MBBS, MD – Dermatologist", department: "Dermatology", image: "https://fch.com.np/wp-content/uploads/2026/04/Untitled-design-27.png" },
  { name: "Dr. Rajan Kumar Sharma", qualification: "MBBS, MD – Neurosurgeon", department: "Neurosurgery", image: "https://fch.com.np/wp-content/uploads/2026/04/rajan-kumar-sharma.png" },
  { name: "Dr. Arun Kadel", qualification: "MBBS, MD, DM – Cardiologist", department: "Cardiology", image: "https://fch.com.np/wp-content/uploads/2026/04/Arun-kandel.png" },
  { name: "Dr. Bijaya Bhahadur Pradhan", qualification: "Physiotherapist", department: "Physiotherapy", image: "https://fch.com.np/wp-content/uploads/2026/04/bijay-bdr-pradhan.png" },
  { name: "Harishchandra Joshi", qualification: "Physiotherapist", department: "Physiotherapy", image: "https://fch.com.np/wp-content/uploads/2026/04/Harischandra-joshi.png" },
  { name: "Dr. Niva Shrestha", qualification: "BDS – Dental Surgeon", department: "Dental", image: "https://fch.com.np/wp-content/uploads/2026/05/NIVASHRESTHA.jpg" },
  { name: "Dr. Padmaraj Dhungana", qualification: "MBBS, MS – Gynecologist", department: "Gynecology", image: "https://fch.com.np/wp-content/uploads/2026/05/DSC03168.jpg" },
  { name: "Dr. Anup Chapagain", qualification: "MBBS, MS, MCH – Urologist", department: "Urology", image: "https://fch.com.np/wp-content/uploads/2026/05/DSC03153-1.jpg" },
  { name: "Dr. Madan Thapa", qualification: "MBBS, MD – Radiologist", department: "Radiology", image: "https://fch.com.np/wp-content/uploads/2026/05/MADANTHAPA.jpg" },
  { name: "Dr. Buddhi Bahadur Thapa", qualification: "MBBS, MD – Senior Consultant (Internal Medicine)", department: "Internal Medicine", image: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg" },
  { name: "Dr. Hari Krishna Bhandari", qualification: "MBBS, MD – Consultant Physician", department: "Internal Medicine", image: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg" },
  { name: "Dr. Tumaya Ghale", qualification: "MBBS, MS – Anesthesia", department: "Anesthesia", image: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg" },
  { name: "Dr. Susmit Kafle", qualification: "MBBS, MD – Radiologist", department: "Radiology", image: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg" },
  { name: "Dr. Krishna Prasad Koirala", qualification: "MBBS, MS – ENT", department: "ENT", image: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg" },
  { name: "Dr. Tulika Dube", qualification: "MBBS, MS – ENT", department: "ENT", image: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg" },
  { name: "Dr. Anjita Hirachan", qualification: "MBBS, MD – Ophthalmologist", department: "Ophthalmology", image: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg" },
  { name: "Dr. Saurav Aryal", qualification: "MBBS, MD – Dermatologist", department: "Dermatology", image: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg" },
  { name: "Dr. Madhu Roka", qualification: "MBBS, MD, DM – Cardiologist", department: "Cardiology", image: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg" },
  { name: "Dr. Bikash Khatri", qualification: "MBBS, MD, DM – Nephrologist", department: "Nephrology", image: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg" },
  { name: "Dr. Deependra Man Simang Gainda", qualification: "Oncologist", department: "Oncology", image: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg" }
];

// Helper to resolve a department string or ObjectId to a valid Department ObjectId
const resolveDepartmentId = async (departmentVal) => {
  if (!departmentVal) return null;
  
  if (mongoose.Types.ObjectId.isValid(departmentVal)) {
    return departmentVal;
  }
  
  // Try searching existing department matching search string
  let dept = await Department.findOne({
    $or: [
      { title: new RegExp(`^${departmentVal}`, 'i') },
      { slug: new RegExp(`^${departmentVal}`, 'i') },
      { title: new RegExp(departmentVal, 'i') }
    ]
  });
  
  if (!dept) {
    // Dynamically create a department if it doesn't exist
    const cleanTitle = departmentVal.endsWith('Department') ? departmentVal : `${departmentVal} Department`;
    const cleanSlug = departmentVal.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    dept = await Department.create({
      title: cleanTitle,
      slug: cleanSlug,
      description: `The ${cleanTitle} at Fewa City Hospital.`,
      points: ['Specialist clinical diagnostics', 'Personalized recovery plans']
    });
  }
  
  return dept._id;
};

// @desc    Get all doctors (seeds automatically if database is empty)
// @route   GET /api/doctors
// @access  Public
export const getDoctors = async (req, res) => {
  try {
    let doctors = await Doctor.find().populate('department').sort({ createdAt: -1 });
    
    // Auto-seed if empty
    if (doctors.length === 0) {
      console.log('Doctors collection empty. Seeding initial specialist doctors...');
      
      // Resolve each doctor's department string into an ObjectId
      const doctorsToInsert = [];
      for (const doc of seedDoctors) {
        const deptId = await resolveDepartmentId(doc.department);
        doctorsToInsert.push({
          ...doc,
          department: deptId
        });
      }
      
      await Doctor.insertMany(doctorsToInsert);
      doctors = await Doctor.find().populate('department').sort({ createdAt: -1 });
    }

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving doctors roster', error: error.message });
  }
};

// @desc    Create a new doctor
// @route   POST /api/doctors
// @access  Private/Admin
export const createDoctor = async (req, res) => {
  try {
    const { name, qualification, department, phone, experience, biography, schedule, workingStart, workingEnd } = req.body;

    let availableDaysArray = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    if (req.body.availableDays) {
      try {
        availableDaysArray = typeof req.body.availableDays === 'string'
          ? JSON.parse(req.body.availableDays)
          : req.body.availableDays;
      } catch (e) {
        availableDaysArray = req.body.availableDays.split(',').map(d => d.trim()).filter(Boolean);
      }
    }

    let imageUrl = '';
    // If image file was uploaded
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      imageUrl = req.body.image; // Support fallback to external URL
    }

    const deptId = await resolveDepartmentId(department);

    const doctor = new Doctor({
      name,
      qualification,
      department: deptId,
      phone: phone || '9765940555',
      image: imageUrl,
      experience: experience || '',
      biography: biography || '',
      schedule: schedule || '',
      availableDays: availableDaysArray,
      workingStart: workingStart || '09:00 AM',
      workingEnd: workingEnd || '05:00 PM'
    });

    const savedDoctor = await doctor.save();
    // Return populated doctor
    const populated = await Doctor.findById(savedDoctor._id).populate('department');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: 'Error creating doctor record', error: error.message });
  }
};

// @desc    Update an existing doctor
// @route   PUT /api/doctors/:id
// @access  Private/Admin
export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor record not found' });
    }

    const { name, qualification, department, phone, experience, biography, schedule, workingStart, workingEnd } = req.body;

    doctor.name = name || doctor.name;
    doctor.qualification = qualification || doctor.qualification;
    doctor.phone = phone !== undefined ? phone : doctor.phone;
    doctor.experience = experience !== undefined ? experience : doctor.experience;
    doctor.biography = biography !== undefined ? biography : doctor.biography;
    doctor.schedule = schedule !== undefined ? schedule : doctor.schedule;
    doctor.workingStart = workingStart !== undefined ? workingStart : doctor.workingStart;
    doctor.workingEnd = workingEnd !== undefined ? workingEnd : doctor.workingEnd;

    if (req.body.availableDays !== undefined) {
      try {
        doctor.availableDays = typeof req.body.availableDays === 'string'
          ? JSON.parse(req.body.availableDays)
          : req.body.availableDays;
      } catch (e) {
        doctor.availableDays = req.body.availableDays.split(',').map(d => d.trim()).filter(Boolean);
      }
    }

    if (department !== undefined) {
      const deptId = await resolveDepartmentId(department);
      doctor.department = deptId;
    }

    if (req.file) {
      doctor.image = `/uploads/${req.file.filename}`;
    } else if (req.body.image !== undefined) {
      doctor.image = req.body.image;
    }

    const updatedDoctor = await doctor.save();
    const populated = await Doctor.findById(updatedDoctor._id).populate('department');
    res.status(200).json(populated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating doctor record', error: error.message });
  }
};

// @desc    Delete a doctor
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor record not found' });
    }

    await Doctor.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id, message: 'Doctor record successfully removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting doctor record', error: error.message });
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('department');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor record not found' });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving doctor details', error: error.message });
  }
};
