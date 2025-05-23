import React, { useState, useEffect } from 'react';
import { Plus, X, UserPlus, Calendar, Phone, Mail, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FloatingActionMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  // Hide the floating menu when scrolling down, show when scrolling up
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY;
      
      // Only hide when scrolling down and past a certain point (100px)
      if (isScrollingDown && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleCalendlyClick = () => {
    window.open('https://calendly.com/blackhaysgroup', '_blank', 'noopener,noreferrer');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleNewsletterClick = () => {
    // Set state in HomePage to open newsletter modal
    navigate('/');
    // Using sessionStorage to communicate with HomePage
    sessionStorage.setItem('openNewsletterModal', 'true');
    setIsOpen(false);
  };

  return (
    <div className={`fixed top-1/2 right-6 transform -translate-y-1/2 z-50 transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
    }`}>
      <div className={`flex flex-col items-end space-y-4 mb-4 transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}>
        <button
          onClick={() => handleNavigation('/apply')}
          className="flex items-center bg-black text-white px-4 py-2 rounded-lg shadow-lg hover:bg-bhgray-800 transition-colors"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Apply as Advisor
        </button>
        <button
          onClick={handleNewsletterClick}
          className="flex items-center bg-bhgray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-bhgray-700 transition-colors"
        >
          <Mail className="w-5 h-5 mr-2" />
          Newsletter
        </button>
        <button
          onClick={() => handleNavigation('/news')}
          className="flex items-center bg-bhgray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-bhgray-700 transition-colors"
        >
          <Info className="w-5 h-5 mr-2" />
          Latest News
        </button>
        <button
          onClick={handleCalendlyClick}
          className="flex items-center bg-bhred text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors"
        >
          <Phone className="w-5 h-5 mr-2" />
          Schedule Call
        </button>
        <button
          onClick={() => handleNavigation('/submit-event')}
          className="flex items-center bg-bhgray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-bhgray-700 transition-colors"
        >
          <Calendar className="w-5 h-5 mr-2" />
          Submit Event
        </button>
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-bhred text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-colors transform ${
          isOpen ? 'rotate-45' : ''
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default FloatingActionMenu;