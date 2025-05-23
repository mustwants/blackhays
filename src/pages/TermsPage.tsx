import React, { useState } from 'react';
import Footer from '../components/Footer';
import AdminPanel from '../components/AdminPanel';

const TermsPage = () => {
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const handleAdminClick = () => {
    setShowAdminPanel(true);
  };

  const handleCloseAdminPanel = () => {
    setShowAdminPanel(false);
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">1. Introduction</h2>
            <p className="text-bhgray-600">
              Welcome to BlackHays Group LLC ("Company", "we", "our", "us"). These Terms and Conditions 
              ("Terms", "Terms and Conditions") govern your use of our website located at 
              blackhaysgroup.com (the "Service") and constitute a binding legal agreement between 
              you and BlackHays Group LLC.
            </p>
            <p className="text-bhgray-600 mt-2">
              By accessing or using the Service, you agree to be bound by these Terms. If you disagree 
              with any part of the terms, then you may not access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">2. Communications</h2>
            <p className="text-bhgray-600">
              By using our Service, you agree to subscribe to newsletters, marketing or promotional 
              materials and other information we may send. However, you may opt-out of receiving any, 
              or all, of these communications from us by following the unsubscribe link or instructions 
              provided in any email we send.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">3. Services</h2>
            <p className="text-bhgray-600">
              BlackHays Group provides defense consulting services, including but not limited to 
              advisory services, consulting, and fractional expert support. The specific services 
              provided are outlined on our website and in any agreements entered into between 
              BlackHays Group and clients.
            </p>
            <p className="text-bhgray-600 mt-2">
              While we strive to provide accurate and up-to-date information, we make no 
              representations or warranties of any kind, express or implied, about the completeness, 
              accuracy, reliability, suitability, or availability of the information, products, services, 
              or related graphics contained on the website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">4. Content</h2>
            <p className="text-bhgray-600">
              Our Service allows you to view content provided by BlackHays Group. This content is not 
              downloadable unless explicitly stated, and remains the property of BlackHays Group LLC or 
              its licensors.
            </p>
            <p className="text-bhgray-600 mt-2">
              The content provided on our website is for general information purposes only. It is subject 
              to change without notice and should not be relied upon as the sole basis for making decisions 
              without consulting primary, more accurate, more complete, or more timely sources of information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">5. Prohibited Uses</h2>
            <p className="text-bhgray-600">
              You may only use the Service for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul className="list-disc pl-6 text-bhgray-600 space-y-1 mt-2">
              <li>Use the Service in any way that violates any applicable national or international law or regulation</li>
              <li>Use the Service for the purpose of exploiting, harming, or attempting to exploit or harm minors</li>
              <li>Impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person</li>
              <li>Engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
              <li>Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">6. Export Control and Compliance</h2>
            <p className="text-bhgray-600">
              Due to the nature of our services in the defense sector, users acknowledge that information 
              provided may be subject to U.S. export control regulations, including the International Traffic 
              in Arms Regulations (ITAR) and Export Administration Regulations (EAR).
            </p>
            <p className="text-bhgray-600 mt-2">
              Users agree to comply with all applicable export control laws and regulations, and not to 
              export, re-export, or transfer any information, software, or technology obtained through 
              our services in violation of such laws or regulations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">7. Limitation of Liability</h2>
            <p className="text-bhgray-600">
              In no event shall BlackHays Group LLC, nor its directors, employees, partners, agents, 
              suppliers, or affiliates, be liable for any indirect, incidental, special, consequential 
              or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
              or other intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-6 text-bhgray-600 space-y-1 mt-2">
              <li>Your access to or use of or inability to access or use the Service</li>
              <li>Any conduct or content of any third party on the Service</li>
              <li>Any content obtained from the Service</li>
              <li>Unauthorized access, use or alteration of your transmissions or content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">8. Governing Law</h2>
            <p className="text-bhgray-600">
              These Terms shall be governed and construed in accordance with the laws of the United States, 
              without regard to its conflict of law provisions.
            </p>
            <p className="text-bhgray-600 mt-2">
              Our failure to enforce any right or provision of these Terms will not be considered a waiver 
              of those rights. If any provision of these Terms is held to be invalid or unenforceable by a 
              court, the remaining provisions of these Terms will remain in effect.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">9. Changes to Terms</h2>
            <p className="text-bhgray-600">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              If a revision is material, we will try to provide at least 30 days' notice prior to any new 
              terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            <p className="text-bhgray-600 mt-2">
              By continuing to access or use our Service after those revisions become effective, you agree 
              to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">10. Contact Us</h2>
            <p className="text-bhgray-600">
              If you have any questions about these Terms, please contact us at legal@blackhaysgroup.com.
            </p>
            <p className="text-bhgray-600 mt-2">
              Last updated: June 1, 2025
            </p>
          </section>
        </div>
      </div>
      
      <Footer onAdminClick={handleAdminClick} />
      {showAdminPanel && <AdminPanel onClose={handleCloseAdminPanel} />}
    </div>
  );
};

export default TermsPage;