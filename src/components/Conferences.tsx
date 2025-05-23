import React from 'react';
import { Calendar, MapPin, Globe, ArrowRight } from 'lucide-react';

const Conferences = () => {
  const upcomingEvents = [
    {
      id: 'event-1',
      name: "Defense Innovation Summit 2025",
      start_date: "2025-06-15T00:00:00.000Z",
      end_date: "2025-06-17T00:00:00.000Z",
      location: "Washington, DC",
      description: "Annual gathering of defense technology leaders and innovators.",
      website: "https://example.com/dis2025"
    },
    {
      id: 'event-2',
      name: "Cyber Defense Expo",
      start_date: "2025-08-22T00:00:00.000Z", 
      end_date: "2025-08-24T00:00:00.000Z",
      location: "San Diego, CA",
      description: "Leading cybersecurity and defense technology exhibition.",
      website: "https://example.com/cde2025"
    }
  ];

  return (
    <div id="conferences" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-black sm:text-4xl">
            Upcoming Events
          </h2>
          <p className="mt-4 text-xl text-bhgray-600">
            Connect with industry leaders and stay updated on defense innovation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-bhgray-900 mb-2">
                  {event.name}
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-bhgray-600">
                    <Calendar className="w-5 h-5 mr-2" />
                    {new Date(event.start_date).toLocaleDateString()} - 
                    {new Date(event.end_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-bhgray-600">
                    <MapPin className="w-5 h-5 mr-2" />
                    {event.location}
                  </div>
                </div>
                <p className="text-bhgray-600 mb-6">
                  {event.description}
                </p>
                <a
                  href={event.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-bhred hover:text-red-700"
                >
                  <Globe className="w-4 h-4 mr-1" />
                  Visit Website
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="/events"
            className="inline-flex items-center px-6 py-3 bg-bhred text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            View All Events
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Conferences;