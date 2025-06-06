import React, { useState, useEffect, useRef } from 'react';

const LisbonJobOpportunityLanding = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [formStep, setFormStep] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    experience: '',
    disponibilite: '',
    motivation: '',
    cv: null
  });

  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const observerRef = useRef();
  const heroRef = useRef();

  useEffect(() => {
    document.title = "Poste Francophone Lisbonne - Logement Inclus, Départ 14 jours";
    
    // Scroll parallax effect
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    // Mouse tracking for subtle effects
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    // Intersection Observer for animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Auto testimonial rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Observe elements for animations
  useEffect(() => {
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  const testimonials = [
    {
      text: "En 6 mois à Lisbonne, j'ai progressé professionnellement et découvert un art de vivre incroyable.",
      author: "Marie D.",
      role: "Conseillère client",
      gradient: "from-pink-500 to-violet-500"
    },
    {
      text: "Le processus était si fluide ! En 2 semaines j'étais installé et opérationnel.",
      author: "Thomas M.", 
      role: "Support technique",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      text: "Salaire sur 14 mois, assurance privée... Les avantages sont réels.",
      author: "Lucas P.",
      role: "Conseiller senior",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  const trackEvent = (eventName) => {
    console.log(`FB Pixel: ${eventName}`);
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', eventName);
    }
  };

  const handleFormSubmit = () => {
    // Validation des champs requis
    if (!formData.nom || !formData.email || !formData.telephone) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Veuillez entrer une adresse email valide.');
      return;
    }

    // Tracking des événements
    trackEvent('Lead');
    trackEvent('CompleteRegistration');
    
    // En production, vous pourriez envoyer les données via FormData pour inclure le fichier :
    /*
    const formDataToSend = new FormData();
    formDataToSend.append('nom', formData.nom);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('telephone', formData.telephone);
    formDataToSend.append('experience', formData.experience);
    formDataToSend.append('disponibilite', formData.disponibilite);
    formDataToSend.append('motivation', formData.motivation);
    if (formData.cv) {
      formDataToSend.append('cv', formData.cv);
    }
    
    // Envoi vers votre API
    fetch('/api/candidatures', {
      method: 'POST',
      body: formDataToSend
    });
    */
    
    console.log('Données de candidature:', {
      ...formData,
      cv: formData.cv ? {
        name: formData.cv.name,
        size: formData.cv.size,
        type: formData.cv.type
      } : null
    });

    alert(`Merci ${formData.nom} ! Votre candidature${formData.cv ? ' avec CV' : ''} a été envoyée. Nous vous recontacterons sous 48h.`);
  };

  const nextFormStep = () => {
    if (formStep < 2) setFormStep(formStep + 1);
  };

  const prevFormStep = () => {
    if (formStep > 0) setFormStep(formStep - 1);
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // File upload handlers
  const handleFileSelect = (file) => {
    if (file && validateFile(file)) {
      updateFormData('cv', file);
    }
  };

  const validateFile = (file) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      alert('Format non supporté. Utilisez PDF, DOC ou DOCX.');
      return false;
    }

    if (file.size > maxSize) {
      alert('Fichier trop volumineux. Maximum 5MB.');
      return false;
    }

    return true;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const removeFile = () => {
    updateFormData('cv', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Dynamic styles with animations
  const getAnimatedStyle = (elementId, baseStyle = {}) => {
    const isElementVisible = isVisible[elementId];
    return {
      ...baseStyle,
      opacity: isElementVisible ? 1 : 0,
      transform: isElementVisible 
        ? 'translateY(0px) scale(1)' 
        : 'translateY(30px) scale(0.95)',
      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
    };
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: `linear-gradient(135deg, #263F58 0%, #1a2d3f 50%, #0f1419 100%)`,
      color: 'white',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      position: 'relative',
      overflow: 'hidden'
    },
    
    // Animated background particles
    backgroundEffect: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,215,0,0.03) 0%, transparent 50%)`,
      transition: 'background 0.3s ease'
    },

    header: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      background: `rgba(38, 63, 88, ${scrollY > 50 ? 0.95 : 0.9})`,
      backdropFilter: 'blur(20px) saturate(180%)',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      padding: scrollY > 50 ? '8px 16px' : '12px 16px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: scrollY > 50 ? '0 4px 20px rgba(0,0,0,0.2)' : 'none'
    },

    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },

    logo: {
      fontSize: '18px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },

    navButton: {
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      color: '#1C1C1C',
      padding: '10px 20px',
      borderRadius: '25px',
      fontWeight: '700',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 4px 15px rgba(255,215,0,0.3)',
      transform: 'scale(1)'
    },

    heroSection: {
      paddingTop: '100px',
      paddingBottom: '60px',
      paddingLeft: '16px',
      paddingRight: '16px',
      position: 'relative',
      transform: `translateY(${scrollY * 0.1}px)`,
      transition: 'transform 0.1s ease-out'
    },

    maxWidth: {
      maxWidth: '420px',
      margin: '0 auto',
      textAlign: 'center'
    },

    badge: {
      display: 'inline-block',
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(255,215,0,0.4)',
      borderRadius: '50px',
      padding: '12px 20px',
      marginBottom: '32px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#FFD700',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(255,215,0,0.1)',
      animation: 'pulse 2s infinite'
    },

    title: {
      fontSize: 'clamp(28px, 8vw, 38px)',
      fontWeight: '900',
      lineHeight: '1.1',
      marginBottom: '20px',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #E5E7EB 50%, #FFD700 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      letterSpacing: '-0.02em'
    },

    highlight: {
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },

    subtitle: {
      fontSize: '20px',
      color: '#E5E7EB',
      marginBottom: '12px',
      fontWeight: '600'
    },

    description: {
      color: '#9CA3AF',
      marginBottom: '40px',
      fontSize: '16px'
    },

    offerCard: {
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(255,215,0,0.3)',
      borderRadius: '20px',
      padding: '28px',
      marginBottom: '40px',
      backdropFilter: 'blur(20px) saturate(180%)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
      position: 'relative',
      overflow: 'hidden'
    },

    offerCardGlow: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(45deg, rgba(255,215,0,0.05), transparent, rgba(255,215,0,0.05))',
      animation: 'shimmer 3s ease-in-out infinite'
    },

    offerTitle: {
      color: '#FFD700',
      fontWeight: '800',
      fontSize: '20px',
      marginBottom: '20px',
      position: 'relative',
      zIndex: 2
    },

    offerGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      fontSize: '14px',
      position: 'relative',
      zIndex: 2
    },

    offerItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px',
      borderRadius: '10px',
      transition: 'all 0.3s ease'
    },

    checkmark: {
      width: '20px',
      height: '20px',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#1C1C1C',
      fontSize: '12px',
      fontWeight: 'bold',
      boxShadow: '0 4px 12px rgba(255,215,0,0.3)',
      animation: 'bounce 0.6s ease'
    },

    primaryButton: {
      width: '100%',
      background: 'linear-gradient(135deg, #FFFFFF, #F8F9FA)',
      color: '#1C1C1C',
      padding: '18px',
      borderRadius: '16px',
      fontWeight: '800',
      fontSize: '18px',
      border: 'none',
      cursor: 'pointer',
      marginBottom: '16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden'
    },

    secondaryButton: {
      width: '100%',
      background: 'rgba(255,255,255,0.05)',
      color: '#E5E7EB',
      padding: '18px',
      borderRadius: '16px',
      fontWeight: '600',
      border: '1px solid rgba(255,255,255,0.2)',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backdropFilter: 'blur(10px)'
    },

    section: {
      padding: '80px 16px',
      position: 'relative'
    },

    sectionTitle: {
      fontSize: 'clamp(24px, 6vw, 32px)',
      fontWeight: '800',
      textAlign: 'center',
      marginBottom: '40px',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #FFD700 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },

    statsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
      maxWidth: '420px',
      margin: '0 auto'
    },

    statCard: {
      background: 'rgba(255,255,255,0.08)',
      borderRadius: '16px',
      padding: '24px 16px',
      textAlign: 'center',
      border: '1px solid rgba(255,255,255,0.1)',
      backdropFilter: 'blur(20px)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer'
    },

    statNumber: {
      fontSize: '28px',
      fontWeight: '900',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '8px'
    },

    statLabel: {
      fontSize: '12px',
      color: '#9CA3AF',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      fontWeight: '600'
    },

    testimonialCard: {
      background: 'rgba(255,255,255,0.08)',
      borderRadius: '20px',
      padding: '32px',
      border: '1px solid rgba(255,255,255,0.1)',
      marginBottom: '20px',
      backdropFilter: 'blur(20px)',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '200px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },

    testimonialText: {
      fontStyle: 'italic',
      marginBottom: '24px',
      color: '#E5E7EB',
      fontSize: '16px',
      lineHeight: '1.6',
      position: 'relative',
      zIndex: 2
    },

    testimonialAuthor: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      position: 'relative',
      zIndex: 2
    },

    avatar: {
      width: '48px',
      height: '48px',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#1C1C1C',
      fontWeight: '800',
      fontSize: '18px',
      boxShadow: '0 8px 24px rgba(255,215,0,0.3)'
    },

    dots: {
      display: 'flex',
      justifyContent: 'center',
      gap: '12px',
      marginTop: '24px'
    },

    dot: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      border: 'none'
    },

    featureCard: {
      background: 'rgba(255,255,255,0.08)',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid rgba(255,255,255,0.1)',
      marginBottom: '16px',
      backdropFilter: 'blur(20px)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer'
    },

    featureHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px'
    },

    featureNumber: {
      width: '40px',
      height: '40px',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#1C1C1C',
      fontWeight: '800',
      fontSize: '16px',
      flexShrink: 0,
      boxShadow: '0 6px 20px rgba(255,215,0,0.3)'
    },

    formCard: {
      background: 'rgba(255,255,255,0.08)',
      borderRadius: '24px',
      padding: '32px',
      border: '1px solid rgba(255,255,255,0.1)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 24px 48px rgba(0,0,0,0.2)'
    },

    progressBar: {
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
      marginBottom: '32px'
    },

    progressStep: {
      height: '4px',
      borderRadius: '2px',
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
    },

    input: {
      width: '100%',
      padding: '16px',
      background: 'rgba(255,255,255,0.05)',
      border: '2px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      color: 'white',
      fontSize: '16px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backdropFilter: 'blur(10px)'
    },

    floatingCTA: {
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      right: '20px',
      zIndex: 40,
      animation: 'slideUp 0.5s ease-out'
    },

    // File upload styles
    uploadZone: {
      border: `2px dashed ${dragActive ? '#FFD700' : 'rgba(255,255,255,0.3)'}`,
      borderRadius: '12px',
      padding: '32px 20px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      background: dragActive ? 'rgba(255,215,0,0.05)' : 'rgba(255,255,255,0.02)',
      position: 'relative',
      overflow: 'hidden'
    },

    uploadIcon: {
      width: '48px',
      height: '48px',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      fontSize: '20px',
      color: '#1C1C1C',
      boxShadow: '0 6px 20px rgba(255,215,0,0.3)'
    },

    filePreview: {
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(255,215,0,0.3)',
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginTop: '16px'
    },

    fileIcon: {
      width: '40px',
      height: '40px',
      background: 'linear-gradient(135deg, #10B981, #059669)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '18px',
      flexShrink: 0
    },

    fileInfo: {
      flex: 1,
      textAlign: 'left'
    },

    fileName: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#FFFFFF',
      marginBottom: '4px'
    },

    fileSize: {
      fontSize: '12px',
      color: '#9CA3AF'
    },

    removeButton: {
      background: 'rgba(239, 68, 68, 0.2)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '6px',
      padding: '6px',
      cursor: 'pointer',
      color: '#EF4444',
      fontSize: '14px',
      transition: 'all 0.3s ease'
    }
  };

  // Event handlers with enhanced UX
  const handleButtonHover = (e) => {
    e.target.style.transform = 'translateY(-2px) scale(1.02)';
    e.target.style.boxShadow = '0 12px 40px rgba(255,215,0,0.4)';
  };

  const handleButtonLeave = (e) => {
    e.target.style.transform = 'translateY(0) scale(1)';
    e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.15)';
  };

  const handleStatHover = (e) => {
    e.target.style.transform = 'translateY(-4px) scale(1.05)';
    e.target.style.background = 'rgba(255,255,255,0.12)';
    e.target.style.borderColor = 'rgba(255,215,0,0.3)';
  };

  const handleStatLeave = (e) => {
    e.target.style.transform = 'translateY(0) scale(1)';
    e.target.style.background = 'rgba(255,255,255,0.08)';
    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
  };

  return (
    <div style={styles.container}>
      {/* Animated background */}
      <div style={styles.backgroundEffect}></div>
      
      {/* Enhanced styles */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          @keyframes bounce {
            0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
            40%, 43% { transform: translateY(-8px); }
            70% { transform: translateY(-4px); }
            90% { transform: translateY(-2px); }
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes slideUp {
            from { transform: translateY(100px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          @keyframes fadeInUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          .animate-fadeInUp {
            animation: fadeInUp 0.6s ease-out;
          }
          
          input:focus, textarea:focus, select:focus {
            outline: none !important;
            border-color: #FFD700 !important;
            background: rgba(255,255,255,0.1) !important;
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(255,215,0,0.2) !important;
          }
          
          input::placeholder, textarea::placeholder {
            color: rgba(255,255,255,0.5);
          }
        `}
      </style>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.nav}>
          <div style={styles.logo}>Opportunité Lisbonne</div>
          <button 
            style={styles.navButton}
            onClick={() => {
              trackEvent('InitiateCheckout');
              scrollToSection('candidature');
            }}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
          >
            Postuler
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.heroSection} ref={heroRef}>
        <div style={styles.maxWidth}>
          <div style={styles.badge}>
            ● 2500+ candidats sélectionnés
          </div>

          <h1 style={styles.title} className="animate-fadeInUp">
            Vous parlez français ?<br/>
            <span style={styles.highlight}>Démarrez une nouvelle vie</span><br/>
            à Lisbonne.
          </h1>

          <p style={styles.subtitle} className="animate-fadeInUp">
            Travaillez en français. Vivez au soleil.
          </p>
          <p style={styles.description} className="animate-fadeInUp">
            Une opportunité exceptionnelle dans la capitale portugaise.
          </p>

          <div style={styles.offerCard} className="animate-fadeInUp">
            <div style={styles.offerCardGlow}></div>
            <div style={styles.offerTitle}>
              Conseiller clientèle francophone
            </div>
            <div style={styles.offerGrid}>
              {[
                'Contrat local',
                'Logement inclus', 
                '14 mois salaire',
                'Départ 14j'
              ].map((item, idx) => (
                <div key={idx} style={styles.offerItem}>
                  <div style={{...styles.checkmark, animationDelay: `${idx * 0.1}s`}}>✓</div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <button 
            style={styles.primaryButton}
            onClick={() => {
              trackEvent('InitiateCheckout');
              scrollToSection('candidature');
            }}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
            className="animate-fadeInUp"
          >
            Je postule maintenant →
          </button>
          
          <button 
            style={styles.secondaryButton}
            onClick={() => scrollToSection('details')}
            className="animate-fadeInUp"
          >
            Découvrir l'offre
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{...styles.section, padding: '60px 16px', backgroundColor: '#1a2d3f'}} id="details">
        <div style={styles.statsGrid} data-animate id="stats">
          {[
            { number: '2500+', label: 'Candidats' },
            { number: '300+', label: 'Jours soleil' },
            { number: '-40%', label: 'Coût vie' },
            { number: '14', label: 'Mois salaire' }
          ].map((stat, idx) => (
            <div 
              key={idx} 
              style={{
                ...styles.statCard,
                ...getAnimatedStyle('stats'),
                animationDelay: `${idx * 0.1}s`
              }}
              onMouseEnter={handleStatHover}
              onMouseLeave={handleStatLeave}
            >
              <div style={styles.statNumber}>{stat.number}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={styles.section}>
        <div style={styles.maxWidth}>
          <h2 style={styles.sectionTitle} data-animate id="testimonials-title">
            Ils ont sauté le pas
          </h2>
          
          <div 
            style={{
              ...styles.testimonialCard,
              ...getAnimatedStyle('testimonials-title')
            }}
          >
            <p style={styles.testimonialText}>
              "{testimonials[currentTestimonial].text}"
            </p>
            <div style={styles.testimonialAuthor}>
              <div style={styles.avatar}>
                {testimonials[currentTestimonial].author[0]}
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>
                  {testimonials[currentTestimonial].author}
                </div>
                <div style={{ fontSize: '14px', color: '#9CA3AF' }}>
                  {testimonials[currentTestimonial].role}
                </div>
              </div>
            </div>
          </div>
          
          <div style={styles.dots}>
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentTestimonial(idx)}
                style={{
                  ...styles.dot,
                  backgroundColor: idx === currentTestimonial ? '#FFD700' : 'rgba(255,255,255,0.3)',
                  transform: idx === currentTestimonial ? 'scale(1.2)' : 'scale(1)'
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Lisbon */}
      <section style={{...styles.section, backgroundColor: '#1a2d3f'}}>
        <div style={styles.maxWidth}>
          <h2 style={styles.sectionTitle} data-animate id="why-title">
            Pourquoi Lisbonne ?
          </h2>
          
          {[
            { num: '01', title: 'Qualité de vie', desc: 'Mer, culture, plages à 20min, climat méditerranéen' },
            { num: '02', title: 'Hub tech européen', desc: 'Équipes multiculturelles, centre tech du Sud' },
            { num: '03', title: 'Avantage économique', desc: '-40% coût vie vs Paris, pouvoir d\'achat amélioré' },
            { num: '04', title: 'Support complet', desc: 'Logement, démarches, intégration culturelle' }
          ].map((feature, idx) => (
            <div 
              key={idx}
              style={{
                ...styles.featureCard,
                ...getAnimatedStyle('why-title'),
                animationDelay: `${idx * 0.1}s`
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px)';
                e.target.style.background = 'rgba(255,255,255,0.12)';
                e.target.style.borderColor = 'rgba(255,215,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.background = 'rgba(255,255,255,0.08)';
                e.target.style.borderColor = 'rgba(255,255,255,0.1)';
              }}
            >
              <div style={styles.featureHeader}>
                <div style={styles.featureNumber}>{feature.num}</div>
                <div>
                  <div style={{ fontWeight: '700', marginBottom: '8px', fontSize: '16px' }}>
                    {feature.title}
                  </div>
                  <p style={{ fontSize: '14px', color: '#9CA3AF', margin: 0 }}>
                    {feature.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Floating CTA */}
      <div style={styles.floatingCTA}>
        <button 
          onClick={() => {
            trackEvent('InitiateCheckout');
            scrollToSection('candidature');
          }}
          style={{
            ...styles.primaryButton, 
            boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
            fontSize: '16px',
            fontWeight: '800'
          }}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonLeave}
        >
          Postuler maintenant →
        </button>
      </div>

      {/* Complete Form Section */}
      <section style={{...styles.section, backgroundColor: '#0f1419'}} id="candidature">
        <div style={styles.maxWidth}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }} data-animate id="form-header">
            <h2 style={{
              ...styles.sectionTitle,
              ...getAnimatedStyle('form-header')
            }}>
              Candidatures ouvertes
            </h2>
            <p style={{ color: '#E5E7EB', marginBottom: '8px', fontSize: '16px' }}>
              Logement inclus • Départ sous 14 jours
            </p>
            <p style={{ 
              color: '#FFD700', 
              fontWeight: '700', 
              fontSize: '14px',
              animation: 'pulse 2s infinite'
            }}>
              Postulez aujourd'hui pour sécuriser votre place
            </p>
          </div>

          {/* Progress Bar */}
          <div style={styles.progressBar}>
            {[0, 1, 2].map((step) => (
              <div
                key={step}
                style={{
                  ...styles.progressStep,
                  width: '60px',
                  backgroundColor: step <= formStep ? '#FFD700' : 'rgba(255,255,255,0.2)',
                  transform: step <= formStep ? 'scaleY(1.5)' : 'scaleY(1)',
                  boxShadow: step <= formStep ? '0 4px 12px rgba(255,215,0,0.4)' : 'none'
                }}
              />
            ))}
          </div>

          {/* Step indicators */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '32px',
            padding: '0 20px'
          }}>
            {['Coordonnées', 'Profil', 'Motivation'].map((label, idx) => (
              <div key={idx} style={{
                fontSize: '12px',
                color: idx <= formStep ? '#FFD700' : '#6B7280',
                fontWeight: idx <= formStep ? '600' : '400',
                transition: 'all 0.3s ease'
              }}>
                {label}
              </div>
            ))}
          </div>

          <div style={{
            ...styles.formCard,
            ...getAnimatedStyle('form-header'),
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Step 1: Contact Info */}
            {formStep === 0 && (
              <div style={{
                opacity: 1,
                transform: 'translateX(0)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <h3 style={{ 
                  fontWeight: '700', 
                  textAlign: 'center', 
                  marginBottom: '32px',
                  fontSize: '20px',
                  background: 'linear-gradient(135deg, #FFFFFF, #FFD700)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Vos coordonnées
                </h3>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: '#FFFFFF'
                  }}>
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => updateFormData('nom', e.target.value)}
                    style={styles.input}
                    placeholder="Votre nom et prénom"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: '#FFFFFF'
                  }}>
                    Email *
                  </label>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '8px' }}>
                    Nous vous recontacterons sous 48h
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    style={styles.input}
                    placeholder="votre@email.com"
                  />
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: '#FFFFFF'
                  }}>
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => updateFormData('telephone', e.target.value)}
                    style={styles.input}
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>

                <button
                  onClick={nextFormStep}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    color: '#1C1C1C',
                    padding: '16px',
                    borderRadius: '12px',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 6px 20px rgba(255,215,0,0.3)',
                    marginTop: 'auto'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 24px rgba(255,215,0,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 6px 20px rgba(255,215,0,0.3)';
                  }}
                >
                  Continuer → Étape 2/3
                </button>
              </div>
            )}

            {/* Step 2: Profile */}
            {formStep === 1 && (
              <div style={{
                opacity: 1,
                transform: 'translateX(0)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <h3 style={{ 
                  fontWeight: '700', 
                  textAlign: 'center', 
                  marginBottom: '32px',
                  fontSize: '20px',
                  background: 'linear-gradient(135deg, #FFFFFF, #FFD700)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Votre profil professionnel
                </h3>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: '#FFFFFF'
                  }}>
                    Expérience en relation client
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e) => updateFormData('experience', e.target.value)}
                    style={{
                      ...styles.input,
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                      backgroundSize: '20px'
                    }}
                  >
                    <option value="">Sélectionnez votre niveau</option>
                    <option value="aucune">Aucune expérience (formation incluse)</option>
                    <option value="moins-1an">Moins d'1 an</option>
                    <option value="1-3ans">1 à 3 ans</option>
                    <option value="plus-3ans">Plus de 3 ans</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: '#FFFFFF'
                  }}>
                    Disponibilité pour démarrer
                  </label>
                  <select
                    value={formData.disponibilite}
                    onChange={(e) => updateFormData('disponibilite', e.target.value)}
                    style={{
                      ...styles.input,
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                      backgroundSize: '20px'
                    }}
                  >
                    <option value="">Quand pouvez-vous commencer ?</option>
                    <option value="immediat">Immédiatement ⚡</option>
                    <option value="2semaines">Dans 2 semaines</option>
                    <option value="1mois">Dans 1 mois</option>
                    <option value="plus-1mois">Plus d'1 mois</option>
                  </select>
                </div>

                {/* CV Upload Section */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: '#FFFFFF'
                  }}>
                    Votre CV
                  </label>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '12px' }}>
                    PDF, DOC ou DOCX • Maximum 5MB • Optionnel mais recommandé
                  </div>
                  
                  {!formData.cv ? (
                    <div
                      style={styles.uploadZone}
                      onClick={() => fileInputRef.current?.click()}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <div style={styles.uploadIcon}>📄</div>
                      <div style={{ marginBottom: '8px' }}>
                        <span style={{ 
                          fontWeight: '600', 
                          color: dragActive ? '#FFD700' : '#FFFFFF',
                          fontSize: '16px'
                        }}>
                          {dragActive ? 'Déposez votre CV ici' : 'Cliquez ou glissez votre CV'}
                        </span>
                      </div>
                      <div style={{ 
                        fontSize: '14px', 
                        color: '#9CA3AF'
                      }}>
                        Formats acceptés: PDF, DOC, DOCX
                      </div>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileInputChange}
                        style={{ display: 'none' }}
                      />
                    </div>
                  ) : (
                    <div style={styles.filePreview}>
                      <div style={styles.fileIcon}>
                        {formData.cv.type === 'application/pdf' ? '📄' : '📝'}
                      </div>
                      <div style={styles.fileInfo}>
                        <div style={styles.fileName}>{formData.cv.name}</div>
                        <div style={styles.fileSize}>{formatFileSize(formData.cv.size)}</div>
                      </div>
                      <button
                        onClick={removeFile}
                        style={styles.removeButton}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(239, 68, 68, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  marginTop: 'auto'
                }}>
                  <button
                    onClick={prevFormStep}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      color: '#FFFFFF',
                      padding: '16px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      border: '2px solid rgba(255,255,255,0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = '#FFFFFF';
                      e.target.style.background = 'rgba(255,255,255,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                      e.target.style.background = 'transparent';
                    }}
                  >
                    ← Retour
                  </button>
                  <button
                    onClick={nextFormStep}
                    style={{
                      flex: 2,
                      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                      color: '#1C1C1C',
                      padding: '16px',
                      borderRadius: '12px',
                      fontWeight: '700',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 6px 20px rgba(255,215,0,0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 24px rgba(255,215,0,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 6px 20px rgba(255,215,0,0.3)';
                    }}
                  >
                    Continuer → Étape 3/3
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Motivation */}
            {formStep === 2 && (
              <div style={{
                opacity: 1,
                transform: 'translateX(0)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <h3 style={{ 
                  fontWeight: '700', 
                  textAlign: 'center', 
                  marginBottom: '32px',
                  fontSize: '20px',
                  background: 'linear-gradient(135deg, #FFFFFF, #FFD700)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Dernière étape !
                </h3>
                
                <div style={{ marginBottom: '32px', flex: 1 }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: '#FFFFFF'
                  }}>
                    Pourquoi Lisbonne vous intéresse-t-elle ?
                  </label>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '8px' }}>
                    Partagez votre motivation en quelques lignes (optionnel)
                  </div>
                  <textarea
                    value={formData.motivation}
                    onChange={(e) => updateFormData('motivation', e.target.value)}
                    rows="5"
                    style={{
                      ...styles.input,
                      minHeight: '120px',
                      resize: 'none',
                      fontFamily: 'inherit'
                    }}
                    placeholder="Ex: Je souhaite découvrir une nouvelle culture tout en développant mes compétences professionnelles..."
                  />
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: '12px'
                }}>
                  <button
                    onClick={prevFormStep}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      color: '#FFFFFF',
                      padding: '16px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      border: '2px solid rgba(255,255,255,0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = '#FFFFFF';
                      e.target.style.background = 'rgba(255,255,255,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                      e.target.style.background = 'transparent';
                    }}
                  >
                    ← Retour
                  </button>
                  <button
                    onClick={handleFormSubmit}
                    style={{
                      flex: 2,
                      background: 'linear-gradient(135deg, #10B981, #059669)',
                      color: '#FFFFFF',
                      padding: '16px',
                      borderRadius: '12px',
                      fontWeight: '700',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 6px 20px rgba(16, 185, 129, 0.3)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px) scale(1.02)';
                      e.target.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.3)';
                    }}
                  >
                    🚀 Envoyer ma candidature
                  </button>
                </div>
              </div>
            )}
          </div>

          <div style={{ 
            textAlign: 'center', 
            fontSize: '12px', 
            color: '#6B7280', 
            marginTop: '20px',
            padding: '16px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            🔒 Réponse sous 48h • Données sécurisées • Processus 100% gratuit
          </div>
        </div>
      </section>
    </div>
  );
};

export default LisbonJobOpportunityLanding;