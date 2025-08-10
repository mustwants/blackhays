import React, { useState } from 'react';
import { Clock, MessageCircle, Target, ArrowRight, Shield, Star, CheckCircle, Calendar } from 'lucide-react';

const Mission = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const approaches = [
    {
      id: 'time',
      title: 'Right Time',
      subtitle: 'Strategic timing saves time and money',
      icon: Clock,
      description: 'Timing your engagement strategically can save thousands. We align with federal budget cycles and procurement windows.',
      benefits: [
        'Align with federal budget cycles',
        'Optimize proposal submissions',
        'Maximize funding opportunities',
        'Reduce time-to-market by 6-8 months'
      ],
      stat: { value: '40-60%', label: 'Cost Reduction' },
      gradient: 'from-blue-600 to-blue-700'
    },
    {
      id: 'message',
      title: 'Right Message',
      subtitle: 'Tailored messaging that resonates',
      icon: MessageCircle,
      description: 'With 400+ years of combined experience, we ensure your messaging aligns with leadership priorities.',
      benefits: [
        'Leadership alignment strategies',
        'Value proposition refinement',
        'Stakeholder communication',
        'Impact demonstration'
      ],
      stat: { value: '85%', label: 'Success Rate' },
      gradient: 'from-purple-600 to-purple-700'
    },
    {
      id: 'approach',
      title: 'Right Approach',
      subtitle: 'Beyond SBIRs: Strategic partnerships',
      icon: Target,
      description: "It's about teaming, partnering, and creating pathways to engage effectively with prime vendors.",
      benefits: [
        'Prime vendor partnerships',
        'SBIR/STTR optimization',
        'Contract vehicle selection',
        'Technology transition planning'
      ],
      stat: { value: '500+', label: 'Partner Network' },
      gradient: 'from-green-600 to-green-700'
    }
  ];

  return (
    <div id="what-we-do" className="relative py-24 bg-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white">
        <div className="absolute inset-0 bg-grid-gray-100/50 bg-grid-8"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-bhred/10 border border-bhred/20 rounded-full text-bhred text-sm font-semibold mb-6">
            <Star className="w-4 h-4 mr-2" />
            Our Strategic Methodology
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            The <span className="bg-gradient-to-r from-bhred to-red-600 bg-clip-text text-transparent">Right Formula</span>
            <br />for Defense Success
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our proven methodology identifies the optimal timing, messaging, and approach to maximize your 
            success in government markets while minimizing costs and accelerating outcomes.
          </p>
        </div>

        {/* Approach Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {approaches.map((approach, index) => (
            <div
              key={approach.id}
              className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200 ${
                activeCard === approach.id ? 'scale-105 shadow-2xl' : ''
              }`}
              onMouseEnter={() => setActiveCard(approach.id)}
              onMouseLeave={() => setActiveCard(null)}
            >
              {/* Card Header */}
              <div className={`p-8 bg-gradient-to-br ${approach.gradient} text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                
                <div className="relative z-10">
                  <approach.icon className="w-12 h-12 text-white mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-2xl font-bold mb-2">{approach.title}</h3>
                  <p className="text-white/90 text-lg font-medium">{approach.subtitle}</p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-8">
                <p className="text-gray-700 text-base leading-relaxed mb-6">
                  {approach.description}
                </p>

                {/* Benefits List */}
                <div className="space-y-3 mb-6">
                  {approach.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Stat */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                  <div className="text-3xl font-bold text-gray-900">{approach.stat.value}</div>
                  <div className="text-sm text-gray-600">{approach.stat.label}</div>
                </div>

                {/* CTA */}
                <a
                  href="https://calendly.com/blackhaysgroup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center w-full justify-center px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-bhred transition-all duration-300 font-semibold"
                >
                  Learn More
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 p-8 bg-gradient-to-r from-bhred/5 to-red-600/5 border border-bhred/20 rounded-3xl">
            <div className="text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Ready to Accelerate Your Defense Strategy?
              </h3>
              <p className="text-gray-600">
                Schedule a consultation and discover how our proven methodology can transform your government engagement.
              </p>
            </div>
            <a
              href="https://calendly.com/blackhaysgroup"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center px-8 py-4 bg-bhred text-white rounded-xl hover:bg-red-700 transition-colors font-semibold whitespace-nowrap"
            >
              Schedule Consultation
              <Calendar className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mission;