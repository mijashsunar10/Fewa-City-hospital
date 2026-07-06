import React, { useState, useEffect } from 'react';
import { Eye, X, ZoomIn } from 'lucide-react';
import './Gallery.css';
import useSEO from '../../hooks/useSEO';

const galleryItems = [
  {
    id: 1,
    category: 'Departments & Wards',
    title: 'Modern ICU Facility',
    description: 'Fully equipped intensive care unit with advanced patient monitoring systems.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 2,
    category: 'Technology & Equipment',
    title: 'Advanced MRI Scanner',
    description: 'High-resolution diagnostic imaging system for precise clinical reports.',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 3,
    category: 'Doctors & Staff',
    title: 'Clinical Consultation',
    description: 'Our experienced medical specialists providing dedicated patient care.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 4,
    category: 'Departments & Wards',
    title: 'Emergency Response Room',
    description: '24/7 active emergency department designed for rapid trauma care.',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 5,
    category: 'Technology & Equipment',
    title: 'Pathology Laboratory',
    description: 'State-of-the-art diagnostic laboratory for hematology and biochemistry.',
    image: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 6,
    category: 'Community Events',
    title: 'Health Awareness Camp',
    description: 'Free community medical outreach program and health screenings.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 7,
    category: 'Departments & Wards',
    title: 'General Ward',
    description: 'Spacious, hygienic, and comfortable general recovery ward.',
    image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 8,
    category: 'Doctors & Staff',
    title: 'Surgical Team',
    description: 'Our team of skilled surgeons operating in sterile environments.',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 9,
    category: 'Community Events',
    title: 'Blood Donation Drive',
    description: 'Annual voluntary blood donation drive organized by Fewa City Hospital.',
    image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=800&auto=format&fit=crop'
  }
];

const categories = ['All', 'Departments & Wards', 'Technology & Equipment', 'Doctors & Staff', 'Community Events'];

const Gallery = () => {
  useSEO('Hospital Gallery', 'View photos and media from Fewa City Hospital in Pokhara, showcasing our ICU, general wards, pathology labs, community events, and medical teams.');
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredItems = galleryItems.filter(item => 
    selectedCategory === 'All' || item.category === selectedCategory
  );

  return (
    <div className="gallery-page">
      {/* HERO SECTION */}
      <div className="gallery-hero">
        <div className="gallery-hero-overlay"></div>
        <div className="gallery-hero-content">
          <h1>Hospital Gallery</h1>
          <p>Explore our state-of-the-art facilities, clinical departments, technology, and community events.</p>
        </div>
      </div>

      <div className="gallery-container">
        {/* CATEGORY FILTER PILLS */}
        <div className="gallery-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-pill ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* GALLERY PHOTO GRID */}
        <div className="gallery-grid">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className="gallery-card"
              onClick={() => setLightboxImage(item)}
            >
              <div className="gallery-img-wrapper">
                <img src={item.image} alt={item.title} loading="lazy" />
                <div className="gallery-hover-overlay">
                  <div className="gallery-zoom-button">
                    <ZoomIn size={24} />
                  </div>
                </div>
              </div>
              <div className="gallery-info">
                <span className="gallery-category-badge">{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LIGHTBOX OVERLAY */}
      {lightboxImage && (
        <div className="lightbox-overlay" onClick={() => setLightboxImage(null)}>
          <button className="lightbox-close" onClick={() => setLightboxImage(null)}>
            <X size={32} />
          </button>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <img src={lightboxImage.image} alt={lightboxImage.title} />
            <div className="lightbox-caption">
              <span className="lightbox-badge">{lightboxImage.category}</span>
              <h2>{lightboxImage.title}</h2>
              <p>{lightboxImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
