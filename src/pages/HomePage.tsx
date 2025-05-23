import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Mission from '../components/Mission';
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
      
      {/* Interactive Map Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Defense Innovation Network</h2>
            <p className="mt-4 text-xl text-gray-600">
              Explore our nationwide network of defense advisors, companies, and innovation centers
            </p>
          </div>
          <div className="h-[600px] rounded-lg overflow-hidden shadow-xl">
            <MapExplorer />
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