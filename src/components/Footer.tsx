import React, { useState } from 'react';
import { ExternalLink, Users, Info, Facebook, Linkedin, X, Lock, MapPin, Mail, Phone, Clock, Calendar, Shield, Award, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterProps {
  onAdminClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const companyInfo = {
    mission: 'Established to provide affordable subscription-based knowledge about engaging US Defense, Intelligence Community, and other US Agencies with the experience and expertise to engage at the RIGHT time and in the RIGHT way.',
    values: 'We are committed to integrity, excellence, and service to our clients and the national security community. We believe in making defense expertise accessible to companies of all sizes.',
    approach: 'Our consultants have served in key roles across the Department of Defense, Intelligence Community, and defense industrial base, enabling unique insights into government requirements and opportunities.'
  };

  const aboutHighlights = [
    {
      title: 'Experienced Leadership',
      description: 'Former military officers, defense acquisition professionals, and industry experts who understand government needs.',
      icon: Shield
    },
    {
      title: 'Flexible Engagement',
      description: 'From fractional consulting to project-based support, tailored to meet your specific needs and budget.',
      icon: Calendar
    },
    {
      title: 'Proven Results',
      description: 'Helped companies of all sizes secure contracts, navigate innovation programs, and build sustainable strategies.',
      icon: Award
    }
  ];

  const contactInfo = [
    { type: 'Email', value: 'contact@blackhaysgroup.com', icon: Mail, href: 'mailto:contact@blackhaysgroup.com' },
    { type: 'Phone', value: '(904) 501-3795', icon: Phone, href: 'tel:+19045013795' },
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

  const quickLinks = [
    { label: 'Innovation Advisory', to: '/innovation' },
    { label: 'Events', to: '/events' },
    { label: 'Defense Map', to: '/map' },
    { label: 'Apply as Advisor', to: '/apply' },
    { label: 'Submit Event', to: '/submit-event' },
    { label: 'Add Company', to: '/add-company' }
  ];

  const FooterSection = ({ title, children, sectionKey }: { title: string; children: React.ReactNode; sectionKey: string }) => (
    <div className="space-y-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <ChevronUp className={`w-5 h-5 text-gray-400 transition-transform duration-300 lg:hidden ${
          expandedSection === sectionKey ? 'rotate-180' : ''
        }`} />
      </button>
      
      <div className={`space-y-4 transition-all duration-300 overflow-hidden ${
        expandedSection === sectionKey || window.innerWidth >= 1024 
          ? 'max-h-96 opacity-100' 
          : 'max-h-0 opacity-0 lg:max-h-96 lg:opacity-100'
      }`}>
        {children}
      </div>
    </div>
  );

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-white/5 bg-grid-16"></div>
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-bhred/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <FooterSection title="About BlackHays Group" sectionKey="about">
            <p className="text-gray-300 leading-relaxed text-sm">
              {companyInfo.mission}
            </p>
            
            <div className="space-y-3">
              {aboutHighlights.map((highlight, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-bhred/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <highlight.icon className="w-4 h-4 text-bhred" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">{highlight.title}</h4>
                    <p className="text-gray-400 text-xs">{highlight.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Link to="/about" className="inline-flex items-center text-bhred hover:text-red-400 text-sm font-medium">
              Learn more about our company 
              <ExternalLink className="w-4 h-4 ml-1" />
            </Link>
          </FooterSection>

          {/* Quick Links */}
          <FooterSection title="Quick Links" sectionKey="links">
            <div className="grid grid-cols-1 gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-gray-300 hover:text-white transition-colors text-sm font-medium py-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </FooterSection>

          {/* Contact Information */}
          <FooterSection title="Contact Us" sectionKey="contact">
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-bhred/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <info.icon className="w-4 h-4 text-bhred" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">{info.type}</p>
                    {info.href ? (
                      <a href={info.href} className="text-white hover:text-bhred transition-colors font-medium">
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-white font-medium">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t border-white/20">
              <a
                href="https://calendly.com/blackhaysgroup"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center w-full justify-center px-4 py-3 bg-bhred text-white rounded-xl hover:bg-red-700 transition-colors font-semibold text-sm"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book a Meeting
              </a>
            </div>
          </FooterSection>

          {/* Newsletter & Social */}
          <FooterSection title="Stay Connected" sectionKey="social">
            <p className="text-gray-300 text-sm mb-4">
              Follow us for the latest defense industry insights and company updates.
            </p>
            
            <div className="space-y-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-bhred/20 rounded-lg flex items-center justify-center group-hover:bg-bhred/30 transition-colors">
                    <link.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-medium">{link.label}</span>
                </a>
              ))}
            </div>
          </FooterSection>
        </div>

        {/* Legal Links */}
        <div className="border-t border-white/20 pt-8 mb-8">
          <div className="flex flex-wrap justify-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <img
                src="https://zwjhmkfgtvmzkisqrfwm.supabase.co/storage/v1/object/public/images/BHfullwhite.png" 
                alt="BlackHays Group"
                className="h-8 w-auto"
              />
              <p className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} BlackHays Group LLC. All rights reserved.
              </p>
            </div>

            <div className="flex items-center space-x-6">
              <button 
                onClick={onAdminClick}
                className="group flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <Lock className="w-4 h-4" />
                <span>Admin Access</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;