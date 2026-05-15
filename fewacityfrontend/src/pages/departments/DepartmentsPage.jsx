import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './DepartmentsPage.css';

const departmentsData = {
  anesthesia: {
    title: "Anesthesia Department",
    description: "The Anesthesia Department ensures patient comfort and safety before, during, and after surgical procedures. Our team specializes in pain management, critical care support, and modern anesthesia techniques.",
    extra: "We provide personalized care for every patient and focus on safety, monitoring, and post-operative support.",
    points: [
      "Patient monitoring during surgery",
      "Modern anesthesia techniques",
      "Pain management and critical care",
      "Post-operative patient support"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/02/anaesthesia1.jpg",
    doctors: [
      {
        name: "Dr. Tumaya Ghale",
        qual: "MBBS.MS Anesthesia",
        img: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Tumaya%20Ghale%20from%20the%20Anesthesia%20Department."
      },
      {
        name: "Dr. Rohini Sigdel",
        qual: "MBBS.MS Anesthesia",
        img: "https://fch.com.np/wp-content/uploads/2026/02/RohinSigdel.jpg",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Rohini%20Sigdel%20from%20the%20Anesthesia%20Department."
      }
    ]
  },
  cardiology: {
    title: "Cardiology Department",
    description: "The Cardiology Department specializes in diagnosing and treating heart conditions. Our team provides comprehensive cardiac care using advanced technology for heart health assessment and treatment.",
    extra: "We offer preventive care, diagnostic services, and interventional procedures to manage cardiovascular diseases effectively.",
    points: [
      "Comprehensive cardiac care",
      "Heart health assessment",
      "Diagnostic services",
      "Interventional procedures"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/02/cardio.jpeg",
    doctors: [
      {
        name: "Dr. MADHU ROKA",
        qual: "MBBS MD DM",
        img: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20MADHU%20ROKA%20from%20the%20Cardiology%20Department."
      },
      {
        name: "Dr. ARUN KADEL",
        qual: "MBBS MD, DM",
        img: "https://fch.com.np/wp-content/uploads/2026/04/Arun-kandel.png",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20ARUN%20KADEL%20from%20the%20Cardiology%20Department."
      }
    ]
  },
  dental: {
    title: "Dental Department",
    description: "The Dental Department provides comprehensive oral healthcare services for all ages. Our team offers preventive, restorative, and cosmetic dental treatments using modern equipment.",
    points: [
      "Routine checkups and cleanings",
      "Fillings and root canal treatment",
      "Dental implants and crowns",
      "Orthodontic treatments"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/02/dental.jpg",
    doctors: [
      {
        name: "Dr Niva Shrestha",
        qual: "BDS",
        img: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Niva%20Shrestha%20from%20the%20Dental%20Department."
      }
    ]
  },
  dermatology: {
    title: "Dermatology Department",
    description: "The Dermatology Department specializes in skin, hair, and nail conditions. Our team diagnoses and treats various dermatological issues using advanced therapeutic approaches.",
    points: [
      "Skin cancer screening",
      "Acne and eczema treatment",
      "Laser and cosmetic procedures",
      "Hair and scalp disorders"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/02/dermatology.jpeg",
    doctors: [
      {
        name: "Dr. SAURAV ARYAL",
        qual: "MBBS MD",
        img: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20SAURAV%20ARYAL%20from%20the%20Dermatology%20Department."
      },
      {
        name: "Dr. RISHNA MALLA",
        qual: "MBBS. MD",
        img: "https://fch.com.np/wp-content/uploads/2026/04/Untitled-design-27.png",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20RISHNA%20MALLA%20from%20the%20Dermatology%20Department."
      }
    ]
  },
  ent: {
    title: "ENT Department",
    description: "The ENT Department specializes in disorders of the head and neck region. Our team provides comprehensive care for hearing, breathing, and swallowing issues.",
    points: [
      "Hearing tests and hearing aids",
      "Sinus and nasal disorder treatment",
      "Voice and swallowing therapy",
      "Head and neck surgery"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/02/ENT.jpeg",
    doctors: [
      {
        name: "Dr. Krishna Prasad Koirala",
        qual: "MBBS .MS ENT",
        img: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Krishna%20Prasad%20Koirala%20from%20the%20ENT%20Department."
      },
      {
        name: "Dr. Tulika Dube",
        qual: "MBBS .MS ENT",
        img: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Tulika%20Dube%20from%20the%20ENT%20Department."
      },
      {
        name: "Dr. Donjan Bahadur Lamechhine",
        qual: "MBBS .MS ENT",
        img: "https://fch.com.np/wp-content/uploads/2026/04/Donjan-bdr-lamichhane.png",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Donjan%20Bahadur%20Lamechhine%20from%20the%20ENT%20Department."
      },
      {
        name: "Dr. Bonu Gaudel",
        qual: "MBBS .MS ENT",
        img: "https://fch.com.np/wp-content/uploads/2026/04/Bunu-gaudel.png",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Bunu%20Gaudel%20from%20the%20ENT%20Department."
      }
    ]
  },
  gastro: {
    title: "Gastroenterology Department",
    description: "The Gastroenterology Department specializes in digestive system disorders. Our team diagnoses and treats conditions affecting the esophagus, stomach, intestines, liver, and pancreas.",
    points: [
      "Endoscopy and colonoscopy",
      "Liver disease management",
      "Inflammatory bowel disease treatment",
      "Digestive disorder diagnosis"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/02/Gastrology.jpeg",
    doctors: [
      {
        name: "Dr. Suresh Thapa",
        qual: "MBBS,MD, DM Gestrology",
        img: "https://fch.com.np/wp-content/uploads/2026/04/Untitled-design-26.png",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Suresh%20Thapa%20from%20the%20Gastroenterology%20Department."
      },
      {
        name: "Dr. Jeevan Thapa",
        qual: "MBBS,MD, DM Gestrology",
        img: "https://fch.com.np/wp-content/uploads/2026/04/jiwan-thapa.png",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Jeevan%20Thapa%20from%20the%20Gastroenterology%20Department."
      }
    ]
  },
  surgery: {
    title: "Surgery Department",
    description: "The Surgery Department provides a wide range of surgical services using advanced techniques and technology. Our team performs both routine and complex surgical procedures.",
    points: [
      "General and laparoscopic surgery",
      "Emergency surgical care",
      "Minimally invasive procedures",
      "Post-operative care and recovery"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/02/sugery.jpeg",
    doctors: [
      {
        name: "Dr. Bhoj Raj Neupane",
        qual: "MBBS.MS General Surgeon",
        img: "https://fch.com.np/wp-content/uploads/2026/04/Untitled-design-30.png",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Bhoj%20Raj%20Neupane%20from%20the%20Surgery%20Department."
      },
      {
        name: "Dr Sureshraj Paudel",
        qual: "MBBS.MS General Surgeon",
        img: "https://fch.com.np/wp-content/uploads/2026/04/Untitled-design-28.png",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Sureshraj%20Paudel%20from%20the%20Surgery%20Department."
      }
    ]
  },
  gynecology: {
    title: "Gynecology Department",
    description: "The Gynecology Department provides comprehensive women's health services, focusing on reproductive system health. Our team offers preventive care, diagnosis, and treatment of gynecological conditions.",
    points: [
      "Annual exams and Pap smears",
      "Family planning and contraception",
      "Menstrual disorder management",
      "Minimally invasive gynecological surgery"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/02/gymecology.jpeg",
    doctors: [
      {
        name: "Dr. Chandika Pandit",
        qual: "MBBS.Ms.DCH Gyanocologist",
        img: "https://fch.com.np/wp-content/uploads/2026/02/ChandikaPandit.jpg",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Chandika%20Pandit%20from%20the%20Gynecology%20Department."
      },
      {
        name: "Dr. Padmaraj Dhungana",
        qual: "MBBS.Ms. Gyanocologist",
        img: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Padmaraj%20Dhungana%20from%20the%20Gynecology%20Department."
      }
    ]
  },
  medicine: {
    title: "General Medicine Department",
    description: "The General Medicine Department provides primary care for adults, managing a wide range of medical conditions. Our team focuses on diagnosis, treatment, and prevention of common and complex illnesses.",
    points: [
      "Comprehensive health checkups",
      "Chronic disease management",
      "Preventive health counseling",
      "Acute illness treatment"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/02/internal.jpg",
    doctors: [
      {
        name: "Dr. Buddhi Bahadur Thapa",
        qual: "MBBS.MD Senior Consultant ( Internal Medicine)",
        img: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Buddhi%20Bahadur%20Thapa%20from%20the%20General%20Medicine%20Department."
      },
      {
        name: "Dr. Krishna Bhadur Thapa",
        qual: "MBBS.MD Consultant ( Internal Medicine)",
        img: "https://fch.com.np/wp-content/uploads/2026/04/Krishna-bdr-thapa.png",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Krishna%20Bhadur%20Thapa%20from%20the%20General%20Medicine%20Department."
      },
      {
        name: "Dr. Hari Krishna Bhandari",
        qual: "MBBS.MD Consultant Physician",
        img: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Hari%20Krishna%20Bhandari%20from%20the%20General%20Medicine%20Department."
      }
    ]
  },
  neuro: {
    title: "Neurosurgery Department",
    description: "The Neurosurgery Department specializes in diagnosing and treating disorders of the nervous system. Our team manages conditions affecting the brain, spinal cord, nerves, and muscles.",
    points: [
      "Brain and spinal surgery",
      "Stroke management",
      "Epilepsy treatment",
      "Neuro-oncology"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/02/neurosergery.avif",
    doctors: [
      {
        name: "Dr Rajan Kumar Sharma",
        qual: "MBBS MD",
        img: "https://fch.com.np/wp-content/uploads/2026/04/rajan-kumar-sharma.png",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Rajan%20Kumar%20Sharma%20from%20the%20Neurosurgery%20Department."
      }
    ]
  },
  orthopedic: {
    title: "Orthopedic Department",
    description: "The Orthopedic Department specializes in conditions involving the musculoskeletal system. Our surgeons provide care for bones, joints, ligaments, tendons, and muscles.",
    points: [
      "Joint replacement surgery",
      "Fracture and trauma care",
      "Sports medicine",
      "Spine and back surgery"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/03/ortho.jpg",
    doctors: [
      {
        name: "Dr. Rabeendra Prasad Shrestha",
        qual: "MBBS.MS Orthopedic Surgeon",
        img: "https://fch.com.np/wp-content/uploads/2026/04/Rabindra-psd-shrestha.png",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Rabeendra%20Prasad%20Shrestha%20from%20the%20Orthopedic%20Department."
      },
      {
        name: "Dr. Dinesh Kumar BK",
        qual: "MBBS, MS – (Ortho) Trauma & Joint Replacement Surgeon",
        img: "https://fch.com.np/wp-content/uploads/2026/04/dinesh-kumar-bk.png",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Dinesh%20Kumar%20BK%20from%20the%20Orthopedic%20Department."
      },
      {
        name: "Dr. Rabimohan Dhakal",
        qual: "MBBS, MS – (Ortho) Trauma, Sport Injury & Arthroscopy Surgeon",
        img: "https://fch.com.np/wp-content/uploads/2026/04/rabi-mohan-dhakal.png",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Rabimohan%20Dhakal%20from%20the%20Orthopedic%20Department."
      }
    ]
  },
  peadiatric: {
    title: "Peadiatric Department",
    description: "The Peadiatric Department provides specialized medical care for infants, children, and adolescents. Our team focuses on the physical, emotional, and social health of young patients.",
    points: [
      "Routine checkups and vaccinations",
      "Childhood illness treatment",
      "Growth and development monitoring",
      "Pediatric emergency care"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/03/oedi.jpeg",
    doctors: [
      {
        name: "Dr. Hum Prasad Neupane",
        qual: "MBBS.DCH Peadiatrician",
        img: "https://fch.com.np/wp-content/uploads/2026/04/hum-psd-neupane.png",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Hum%20Prasad%20Neupane%20from%20the%20Peadiatric%20Department."
      },
      {
        name: "Dr. Amrita Ghimire",
        qual: "MBBS MD Peadiatrician",
        img: "https://fch.com.np/wp-content/uploads/2026/04/2.png",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Amrita%20Ghimire%20from%20the%20Peadiatric%20Department."
      }
    ]
  },
  urology: {
    title: "Urology Department",
    description: "The Urology Department provides medical and surgical care for the urinary tract system and the male reproductive organs.",
    points: [
      "Kidney and bladder care",
      "Prostate health",
      "Urinary tract infection treatment",
      "Minimally invasive urologic surgery"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/03/urology.jpg",
    doctors: [
      {
        name: "Dr. Dhurba Bahadur Adhikari",
        qual: "MBBS MS Urologist",
        img: "https://fch.com.np/wp-content/uploads/2026/04/Dhurba-bdr-adhikari.png",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Dhurba%20Bahadur%20Adhikari%20from%20the%20Urology%20Department."
      },
      {
        name: "Dr. Anup Chapagain",
        qual: "MBBS MS, MCH Urologist",
        img: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Anup%20Chapagain%20from%20the%20Urology%20Department."
      }
    ]
  },
  radiology: {
    title: "Radiology Department",
    description: "The Radiology Department uses medical imaging to diagnose and treat diseases seen within the body.",
    points: [
      "X-ray and Fluoroscopy",
      "CT and MRI scans",
      "Ultrasound imaging",
      "Interventional radiology"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/03/radiology.jpeg",
    doctors: [
      {
        name: "Dr. Ananda Bahadur Shrestha",
        qual: "MBBS DMRD Radiology",
        img: "https://fch.com.np/wp-content/uploads/2026/04/1.png",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Ananda%20Bahadur%20Shrestha%20from%20the%20Radiology%20Department."
      },
      {
        name: "Dr. Madan Thapa",
        qual: "MBBS.MD Radiology",
        img: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Madan%20Thapa%20from%20the%20Radiology%20Department."
      },
      {
        name: "Dr. Susmit Kafle",
        qual: "MBBS.MD Radiology",
        img: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Susmit%20Kafle%20from%20the%20Radiology%20Department."
      }
    ]
  },
  psychiatric: {
    title: "Psychiatric Department",
    description: "The Psychiatric Department provides compassionate mental health care, focusing on the diagnosis, treatment, and prevention of mental, emotional, and behavioral disorders.",
    points: [
      "Counseling and therapy",
      "Mental health assessments",
      "Mood disorder treatment",
      "Stress management"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/03/psytric.jpeg",
    doctors: [
      {
        name: "Dr. Jaya Bahadur Khatri",
        qual: "MBBS. MD",
        img: "https://fch.com.np/wp-content/uploads/2026/04/Jay-bdr-khatri.png",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Jaya%20Bahadur%20Khatri%20from%20the%20Psychiatric%20Department."
      }
    ]
  },
  opthalmology: {
    title: "Opthalmology Department",
    description: "The Opthalmology Department provides comprehensive eye care, from routine exams to advanced surgical procedures.",
    points: [
      "Vision testing and spectacles",
      "Cataract surgery",
      "Glaucoma management",
      "Eye trauma care"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/03/opthamology.jpeg",
    doctors: [
      {
        name: "Dr. ANJITA HIRACHAN",
        qual: "MBBS MD",
        img: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20ANJITA%20HIRACHAN%20from%20the%20Opthalmology%20Department."
      },
      {
        name: "Dr. RENU POUDEL",
        qual: "MBBS MD",
        img: "https://fch.com.np/wp-content/uploads/2026/04/renu-poudel.png",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20RENU%20POUDEL%20from%20the%20Opthalmology%20Department."
      }
    ]
  },
  nephrology: {
    title: "Nephrology Department",
    description: "The Nephrology Department specializes in kidney care and the treatment of kidney-related diseases.",
    points: [
      "Chronic kidney disease management",
      "Dialysis services",
      "Hypertension treatment",
      "Kidney stone prevention"
    ],
    image: "https://fch.com.np/wp-content/uploads/2026/03/nepro.jpg",
    doctors: [
      {
        name: "Dr. BIKASH KHATRI",
        qual: "MBBS. MD. DM",
        img: "https://fch.com.np/wp-content/uploads/2026/03/docotorlast.jpg",
        waLink: "https://wa.me/9779765940555?text=Hello%20Doctor%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20BIKASH%20KHATRI%20from%20the%20Nephrology%20Department."
      }
    ]
  }
};

const DepartmentsPage = () => {
  const [activeDept, setActiveDept] = useState('anesthesia');
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && departmentsData[hash]) {
      setActiveDept(hash);
      window.scrollTo(0, 0);
    }
  }, [location]);

  const handleDeptChange = (deptId) => {
    setActiveDept(deptId);
    // Optional: update hash without reloading
    // window.history.pushState(null, null, `#${deptId}`);
  };

  const currentDept = departmentsData[activeDept];

  return (
    <section className="department-section">
      <div className="department-container">
        {/* LEFT SIDE */}
        <aside className="department-list">
          {/* MOBILE DROPDOWN */}
          <select 
            className="dept-dropdown" 
            value={activeDept} 
            onChange={(e) => handleDeptChange(e.target.value)}
          >
            {Object.keys(departmentsData).map(key => (
              <option key={key} value={key}>
                {departmentsData[key].title.replace(' Department', '')}
              </option>
            ))}
          </select>

          {/* DESKTOP BUTTONS */}
          <div className="dept-buttons">
            {Object.keys(departmentsData).map(key => (
              <button 
                key={key}
                className={`dept-btn ${activeDept === key ? 'active' : ''}`}
                onClick={() => handleDeptChange(key)}
              >
                {departmentsData[key].title.replace(' Department', '')}
              </button>
            ))}
          </div>
        </aside>

        {/* RIGHT SIDE */}
        <div className="department-content">
          <div className="dept-panel active">
            <div className="dept-top">
              <div className="dept-text">
                <h2>{currentDept.title}</h2>
                <p>{currentDept.description}</p>
                {currentDept.extra && <p>{currentDept.extra}</p>}
                <ul className="dept-points">
                  {currentDept.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
              <div className="dept-images">
                <img src={currentDept.image} alt={currentDept.title} />
              </div>
            </div>

            <div className="dept-doctors">
              <h3>Available Doctors</h3>
              <div className="doctor-grid">
                {currentDept.doctors.map((doc, i) => (
                  <div className="doctor-card" key={i}>
                    <img src={doc.img} alt={doc.name} />
                    <h4>{doc.name}</h4>
                    <span>{doc.qual}</span>
                    <a 
                      className="book-btn" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      href={doc.waLink}
                    >
                      Book Appointment
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DepartmentsPage;
