import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Mission from '../components/Mission';
import Services from '../components/Services';
import Conferences from '../components/Conferences';
import Team from '../components/Team';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';
import AdminPanel from '../components/AdminPanel';
import NewsletterSignup from '../components/NewsletterSignup';
import MapExplorer from '../components/MapExplorer';

const HomePage = () => {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);

  useEffect(() => {
    // Check if the newsletter modal should be opened (set by FloatingActionMenu)
    const shouldOpenNewsletter = sessionStorage.getItem('openNewsletterModal');
    if (shouldOpenNewsletter === 'true') {
      setShowNewsletterModal(true);
      sessionStorage.removeItem('openNewsletterModal');
    }
  }, []);

  const handleAdminClick = () => {
    setShowAdminPanel(true);
  };

  const handleCloseAdminPanel = () => {
    setShowAdminPanel(false);
  };

  return (
    <>
      <Hero />
      <Mission />
      <Services />
      
      {/* Interactive Map Section */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-bhred/10 border border-bhred/20 rounded-full text-bhred text-sm font-semibold mb-6">
              <MapExplorer className="w-4 h-4 mr-2" />
              Interactive Experience
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Defense Innovation 
              <span className="block bg-gradient-to-r from-bhred to-red-600 bg-clip-text text-transparent">
                Network Explorer
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our nationwide network of defense advisors, companies, and innovation centers. 
              Discover connections and opportunities in your area.
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-bhred/10 via-transparent to-bhred/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="h-[700px]">
                <MapExplorer />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Conferences />
      <Team />
      <CallToAction />
      <Footer onAdminClick={handleAdminClick} />
      {showAdminPanel && <AdminPanel onClose={handleCloseAdminPanel} />}
      {showNewsletterModal && <NewsletterSignup onClose={() => setShowNewsletterModal(false)} />}
    </>
  );
};

export default HomePage;