import React, { useState } from 'react';
import Footer from '../components/Footer';
import AdminPanel from '../components/AdminPanel';

const DmcaPage = () => {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">DMCA Policy</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">Digital Millennium Copyright Act (DMCA) Notice and Policy</h2>
            <p className="text-bhgray-600">
              BlackHays Group LLC respects the intellectual property rights of others and expects 
              its users to do the same. In accordance with the Digital Millennium Copyright Act of 
              1998 ("DMCA"), we will respond expeditiously to claims of copyright infringement that 
              are reported to the designated copyright agent identified below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">Notification of Copyright Infringement</h2>
            <p className="text-bhgray-600">
              If you are a copyright owner or authorized to act on behalf of a copyright owner and 
              believe that any material available on or through our website infringes upon your 
              copyrights, you may submit a notification pursuant to the DMCA by providing our 
              designated copyright agent with the following information in writing:
            </p>
            <ol className="list-decimal pl-6 text-bhgray-600 space-y-2 mt-2">
              <li>
                A physical or electronic signature of a person authorized to act on behalf of the 
                owner of an exclusive right that is allegedly infringed.
              </li>
              <li>
                Identification of the copyrighted work claimed to have been infringed, or, if multiple 
                copyrighted works at a single online site are covered by a single notification, a 
                representative list of such works at that site.
              </li>
              <li>
                Identification of the material that is claimed to be infringing or to be the subject 
                of infringing activity and that is to be removed or access to which is to be disabled, 
                and information reasonably sufficient to permit us to locate the material.
              </li>
              <li>
                Information reasonably sufficient to permit us to contact you, such as an address, 
                telephone number, and, if available, an electronic mail address at which you may be contacted.
              </li>
              <li>
                A statement that you have a good faith belief that use of the material in the manner 
                complained of is not authorized by the copyright owner, its agent, or the law.
              </li>
              <li>
                A statement that the information in the notification is accurate, and under penalty of 
                perjury, that you are authorized to act on behalf of the owner of an exclusive right 
                that is allegedly infringed.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">Counter-Notification Procedures</h2>
            <p className="text-bhgray-600">
              If you believe that material you posted on the website was removed or access to it was 
              disabled by mistake or misidentification, you may file a counter-notification with us 
              by submitting written notification to our designated copyright agent. The counter-notification 
              must include:
            </p>
            <ol className="list-decimal pl-6 text-bhgray-600 space-y-2 mt-2">
              <li>
                Your physical or electronic signature.
              </li>
              <li>
                An identification of the material that has been removed or to which access has been 
                disabled and the location at which the material appeared before it was removed or 
                access to it was disabled.
              </li>
              <li>
                A statement under penalty of perjury that you have a good faith belief that the 
                material was removed or disabled as a result of mistake or misidentification of 
                the material to be removed or disabled.
              </li>
              <li>
                Your name, address, and telephone number, and a statement that you consent to the 
                jurisdiction of the Federal District Court for the judicial district in which your 
                address is located, or if your address is outside of the United States, for any 
                judicial district in which BlackHays Group LLC may be found, and that you will 
                accept service of process from the person who provided notification of the alleged 
                infringement.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">Repeat Infringer Policy</h2>
            <p className="text-bhgray-600">
              In accordance with the DMCA and other applicable laws, BlackHays Group LLC has adopted 
              a policy of terminating or disabling, in appropriate circumstances and at our sole 
              discretion, the accounts of users who are deemed to be repeat infringers. We may also, 
              at our sole discretion, limit access to our website and/or terminate the accounts of 
              any users who infringe any intellectual property rights of others, whether or not 
              there is any repeat infringement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">DMCA Compliance</h2>
            <p className="text-bhgray-600">
              BlackHays Group LLC complies with the provisions of the DMCA applicable to Internet service 
              providers (17 U.S.C. §512). If you have any complaints or objections to content hosted on 
              our website, please contact our designated agent:
            </p>
            <div className="mt-3 text-bhgray-600">
              <p><strong>DMCA Agent:</strong> Copyright Compliance Department</p>
              <p><strong>Address:</strong> [Company Address]</p>
              <p><strong>Email:</strong> dmca@blackhaysgroup.com</p>
              <p><strong>Phone:</strong> [Phone Number]</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-bhgray-800 mb-3">Disclaimer</h2>
            <p className="text-bhgray-600">
              The information provided in this DMCA Policy is for informational purposes only and 
              not for the purpose of providing legal advice. You should contact your attorney to 
              obtain advice with respect to any particular issue or problem.
            </p>
          </section>

          <section>
            <p className="text-bhgray-600 mt-4">
              Last updated: February 1, 2025
            </p>
          </section>
        </div>
      </div>
      
      <Footer onAdminClick={handleAdminClick} />
      {showAdminPanel && <AdminPanel onClose={handleCloseAdminPanel} />}
    </div>
  );
};

export default DmcaPage;