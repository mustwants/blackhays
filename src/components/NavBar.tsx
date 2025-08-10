import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, PlusCircle, Calendar, Users, Building, Rocket, Brain, Lock, MapPin } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

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
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/');
      }
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-200/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => handleNavClick('home')}>
            <img 
              src={scrolled 
                ? "https://zwjhmkfgtvmzkisqrfwm.supabase.co/storage/v1/object/public/images/BHfullblack.png"
                : "https://zwjhmkfgtvmzkisqrfwm.supabase.co/storage/v1/object/public/images/BHfullwhite.png"
              }
              alt="BlackHays Group"
              className="h-10 w-auto transition-all duration-300"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {mainMenuItems.map((item) => (
              <div key={item.id} className="relative group">
                {item.submenu ? (
                  <>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                      className={`flex items-center px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg ${
                        scrolled 
                          ? 'text-gray-900 hover:text-bhred hover:bg-bhred/5' 
                          : 'text-white hover:text-bhred hover:bg-white/10'
                      }`}
                    >
                      {item.label}
                      <ChevronDown className={`ml-2 w-4 h-4 transition-transform duration-300 ${
                        activeDropdown === item.id ? 'rotate-180' : ''
                      }`} />
                    </button>
                    <div className={`absolute left-0 mt-2 w-64 rounded-2xl shadow-2xl bg-white border border-gray-100 overflow-hidden transition-all duration-300 ${
                      activeDropdown === item.id ? 'opacity-100 visible transform translate-y-0' : 'opacity-0 invisible transform translate-y-2'
                    }`}>
                      <div className="py-2">
                        {item.submenu.map((subItem) => (
                          <button
                            key={subItem.id}
                            onClick={() => handleNavClick(subItem.id)}
                            className="block w-full text-left px-6 py-3 text-sm font-medium text-gray-700 hover:bg-bhred/5 hover:text-bhred transition-colors"
                          >
                            <div className="flex items-center">
                              {subItem.icon && React.createElement(subItem.icon, { className: "w-4 h-4 mr-3 text-bhred" })}
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
                    className={`px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg ${
                      scrolled 
                        ? 'text-gray-900 hover:text-bhred hover:bg-bhred/5' 
                        : 'text-white hover:text-bhred hover:bg-white/10'
                    }`}
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
              className="group px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-bhred to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Contact Us
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-3 rounded-xl transition-all duration-300 ${
                scrolled 
                  ? 'text-gray-900 hover:bg-bhred/10' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-500 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-2xl border-b border-gray-200">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {mainMenuItems.map((item) => (
              <div key={item.id}>
                {item.submenu ? (
                  <>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold text-gray-900 hover:bg-bhred/5 hover:text-bhred transition-all duration-300"
                    >
                      {item.label}
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${
                        activeDropdown === item.id ? 'rotate-180' : ''
                      }`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${
                      activeDropdown === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="pl-4 space-y-1 py-2">
                        {item.submenu.map((subItem) => (
                          <button
                            key={subItem.id}
                            onClick={() => handleNavClick(subItem.id)}
                            className="flex items-center w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-bhred/5 hover:text-bhred transition-all duration-300"
                          >
                            {subItem.icon && React.createElement(subItem.icon, { className: "w-5 h-5 mr-3 text-bhred" })}
                            {subItem.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className="block w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-gray-900 hover:bg-bhred/5 hover:text-bhred transition-all duration-300"
                  >
                    {item.label}
                  </button>
                )}
              </div>
            ))}
            
            <div className="pt-4 border-t border-gray-200 mt-6">
              <a
                href="https://calendly.com/blackhaysgroup"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-4 py-4 bg-gradient-to-r from-bhred to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold text-lg shadow-lg"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;