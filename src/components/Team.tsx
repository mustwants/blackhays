import React from 'react';
import { Users, ArrowRight, MapPin, Star, Award, Shield } from 'lucide-react';
import ConsultantMap from './ConsultantMap';

const Team = () => {
  const teamHighlights = [
    {
      icon: Shield,
      title: 'Military Leadership',
      description: 'Former officers and senior enlisted personnel from all service branches',
      stat: '25+ Years',
      statLabel: 'Average Experience'
    },
    {
      icon: Award,
      title: 'Defense Expertise',
      description: 'Deep knowledge of acquisition, technology integration, and program management',
      stat: '400+',
      statLabel: 'Combined Years'
    },
    {
      icon: MapPin,
      title: 'National Presence',
      description: 'Advisors strategically located across the United States',
      stat: '50+',
      statLabel: 'States Covered'
    }
  ];

  return (
    <div id="our-team" className="py-24 bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-bhred/10 border border-bhred/20 rounded-full text-bhred text-sm font-semibold mb-6">
            <Star className="w-4 h-4 mr-2" />
            Our Expert Network
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Meet Our 
            <span className="block bg-gradient-to-r from-bhred to-red-600 bg-clip-text text-transparent">
              Defense Professionals
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our network of experienced defense and intelligence professionals spanning all service branches and government agencies
          </p>
        </div>

        {/* Team Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {teamHighlights.map((highlight, index) => (
            <div key={index} className="group text-center">
              <div className="relative p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-gray-200 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-bhred/5 rounded-full -mr-12 -mt-12 group-hover:bg-bhred/10 transition-colors"></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-bhred to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <highlight.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{highlight.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{highlight.description}</p>
                  
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="text-3xl font-bold text-bhred">{highlight.stat}</div>
                    <div className="text-sm text-gray-600 font-medium">{highlight.statLabel}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Map Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Advisors Across the Nation</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our nationwide network of defense professionals strategically positioned to support your initiatives
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-bhred/20 via-transparent to-bhred/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="h-[600px]">
                <ConsultantMap />
              </div>
            </div>
          </div>
        </div>

        {/* Join CTA */}
        <div className="relative">
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-3xl p-12 text-center overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-white/5 bg-grid-8"></div>
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-bhred/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-bhred to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Users className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Ready to Join Our Expert Network?
              </h3>
              
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Are you a veteran or experienced professional in defense, intelligence, or technology? 
                Join our network of advisors and help shape the future of defense innovation.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href="/apply"
                  className="group inline-flex items-center px-8 py-4 bg-bhred text-white rounded-2xl hover:bg-red-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-2xl"
                >
                  Apply as Advisor
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </a>
                
                <a
                  href="https://calendly.com/blackhaysgroup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center px-8 py-4 border-2 border-white/30 text-white bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 hover:border-white/50 transition-all duration-300 font-semibold text-lg"
                >
                  Learn More
                  <Users className="ml-3 w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;