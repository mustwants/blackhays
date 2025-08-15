import React, { useEffect, useRef, useState } from 'react';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl';
import { MapPin, RefreshCw } from 'lucide-react';
import { supabase, isConnected } from '../lib/supabaseClient';
import 'mapbox-gl/dist/mapbox-gl.css';

type Advisor = {
  id: string;
  full_name?: string | null;
  professional_title?: string | null;
  military_branch?: string | null;
  about?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  lat?: number | null;
  lng?: number | null;
};

export default function ConsultantMap() {
  const [selected, setSelected] = useState<Advisor | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const [viewState, setViewState] = useState({
    longitude: -95.7129,
    latitude: 37.0902,
    zoom: 3.5,
  });
  const mapRef = useRef<any>(null);

  const fetchAdvisors = async () => {
    try {
      setLoading(true);

      if (!isConnected()) throw new Error('Supabase is not configured');

      const { data, error } = await supabase
        .from('advisor_applications')
        .select('id, full_name, professional_title, military_branch, about, city, state, country, lat, lng')
        .eq('status', 'approved');

      if (error) throw error;

      setAdvisors(data ?? []);
      setError(data && data.length === 0 ? 'No advisors found.' : null);
      setRetryCount(0);
    } catch (err: any) {
      console.error('Error loading advisors:', err);
      const msg = String(err?.message ?? err);
      const missing = msg.includes('404') || msg.includes('Not Found');

      if (!missing && retryCount < maxRetries) {
        setError(`Unable to load advisor data. Retrying... (${retryCount + 1}/${maxRetries})`);
        setRetryCount((n) => n + 1);
        setTimeout(fetchAdvisors, 3000);
      } else {
        setError('Unable to load advisor data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdvisors(); }, []);

  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
  if (!MAPBOX_TOKEN) {
    return (
      <div className="relative w-full h-[600px] bg-bhgray-100 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-red-600">Map configuration error. Missing VITE_MAPBOX_TOKEN.</p>
        </div>
      </div>
    );
  }

  const handleRetry = () => {
    setRetryCount(0);
    setError(null);
    fetchAdvisors();
  };

  return (
    <div className="relative w-full h-[600px] bg-bhgray-100 rounded-lg overflow-hidden">
      {error && (
        <div className="absolute top-4 left-4 right-4 z-10 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded flex items-center justify-between">
          <p>{error}</p>
          <div className="flex gap-2">
            <button
              onClick={handleRetry}
              className="inline-flex items-center text-yellow-800 hover:text-yellow-900 bg-yellow-100 hover:bg-yellow-200 px-2 py-1 rounded"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Retry
            </button>
            <button onClick={() => setError(null)} className="text-yellow-600 hover:text-yellow-800">×</button>
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bhred mx-auto"></div>
            <p className="mt-2 text-gray-700">Loading advisor locations...</p>
          </div>
        </div>
      )}

      <Map
        {...viewState}
        ref={mapRef}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        minZoom={2}
        maxZoom={15}
      >
        <NavigationControl position="top-right" />

        {advisors
          .filter(a => typeof a.lat === 'number' && typeof a.lng === 'number')
          .map(a => (
            <Marker
              key={a.id}
              longitude={a.lng as number}
              latitude={a.lat as number}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelected(a);
              }}
            >
              <div className="relative group cursor-pointer">
                <div className="w-8 h-8 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform shadow-lg bg-blue-500">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-black/75 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {a.full_name || 'Advisor'}
                </div>
              </div>
            </Marker>
          ))}

        {selected && (
          <Popup
            longitude={selected.lng as number}
            latitude={selected.lat as number}
            anchor="bottom"
            onClose={() => setSelected(null)}
            closeButton
            closeOnClick={false}
            className="max-w-sm"
          >
            <div className="p-2">
              <h3 className="text-lg font-bold text-bhgray-900">{selected.full_name || 'Advisor'}</h3>
              {selected.professional_title && <p className="text-sm text-bhgray-600 italic mb-2">{selected.professional_title}</p>}
              {selected.military_branch && <p className="text-sm text-bhgray-600 mb-2"><strong>Branch:</strong> {selected.military_branch}</p>}
              {selected.about && <p className="text-sm text-bhgray-700 line-clamp-3">{selected.about}</p>}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}

