import React from 'react';
import { Globe } from 'lucide-react';
import { Consortium } from '../types/consortium';

interface ConsortiumCardProps {
  consortium: Consortium;
  flipped: boolean;
  onFlip: (id: string) => void;
}

const ConsortiumCard: React.FC<ConsortiumCardProps> = ({ consortium, flipped, onFlip }) => {
  return (
    <div
      className="h-[420px] perspective-1000"
      onClick={() => onFlip(consortium.id)}
    >
      <div
        className={`relative w-full h-full transition-all duration-700 preserve-3d ${flipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front */}
        <div className="absolute inset-0 bg-white rounded-lg shadow-lg p-6 backface-hidden flex flex-col">
          <div className="flex items-center mb-4">
            <img
              src={consortium.logo}
              alt={`${consortium.name} logo`}
              className="w-16 h-16 object-contain"
              onError={(e) => {
                e.currentTarget.src = '/BHfullblack.png';
              }}
            />
            <h3 className="text-xl font-bold ml-4">{consortium.name}</h3>
          </div>
          <p className="text-gray-600 mb-4 flex-grow">{consortium.description}</p>
          <div className="flex flex-wrap gap-2 mt-auto">
            {consortium.focus.map((area) => (
              <span
                key={area}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 bg-white rounded-lg shadow-lg p-6 rotate-y-180 backface-hidden flex flex-col">
          <h4 className="text-lg font-semibold mb-4">Key Features</h4>
          <div className="flex-grow space-y-2 overflow-y-auto">
            {consortium.details.map((detail, index) => (
              <div key={index} className="flex items-start">
                <div className="w-2 h-2 bg-bhred rounded-full mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">{detail}</p>
              </div>
            ))}
          </div>
          <a
            href={consortium.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-bhred hover:text-red-700 mt-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Globe className="w-4 h-4 mr-2" />
            Visit Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default ConsortiumCard;
