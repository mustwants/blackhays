import React, { useState } from 'react';
import ConsultantApplicationForm from '../components/ConsultantApplication';
import Footer from '../components/Footer';
import AdminPanel from '../components/AdminPanel';

const ConsultantApplication = () => {
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const handleAdminClick = () => {
    setShowAdminPanel(true);
  };

  const handleCloseAdminPanel = () => {
    setShowAdminPanel(false);
  };

  return (
    <>
      <ConsultantApplicationForm />
      <Footer onAdminClick={handleAdminClick} />
      {showAdminPanel && <AdminPanel onClose={handleCloseAdminPanel} />}
    </>
  );
};

export default ConsultantApplication;