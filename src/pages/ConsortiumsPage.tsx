import React, { useState } from 'react';
import { ArrowRight, Search, PlusCircle, Check, Rocket } from 'lucide-react';
import Footer from '../components/Footer';
import AdminPanel from '../components/AdminPanel';
import ConsortiumCard from '../components/ConsortiumCard';
import { Consortium } from '../types/consortium';

const ConsortiumsPage = () => {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

  const handleAdminClick = () => {
    setShowAdminPanel(true);
  };

  const handleCloseAdminPanel = () => {
    setShowAdminPanel(false);
  };

  const handleFlip = (id: string) => {
    setFlippedCard(flippedCard === id ? null : id);
  };

  // TODO: replace placeholderLogo paths with actual consortium logos
  const placeholderLogo = '/BHfullblack.png';

  const consortiums: Consortium[] = [
    {
      id: 'c5',
      name: 'C5 Consortium',
      logo: placeholderLogo,
      website: 'https://c5technologies.org',
      description: 'A consortium composed of leading companies and institutions in the C4ISR and cyber technology sectors.',
      details: [
        'Accelerates development and deployment of new capabilities to the Warfighter through OTA',
        'Provides innovative acquisition mechanism for new technologies',
        'Initial three-year OTA with Army in July 2014',
        '10-year, no-ceiling, follow-on OTA in April 2017',
        'Marine Corps Systems Command agreement in April 2018'
      ],
      focus: ['C4ISR', 'Cyber', 'Electronic Warfare', 'Software', 'IT']
    },
    {
      id: 'vlc',
      name: 'Vertical Lift Consortium',
     logo: placeholderLogo,
      website: 'https://www.verticalliftconsortium.org',
      description: 'A collaboration of traditional and nontraditional government contractors developing innovative vertical lift technologies.',
      details: [
        'Includes small and large businesses',
        'For-profit and not-for-profit entities',
        'Academic organizations',
        'Coordinated research and development program',
        'Prototype aviation technologies development'
      ],
      focus: ['Aviation', 'Rotorcraft', 'UAV', 'Propulsion', 'Avionics']
    },
    {
      id: 'spec',
      name: 'Space Enterprise Consortium',
      logo: placeholderLogo,
      website: 'https://space-enterprise.org',
      description: 'Created to bridge the cultural gap between military buyers and commercial space startups and small businesses through OTAs.',
      details: [
        'Minimizes barriers to entry for small businesses',
        'Promotes integrated research and prototyping efficiencies',
        'Leverages partnerships to increase flexibility',
        'Reduces cost and improves technology',
        'Decreases program development cycles'
      ],
      focus: ['Space', 'Satellites', 'Launch Systems', 'Ground Systems', 'Space Domain Awareness']
    },
    {
      id: 'sossec',
      name: 'SOSSEC',
      logo: placeholderLogo,
      website: 'https://sossec.org',
      description: 'System of Systems Security (SOSSEC) works with the Defense Cyber Crime Center (DC3) to enable a Department-wide path for better cyber security tools.',
      details: [
        'Accelerates delivery of cyber capabilities',
        'Primary OTA for defense cyber crime investigation and analysis systems',
        'Connects cyber innovators with defense customers',
        'Streamlined acquisition through Other Transaction Authority',
        'Focuses on prototyping and rapid fielding'
      ],
      focus: ['Cybersecurity', 'Digital Forensics', 'Network Defense', 'Cyber Intelligence']
    },
    {
      id: 'nsic',
      name: 'National Security Innovation Consortium (NSIC)',
      logo: placeholderLogo,
      website: 'https://nstxl.org/about/nsic',
      description: 'A consortium dedicated to supporting the integration of advanced technologies into defense, security, and intelligence operations.',
      details: [
        'Supports Army Futures Command',
        'Focuses on multi-domain operations',
        'Facilitates prototype development and demonstration',
        'Enables dual-use technologies',
        'Streamlines access to innovation capabilities'
      ],
      focus: ['Advanced Computing', 'Command & Control', 'Intelligence Systems', 'Logistics', 'AI/ML']
    },
    {
      id: 'mtec',
      name: 'Medical Technology Enterprise Consortium (MTEC)',
      logo: placeholderLogo,
      website: 'https://mtec-sc.org',
      description: 'A biomedical technology consortium collaborating with multiple DoD stakeholders to address military medical capability gaps.',
      details: [
        'Accelerates development of medical solutions for warfighters',
        'Develops clinical systems and combat casualty care technologies',
        'Supports telehealth, medical training, and health monitoring',
        'Facilitates healthcare for military operational missions',
        'Integrates prototyping and production strategies'
      ],
      focus: ['Biomedical', 'Medical Devices', 'Combat Casualty Care', 'Military Health']
    },
    {
      id: 'atcc',
      name: 'Aviation and Turbine Consortium (ATCC)',
      logo: placeholderLogo,
      website: 'https://atcc.us',
      description: 'Focused on accelerating the development of next-generation aviation and turbine technologies for defense applications.',
      details: [
        'Enhances operational readiness of aviation assets',
        'Focuses on propulsion, maintenance, and support systems',
        'Addresses sustainability and cost-effectiveness',
        'Develops next-generation propulsion technologies',
        'Accelerates integration of emerging technologies'
      ],
      focus: ['Aviation', 'Propulsion', 'Turbine Technology', 'Sustainment']
    },
    {
      id: 'nstxl',
      name: 'National Security Technology Accelerator (NSTXL)',
      logo: placeholderLogo,
      website: 'https://nstxl.org',
      description: 'A non-profit organization that serves as the consortium management firm for multiple defense technology programs and consortia.',
      details: [
        'Manages multiple technology consortia',
        'Acts as bridge between innovators and defense customers',
        'Streamlines procurement and technology acquisition',
        'Accelerates technology delivery to warfighters',
        'Provides collaboration platforms for diverse stakeholders'
      ],
      focus: ['Technology Integration', 'Acquisition Management', 'Requirements Refinement']
    },
    {
      id: 'iwrp',
      name: 'Information Warfare Research Project (IWRP)',
      logo: placeholderLogo,
      website: 'https://www.theiwrp.org',
      description: 'Focused on information warfare technologies to enhance Navy and Marine Corps missions.',
      details: [
        'Addresses critical Navy information technology gaps',
        'Supports advanced technologies for information operations',
        'Engages in cybersecurity and electromagnetic spectrum operations',
        'Develops tools for command and control capabilities',
        'Combines commercial and defense technologies'
      ],
      focus: ['Information Operations', 'Cybersecurity', 'Communications', 'Command & Control']
    },
    {
      id: 'mscei',
      name: 'Marine Corps Systems Command Experts & Equippers Innovation (MSCEI)',
      logo: placeholderLogo,
      website: 'https://www.marcorsyscom.marines.mil/MCSCIE',
      description: 'Focuses on innovative technologies to support and enhance Marine Corps missions and capabilities.',
      details: [
        'Streamlines technology acquisition for the Marine Corps',
        'Enhances force protection and force applications',
        'Develops advanced battlefield communications',
        'Supports USMC-unique equipment requirements',
        'Leverages OTA for rapid capability delivery'
      ],
      focus: ['Marines Equipment', 'Expeditionary Operations', 'Command & Control', 'Sensors']
    },
    {
      id: 'disa-oti',
      name: 'Defense Information Systems Agency (DISA) OTA',
      logo: placeholderLogo,
      website: 'https://www.disa.mil',
      description: 'Focuses on innovative information technology solutions for defense networks and systems.',
      details: [
        'Enhances DoD information networks',
        'Develops cloud computing solutions for defense',
        'Focuses on cybersecurity for defense systems',
        'Supports command and control communications',
        'Enables secure information sharing across domains'
      ],
      focus: ['IT Infrastructure', 'Cloud Computing', 'Cybersecurity', 'Communications']
    },
    {
      id: 'ati',
      name: 'Advanced Technology International (ATI)',
      logo: placeholderLogo,
      website: 'https://www.ati.org',
      description: 'A nonprofit organization that builds and manages research and development consortia for government, industry, and academia.',
      details: [
        'Manages multiple defense-related consortia',
        'Facilitates collaborative R&D across diverse sectors',
        'Supports technology transition to operational use',
        'Enables industry-government partnerships',
        'Streamlines acquisition through multiple OTAs'
      ],
      focus: ['Technology Management', 'R&D Collaboration', 'Defense Innovation']
    },
    {
      id: 'cmmc',
      name: 'Cybersecurity Maturity Model Certification (CMMC) Accreditation Body',
      logo: placeholderLogo,
      website: 'https://www.cyberab.org',
      description: 'Oversees the assessment and certification of contractors meeting the cybersecurity requirements specified by the DoD.',
      details: [
        'Establishes standards for cybersecurity in defense industry',
        'Trains and certifies cybersecurity assessors',
        'Implements CMMC framework for defense contractors',
        'Ensures protection of controlled unclassified information',
        'Strengthens security of defense industrial base'
      ],
      focus: ['Cybersecurity Standards', 'Defense Industrial Base', 'Assessment & Certification']
    },
    {
      id: 'dotc',
      name: 'Defense Ordnance Technology Consortium (DOTC)',
      logo: placeholderLogo,
      website: 'https://www.dodt.org',
      description: 'Focuses on ordnance technologies, systems, and equipment to enhance warfighter capabilities.',
      details: [
        'Develops advanced weapons and ammunition',
        'Focuses on precision engagement capabilities',
        'Enhances fire control and targeting systems',
        'Supports testing and evaluation of ordnance',
        'Accelerates delivery of ordnance technologies'
      ],
      focus: ['Ordnance', 'Munitions', 'Weapons Systems', 'Precision Engagement']
    },
    {
      id: 'amtc',
      name: 'Advanced Manufacturing Technologies Consortium (AMTC)',
      logo: placeholderLogo,
      website: 'https://www.ati.org/industries-we-serve/advanced-materials-manufacturing',
      description: 'Focuses on advancing manufacturing technologies to enhance defense industrial capabilities.',
      details: [
        'Accelerates adoption of advanced manufacturing',
        'Develops digital engineering capabilities',
        'Supports industrial base modernization',
        'Integrates additive manufacturing technologies',
        'Enhances supply chain resilience'
      ],
      focus: ['Advanced Manufacturing', '3D Printing', 'Digital Engineering', 'Industrial Base']
    },
    {
      id: 'esc',
      name: 'Electromagnetic Spectrum Consortium (ESC)',
      logo: placeholderLogo,
      website: 'https://www.electromagnetic.org',
      description: 'Focuses on electromagnetic spectrum technologies and capabilities for defense and security applications.',
      details: [
        'Develops spectrum management technologies',
        'Enhances electronic warfare capabilities',
        'Supports electromagnetic spectrum operations',
        'Addresses spectrum sharing challenges',
        'Enables advanced RF technologies'
      ],
      focus: ['Electromagnetic Spectrum', 'Electronic Warfare', 'Communications', 'Sensors']
    },
    {
      id: 'nvtc',
      name: 'Naval Undersea Technology Consortium (NUTC)',
      logo: placeholderLogo,
      website: 'https://www.underseatech.org',
      description: 'Focuses on technologies and capabilities for naval undersea operations and systems.',
      details: [
        'Develops advanced undersea technologies',
        'Enhances submarine platforms and systems',
        'Supports anti-submarine warfare capabilities',
        'Develops unmanned undersea vehicles',
        'Accelerates undersea sensor technologies'
      ],
      focus: ['Undersea Technology', 'Sonar Systems', 'Submarine Technologies', 'UUVs']
    }
  ];

  const benefits = [
    'Speed, agility, and flexibility',
    'Collaborative and Competitive',
    'Facilitates networking and teaming among the membership',
    'Improved dialogue between government and consortium',
    'Significant non-traditional and small business participation in meaningful R&D',
    'Access to defense market opportunities',
    'Reduced barriers to entry for new technologies',
    'Streamlined contracting processes',
    'Direct engagement with government customers'
  ];

  const eligibility = [
    'U.S.-based organization',
    'Capability to perform research, development, or production',
    'Compliance with U.S. export control regulations',
    'Active SAM.gov registration',
    'Ability to obtain necessary security clearances'
  ];

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">Defense Consortiums</h1>
              <p className="text-xl text-gray-300">
                An innovative acquisition approach for Research & Development prototyping and limited production
              </p>
            </div>
            <a
              href="/add-consortium"
              className="inline-flex items-center px-6 py-3 bg-bhred text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add Consortium
            </a>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-bhred text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Key Advantages of Consortium Membership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <ArrowRight className="w-5 h-5 flex-shrink-0 mt-1" />
                <p className="text-lg">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Eligibility Section */}
      <div className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">General Eligibility Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eligibility.map((requirement, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Check className="w-5 h-5 flex-shrink-0 mt-1" />
                <p className="text-lg">{requirement}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Consortiums Filter section */}
      <div className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-bold mb-4 md:mb-0">Department of Defense Consortiums</h2>
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Find a consortium..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-bhred focus:border-bhred w-full md:w-64"
              />
            </div>
          </div>
        </div>
      </div>

        {/* Consortiums Grid */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {consortiums.map((consortium) => (
              <ConsortiumCard
                key={consortium.id}
                consortium={consortium}
                flipped={flippedCard === consortium.id}
                onFlip={handleFlip}
              />
            ))}
               </div>
          </div>
        </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join a Consortium?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Let us help you identify the right consortium for your technology and goals. Our advisors have deep experience with these organizations and can guide your engagement strategy.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://calendly.com/blackhaysgroup"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 bg-bhred text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Schedule a Consultation
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
            <a
              href="/add-consortium"
              className="inline-flex items-center justify-center px-8 py-3 border border-bhred text-bhred bg-transparent rounded-lg hover:bg-red-50 transition-colors"
            >
              Submit a Consortium
              <Rocket className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <Footer onAdminClick={handleAdminClick} />
      {showAdminPanel && <AdminPanel onClose={handleCloseAdminPanel} />}
    </div>
  );
};

export default ConsortiumsPage;
