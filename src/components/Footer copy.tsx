import React, { useState } from 'react';
import { ExternalLink, Users, Info, Facebook, Linkedin, X, Lock, MapPin, Mail, Phone, Clock, Calendar, Shield, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterProps {
  onAdminClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  const [expandedInfo, setExpandedInfo] = useState<string | null>(null);

  const toggleExpandInfo = (section: string) => {
    setExpandedInfo(expandedInfo === section ? null : section);
  };

  const companyInfo = {
    about: {
      title: 'About Us',
      content: 'Established to provide affordable subscription-based knowledge about engaging US Defense, Intelligence Community, and other US Agencies. The experience and expertise to engage the US Government at the RIGHT time and in the RIGHT way.'
    },
    mission: {
      title: 'Our Mission',
      content: 'BlackHays Group was founded by dedicated professionals with decades of experience in the defense and intelligence sectors. Our mission is to deliver affordable, high-quality advisory services that enable companies to successfully navigate the complex landscape of government procurement and innovation programs.'
    },
    team: {
      title: 'Our Team',
      content: 'Our expert consultants bring decades of combined experience in defense, intelligence, and technology integration, ready to support your initiatives.'
    },
    values: {
      title: 'Our Values',
      content: 'We are committed to integrity, excellence, and service to our clients and the national security community. We believe in making defense expertise accessible to companies of all sizes to foster innovation in national security.'
    }
  };

  const aboutHighlights = [
    {
      title: 'Experienced Leadership',
      description: 'Our team includes former military officers, defense acquisition professionals, and industry experts who understand government needs from the inside.',
      icon: Shield
    },
    {
      title: 'Flexible Engagement Models',
      description: 'From fractional consulting to project-based support, we tailor our services to meet your specific needs and budget constraints.',
      icon: Calendar
    },
    {
      title: 'Proven Results',
      description: "We have helped companies of all sizes secure government contracts, navigate innovation programs, and build sustainable defense business strategies.",
      icon: Award
    }
  ];

  const contactInfo = [
    { type: 'Email', value: 'contact@blackhaysgroup.com', icon: Mail },
    { type: 'Phone', value: '(904) 501-3795', icon: Phone },
    { type: 'Location', value: 'Arlington, VA', icon: MapPin },
    { type: 'Hours', value: 'Monday - Friday: 9AM - 5PM ET', icon: Clock }
  ];

  const socialLinks = [
    { label: 'LinkedIn', href: 'https://linkedin.com/company/blackhaysgroup', icon: Linkedin },
    { label: 'Facebook', href: 'https://www.facebook.com/BlackHaysGroupLLC/', icon: Facebook },
    { label: 'X', href: 'https://x.com/@blackhaysgroup', icon: X }
  ];

  const legalLinks = [
    { label: 'Terms & Conditions', to: '/terms' },
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Accessibility', to: '/accessibility' },
    { label: 'DMCA Policy', to: '/dmca' }
  ];

  return (
    <footer className="bg-black">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* About Us Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => toggleExpandInfo('about')}
            >
              <Info className="w-6 h-6 text-bhred mr-2" />
              <h3 className="text-xl font-bold text-white">{companyInfo.about.title}</h3>
            </div>
            <p className="text-bhgray-400 leading-relaxed">
              {companyInfo.about.content}
            </p>
            
            {expandedInfo === 'about' && (
              <div className="mt-4 space-y-6 animate-fadeIn">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">{companyInfo.mission.title}</h4>
                  <p className="text-bhgray-400 leading-relaxed">{companyInfo.mission.content}</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">{companyInfo.values.title}</h4>
                  <p className="text-bhgray-400 leading-relaxed">{companyInfo.values.content}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {aboutHighlights.map((highlight, index) => (
                    <div key={index} className="bg-bhgray-900 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <highlight.icon className="w-5 h-5 text-bhred mr-2" />
                        <h5 className="font-medium text-white">{highlight.title}</h5>
                      </div>
                      <p className="text-sm text-bhgray-400">{highlight.description}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <Link to="/about" className="text-bhred hover:text-red-400 text-sm inline-flex items-center">
                    Learn more about our company <ExternalLink className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            )}
            
            {expandedInfo !== 'about' && (
              <button 
                onClick={() => toggleExpandInfo('about')} 
                className="text-bhred hover:text-red-400 text-sm inline-flex items-center"
              >
                Read more about us <ExternalLink className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => toggleExpandInfo('team')}
            >
              <Users className="w-6 h-6 text-bhred mr-2" />
              <h3 className="text-xl font-bold text-white">{companyInfo.team.title}</h3>
            </div>
            <p className="text-bhgray-400 leading-relaxed">
              {companyInfo.team.content}
            </p>
            
            {expandedInfo === 'team' && (
              <div className="mt-4 space-y-4 animate-fadeIn">
                <p className="text-bhgray-400 leading-relaxed">
                  Our consultants have served in key roles across the Department of Defense, Intelligence Community, and defense industrial base. This experience enables us to provide unique insights into government requirements, processes, and opportunities.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="bg-bhgray-900 p-4 rounded-lg">
                    <h5 className="font-medium text-white mb-2">Defense Expertise</h5>
                    <ul className="text-sm text-bhgray-400 space-y-1">
                      <li>• Military Requirements & Acquisitions</li>
                      <li>• Defense Technology Integration</li>
                      <li>• Program Management</li>
                      <li>• Test & Evaluation</li>
                    </ul>
                  </div>
                  <div className="bg-bhgray-900 p-4 rounded-lg">
                    <h5 className="font-medium text-white mb-2">Innovation Programs</h5>
                    <ul className="text-sm text-bhgray-400 space-y-1">
                      <li>• SBIR/STTR</li>
                      <li>• Other Transaction Authorities (OTAs)</li>
                      <li>• Defense Innovation Unit (DIU)</li>
                      <li>• Innovation Hubs & Consortia</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {expandedInfo !== 'team' && (
              <button 
                onClick={() => toggleExpandInfo('team')} 
                className="text-bhred hover:text-red-400 text-sm inline-flex items-center"
              >
                Learn more about our team <ExternalLink className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t border-bhgray-800 pt-8 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {contactInfo.map((info, index) => (
              <div key={index} className="flex items-start">
                <info.icon className="w-5 h-5 text-bhred mt-0.5 mr-2" />
                <div>
                  <p className="text-sm text-bhgray-400">{info.type}</p>
                  <p className="text-white">{info.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-bhgray-800 pt-8 mb-8">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm text-bhgray-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Logo and Bottom Section */}
        <div className="border-t border-bhgray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <img
                src="https://zwjhmkfgtvmzkisqrfwm.supabase.co/storage/v1/object/sign/images/BH%20Alone%20Clear%20Background%20Reversed%20White.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvQkggQWxvbmUgQ2xlYXIgQmFja2dyb3VuZCBSZXZlcnNlZCBXaGl0ZS5wbmciLCJpYXQiOjE3NDIxNzgzNzYsImV4cCI6MTc3MzcxNDM3Nn0.aiF8a7OBqaUWd2-TuptIhwjngwB4xstrtr3XQwJEpz8"
                alt="BlackHays Group"
                className="h-8 w-auto"
              />
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex items-center space-x-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bhgray-400 hover:text-white transition-colors text-sm flex items-center"
                  >
                    <link.icon className="w-4 h-4 mr-1" />
                    {link.label}
                  </a>
                ))}
              </div>
              
              <div className="flex items-center space-x-4">
                <button 
                  onClick={onAdminClick}
                  className="text-bhgray-400 hover:text-white transition-colors text-sm flex items-center"
                >
                  <Lock className="w-4 h-4 mr-1" />
                  Admin
                </button>
                <p className="text-xs text-bhgray-400">
                  &copy; {new Date().getFullYear()} BlackHays Group LLC
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;