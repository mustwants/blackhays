import { useState, useEffect } from 'react';
import { eventService, Event, EventSubmission } from '../services/events';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await eventService.getEvents();
      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitEvent = async (submission: Omit<EventSubmission, 'status'>): Promise<{ data: EventSubmission | null; error: Error | null }> => {
    try {
      const { data, error } = await eventService.submitEvent(submission);
      if (error) throw error;
      await fetchEvents(); // Refresh events list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  };

  const deleteEvent = async (id: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await eventService.deleteEvent(id);
      if (error) throw error;
      await fetchEvents(); // Refresh events list
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const updateEventStatus = async (id: string, status: 'approved' | 'rejected' | 'paused'): Promise<{ error: Error | null }> => {
    try {
      const { error } = await eventService.updateEventStatus(id, status);
      if (error) throw error;
      await fetchEvents(); // Refresh events list
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  return {
    events,
    isLoading,
    error,
    submitEvent,
    deleteEvent,
    updateEventStatus,
    refreshEvents: fetchEvents
  };
}