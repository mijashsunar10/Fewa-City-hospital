import { useEffect } from 'react';

const useSEO = (title, description = '', keywords = '') => {
  useEffect(() => {
    // Update Title
    const baseTitle = 'Fewa City Hospital';
    document.title = title ? `${title} | ${baseTitle}` : baseTitle;

    // Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description || 'Fewa City Hospital - Providing high-quality, compassionate and affordable clinical services in Pokhara, Nepal.');

    // Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords || 'Fewa City Hospital, Pokhara, hospital, medical services, ICU, diagnostics, doctors, care');

  }, [title, description, keywords]);
};

export default useSEO;
