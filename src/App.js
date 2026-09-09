import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [language, setLanguage] = useState('en');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: ''
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update document title and meta tags based on language
  useEffect(() => {
    if (language === 'en') {
      document.title = "Riviera Maya Travel Assistant | Your Journey, Our Expertise";
      document.querySelector('meta[name="description"]')?.setAttribute('content', 
        "Reliable, clean, and stress-free transportation from Cancun airport to your resort, hotel, Airbnb, ferry, and anywhere you need to go."
      );
    } else {
      document.title = "Assistant de Voyage Riviera Maya | Votre Voyage, Notre Expertise";
      document.querySelector('meta[name="description"]')?.setAttribute('content',
        "Transport fiable, propre et sans stress de l'aéroport de Cancun à votre resort, hôtel, Airbnb, ferry et partout où vous devez aller."
      );
    }
    document.documentElement.lang = language === 'en' ? 'en' : 'fr';
  }, [language]);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on window resize (if desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.service-card, .feature-item, .contact-method');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Toggle language function
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en');
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when clicking a link
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission with Formspree
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send data to Formspree
      const response = await fetch('https://formspree.io/f/mdayrrqk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          service: formData.service,
          message: formData.message
        })
      });
      
      if (response.ok) {
        // Success message
        const successMessage = language === 'en' 
          ? '✓ Thank you! We will get back to you soon.' 
          : '✓ Merci ! Nous vous répondrons bientôt.';
        
        setToastMessage(successMessage);
        setShowToast(true);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          service: '',
          message: ''
        });
        
        // Hide toast after 4 seconds
        setTimeout(() => setShowToast(false), 4000);
      } else {
        // Error message
        const errorData = await response.json();
        console.error('Formspree error:', errorData);
        
        const errorMessage = language === 'en'
          ? '❌ Something went wrong. Please try again or email us directly.'
          : '❌ Une erreur s\'est produite. Veuillez réessayer ou nous envoyer un email directement.';
        
        setToastMessage(errorMessage);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      const errorMessage = language === 'en'
        ? '❌ Network error. Please check your connection and try again.'
        : '❌ Erreur réseau. Veuillez vérifier votre connexion et réessayer.';
      
      setToastMessage(errorMessage);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
    closeMobileMenu();
  };

  // Structured data for SEO
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Riviera Maya Travel Assistant",
      "description": language === 'en' 
        ? "Reliable transportation and travel services in Riviera Maya and Cozumel"
        : "Services de transport et de voyage fiables à Riviera Maya et Cozumel",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Riviera Maya",
        "addressRegion": "Quintana Roo",
        "addressCountry": "MX"
      },
      "url": "https://www.rivieramayatravel.com",
      "telephone": "+17056767704",
      "email": "ourlittlelife28@gmail.com",
      "priceRange": "$$"
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [language]);

  return (
    <div className={`app ${language === 'fr' ? 'lang-fr' : ''}`}>
      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification" role="alert">
          {toastMessage}
        </div>
      )}

      {/* Mobile Menu Button */}
      <button 
        className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`} 
        onClick={toggleMobileMenu}
        aria-label="Menu"
        aria-expanded={mobileMenuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Navigation with toggle inside navbar */}
      <nav className={`${scrolled ? 'scrolled' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <a href="#hero" className="logo" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>
          <span className="logo-icon" aria-hidden="true">🌴</span>
          <span>Riviera Maya Travel</span>
        </a>
        
        {/* Language Toggle - Inside navbar */}
        <div className="lang-toggle-nav" aria-label="Language selector">
          <span className={language === 'en' ? 'active' : ''} aria-label="English">EN</span>
          <div 
            className={`toggle-switch ${language === 'fr' ? 'fr' : ''}`} 
            onClick={toggleLanguage}
            role="button"
            aria-label="Toggle language"
            tabIndex="0"
            onKeyPress={(e) => e.key === 'Enter' && toggleLanguage()}
          />
          <span className={language === 'fr' ? 'active' : ''} aria-label="Français">FR</span>
        </div>
        
        <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>
            {language === 'en' ? 'Services' : 'Services'}
          </a></li>
          <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>
            {language === 'en' ? 'About' : 'À Propos'}
          </a></li>
          <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>
            {language === 'en' ? 'Contact' : 'Contact'}
          </a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-background"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <span aria-hidden="true">🌴</span>
            <span>Cozumel & Riviera Maya</span>
          </div>
          <h1>
            {language === 'en' ? (
              <>Your Journey,<br /><span className="accent">Our Expertise</span></>
            ) : (
              <>Votre Voyage,<br /><span className="accent">Notre Expertise</span></>
            )}
          </h1>
          <div className="hero-slogan">
            {language === 'en' 
              ? 'Your Ride. Your Time. Your Peace of Mind.' 
              : 'Votre Trajet. Votre Temps. Votre Tranquillité.'}
          </div>
          <p>
            {language === 'en' 
              ? 'Reliable, clean, and stress-free transportation from the airport to your resort, hotel, Airbnb, ferry, and anywhere you need to go. Let us handle the logistics so you can enjoy your trip.'
              : 'Transport fiable, propre et sans stress depuis l\'aéroport international de Cancun jusqu\'à votre resort, hôtel, Airbnb, ferry et partout où vous devez aller. Laissez-nous gérer la logistique pour que vous puissiez profiter de votre voyage.'}
          </p>
          <div className="hero-buttons">
            <a href="#contact" className="btn btn-primary" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>
              <span aria-hidden="true">📩</span> {language === 'en' ? 'Send a Message' : 'Envoyer un Message'}
            </a>
            <a href="#services" className="btn btn-secondary" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>
              {language === 'en' ? 'Explore Services' : 'Découvrir les Services'}
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services" id="services">
        <div className="container">
          <div className="section-header">
            <h2>{language === 'en' ? 'What We Offer' : 'Ce Que Nous Offrons'}</h2>
            <p>{language === 'en' ? 'Complete travel assistance tailored to your needs' : 'Assistance voyage complète adaptée à vos besoins'}</p>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <span className="service-icon" aria-hidden="true">🚐</span>
              <h3>{language === 'en' ? 'Airport Transfers' : 'Transferts Aéroport'}</h3>
              <p>{language === 'en' 
                ? 'Transportation to and from Cancun and Tulum airports. We accommodate everything from small groups to large groups for wedding parties and special events.'
                : 'Transport vers et depuis les aéroports de Cancun et Tulum. Nous accueillons tout, des petits groupes aux grands groupes pour les mariages et événements spéciaux.'}</p>
            </div>
            <div className="service-card">
              <span className="service-icon" aria-hidden="true">⛴️</span>
              <h3>{language === 'en' ? 'Ferry Transfers' : 'Transferts par Ferry'}</h3>
              <p>{language === 'en'
                ? 'Door-to-door transport to and from the ferry terminal. We do not provide ferry tickets — only seamless land transfers for departures and arrivals.'
                : 'Transport porte-à-porte vers et depuis le terminal de ferry. Nous ne fournissons pas les billets de ferry — uniquement des transferts terrestres sans rupture pour départs et arrivées.'}</p>
            </div>
            <div className="service-card">
              <span className="service-icon" aria-hidden="true">🤿</span>
              <h3>{language === 'en' ? 'Diving Tours' : 'Tours de Plongée'}</h3>
              <p>{language === 'en'
                ? 'Explore the world-famous coral reefs of Cozumel with our curated diving experiences for all skill levels.'
                : 'Explorez les récifs coralliens mondialement célèbres de Cozumel avec nos expériences de plongée pour tous les niveaux.'}</p>
            </div>
            <div className="service-card">
              <span className="service-icon" aria-hidden="true">🗺️</span>
              <h3>{language === 'en' ? 'Custom Tours' : 'Tours Personnalisés'}</h3>
              <p>{language === 'en'
                ? 'Discover the beauty of Cozumel island with personalized tours. From hidden beaches to local culture and breathtaking views — designed just for you.'
                : 'Découvrez la beauté de l\'île de Cozumel avec des visites personnalisées. Des plages cachées à la culture locale et des vues à couper le souffle — conçues spécialement pour vous.'}</p>
            </div>
            <div className="service-card">
              <span className="service-icon" aria-hidden="true">🧳</span>
              <h3>{language === 'en' ? 'Travel Help' : 'Aide Voyage'}</h3>
              <p>{language === 'en'
                ? 'Local expertise and recommendations to make your trip unforgettable. Restaurants, activities, and insider tips.'
                : 'Expertise locale et recommandations pour rendre votre voyage inoubliable. Restaurants, activités et conseils d\'initiés.'}</p>
            </div>
            <div className="service-card">
              <span className="service-icon" aria-hidden="true">🚙</span>
              <h3>{language === 'en' ? 'Private Transport' : 'Transport Privé'}</h3>
              <p>{language === 'en'
                ? 'Clean, comfortable vehicles with professional drivers available throughout Riviera Maya.'
                : 'Véhicules propres et confortables avec chauffeurs professionnels disponibles dans toute la Riviera Maya.'}</p>
            </div>
            <div className="service-card">
              <span className="service-icon" aria-hidden="true">💒</span>
              <h3>{language === 'en' ? 'Events & Group Transport' : 'Événements & Transport de Groupe'}</h3>
              <p>{language === 'en'
                ? 'Specializing in large group accommodations for weddings and other group events. Reliable, coordinated transportation to ensure your special day runs smoothly.'
                : 'Spécialisé dans l\'accueil de grands groupes pour les mariages et autres événements de groupe. Transport fiable et coordonné pour que votre journée spéciale se déroule sans problème.'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="about-grid">
          <div className="about-image">
            <div className="img-main" aria-hidden="true">
              <img src="/about-us.jpg" alt="Derek and Suann" />
            </div>
          </div>
          <div className="about-content">
            <h2>{language === 'en' ? 'Meet Derek & Suann' : 'Rencontrez Derek & Suann'}</h2>
            <p>
              {language === 'en'
                ? 'We\'re your dedicated travel assistants for the Riviera Maya and Cozumel. With years of local experience, we provide reliable, clean, and stress-free transportation and tour services so you can focus on enjoying every moment of your vacation.'
                : 'Nous sommes vos assistants voyage dédiés pour la Riviera Maya et Cozumel. Avec des années d\'expérience locale, nous fournissons des services de transport et de tour fiables, propres et sans stress pour que vous puissiez profiter de chaque instant de vos vacances.'}
            </p>
            <p>
              {language === 'en'
                ? 'From the moment you land at Cancun International Airport to your final departure, we\'ve got your transportation covered — to resorts, hotels, Airbnbs, ferries, and anywhere else your adventure takes you.'
                : 'Dès votre arrivée à l\'aéroport international de Cancun jusqu\'à votre départ final, nous gérons votre transport — vers les resorts, hôtels, Airbnbs, ferries et partout où votre aventure vous mène.'}
            </p>
            <div className="about-features">
              <div className="feature-item">
                <span className="icon" aria-hidden="true">✅</span>
                <span>{language === 'en' ? 'Reliable & Punctual Service' : 'Service Fiable & Ponctuel'}</span>
              </div>
              <div className="feature-item">
                <span className="icon" aria-hidden="true">✅</span>
                <span>{language === 'en' ? 'Clean, Comfortable Vehicles' : 'Véhicules Propres & Confortables'}</span>
              </div>
              <div className="feature-item">
                <span className="icon" aria-hidden="true">✅</span>
                <span>{language === 'en' ? 'Local Expertise & Insider Tips' : 'Expertise Locale & Conseils d\'Initiés'}</span>
              </div>
              <div className="feature-item">
                <span className="icon" aria-hidden="true">✅</span>
                <span>{language === 'en' ? 'Personalized Travel Assistance' : 'Assistance Voyage Personnalisée'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact" id="contact">
        <div className="contact-grid">
          <div className="contact-info">
            <h2>{language === 'en' ? 'Let\'s Plan Your Trip' : 'Planifions Votre Voyage'}</h2>
            <p>
              {language === 'en'
                ? 'Ready to experience the Riviera Maya without the stress? Send us a message and we\'ll take care of the rest. Whether you need airport pickup, a custom tour, or diving arrangements — we\'re here to help.'
                : 'Prêt à découvrir la Riviera Maya sans stress ? Envoyez-nous un message et nous nous occupons du reste. Que vous ayez besoin d\'un transfert aéroport, d\'un tour personnalisé ou d\'arrangements de plongée — nous sommes là pour vous aider.'}
            </p>
            <div className="contact-methods">
              <a href="tel:+17056767704" className="contact-method" aria-label="Call us">
                <div className="icon-box" aria-hidden="true">📞</div>
                <div className="details">
                  <h4>{language === 'en' ? 'Call Us' : 'Appelez-Nous'}</h4>
                  <p>+1 705 676 7704</p>
                </div>
              </a>
              <a href="mailto:ourlittlelife28@gmail.com" className="contact-method" aria-label="Email us">
                <div className="icon-box" aria-hidden="true">✉️</div>
                <div className="details">
                  <h4>{language === 'en' ? 'Email Us' : 'Écrivez-Nous'}</h4>
                  <p>ourlittlelife28@gmail.com</p>
                </div>
              </a>
              <div className="contact-method">
                <div className="icon-box" aria-hidden="true">🌐</div>
                <div className="details">
                  <h4>{language === 'en' ? 'Location' : 'Emplacement'}</h4>
                  <p>{language === 'en' ? 'Riviera Maya & Cozumel, Mexico' : 'Riviera Maya & Cozumel, Mexique'}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="contact-form">
            <h3>{language === 'en' ? 'Send a Message' : 'Envoyer un Message'}</h3>
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="name">{language === 'en' ? 'Your Name' : 'Votre Nom'}</label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={language === 'en' ? 'John Doe' : 'Jean Dupont'} 
                  required 
                  aria-required="true"
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">{language === 'en' ? 'Email Address' : 'Adresse Email'}</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com" 
                  required 
                  aria-required="true"
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="service">{language === 'en' ? 'Service Needed' : 'Service Souhaité'}</label>
                <select id="service" name="service" value={formData.service} onChange={handleInputChange} required aria-required="true" disabled={isSubmitting}>
                  <option value="">{language === 'en' ? 'Select a service...' : 'Sélectionnez un service...'}</option>
                  <option value="airport">{language === 'en' ? 'Airport Transfer' : 'Transfert Aéroport'}</option>
                  <option value="tour">{language === 'en' ? 'Custom Tour' : 'Tour Personnalisé'}</option>
                  <option value="diving">{language === 'en' ? 'Diving Experience' : 'Expérience de Plongée'}</option>
                  <option value="ferry">{language === 'en' ? 'Ferry Transport' : 'Transport Ferry'}</option>
                  <option value="other">{language === 'en' ? 'Other / General Inquiry' : 'Autre / Demande Générale'}</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="message">{language === 'en' ? 'Your Message' : 'Votre Message'}</label>
                <textarea 
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={language === 'en' ? 'Tell us about your trip plans...' : 'Parlez-nous de vos projets de voyage...'} 
                  required
                  aria-required="true"
                  disabled={isSubmitting}
                />
              </div>
              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting 
                  ? (language === 'en' ? 'Sending...' : 'Envoi en cours...') 
                  : (language === 'en' ? 'Send Message 👍' : 'Envoyer le Message 👍')}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2026 Riviera Maya Travel Assistant — Derek & Suann. {language === 'en' ? 'All rights reserved.' : 'Tous droits réservés.'}</p>
        <div className="footer-powered">
          <span className="bolt" aria-hidden="true">⚡</span>
          <span>{language === 'en' ? 'Powered by ' : 'Propulsé par '}</span>
          <a href="https://www.ultimateapps.ca" target="_blank" rel="noopener noreferrer">UltimateAppsCA</a>
          <span className="bolt" aria-hidden="true">⚡</span>
        </div>
      </footer>
    </div>
  );
};

export default App;