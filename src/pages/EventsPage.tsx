import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Globe, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import AdminPanel from '../components/AdminPanel';
import { supabase } from '../lib/supabaseClient';
import EventMap from '../components/EventMap';
import EventCalendar from '../components/EventCalendar';
import EventDetailModal, { EventInfo } from '../components/EventDetailModal';

const EventsPage = () => {
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
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Get approved events from both tables
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
      
      // Handle errors in both requests
      if (approvedSubmissionsResult.error) {
        console.error("Error fetching approved submissions:", approvedSubmissionsResult.error);
      }
      
      if (eventsResult.error) {
        console.error("Error fetching events:", eventsResult.error);
      }
      
      let allEvents: EventInfo[] = [];
      
      // Add approved submissions
      if (approvedSubmissionsResult.data) {
        allEvents = [...allEvents, ...(approvedSubmissionsResult.data as EventInfo[])];
      }
      
      // Add events
      if (eventsResult.data) {
        allEvents = [...allEvents, ...(eventsResult.data as EventInfo[])];
      }
      
      // Remove duplicates
      const uniqueMap = new Map();
      allEvents.forEach(event => {
        const key = `${event.name}|${event.start_date}|${event.location}`;
        uniqueMap.set(key, event);
      });
      
      const uniqueEvents = Array.from(uniqueMap.values());
      
      // Sort by start date
      uniqueEvents.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
      
      // Filter out past events
      const now = new Date();
      const futureEvents = uniqueEvents.filter(event => new Date(event.start_date) >= now);
      
      setEvents(futureEvents);
      
      if (futureEvents.length === 0) {
        setError("No upcoming events found.");
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminClick = () => {
    setShowAdminPanel(true);
  };

  const handleCloseAdminPanel = () => {
    setShowAdminPanel(false);
    // Refresh events after closing admin panel
    fetchEvents();
  };

  // Filter events based on search term
  const filteredEvents = events.filter(event => 
    event.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    event.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Defense & Intelligence Events</h1>
          <p className="text-xl text-gray-300">
            Stay connected with the latest conferences, summits, and networking opportunities
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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

      {/* Events Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bhred mx-auto"></div>
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
                        {new Date(event.start_date).toLocaleDateString()} -
                        {new Date(event.end_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-bhgray-600">
                        <MapPin className="w-5 h-5 mr-2" />
                        {event.location}
                      </div>
                    {event.about && (
                      <p className="text-bhgray-600 mb-6">
                        {event.about}
                      </p>
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
              {searchTerm ? 'No events found matching your search.' : 'No upcoming events found.'}
            </p>
          </div>
        )}
      </div>

      <Footer onAdminClick={handleAdminClick} />
      {showAdminPanel && <AdminPanel onClose={handleCloseAdminPanel} />}
    </div>
  );
};

export default EventsPage;
