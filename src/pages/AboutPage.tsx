import React, { useState } from 'react';
import { Shield, Clock, MessageCircle, Target, Users, Building, Award, Mail, Lightbulb, MapPin, Phone } from 'lucide-react';
import Footer from '../components/Footer';
import AdminPanel from '../components/AdminPanel';

const AboutPage = () => {
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const handleAdminClick = () => {
    setShowAdminPanel(true);
  };

  const handleCloseAdminPanel = () => {
    setShowAdminPanel(false);
  };

  const contactInfo = [
    { type: 'Email', value: 'contact@blackhaysgroup.com', icon: Mail },
    { type: 'Phone', value: '(904) 501-3795', icon: Phone },
    { type: 'Location', value: 'Arlington, VA', icon: MapPin }
  ];

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">About BlackHays Group</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Founded by experienced defense and intelligence professionals to bridge the gap between 
            innovative technology companies and government agencies.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center mb-6">
                <Target className="h-10 w-10 text-bhred" />
                <h2 className="text-3xl font-bold ml-3">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                BlackHays Group was established to provide affordable subscription-based knowledge about 
                engaging US Defense, Intelligence Community, and other US Agencies. We aim to deliver the
                experience and expertise to engage the US Government at the RIGHT time and in the RIGHT way.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mt-4">
                We believe that by making defense expertise accessible to companies of all sizes, we can 
                help foster innovation in national security and create more opportunities for technology 
                integration across the government.
              </p>
            </div>

            <div>
              <div className="flex items-center mb-6">
                <Lightbulb className="h-10 w-10 text-bhred" />
                <h2 className="text-3xl font-bold ml-3">Our Approach</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Clock className="w-6 h-6 text-bhred mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Right Time</h3>
                    <p className="text-gray-700">Strategic timing that saves time and money by aligning with government budget cycles and procurement windows.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MessageCircle className="w-6 h-6 text-bhred mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Right Message</h3>
                    <p className="text-gray-700">Tailored messaging that resonates with agency leadership and addresses explicit and implicit government requirements.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Target className="w-6 h-6 text-bhred mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Right Approach</h3>
                    <p className="text-gray-700">Beyond SBIRs or RFPs - focusing on teaming, partnering, and creating strategic pathways to engage with prime vendors.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <Shield className="h-12 w-12 text-bhred mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Integrity</h3>
              <p className="text-gray-600">We maintain the highest standards of professional ethics and transparency in all our work.</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <Award className="h-12 w-12 text-bhred mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Expertise</h3>
              <p className="text-gray-600">Our team brings decades of specialized experience in defense and intelligence sectors.</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <Users className="h-12 w-12 text-bhred mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Accessibility</h3>
              <p className="text-gray-600">We believe in making defense expertise available to companies of all sizes.</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <Target className="h-12 w-12 text-bhred mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Results</h3>
              <p className="text-gray-600">We measure our success by the tangible outcomes we deliver for our clients.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <p className="text-gray-300 mb-8">
                We're here to help you navigate the complex landscape of defense and government contracting. 
                Contact us to discuss how we can support your goals.
              </p>
              
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-center">
                    <div className="rounded-full bg-bhred bg-opacity-20 p-2 mr-4">
                      <info.icon className="h-6 w-6 text-bhred" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{info.type}</p>
                      <p className="text-white font-medium">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-8">
              <h3 className="text-xl font-bold mb-6">Schedule a Consultation</h3>
              <p className="text-gray-300 mb-6">
                Ready to explore how we can help your business succeed in the defense and government market? 
                Schedule a consultation with our experts.
              </p>
              <a
                href="https://calendly.com/blackhaysgroup"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full py-3 px-4 bg-bhred text-white text-center rounded-lg hover:bg-red-700 transition-colors"
              >
                Book a Call Now
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer onAdminClick={handleAdminClick} />
      {showAdminPanel && <AdminPanel onClose={handleCloseAdminPanel} />}
    </div>
  );
};

export default AboutPage;