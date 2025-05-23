import React from 'react';
import { Shield, Target, Users, DollarSign, Briefcase, FileText, Building, Handshake } from 'lucide-react';

const Services = () => {
  const mainServices = [
    {
      title: 'Advisory Role',
      description: 'No Cost discussions concerning your technology and the viability related to defense and law enforcement.',
      icon: Shield,
      action: {
        text: 'Schedule a Call Now!',
        link: 'https://calendly.com/blackhaysgroup'
      },
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80'
    },
    {
      title: 'Consulting',
      description: 'Flat Low Cost Rate engagement and assistance in developing use cases, scenarios, and viable ways to engage and potentially secure Small Business Funding. Results Based.',
      icon: Briefcase,
      action: {
        text: 'Find out more',
        link: 'https://calendly.com/blackhaysgroup'
      },
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80'
    },
    {
      title: 'Fractional Expert Support',
      description: 'BlackHays Group will work with your runway, your priorities, and advise you on aligning your efforts with the USG "PPBE", Budgetary, and Legislative timeline.',
      icon: Users,
      action: {
        text: 'Contact to discuss',
        link: 'https://calendly.com/blackhaysgroup'
      },
      image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80'
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
      title: 'No/Low Cost Consulting',
      description: 'Defense Consulting designed for small/early stage companies that cannot afford the Colonel/General/Admiral/Govt SME to join your board.',
      icon: DollarSign,
      action: { 
        text: 'Set up a time to chat',
        link: 'https://calendly.com/blackhaysgroup'
      },
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80'
    },
    {
      title: 'Strategy Development',
      description: 'We will work as your BD or work with your BD on your Strategy, Value Proposition, and Pipeline related to your Technology and Governemnt Engagement.',
      icon: Target,
      action: {
        text: 'Learn More',
        link: 'https://calendly.com/blackhaysgroup'
      },
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80'
    },
    {
      title: 'Integration Services',
      description: 'We will assist in identifying potential partners and integrators to maximize your technology value to Defense.',
      icon: Handshake,
      action: {
        text: 'Find out more',
        link: 'https://calendly.com/blackhaysgroup'
      },
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80'
    }
  ];

  return (
    <div className="py-16 bg-white" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Services Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-black sm:text-4xl">Our Services</h2>
          <p className="mt-4 text-xl text-bhgray-600">
            Comprehensive support for defense and law enforcement technology integration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {mainServices.map((service, index) => (
            <div key={index} className="relative group overflow-hidden rounded-lg shadow-lg">
              <div className="relative h-96">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                  <div className="flex items-center mb-3">
                    <service.icon className="h-8 w-8 text-bhred" />
                    <h3 className="ml-3 text-2xl font-bold text-white">{service.title}</h3>
                  </div>
                  <p className="text-white text-base mb-4">{service.description}</p>
                  <a
                    href={service.action.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-bhred text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    {service.action.text}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Documents & Guidance Section */}
        <div className="bg-black rounded-lg p-8 mb-16">
          <h3 className="text-2xl font-bold text-white mb-8">Documents & Guidance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc, index) => (
              <a
                key={index}
                href={doc.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-bhgray-800 rounded-lg hover:bg-bhred transition-colors group"
              >
                <doc.icon className="h-5 w-5 text-white" />
                <span className="ml-3 text-white text-sm font-medium">{doc.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Additional Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {additionalServices.map((service, index) => (
            <div key={index} className="relative group overflow-hidden rounded-lg shadow-lg">
              <div className="relative h-80">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                  <div className="flex items-center mb-3">
                    <service.icon className="h-6 w-6 text-bhred" />
                    <h3 className="ml-2 text-xl font-bold text-white">{service.title}</h3>
                  </div>
                  <p className="text-white text-sm mb-4">{service.description}</p>
                  <a
                    href={service.action.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-bhred text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    {service.action.text}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;