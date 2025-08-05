import React, { useState } from 'react';
import { Anchor, Network, Shield, Lightbulb, Rocket, Target, Building, Users, ArrowRight, ExternalLink, ChevronDown, Award, BarChart3, Brain, FileText } from 'lucide-react';
import Footer from '../components/Footer';
import AdminPanel from '../components/AdminPanel';

const InnovationPage = () => {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleAdminClick = () => {
    setShowAdminPanel(true);
  };

  const handleCloseAdminPanel = () => {
    setShowAdminPanel(false);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const innovationPrograms = [
    {
      id: 'sbir',
      title: 'SBIR/STTR',
      description: 'Small Business Innovation Research (SBIR) and Small Business Technology Transfer (STTR) programs are competitive funding opportunities that enable small businesses to explore technological potential.',
      icon: Rocket,
      link: 'https://www.sbir.gov/',
      details: [
        'Non-dilutive funding up to $1.7M',
        'Retain IP rights',
        'Multiple phases for development',
        'Path to government contracts',
        'Dedicated funding across federal agencies'
      ]
    },
    {
      id: 'afwerx',
      title: 'AFWERX',
      description: 'AFWERX is the innovation arm of the Air Force and Space Force, connecting innovators across government, industry, and academia with Air Force and Space Force teams.',
      icon: Rocket,
      link: 'https://afwerx.com/',
      details: [
        'Direct connection to Air Force and Space Force',
        'Accelerator programs',
        'Challenge-based innovation',
        'Open topic solicitations',
        'Strategic funding initiatives'
      ]
    },
    {
      id: 'sofwerx',
      title: 'SOFWERX',
      description: 'SOFWERX creates and maintains a platform that accelerates delivery of innovative capabilities to USSOCOM and facilitates capability refinement through exploration, experimentation, and assessment.',
      icon: Shield,
      link: 'https://www.sofwerx.org/',
      details: [
        'Special Operations focused',
        'Rapid prototyping',
        'Technology experimentations',
        'Collaborative environments',
        'Direct SOF operator feedback'
      ]
    },
    {
      id: 'diu',
      title: 'Defense Innovation Unit (DIU)',
      description: 'DIU strengthens national security by accelerating the adoption of commercial technology throughout the military and growing the national security innovation base.',
      icon: Building,
      link: 'https://www.diu.mil/',
      details: [
        'Commercial Solutions Opening (CSO)',
        'Fast contract awards (60-90 days)',
        'Focus on AI, autonomy, cyber, space, and human systems',
        'Follow-on production contracts',
        'Silicon Valley, Boston, Austin, and DC presence'
      ]
       },
    {
      id: 'navalx',
      title: 'NavalX Tech Bridges',
      description: 'NavalX accelerates collaboration across the Department of the Navy through a network of regional Tech Bridges connecting industry, academia, and government.',
      icon: Anchor,
      link: 'https://www.secnav.navy.mil/agility/Pages/techbridges.aspx',
      details: [
        'National network of Tech Bridges',
        'Rapid prototyping and experimentation',
        'Collaboration with Navy experts and facilities',
        'Partnership opportunities with industry and academia',
        'Access to cooperative research and development agreements'
      ]
    },
    {
      id: 'nsin',
      title: 'National Security Innovation Network (NSIN)',
      description: 'NSIN builds communities of innovators to solve national security problems through hackathons, accelerators, and collaboration platforms.',
      icon: Network,
      link: 'https://www.nsin.mil/',
      details: [
        'Connects DoD with non-traditional innovators',
        'Programs like Hacking for Defense and Propel',
        'Problem-solving through hackathons and design sprints',
        'Regional innovation hubs across the US',
        'Supports venture acceleration and prototyping'
      ]
    },
    {
      id: 'xtech',
      title: 'Army xTechSearch',
      description: 'xTechSearch discovers and accelerates innovative technologies for Army modernization through prize competitions.',
      icon: Target,
      link: 'https://www.xtechsearch.army.mil/',
      details: [
        'Prize competitions for small businesses and startups',
        'Focus on Army modernization priorities',
        'Non-dilutive cash awards',
        'Opportunities for follow-on contracts',
        'Engagement with Army stakeholders'
      ]
    }
  ];

  const advisoryServices = [
    {
      title: 'Strategic Planning',
      description: 'We help you develop a comprehensive roadmap to navigate the complex government innovation ecosystem, identifying the right opportunities for your technology.',
      icon: Target
    },
    {
      title: 'Program Selection',
      description: 'Our experts match your technology to the most appropriate innovation programs across DoD, IC, and civilian agencies to maximize your chances of success.',
      icon: Award
    },
    {
      title: 'Proposal Development',
      description: 'We guide you through the intricate proposal process, ensuring your submissions emphasize the right elements that government evaluators are looking for.',
      icon: FileText
    },
    {
      title: 'Technology Transition',
      description: 'Our advisors help bridge the "valley of death" between successful prototypes and full-scale deployment within government programs.',
      icon: BarChart3
    }
  ];

  const faqs = [
    {
      question: 'Which innovation program is right for my company?',
      answer: "The right program depends on your technology, maturity level, and target customer within the government. Our advisors conduct a thorough assessment of your solution to recommend the most appropriate pathways, whether it's SBIR/STTR, Other Transaction Authorities (OTAs), or direct engagement with innovation hubs."
    },
    {
      question: 'How long does the government innovation process take?',
      answer: "Timelines vary by program. SBIR/STTR programs typically have defined submission windows and review periods of 3-4 months. DIU aims for contract awards within 60-90 days. Our team helps you understand realistic timelines and prepare accordingly to optimize your runway and planning."
    },
    {
      question: 'Do I need security clearances to work with defense innovation programs?',
      answer: "Not initially. Many innovation programs are specifically designed to engage with commercial companies that don't have clearances. As relationships develop and your technology advances toward deployment, clearance requirements may emerge. We help you navigate this process when the time comes."
    },
    {
      question: 'What makes a successful government innovation proposal?',
      answer: "Successful proposals clearly demonstrate understanding of the government need, technical feasibility, team capability, and realistic commercialization strategy. They balance technical detail with accessibility for non-specialist evaluators. Our advisors help you craft compelling narratives that address both explicit and implicit evaluation criteria."
    }
  ];

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Government Innovation & Advisory</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Connecting innovative technologies with government agencies through strategic advisory,
            program guidance, and deep expertise in AFWERX, SOFWERX, NavalX, NSIN,
            Army xTechSearch, DIU, and other defense innovation pathways.
          </p>
        </div>
      </div>

      {/* Innovation Overview */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Navigate the Government Innovation Ecosystem</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Government agencies are actively seeking innovative technologies through dedicated programs
              designed to accelerate adoption of commercial solutions to national security challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-50 rounded-lg p-8">
              <Lightbulb className="h-12 w-12 text-bhred mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Government Innovation?</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-bhred rounded-full mt-0.5 mr-3">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <p className="text-gray-700">Access to non-dilutive funding for R&D and product development</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-bhred rounded-full mt-0.5 mr-3">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <p className="text-gray-700">Potential for substantial follow-on contracts and scaling opportunities</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-bhred rounded-full mt-0.5 mr-3">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <p className="text-gray-700">Validation of technology through government testing and evaluation</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-bhred rounded-full mt-0.5 mr-3">
                    <span className="text-white text-sm font-bold">4</span>
                  </div>
                  <p className="text-gray-700">Build relationships with government technical experts and end-users</p>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <Brain className="h-12 w-12 text-bhred mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Approach</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-bhred rounded-full mt-0.5 mr-3">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <p className="text-gray-700">Assess your technology for government innovation fit</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-bhred rounded-full mt-0.5 mr-3">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <p className="text-gray-700">Match capabilities to the right government programs and customers</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-bhred rounded-full mt-0.5 mr-3">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <p className="text-gray-700">Develop winning strategies and compelling proposals</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-bhred rounded-full mt-0.5 mr-3">
                    <span className="text-white text-sm font-bold">4</span>
                  </div>
                  <p className="text-gray-700">Guide execution and navigate government relationship building</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Innovation Programs */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Key Government Innovation Programs</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Navigate these programs with confidence through our strategic advisory services
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {innovationPrograms.map((program) => (
              <div key={program.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <program.icon className="h-10 w-10 text-bhred" />
                    <h3 className="text-xl font-bold text-gray-900 ml-3">{program.title}</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{program.description}</p>
                  
                  <button 
                    className="flex items-center text-bhred hover:text-red-700 mb-4"
                    onClick={() => toggleSection(program.id)}
                  >
                    <span className="mr-1">Key Details</span>
                    <ChevronDown className={`h-4 w-4 transform transition-transform ${expandedSection === program.id ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedSection === program.id && (
                    <div className="mt-2 pl-2 border-l-2 border-gray-200">
                      <ul className="space-y-2">
                        {program.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-bhred rounded-full mt-1.5 mr-2"></div>
                            <span className="text-sm text-gray-600">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <a 
                      href={program.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-bhred hover:text-red-700"
                    >
                      Learn More
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advisory Services */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Innovation Advisory Services</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Expert guidance through the government innovation landscape
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {advisoryServices.map((service, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <service.icon className="h-8 w-8 text-bhred" />
                  <h3 className="text-xl font-bold text-gray-900 ml-3">{service.title}</h3>
                </div>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="https://calendly.com/blackhaysgroup"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-bhred text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Schedule a Consultation
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Common questions about government innovation programs
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Explore Government Innovation?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Let our experts help you navigate the complex landscape of government innovation programs and find the right path for your technology.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://calendly.com/blackhaysgroup"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-bhred text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Schedule a Consultation
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
            <a
              href="/add-innovation"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white bg-transparent rounded-lg hover:bg-white/10 transition-colors"
            >
              Submit an Innovation Organization
              <Lightbulb className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <Footer onAdminClick={handleAdminClick} />
      {showAdminPanel && <AdminPanel onClose={handleCloseAdminPanel} />}
    </div>
  );
};

export default InnovationPage;
