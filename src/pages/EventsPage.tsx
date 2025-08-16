import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Globe, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import AdminPanel from '../components/AdminPanel';
import { supabase } from '../lib/supabaseClient';
import EventMap from '../components/EventMap';
import EventCalendar from '../components/EventCalendar';
import EventDetailModal, { EventInfo } from '../components/EventDetailModal';

const EventsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [events, setEvents] = useState<EventInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map' | 'calendar'>('list');
  const [selectedEvent, setSelectedEvent] = useState<EventInfo | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Pull from both sources; show approved submissions + curated events
      const [approvedSubmissionsResult, eventsResult] = await Promise.all([
        supabase
          .from('event_submissions')
          .select('*')
          .eq('status', 'approved')
          .order('start_date', { ascending: true }),
        supabase
          .from('events')
          .select('*')
          .order('start_date', { ascending: true })
      ]);

      if (approvedSubmissionsResult.error) {
        console.error('Error fetching approved submissions:', approvedSubmissionsResult.error);
      }
      if (eventsResult.error) {
        console.error('Error fetching events:', eventsResult.error);
      }

      let allEvents: EventInfo[] = [];
      if (approvedSubmissionsResult.data) {
        allEvents = allEvents.concat(approvedSubmissionsResult.data as EventInfo[]);
      }
      if (eventsResult.data) {
        allEvents = allEvents.concat(eventsResult.data as EventInfo[]);
      }

      // De-dupe by name + start_date + location
      const uniqueMap = new Map<string, EventInfo>();
      for (const ev of allEvents) {
        const key = `${(ev.name ?? '').trim()}|${ev.start_date ?? ''}|${(ev.location ?? '').trim()}`;
        if (!uniqueMap.has(key)) uniqueMap.set(key, ev);
      }
      const uniqueEvents = Array.from(uniqueMap.values());

      // Sort ascending by start date
      uniqueEvents.sort(
        (a, b) =>
          new Date(a.start_date ?? '').getTime() - new Date(b.start_date ?? '').getTime()
      );

      // Only show upcoming
      const now = Date.now();
      const futureEvents = uniqueEvents.filter(
        (ev) => new Date(ev.start_date ?? '').getTime() >= now
      );

      setEvents(futureEvents);
      setError(futureEvents.length === 0 ? 'No upcoming events found.' : null);
    } catch (e) {
      console.error('Error fetching events:', e);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminClick = () => setShowAdminPanel(true);
  const handleCloseAdminPanel = () => {
    setShowAdminPanel(false);
    fetchEvents();
  };

  const filteredEvents = events.filter((ev) => {
    const q = searchTerm.toLowerCase();
    return (
      (ev.name ?? '').toLowerCase().includes(q) ||
      (ev.location ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Defense & Intelligence Events</h1>
          <p className="text-xl text-gray-300">
            Stay connected with the latest conferences, summits, and networking opportunities
          </p>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-bhred focus:border-bhred"
              />
            </div>
            <button
              onClick={() => navigate('/submit-event')}
              className="inline-flex items-center px-4 py-2 bg-bhred text-white rounded-lg hover:bg-red-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Submit Event
            </button>
          </div>

          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg border ${
                viewMode === 'list'
                  ? 'bg-bhred text-white border-bhred'
                  : 'bg-white text-gray-700'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-lg border ${
                viewMode === 'map'
                  ? 'bg-bhred text-white border-bhred'
                  : 'bg-white text-gray-700'
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg border ${
                viewMode === 'calendar'
                  ? 'bg-bhred text-white border-bhred'
                  : 'bg-white text-gray-700'
              }`}
            >
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bhred mx-auto" />
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          viewMode === 'list' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => (
                <div
                  key={`${event.id}-${index}`}
                  onClick={() => setSelectedEvent(event)}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                >
                  <div className="p-6">
                    {event.logo_url && (
                      <img
                        src={event.logo_url}
                        alt={`${event.name} logo`}
                        className="h-24 w-full object-contain mb-4"
                      />
                    )}
                    <h3 className="text-xl font-bold text-bhgray-900 mb-2">
                      {event.name}
                    </h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-bhgray-600">
                        <Calendar className="w-5 h-5 mr-2" />
                        {new Date(event.start_date).toLocaleDateString()} –{' '}
                        {new Date(event.end_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-bhgray-600">
                        <MapPin className="w-5 h-5 mr-2" />
                        {event.location}
                      </div>
                      {event.about && (
                        <p className="text-bhgray-600 mb-6">{event.about}</p>
                      )}
                      {event.website && (
                        <a
                          href={event.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-bhred hover:text-red-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Globe className="w-4 h-4 mr-1" />
                          Visit Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : viewMode === 'map' ? (
            <EventMap events={filteredEvents} onSelectEvent={setSelectedEvent} />
          ) : (
            <EventCalendar events={filteredEvents} onSelectEvent={setSelectedEvent} />
          )
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {searchTerm
                ? 'No events found matching your search.'
                : 'No upcoming events found.'}
            </p>
          </div>
        )}
      </div>

      <Footer onAdminClick={handleAdminClick} />

      {showAdminPanel && <AdminPanel onClose={handleCloseAdminPanel} />}

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default EventsPage;
