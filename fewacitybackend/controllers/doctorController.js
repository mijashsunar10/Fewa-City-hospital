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

// @desc    Get all doctors (seeds automatically if database is empty)
// @route   GET /api/doctors
// @access  Public
export const getDoctors = async (req, res) => {
  try {
    let doctors = await Doctor.find().sort({ createdAt: -1 });
    
    // Auto-seed if empty
    if (doctors.length === 0) {
      console.log('Doctors collection empty. Seeding initial 38 specialist doctors...');
      await Doctor.insertMany(seedDoctors);
      doctors = await Doctor.find().sort({ createdAt: -1 });
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
    const { name, qualification, department, phone } = req.body;

    let imageUrl = '';
    // If image file was uploaded
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      imageUrl = req.body.image; // Support fallback to external URL
    }

    const doctor = new Doctor({
      name,
      qualification,
      department,
      phone: phone || '9765940555',
      image: imageUrl
    });

    const savedDoctor = await doctor.save();
    res.status(201).json(savedDoctor);
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

    const { name, qualification, department, phone } = req.body;

    doctor.name = name || doctor.name;
    doctor.qualification = qualification || doctor.qualification;
    doctor.department = department || doctor.department;
    doctor.phone = phone !== undefined ? phone : doctor.phone;

    if (req.file) {
      doctor.image = `/uploads/${req.file.filename}`;
    } else if (req.body.image !== undefined) {
      doctor.image = req.body.image;
    }

    const updatedDoctor = await doctor.save();
    res.status(200).json(updatedDoctor);
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
