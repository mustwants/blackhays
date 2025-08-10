import React, { useState } from 'react';
import { ArrowRight, Calendar, Users, Mail, Play, Shield, Target, Clock } from 'lucide-react';
import NewsletterSignup from './NewsletterSignup';

const Hero = () => {
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);

  const stats = [
    { label: 'Years Combined Experience', value: '400+', icon: Clock },
    { label: 'Defense Professionals', value: '50+', icon: Users },
    { label: 'Success Rate', value: '85%', icon: Target },
    { label: 'Client Satisfaction', value: '98%', icon: Shield }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-bhred rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-white/5 bg-grid-16"></div>
      </div>

      {/* Background image with sophisticated overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-black/70 z-10" />
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
          alt="Defense Technology"
          className="w-full h-full object-cover opacity-60"
        />
      </div>

      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content Column */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-bhred/20 border border-bhred/30 rounded-full text-bhred text-sm font-medium backdrop-blur-sm">
                  <Shield className="w-4 h-4 mr-2" />
                  Trusted Defense Advisory
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight leading-tight">
                  <span className="block">Defense</span>
                  <span className="block bg-gradient-to-r from-bhred to-red-400 bg-clip-text text-transparent">
                    Intelligence
                  </span>
                  <span className="block text-4xl lg:text-5xl font-normal text-gray-300 mt-2">
                    Advisory Excellence
                  </span>
                </h1>
                
                <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                  Established to provide affordable subscription-based knowledge for engaging US Defense, 
                  Intelligence Community, and federal agencies at the <span className="text-bhred font-semibold">right time</span> 
                  and in the <span className="text-bhred font-semibold">right way</span>.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => document.getElementById('what-we-do')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group flex items-center justify-center px-8 py-4 bg-gradient-to-r from-bhred to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl font-semibold text-lg"
                >
                  Discover Our Approach
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => setShowNewsletterModal(true)}
                  className="group flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 hover:border-white/50 transition-all duration-300 font-semibold text-lg"
                >
                  <Mail className="mr-3 w-6 h-6" />
                  Stay Informed
                </button>
              </div>

              <div className="flex items-center space-x-6 pt-4">
                <a
                  href="https://calendly.com/blackhaysgroup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mr-3 group-hover:bg-bhred/20 transition-colors">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Book a</div>
                    <div className="font-semibold">Free Consultation</div>
                  </div>
                </a>
                
                <button
                  onClick={() => document.getElementById('our-team')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mr-3 group-hover:bg-bhred/20 transition-colors">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Join our</div>
                    <div className="font-semibold">Expert Network</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Stats Column */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="group relative p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-bhred/20 rounded-full flex items-center justify-center">
                        <stat.icon className="w-5 h-5 text-bhred" />
                      </div>
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400 leading-tight">
                      {stat.label}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-bhred/10 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
                  </div>
                ))}
              </div>
              
              <div className="relative p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl">
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Ready to Get Started?</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Schedule a free consultation with our defense experts and discover how we can accelerate your government engagement.
                </p>
                <a
                  href="https://calendly.com/blackhaysgroup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center w-full justify-center px-6 py-3 bg-white text-bhgray-900 rounded-xl hover:bg-gray-100 transition-all duration-300 font-semibold"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Book Your Session
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent z-10"></div>

      {showNewsletterModal && (
        <NewsletterSignup onClose={() => setShowNewsletterModal(false)} />
      )}
    </div>
  );
};

export default Hero;