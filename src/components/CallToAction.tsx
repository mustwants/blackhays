import React from 'react';
import { ArrowRight, Calendar, Users, MessageCircle, Star, Shield } from 'lucide-react';

const CallToAction = () => {
  const features = [
    {
      icon: Shield,
      title: 'Proven Expertise',
      description: '400+ years of combined defense experience'
    },
    {
      icon: Star,
      title: 'Proven Results',
      description: '85% success rate with client engagements'
    },
    {
      icon: Users,
      title: 'Expert Network',
      description: '50+ defense professionals nationwide'
    }
  ];

  return (
    <div className="relative py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-white/5 bg-grid-16"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-bhred/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content Column */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-bhred/20 border border-bhred/30 rounded-full text-bhred text-sm font-semibold backdrop-blur-sm">
                <Star className="w-4 h-4 mr-2" />
                Ready to Get Started?
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                Transform Your 
                <span className="block bg-gradient-to-r from-bhred to-red-400 bg-clip-text text-transparent">
                  Defense Strategy
                </span>
              </h2>
              
              <p className="text-xl text-gray-300 leading-relaxed">
                Schedule a consultation with our experts and discover how we can help you navigate 
                the complex defense landscape with confidence and precision.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6">
              <a
                href="https://calendly.com/blackhaysgroup"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-bhred to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl font-semibold text-lg"
              >
                <Calendar className="mr-3 w-6 h-6" />
                Schedule Consultation
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <button
                onClick={() => document.getElementById('our-team')?.scrollIntoView({ behavior: 'smooth' })}
                className="group inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 hover:border-white/50 transition-all duration-300 font-semibold text-lg"
              >
                <Users className="mr-3 w-6 h-6" />
                Join Our Network
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-8 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">400+</div>
                <div className="text-sm text-gray-400">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">85%</div>
                <div className="text-sm text-gray-400">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-sm text-gray-400">States Covered</div>
              </div>
            </div>
          </div>

          {/* Features Column */}
          <div className="space-y-6">
            <div className="text-center lg:text-left mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Why Choose BlackHays Group?</h3>
              <p className="text-gray-300">
                Our unique combination of experience, expertise, and proven methodologies sets us apart in the defense consulting space.
              </p>
            </div>
            
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/15 hover:border-white/30 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-bhred/20 rounded-xl flex items-center justify-center group-hover:bg-bhred/30 transition-colors">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-br from-bhred/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
              </div>
            ))}

            {/* Bottom CTA */}
            <div className="p-6 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Have Questions?</h4>
                  <p className="text-gray-300 text-sm">Let's discuss your specific needs</p>
                </div>
                <a
                  href="mailto:contact@blackhaysgroup.com"
                  className="flex items-center px-4 py-2 bg-bhred text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;