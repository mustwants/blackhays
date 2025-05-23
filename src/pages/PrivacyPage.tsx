import React, { useState } from 'react';
import Footer from '../components/Footer';
import AdminPanel from '../components/AdminPanel';

const PrivacyPage = () => {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">1. Introduction</h2>
            <p className="text-bhgray-600">
              BlackHays Group LLC ("we", "our", or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you visit our website blackhaysgroup.com (the "Website") or use our services.
            </p>
            <p className="text-bhgray-600 mt-2">
              Please read this Privacy Policy carefully. If you do not agree with the terms of this 
              Privacy Policy, please do not access the Website or use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">2. Information We Collect</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-bhgray-800">Personal Information</h3>
                <p className="text-bhgray-600">
                  We may collect personally identifiable information, such as your name, email address, 
                  telephone number, and mailing address when you register for our newsletter, apply as an 
                  advisor, or submit event information. We also collect information you provide when 
                  scheduling consultations or contacting us for services.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-bhgray-800">Non-Personal Information</h3>
                <p className="text-bhgray-600">
                  When you visit our Website, we may collect non-personal information about your 
                  browser, type of computer, technical information about your means of connection 
                  to our Website, such as operating system and Internet service providers, and 
                  other similar information.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-bhgray-800">Cookies and Web Beacons</h3>
                <p className="text-bhgray-600">
                  We may use cookies and similar tracking technologies on our Website to collect 
                  information about your browsing activities. Cookies are small files that a site 
                  transfers to your computer's hard drive through your Web browser that enables 
                  the site to recognize your browser and remember certain information.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">3. How We Use Your Information</h2>
            <p className="text-bhgray-600">
              We may use the information we collect from you for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-bhgray-600 space-y-1 mt-2">
              <li>To provide and maintain our Website and services</li>
              <li>To notify you about changes to our Website or services</li>
              <li>To allow you to participate in interactive features of our Website when you choose to do so</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our Website and services</li>
              <li>To monitor the usage of our Website</li>
              <li>To detect, prevent and address technical issues</li>
              <li>To send you newsletters, marketing communications, and other information that may be of interest to you</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">4. Information Sharing and Disclosure</h2>
            <p className="text-bhgray-600">
              We do not sell, trade, or otherwise transfer your personally identifiable information to 
              outside parties except in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-bhgray-600 space-y-1 mt-2">
              <li>To our trusted service providers who assist us in operating our Website, conducting our business, 
                or servicing you, so long as those parties agree to keep this information confidential</li>
              <li>When we believe release is appropriate to comply with the law, enforce our site policies, 
                or protect our or others' rights, property, or safety</li>
              <li>With your consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">5. Security of Your Information</h2>
            <p className="text-bhgray-600">
              We use administrative, technical, and physical security measures to help protect your 
              personal information from unauthorized access, use, or disclosure. We implement appropriate 
              security measures considering the nature of the information.
            </p>
            <p className="text-bhgray-600 mt-2">
              However, please be aware that no method of transmission over the Internet or method of 
              electronic storage is 100% secure. While we strive to use commercially acceptable means 
              to protect your personal information, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">6. Data Retention</h2>
            <p className="text-bhgray-600">
              We will retain your personal information only for as long as is necessary for the purposes 
              set out in this Privacy Policy. We will retain and use your information to the extent 
              necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">7. Third-Party Websites</h2>
            <p className="text-bhgray-600">
              Our Website may contain links to third-party websites and applications of interest, 
              including advertisements and external services, that are not affiliated with us. Once 
              you have used these links, any information you provide to these third parties is not 
              covered by this Privacy Policy, and we cannot guarantee the safety and privacy of your 
              information. We encourage you to review the privacy policies of any third-party websites 
              or services before providing any information to them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">8. Children's Privacy</h2>
            <p className="text-bhgray-600">
              Our Website and services are not intended for use by children under the age of 13, and 
              we do not knowingly collect personal information from children under 13. If we learn 
              we have collected or received personal information from a child under 13 without 
              verification of parental consent, we will delete that information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">9. Special Note on Defense-Related Information</h2>
            <p className="text-bhgray-600">
              Given the nature of our business in defense consulting, we take additional precautions 
              to protect any sensitive information. Any information that may be subject to export 
              control regulations, including the International Traffic in Arms Regulations (ITAR) 
              and Export Administration Regulations (EAR), is handled with appropriate security controls.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">10. Changes to This Privacy Policy</h2>
            <p className="text-bhgray-600">
              We may update our Privacy Policy from time to time. We will notify you of any changes by 
              posting the new Privacy Policy on this page and updating the "Last Updated" date. You are 
              advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">11. Contact Us</h2>
            <p className="text-bhgray-600">
              If you have any questions about this Privacy Policy, please contact us at privacy@blackhaysgroup.com.
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

export default PrivacyPage;