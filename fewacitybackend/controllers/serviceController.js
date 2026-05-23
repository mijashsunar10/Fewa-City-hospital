import Service from '../models/Service.js';

const seedServices = [
  {
    title: "Laboratory",
    category: "Diagnostics",
    image: "https://fch.com.np/wp-content/uploads/2026/02/lab.jpg",
    desc: "Advanced laboratories for accurate medical testing and analysis. Supporting reliable diagnosis and patient care."
  },
  {
    title: "X-Ray",
    category: "Diagnostics",
    image: "https://fch.com.np/wp-content/uploads/2026/02/xray.jpg",
    desc: "Digital X-ray imaging for fast and precise diagnosis. Ensures safety with minimal radiation exposure."
  },
  {
    title: "Pharmacy",
    category: "General",
    image: "https://fch.com.np/wp-content/uploads/2026/02/phramacy.jpg",
    desc: "Well-organized pharmacy with essential medicines available. Ensuring safe usage and proper guidance."
  },
  {
    title: "ICU",
    category: "Critical Care",
    image: "https://fch.com.np/wp-content/uploads/2026/02/icu.avif",
    desc: "Advanced intensive care with continuous patient monitoring. Managed by skilled critical care professionals."
  },
  {
    title: "Video Colonoscopy",
    category: "Diagnostics",
    image: "https://fch.com.np/wp-content/uploads/2026/02/colonsocopy.avif",
    desc: "Camera-based examination of the large intestine. Helps in early detection of colorectal conditions."
  },
  {
    title: "Ultrasonography",
    category: "Diagnostics",
    image: "https://fch.com.np/wp-content/uploads/2026/02/ultrasonography.jpeg",
    desc: "Safe imaging using sound waves for diagnosis. Commonly used for organs and pregnancy assessment."
  },
  {
    title: "Laparoscopy",
    category: "Specialized Treatment",
    image: "https://fch.com.np/wp-content/uploads/2026/02/Blausen_0602_Laparoscopy_02.png",
    desc: "Minimally invasive surgical procedure using small incisions. Enables faster recovery and minimal scarring."
  },
  {
    title: "Arthroscopy",
    category: "Specialized Treatment",
    image: "https://fch.com.np/wp-content/uploads/2026/02/arthoscopy.jpg",
    desc: "Joint surgery using a small camera for precision. Improves mobility with quicker healing time."
  },
  {
    title: "CT Scan 160 Slice",
    category: "Diagnostics",
    image: "https://fch.com.np/wp-content/uploads/2026/02/ctscan.jpeg",
    desc: "High-resolution CT imaging for detailed diagnosis. Supports accurate medical evaluation and planning."
  },
  {
    title: "Video Colposcopy",
    category: "Diagnostics",
    image: "https://fch.com.np/wp-content/uploads/2026/02/coloposcopy.jpg",
    desc: "Gynecological screening of cervix and vaginal area. Helps detect abnormalities at an early stage."
  },
  {
    title: "Echocardiography",
    category: "Diagnostics",
    image: "https://fch.com.np/wp-content/uploads/2026/02/echardiography.jpg",
    desc: "Live ultrasound imaging of the heart. Assesses heart function and blood circulation."
  },
  {
    title: "NICU",
    category: "Critical Care",
    image: "https://fch.com.np/wp-content/uploads/2026/02/nicu.jpg",
    desc: "Specialized intensive care for newborn infants. Designed for premature and high-risk babies."
  },
  {
    title: "EEG",
    category: "Diagnostics",
    image: "https://fch.com.np/wp-content/uploads/2026/02/eeg.jpg",
    desc: "Non-invasive test to record brain activity. Used for diagnosing neurological disorders."
  },
  {
    title: "Video Endoscopy",
    category: "Diagnostics",
    image: "https://fch.com.np/wp-content/uploads/2026/02/endoscopy.jpeg",
    desc: "Internal organ examination using a flexible camera. Helps in diagnosis and treatment planning."
  },
  {
    title: "RIRS-HOLLET",
    category: "Specialized Treatment",
    image: "https://fch.com.np/wp-content/uploads/2026/02/rirshollet.jpg",
    desc: "Laser-based kidney stone treatment without open surgery. Ensures quicker recovery and minimal discomfort."
  },
  {
    title: "PFT",
    category: "Diagnostics",
    image: "https://fch.com.np/wp-content/uploads/2026/02/pft.webp",
    desc: "Diagnostic test to evaluate lung function. Helps detect asthma and respiratory conditions."
  },
  {
    title: "TURP / TURBT",
    category: "Specialized Treatment",
    image: "https://fch.com.np/wp-content/uploads/2026/02/turp.jpg",
    desc: "Minimally invasive urological procedures via urethra. Treats prostate enlargement and bladder tumors."
  },
  {
    title: "URS-ICPL",
    category: "Specialized Treatment",
    image: "https://fch.com.np/wp-content/uploads/2026/02/ursicpl.png",
    desc: "Endoscopic treatment for urinary stone removal. Provides effective results with minimal invasion."
  }
];

// @desc    Get all services (seeds automatically if database is empty)
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res) => {
  try {
    let services = await Service.find().sort({ createdAt: -1 });
    
    // Auto-seed if empty
    if (services.length === 0) {
      console.log('Services collection empty. Seeding initial clinical services...');
      await Service.insertMany(seedServices);
      services = await Service.find().sort({ createdAt: -1 });
    }

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving services roster', error: error.message });
  }
};

// @desc    Create a new service
// @route   POST /api/services
// @access  Private/Admin
export const createService = async (req, res) => {
  try {
    const { title, category, desc } = req.body;

    let imageUrl = '';
    // If image file was uploaded
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      imageUrl = req.body.image; // Support fallback to external URL
    }

    // Check if service already exists
    const serviceExists = await Service.findOne({ title });
    if (serviceExists) {
      return res.status(400).json({ message: 'Service with this title already exists' });
    }

    const service = new Service({
      title,
      category,
      desc,
      image: imageUrl
    });

    const savedService = await service.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(400).json({ message: 'Error creating service record', error: error.message });
  }
};

// @desc    Update an existing service
// @route   PUT /api/services/:id
// @access  Private/Admin
export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service record not found' });
    }

    const { title, category, desc } = req.body;

    // Check if title is being changed to an existing title
    if (title && title !== service.title) {
      const serviceExists = await Service.findOne({ title });
      if (serviceExists) {
        return res.status(400).json({ message: 'Service with this title already exists' });
      }
      service.title = title;
    }

    service.category = category || service.category;
    service.desc = desc || service.desc;

    if (req.file) {
      service.image = `/uploads/${req.file.filename}`;
    } else if (req.body.image !== undefined) {
      service.image = req.body.image;
    }

    const updatedService = await service.save();
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(400).json({ message: 'Error updating service record', error: error.message });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service record not found' });
    }

    await Service.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id, message: 'Service record successfully removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service record', error: error.message });
  }
};
