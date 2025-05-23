import React, { useState } from 'react';
import { Clock, MessageCircle, Target, ArrowRight, Shield } from 'lucide-react';

const Mission = () => {
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const [hoveredTip, setHoveredTip] = useState<string | null>(null);

  const cards = [
    {
      id: 'time',
      title: 'Right Time',
      subtitle: 'Strategic timing saves time and money.',
      icon: Clock,
      description: 'We understand that saving time and money is critical. Timing your engagement strategically can save you thousands.',
      tip: 'Did you know federal budget cycles can impact funding availability?',
      stats: [
        { label: 'Average Time Saved', value: '6-8 months' },
        { label: 'Cost Reduction', value: '40-60%' }
      ],
      backContent: {
        title: 'Strategic Timing',
        points: [
          'Align with federal budget cycles',
          'Optimize proposal submissions',
          'Maximize funding opportunities',
          'Reduce time-to-market'
        ]
      }
    },
    {
      id: 'message',
      title: 'Right Message',
      subtitle: 'Tailored messaging that aligns with leadership.',
      icon: MessageCircle,
      description: 'With over 400 years of combined experience, we ensure your messaging resonates with the Administration, Hill Members, and leadership.',
      tip: 'Clear alignment with leadership priorities can improve your success rate by 20%.',
      stats: [
        { label: 'Combined Experience', value: '400+ years' },
        { label: 'Success Rate', value: '85%' }
      ],
      backContent: {
        title: 'Message Development',
        points: [
          'Leadership alignment strategies',
          'Value proposition refinement',
          'Stakeholder communication',
          'Impact demonstration'
        ]
      }
    },
    {
      id: 'approach',
      title: 'Right Approach',
      subtitle: 'Beyond SBIRs: Teaming, partnering, and collaboration.',
      icon: Target,
      description: "It's not just about SBIRs or RFPs. It's about teaming, partnering, and creating pathways to engage effectively with prime vendors.",
      tip: 'Teaming with prime vendors often requires early engagement in program planning.',
      stats: [
        { label: 'Partner Network', value: '500+' },
        { label: 'Active Projects', value: '50+' }
      ],
      backContent: {
        title: 'Strategic Approach',
        points: [
          'Prime vendor partnerships',
          'SBIR/STTR optimization',
          'Contract vehicle selection',
          'Technology transition planning'
        ]
      }
    }
  ];

  return (
    <div id="what-we-do" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-black sm:text-4xl md:text-5xl">
            Our Mission
          </h2>
          <p className="mt-4 text-xl text-bhgray-600 max-w-3xl mx-auto">
            Identifying Right Time, Right Message, to the customer with proven methodologies and expert guidance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div
              key={card.id}
              className="h-[500px] perspective-1000"
              onClick={() => setFlippedCard(flippedCard === card.id ? null : card.id)}
            >
              <div
                className={`relative w-full h-full transition-all duration-700 preserve-3d ${
                  flippedCard === card.id ? 'rotate-y-180' : ''
                }`}
              >
                {/* Front of card */}
                <div className="absolute inset-0 bg-gradient-to-br from-black to-bhred rounded-xl p-8 backface-hidden flex flex-col">
                  <div className="flex items-center mb-4">
                    <card.icon className="w-10 h-10 text-white" />
                    <h3 className="text-2xl font-bold text-white ml-4">{card.title}</h3>
                  </div>
                  
                  <p className="text-white/80 text-lg mb-4">{card.subtitle}</p>
                  
                  <div className="flex-grow">
                    <p className="text-white/90 text-base leading-relaxed">{card.description}</p>
                  </div>

                  <div className="mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      {card.stats.map((stat, index) => (
                        <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <div className="text-white/60 text-xs">{stat.label}</div>
                          <div className="text-white font-bold text-lg">{stat.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div 
                    className="absolute top-4 right-4"
                    onMouseEnter={() => setHoveredTip(card.id)}
                    onMouseLeave={() => setHoveredTip(null)}
                  >
                    <Shield className="w-6 h-6 text-white/40 hover:text-white transition-colors" />
                    
                    {hoveredTip === card.id && (
                      <div className="absolute top-full right-0 mt-2 w-64 p-4 bg-white rounded-lg shadow-lg text-sm text-bhgray-700 z-10">
                        {card.tip}
                      </div>
                    )}
                  </div>
                </div>

                {/* Back of card */}
                <div className="absolute inset-0 bg-white rounded-xl p-8 rotate-y-180 backface-hidden flex flex-col">
                  <h4 className="text-xl font-bold text-bhgray-900 mb-6">{card.backContent.title}</h4>
                  
                  <div className="flex-grow space-y-4">
                    {card.backContent.points.map((point, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-bhred rounded-full mr-3 flex-shrink-0" />
                        <p className="text-bhgray-600">{point}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <a
                      href="https://calendly.com/blackhaysgroup"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full px-4 py-2 bg-bhred text-white rounded-lg hover:bg-red-700 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Schedule Consultation
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mission;