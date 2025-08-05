import React from 'react';
import { Calendar, MapPin, Globe, X } from 'lucide-react';
import { format } from 'date-fns';

export interface EventInfo {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  location: string;
  website?: string;
  about?: string;
  logo_url?: string;
}

interface Props {
  event: EventInfo;
  onClose: () => void;
}

const EventDetailModal: React.FC<Props> = ({ event, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
        {event.logo_url && (
          <img
            src={event.logo_url}
            alt={`${event.name} logo`}
            className="h-24 w-full object-contain mb-4"
          />
        )}
        <h3 className="text-2xl font-bold text-bhgray-900 mb-2">{event.name}</h3>
        <div className="space-y-2 mb-4 text-bhgray-600">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            {format(new Date(event.start_date), 'MM/dd/yyyy')} - {format(new Date(event.end_date), 'MM/dd/yyyy')}
          </div>
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            {event.location}
          </div>
        </div>
        {event.about && (
          <p className="text-bhgray-700 mb-4">{event.about}</p>
        )}
        {event.website && (
          <a
            href={event.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-bhred hover:text-red-700"
          >
            <Globe className="w-4 h-4 mr-1" />
            Visit Website
          </a>
        )}
      </div>
    </div>
  );
};

export default EventDetailModal;
