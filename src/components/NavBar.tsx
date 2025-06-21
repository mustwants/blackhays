import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, PlusCircle, Calendar, Users, Building, Rocket, Brain, Lock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleNavClick = (id: string) => {
    setIsOpen(false);
    setActiveDropdown(null);
    
    // Handle navigation to routes
    if (id === 'news') {
      navigate('/news');
      return;
    }
    if (id === 'events') {
      navigate('/events');
      return;
    }
    if (id === 'innovation') {
      navigate('/innovation');
      return;
    }
    if (id === 'dod-business') {
      navigate('/dod-business');
      return;
    }
    if (id === 'consortiums') {
      navigate('/consortiums');
      return;
    }
    if (id === 'home') {
      navigate('/');
      return;
    }
    if (id === 'apply') {
      navigate('/apply');
      return;
    }
    if (id === 'submit-event') {
      navigate('/submit-event');
      return;
    }
    if (id === 'add-company') {
      navigate('/add-company');
      return;
    }
    if (id === 'add-consortium') {
      navigate('/add-consortium');
      return;
    }
    if (id === 'add-innovation') {
      navigate('/add-innovation');
      return;
    }
    if (id === 'admin') {
      navigate('/admin');
      return;
    }
    if (id === 'map') {
      navigate('/map');
      return;
    }
    if (id === 'about') {
      navigate('/about');
      return;
    }
    
    // For in-page navigation
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mainMenuItems = [
    { label: 'Home', id: 'home' },
    {
      label: 'Resources', 
      id: 'resources', 
      submenu: [
        { label: 'News', id: 'news' },
        { label: 'Events', id: 'events' },
        { label: 'Interactive Map', id: 'map', icon: MapPin }
      ]
    },
    {
      label: 'Government',
      id: 'government',
      submenu: [
        { label: 'Innovation & Advisory', id: 'innovation' },
        { label: 'DoD Small Business', id: 'dod-business' },
        { label: 'Consortiums', id: 'consortiums' }
      ]
    },
    { label: 'About', id: 'about' },
    {
      label: 'Engage', 
      id: 'engage',
      submenu: [
        { label: 'Apply as Advisor', id: 'apply', icon: Users },
        { label: 'Submit an Event', id: 'submit-event', icon: Calendar },
        { label: 'Add a Company', id: 'add-company', icon: Building },
        { label: 'Add a Consortium', id: 'add-consortium', icon: Rocket },
        { label: 'Add an Innovation Org/Lab', id: 'add-innovation', icon: Brain },
        { label: 'Admin Panel', id: 'admin', icon: Lock }
      ]
    }
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black shadow-lg' : 'bg-black/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer">
            <img 
  src="https://zwjhmkfgtvmzkisqrfwm.supabase.co/storage/v1/object/public/images/BHfullwhite.png"
  alt="BlackHays Group"
  className="h-10 w-auto"
/>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            {mainMenuItems.map((item) => (
              <div key={item.id} className="relative group">
                {item.submenu ? (
                  <>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                      className="flex items-center px-3 py-2 text-sm font-medium text-white hover:text-bhred transition-colors"
                    >
                      {item.label}
                      <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${
                        activeDropdown === item.id ? 'rotate-180' : ''
                      }`} />
                    </button>
                    <div className={`absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${
                      activeDropdown === item.id ? 'block' : 'hidden'
                    }`}>
                      <div className="py-1">
                        {item.submenu.map((subItem) => (
                          <button
                            key={subItem.id}
                            onClick={() => handleNavClick(subItem.id)}
                            className="block w-full text-left px-4 py-2 text-sm text-bhgray-700 hover:bg-bhgray-100"
                          >
                            <div className="flex items-center">
                              {subItem.icon && React.createElement(subItem.icon, { className: "w-4 h-4 mr-2" })}
                              {subItem.label}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className="px-3 py-2 text-sm font-medium text-white hover:text-bhred transition-colors"
                  >
                    {item.label}
                  </button>
                )}
              </div>
            ))}
            <a
              href="https://calendly.com/blackhaysgroup"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium text-white bg-bhred rounded-md hover:bg-red-700 transition-colors"
            >
              Contact Us
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-bhred transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-black/95 backdrop-blur-sm shadow-lg">
          {mainMenuItems.map((item) => (
            <div key={item.id}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-white hover:bg-bhred transition-colors"
                  >
                    {item.label}
                    <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${
                      activeDropdown === item.id ? 'rotate-180' : ''
                    }`} />
                  </button>
                  <div className={`pl-4 space-y-1 ${activeDropdown === item.id ? 'block' : 'hidden'}`}>
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => handleNavClick(subItem.id)}
                        className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-bhred hover:text-white transition-colors"
                      >
                        {subItem.icon && React.createElement(subItem.icon, { className: "w-4 h-4 mr-2" })}
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <button
                  onClick={() => handleNavClick(item.id)}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-bhred transition-colors"
                >
                  {item.label}
                </button>
              )}
            </div>
          ))}
          <a
            href="https://calendly.com/blackhaysgroup"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-bhred transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
