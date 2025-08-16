// src/hooks/useEvents.ts
import { useEffect, useState, useCallback } from 'react';
import { eventsService } from '../services/events'; // NOTE: plural export

export type { Event, EventSubmission } from '../services/events';

type State<T> = {
  data: T;
  loading: boolean;
  error: string | null;
};

export function useEvents() {
  const [state, setState] = useState<State<Awaited<ReturnType<typeof eventsService.getEvents>>>>({
    data: [],
    loading: true,
    error: null,
  });

  const load = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const data = await eventsService.getEvents();
      setState({ data, loading: false, error: null });
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? 'Failed to load events';
      setState({ data: [], loading: false, error: msg });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    events: state.data,
    loading: state.loading,
    error: state.error,
    refresh: load,
  };
}
