import React, { useState } from 'react';
import { ArrowRight, Calendar, Users, Mail } from 'lucide-react';
import NewsletterSignup from './NewsletterSignup';

const Hero = () => {
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
          alt="Defense Technology"
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
          <div className="lg:max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              <span className="block mb-2">Low-Cost Technical Advisory</span>
              <span className="block text-bhred">Defense & Intelligence</span>
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl text-white/90 leading-relaxed max-w-xl">
              Established to provide affordable subscription-based knowledge about engaging US Defense, Intelligence Community, and other US Agencies. The experience and expertise to engage the US Government at the RIGHT time and in the RIGHT way.
            </p>
            
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => document.getElementById('what-we-do')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center justify-center px-8 py-4 bg-bhred text-white rounded-lg hover:bg-red-700 transition-colors group"
              >
                Learn More
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => setShowNewsletterModal(true)}
                className="flex items-center justify-center px-8 py-4 border-2 border-white text-white bg-black/30 backdrop-blur-sm rounded-lg hover:bg-black/50 transition-all"
              >
                Subscribe to Newsletter
                <Mail className="ml-2 w-5 h-5" />
              </button>
              
              {showNewsletterModal && (
                <NewsletterSignup onClose={() => setShowNewsletterModal(false)} />
              )}
              
              <button
                onClick={() => document.getElementById('conferences')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center justify-center px-8 py-4 border-2 border-white text-white bg-black/30 backdrop-blur-sm rounded-lg hover:bg-black/50 transition-all"
              >
                Discover Events
                <Calendar className="ml-2 w-5 h-5" />
              </button>
              
              <button
                onClick={() => document.getElementById('our-team')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center justify-center px-8 py-4 bg-bhred text-white rounded-lg hover:bg-red-700 transition-colors group"
              >
                Advisors Apply Now
                <Users className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;