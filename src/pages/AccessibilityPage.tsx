import React, { useState } from 'react';
import Footer from '../components/Footer';
import AdminPanel from '../components/AdminPanel';

const AccessibilityPage = () => {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Accessibility Statement</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">Our Commitment</h2>
            <p className="text-bhgray-600">
              BlackHays Group LLC is committed to ensuring digital accessibility for people with 
              disabilities. We are continually improving the user experience for everyone and 
              applying the relevant accessibility standards.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">Conformance Status</h2>
            <p className="text-bhgray-600">
              The Web Content Accessibility Guidelines (WCAG) define requirements for designers 
              and developers to improve accessibility for people with disabilities. It defines 
              three levels of conformance: Level A, Level AA, and Level AAA.
            </p>
            <p className="text-bhgray-600 mt-2">
              The BlackHays Group website is partially conformant with WCAG 2.1 level AA. 
              Partially conformant means that some parts of the content do not fully conform 
              to the accessibility standard.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">Accessibility Features</h2>
            <p className="text-bhgray-600">
              Our website includes the following accessibility features:
            </p>
            <ul className="list-disc pl-6 text-bhgray-600 space-y-1 mt-2">
              <li>Semantic HTML markup with appropriate heading structure</li>
              <li>Text alternatives for non-text content</li>
              <li>Keyboard navigation support</li>
              <li>Color contrast that meets WCAG 2.1 AA standards</li>
              <li>Resizable text without loss of functionality</li>
              <li>Clear focus indicators for keyboard navigation</li>
              <li>ARIA attributes where appropriate</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">Limitations and Alternatives</h2>
            <p className="text-bhgray-600">
              Despite our best efforts to ensure accessibility of the BlackHays Group website, 
              there may be some limitations. Below is a description of known limitations, and 
              potential solutions. Please contact us if you observe an issue not listed below.
            </p>
            <div className="mt-3 space-y-3">
              <div>
                <h3 className="font-semibold text-bhgray-800">Known limitations:</h3>
                <ul className="list-disc pl-6 text-bhgray-600 space-y-1 mt-1">
                  <li>Interactive maps: Our consultant map feature may not be fully accessible to screen readers</li>
                  <li>PDF documents: Some older PDF documents may not be fully accessible</li>
                  <li>Third-party content: We cannot control the accessibility of third-party content linked from our website</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-bhgray-800">Alternatives:</h3>
                <ul className="list-disc pl-6 text-bhgray-600 space-y-1 mt-1">
                  <li>For our consultant map, we provide the same information in text format</li>
                  <li>If you need assistance accessing any content that is not accessible, please contact us and we will provide an alternative</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">Feedback</h2>
            <p className="text-bhgray-600">
              We welcome your feedback on the accessibility of the BlackHays Group website. 
              Please let us know if you encounter accessibility barriers:
            </p>
            <ul className="list-disc pl-6 text-bhgray-600 space-y-1 mt-2">
              <li>Email: accessibility@blackhaysgroup.com</li>
              <li>Phone: [Phone number]</li>
              <li>Postal address: [Physical address]</li>
            </ul>
            <p className="text-bhgray-600 mt-2">
              We try to respond to feedback within 3 business days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">Assessment Approach</h2>
            <p className="text-bhgray-600">
              BlackHays Group assessed the accessibility of this website by the following approaches:
            </p>
            <ul className="list-disc pl-6 text-bhgray-600 space-y-1 mt-2">
              <li>Self-evaluation</li>
              <li>Automated testing using accessibility evaluation tools</li>
              <li>User testing with assistive technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">Compatibility with Browsers and Assistive Technology</h2>
            <p className="text-bhgray-600">
              The BlackHays Group website is designed to be compatible with the following assistive technologies:
            </p>
            <ul className="list-disc pl-6 text-bhgray-600 space-y-1 mt-2">
              <li>Screen readers (including NVDA, JAWS, and VoiceOver)</li>
              <li>Screen magnifiers</li>
              <li>Voice recognition software</li>
              <li>Keyboard-only navigation</li>
            </ul>
            <p className="text-bhgray-600 mt-2">
              The website is compatible with recent versions of major browsers, including Chrome, Firefox, Safari, and Edge.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">Technical Information about Accessibility</h2>
            <p className="text-bhgray-600">
              BlackHays Group is committed to making our website accessible, in accordance with:
            </p>
            <ul className="list-disc pl-6 text-bhgray-600 space-y-1 mt-2">
              <li>Section 508 of the Rehabilitation Act</li>
              <li>Web Content Accessibility Guidelines 2.1 Level AA</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">Measures to Support Accessibility</h2>
            <p className="text-bhgray-600">
              BlackHays Group takes the following measures to ensure accessibility of our website:
            </p>
            <ul className="list-disc pl-6 text-bhgray-600 space-y-1 mt-2">
              <li>Include accessibility as part of our mission</li>
              <li>Include accessibility throughout our internal policies</li>
              <li>Integrate accessibility into our procurement practices</li>
              <li>Provide accessibility training for our staff</li>
              <li>Assign clear accessibility goals and responsibilities</li>
              <li>Employ formal accessibility quality assurance methods</li>
            </ul>
          </section>

          <section>
            <p className="text-bhgray-600">
              This statement was created on February 1, 2025, using the W3C Accessibility Statement Generator Tool.
            </p>
          </section>
        </div>
      </div>
      
      <Footer onAdminClick={handleAdminClick} />
      {showAdminPanel && <AdminPanel onClose={handleCloseAdminPanel} />}
    </div>
  );
};

export default AccessibilityPage;