import React from 'react';
import { Shield, Target, Users, DollarSign, Briefcase, FileText, Building, Handshake, Star, ArrowRight, CheckCircle } from 'lucide-react';

const Services = () => {
  const mainServices = [
    {
      title: 'Advisory Role',
      description: 'No-cost discussions about your technology and viability related to defense and law enforcement applications.',
      icon: Shield,
      features: [
        'Technology assessment',
        'Market viability analysis', 
        'Strategic roadmap development',
        'Risk evaluation'
      ],
      action: {
        text: 'Schedule Free Advisory Call',
        link: 'https://calendly.com/blackhaysgroup'
      },
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80',
      gradient: 'from-blue-600 to-blue-700'
    },
    {
      title: 'Consulting Services',
      description: 'Flat-rate engagement for developing use cases, scenarios, and viable pathways to secure Small Business Funding.',
      icon: Briefcase,
      features: [
        'Use case development',
        'Funding strategy',
        'Proposal preparation',
        'Results-based approach'
      ],
      action: {
        text: 'Explore Consulting',
        link: 'https://calendly.com/blackhaysgroup'
      },
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80',
      gradient: 'from-purple-600 to-purple-700'
    },
    {
      title: 'Fractional Expert Support',
      description: 'Ongoing support aligned with your runway and priorities, leveraging USG PPBE, budgetary, and legislative timelines.',
      icon: Users,
      features: [
        'Timeline alignment',
        'Priority optimization',
        'Budget cycle planning',
        'Legislative coordination'
      ],
      action: {
        text: 'Discuss Partnership',
        link: 'https://calendly.com/blackhaysgroup'
      },
      image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80',
      gradient: 'from-green-600 to-green-700'
    }
  ];

  const documents = [
    { title: 'SBIR How to Apply', link: 'https://www.sbir.gov/tutorials', icon: FileText },
    { title: 'Controlled Unclassified Info', link: 'https://www.archives.gov/cui', icon: Shield },
    { title: 'DDTC for ITAR', link: 'https://www.pmddtc.state.gov/', icon: Building },
    { title: 'BIS for EAR', link: 'https://www.bis.doc.gov/', icon: Building },
    { title: 'NIST SP 800-53', link: 'https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final', icon: FileText },
    { title: 'NIST SP 800-171', link: 'https://csrc.nist.gov/pubs/sp/800/171/r3/final', icon: FileText }
  ];

  const additionalServices = [
    {
      title: 'Strategic Consulting',
      description: 'Defense consulting designed for small/early-stage companies that cannot afford senior military advisors on their board.',
      icon: DollarSign,
      action: { 
        text: 'Set up a consultation',
        link: 'https://calendly.com/blackhaysgroup'
      },
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80'
    },
    {
      title: 'Strategy Development',
      description: 'We work with your business development team on strategy, value proposition, and pipeline development.',
      icon: Target,
      action: {
        text: 'Learn More',
        link: 'https://calendly.com/blackhaysgroup'
      },
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80'
    },
    {
      title: 'Integration Services',
      description: 'We assist in identifying potential partners and integrators to maximize your technology value to Defense.',
      icon: Handshake,
      action: {
        text: 'Find out more',
        link: 'https://calendly.com/blackhaysgroup'
      },
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80'
    }
  ];

  return (
    <div className="py-24 bg-gradient-to-br from-gray-50 to-white" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-bhred/10 border border-bhred/20 rounded-full text-bhred text-sm font-semibold mb-6">
            <Star className="w-4 h-4 mr-2" />
            Our Service Portfolio
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Comprehensive Defense
            <span className="block bg-gradient-to-r from-bhred to-red-600 bg-clip-text text-transparent">
              Advisory Services
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From strategic planning to execution, we provide end-to-end support for defense and law enforcement technology integration
          </p>
        </div>

        {/* Main Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          {mainServices.map((service, index) => (
            <div key={index} className="group relative">
              {/* Service Card */}
              <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                {/* Header with Gradient */}
                <div className={`relative p-8 bg-gradient-to-br ${service.gradient} text-white overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  
                  <div className="relative z-10">
                    <service.icon className="w-12 h-12 text-white mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                    <p className="text-white/90 leading-relaxed">{service.description}</p>
                  </div>
                </div>

                {/* Features List */}
                <div className="p-8">
                  <div className="space-y-4 mb-8">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <a
                    href={service.action.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn inline-flex items-center w-full justify-center px-6 py-4 bg-gray-900 text-white rounded-2xl hover:bg-bhred transition-all duration-300 font-semibold text-lg"
                  >
                    {service.action.text}
                    <ArrowRight className="ml-3 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-bhred/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Documents & Resources Section */}
        <div className="relative mb-24">
          <div className="bg-gradient-to-r from-gray-900 to-black rounded-3xl p-12 overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-white/5 bg-grid-8"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-white mb-4">Essential Resources & Guidance</h3>
                <p className="text-gray-300 text-lg">
                  Access critical documents and regulatory guidance for defense contracting
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc, index) => (
                  <a
                    key={index}
                    href={doc.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/20 hover:border-white/40 transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-bhred/20 rounded-full flex items-center justify-center mr-4 group-hover:bg-bhred/30 transition-colors">
                      <doc.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <span className="text-white font-semibold group-hover:text-bhred transition-colors">
                        {doc.title}
                      </span>
                      <div className="text-gray-400 text-sm mt-1">Official Resource</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Services */}
        <div>
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Specialized Services
            </h3>
            <p className="text-xl text-gray-600">
              Tailored solutions for your unique defense market challenges
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => (
              <div key={index} className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500">
                <div className="relative h-80">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/20 z-10" />
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  <div className="absolute inset-0 flex flex-col justify-end p-8 z-20">
                    <div className="bg-white/10 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-bhred/20 transition-colors">
                      <service.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                    <p className="text-white/90 text-base mb-6 leading-relaxed">{service.description}</p>
                    
                    <a
                      href={service.action.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn inline-flex items-center px-6 py-3 bg-white text-gray-900 rounded-xl hover:bg-bhred hover:text-white transition-all duration-300 font-semibold self-start"
                    >
                      {service.action.text}
                      <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;