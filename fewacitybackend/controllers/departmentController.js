import Department from '../models/Department.js';
import Doctor from '../models/Doctor.js';

const seedDepartments = [
  {
    title: "Anesthesia Department",
    slug: "anesthesia",
    description: "The Anesthesia Department ensures patient comfort and safety before, during, and after surgical procedures. Our team specializes in pain management, critical care support, and modern anesthesia techniques.",
    extra: "We provide personalized care for every patient and focus on safety, monitoring, and post-operative support.",
    points: [
      "Patient monitoring during surgery",
      "Modern anesthesia techniques",
      "Pain management and critical care",
      "Post-operative patient support"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/02/anaesthesia1.jpg"
  },
  {
    title: "Cardiology Department",
    slug: "cardiology",
    description: "The Cardiology Department specializes in diagnosing and treating heart conditions. Our team provides comprehensive cardiac care using advanced technology for heart health assessment and treatment.",
    extra: "We offer preventive care, diagnostic services, and interventional procedures to manage cardiovascular diseases effectively.",
    points: [
      "Comprehensive cardiac care",
      "Heart health assessment",
      "Diagnostic services",
      "Interventional procedures"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/02/cardio.jpeg"
  },
  {
    title: "Dental Department",
    slug: "dental",
    description: "The Dental Department provides comprehensive oral healthcare services for all ages. Our team offers preventive, restorative, and cosmetic dental treatments using modern equipment.",
    extra: "",
    points: [
      "Routine checkups and cleanings",
      "Fillings and root canal treatment",
      "Dental implants and crowns",
      "Orthodontic treatments"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/02/dental.jpg"
  },
  {
    title: "Dermatology Department",
    slug: "dermatology",
    description: "The Dermatology Department specializes in skin, hair, and nail conditions. Our team diagnoses and treats various dermatological issues using advanced therapeutic approaches.",
    extra: "",
    points: [
      "Skin cancer screening",
      "Acne and eczema treatment",
      "Laser and cosmetic procedures",
      "Hair and scalp disorders"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/02/dermatology.jpeg"
  },
  {
    title: "ENT Department",
    slug: "ent",
    description: "The ENT Department specializes in disorders of the head and neck region. Our team provides comprehensive care for hearing, breathing, and swallowing issues.",
    extra: "",
    points: [
      "Hearing tests and hearing aids",
      "Sinus and nasal disorder treatment",
      "Voice and swallowing therapy",
      "Head and neck surgery"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/02/ENT.jpeg"
  },
  {
    title: "Gastroenterology Department",
    slug: "gastro",
    description: "The Gastroenterology Department specializes in digestive system disorders. Our team diagnoses and treats conditions affecting the esophagus, stomach, intestines, liver, and pancreas.",
    extra: "",
    points: [
      "Endoscopy and colonoscopy",
      "Liver disease management",
      "Inflammatory bowel disease treatment",
      "Digestive disorder diagnosis"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/02/Gastrology.jpeg"
  },
  {
    title: "Surgery Department",
    slug: "surgery",
    description: "The Surgery Department provides a wide range of surgical services using advanced techniques and technology. Our team performs both routine and complex surgical procedures.",
    extra: "",
    points: [
      "General and laparoscopic surgery",
      "Emergency surgical care",
      "Minimally invasive procedures",
      "Post-operative care and recovery"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/02/sugery.jpeg"
  },
  {
    title: "Gynecology Department",
    slug: "gynecology",
    description: "The Gynecology Department provides comprehensive women's health services, focusing on reproductive system health. Our team offers preventive care, diagnosis, and treatment of gynecological conditions.",
    extra: "",
    points: [
      "Annual exams and Pap smears",
      "Family planning and contraception",
      "Menstrual disorder management",
      "Minimally invasive gynecological surgery"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/02/gymecology.jpeg"
  },
  {
    title: "General Medicine Department",
    slug: "medicine",
    description: "The General Medicine Department provides primary care for adults, managing a wide range of medical conditions. Our team focuses on diagnosis, treatment, and prevention of common and complex illnesses.",
    extra: "",
    points: [
      "Comprehensive health checkups",
      "Chronic disease management",
      "Preventive health counseling",
      "Acute illness treatment"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/02/internal.jpg"
  },
  {
    title: "Neurosurgery Department",
    slug: "neuro",
    description: "The Neurosurgery Department specializes in diagnosing and treating disorders of the nervous system. Our team manages conditions affecting the brain, spinal cord, nerves, and muscles.",
    extra: "",
    points: [
      "Brain and spinal surgery",
      "Stroke management",
      "Epilepsy treatment",
      "Neuro-oncology"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/02/neurosergery.avif"
  },
  {
    title: "Orthopedic Department",
    slug: "orthopedic",
    description: "The Orthopedic Department specializes in conditions involving the musculoskeletal system. Our surgeons provide care for bones, joints, ligaments, tendons, and muscles.",
    extra: "",
    points: [
      "Joint replacement surgery",
      "Fracture and trauma care",
      "Sports medicine",
      "Spine and back surgery"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/03/ortho.jpg"
  },
  {
    title: "Peadiatric Department",
    slug: "peadiatric",
    description: "The Peadiatric Department provides specialized medical care for infants, children, and adolescents. Our team focuses on the physical, emotional, and social health of young patients.",
    extra: "",
    points: [
      "Routine checkups and vaccinations",
      "Childhood illness treatment",
      "Growth and development monitoring",
      "Pediatric emergency care"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/03/oedi.jpeg"
  },
  {
    title: "Urology Department",
    slug: "urology",
    description: "The Urology Department provides medical and surgical care for the urinary tract system and the male reproductive organs.",
    extra: "",
    points: [
      "Kidney and bladder care",
      "Prostate health",
      "Urinary tract infection treatment",
      "Minimally invasive urologic surgery"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/03/urology.jpg"
  },
  {
    title: "Radiology Department",
    slug: "radiology",
    description: "The Radiology Department uses medical imaging to diagnose and treat diseases seen within the body.",
    extra: "",
    points: [
      "X-ray and Fluoroscopy",
      "CT and MRI scans",
      "Ultrasound imaging",
      "Interventional radiology"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/03/radiology.jpeg"
  },
  {
    title: "Psychiatric Department",
    slug: "psychiatric",
    description: "The Psychiatric Department provides compassionate mental health care, focusing on the diagnosis, treatment, and prevention of mental, emotional, and behavioral disorders.",
    extra: "",
    points: [
      "Counseling and therapy",
      "Mental health assessments",
      "Mood disorder treatment",
      "Stress management"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/03/psytric.jpeg"
  },
  {
    title: "Opthalmology Department",
    slug: "opthalmology",
    description: "The Opthalmology Department provides comprehensive eye care, from routine exams to advanced surgical procedures.",
    extra: "",
    points: [
      "Vision testing and spectacles",
      "Cataract surgery",
      "Glaucoma management",
      "Eye trauma care"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/03/opthamology.jpeg"
  },
  {
    title: "Nephrology Department",
    slug: "nephrology",
    description: "The Nephrology Department specializes in kidney care and the treatment of kidney-related diseases.",
    extra: "",
    points: [
      "Chronic kidney disease management",
      "Dialysis services",
      "Hypertension treatment",
      "Kidney stone prevention"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/03/nepro.jpg"
  },
  {
    title: "Physiotherapy Department",
    slug: "physiotherapy",
    description: "The Physiotherapy Department helps patients restore physical function, mobility, and strength after injuries, surgery, or illnesses.",
    extra: "",
    points: [
      "Post-operative rehabilitation",
      "Pain management therapy",
      "Sports injury recovery",
      "Muscle and joint strengthening"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/04/bijay-bdr-pradhan.png"
  },
  {
    title: "Oncology Department",
    slug: "oncology",
    description: "The Oncology Department provides comprehensive cancer care, focusing on early screening, diagnostics, and customized treatment plans.",
    extra: "",
    points: [
      "Cancer screenings and diagnosis",
      "Chemotherapy coordination",
      "Palliative and supportive care",
      "Multidisciplinary cancer care"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg"
  }
];

// Helper to parse points
const parsePoints = (points) => {
  if (!points) return [];
  if (Array.isArray(points)) return points;
  if (typeof points === 'string') {
    try {
      const parsed = JSON.parse(points);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // Not a JSON array, try splitting by comma or newline
      if (points.includes('\n')) {
        return points.split('\n').map(p => p.trim()).filter(Boolean);
      }
      return points.split(',').map(p => p.trim()).filter(Boolean);
    }
  }
  return [];
};

// @desc    Get all departments (seeds automatically if database is empty)
// @route   GET /api/departments
// @access  Public
export const getDepartments = async (req, res) => {
  try {
    let departments = await Department.find().sort({ title: 1 });
    
    // Auto-seed if empty
    if (departments.length === 0) {
      console.log('Departments collection empty. Seeding initial departments...');
      await Department.insertMany(seedDepartments);
      departments = await Department.find().sort({ title: 1 });
    }

    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving departments list', error: error.message });
  }
};

// @desc    Create a new department
// @route   POST /api/departments
// @access  Private/Admin
export const createDepartment = async (req, res) => {
  try {
    const { title, description, extra, points, doctorIds } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Please provide both title and description' });
    }

    // Auto generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Check if department already exists
    const deptExists = await Department.findOne({ $or: [{ title }, { slug }] });
    if (deptExists) {
      return res.status(400).json({ message: 'Department with this title or slug already exists' });
    }

    let imageUrl = '';
    // If image file was uploaded
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      imageUrl = req.body.image; // Support fallback to external URL
    }

    const pointsArray = parsePoints(points);

    const department = new Department({
      title,
      slug,
      description,
      extra: extra || '',
      points: pointsArray,
      image: imageUrl
    });

    const savedDepartment = await department.save();

    // Update selected doctors' departments
    if (doctorIds) {
      try {
        const doctorIdsArray = JSON.parse(doctorIds);
        if (Array.isArray(doctorIdsArray) && doctorIdsArray.length > 0) {
          await Doctor.updateMany(
            { _id: { $in: doctorIdsArray } },
            { $set: { department: savedDepartment._id } }
          );
        }
      } catch (err) {
        console.error('Failed to update doctors department on creation:', err);
      }
    }

    res.status(201).json(savedDepartment);
  } catch (error) {
    res.status(400).json({ message: 'Error creating department record', error: error.message });
  }
};

// @desc    Update an existing department
// @route   PUT /api/departments/:id
// @access  Private/Admin
export const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({ message: 'Department record not found' });
    }

    const { title, description, extra, points, doctorIds } = req.body;

    // Check if title is being changed to an existing title
    if (title && title !== department.title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const deptExists = await Department.findOne({ $or: [{ title }, { slug }], _id: { $ne: req.params.id } });
      if (deptExists) {
        return res.status(400).json({ message: 'Department with this title or slug already exists' });
      }
      department.title = title;
      department.slug = slug;
    }

    if (description !== undefined) department.description = description;
    if (extra !== undefined) department.extra = extra;
    if (points !== undefined) {
      department.points = parsePoints(points);
    }

    if (req.file) {
      department.image = `/uploads/${req.file.filename}`;
    } else if (req.body.image !== undefined) {
      department.image = req.body.image;
    }

    const updatedDepartment = await department.save();

    // Update doctor associations if doctorIds is provided
    if (doctorIds !== undefined) {
      try {
        const doctorIdsArray = JSON.parse(doctorIds);
        if (Array.isArray(doctorIdsArray)) {
          // Set department for selected doctors
          await Doctor.updateMany(
            { _id: { $in: doctorIdsArray } },
            { $set: { department: department._id } }
          );

          // Clear department for deselected doctors who were previously in this department
          await Doctor.updateMany(
            {
              _id: { $nin: doctorIdsArray },
              department: department._id
            },
            { $set: { department: null } }
          );
        }
      } catch (err) {
        console.error('Failed to update doctors department list:', err);
      }
    }

    res.status(200).json(updatedDepartment);
  } catch (error) {
    res.status(400).json({ message: 'Error updating department record', error: error.message });
  }
};

// @desc    Delete a department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({ message: 'Department record not found' });
    }

    // Clear department field for any doctors currently under this department
    try {
      await Doctor.updateMany(
        { department: department._id },
        { $set: { department: null } }
      );
    } catch (docErr) {
      console.error('Failed to clear doctor department field during department deletion:', docErr);
    }

    await Department.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id, message: 'Department record successfully removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting department record', error: error.message });
  }
};
