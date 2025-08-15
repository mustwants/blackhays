import React from 'react';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl';
import { MapPin, RefreshCw } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase, isConnected } from '../lib/supabaseClient';

type MapAdvisor = {
  id: string;
  name: string | null;
  professional_title: string | null;
  military_branch: string | null;
  about: string | null;
  lat: number | null;
  lng: number | null;
};

export default function ConsultantMap() {
  const [advisors, setAdvisors] = React.useState<MapAdvisor[]>([]);
  const [selected, setSelected] = React.useState<MapAdvisor | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [retryCount, setRetryCount] = React.useState(0);
  const maxRetries = 3;

  const fetchAdvisors = async () => {
    try {
      setLoading(true);

      // Be defensive: only call isConnected if it’s actually a function
      const ok = typeof isConnected === 'function' ? isConnected() : Boolean(supabase);
      if (!ok) throw new Error('Supabase not configured');

      const { data, error } = await supabase
        .from('advisor_applications')
        .select('id, full_name, professional_title, military_branch, about, lat, lng')
        .eq('status', 'approved');

      if (error) throw error;

      const list: MapAdvisor[] = (data ?? []).map((r: any) => ({
        id: r.id,
        name: r.full_name ?? null,
        professional_title: r.professional_title ?? null,
        military_branch: r.military_branch ?? null,
        about: r.about ?? null,
        lat: r.lat,
        lng: r.lng,
      }));

      setAdvisors(list.filter(a => a.lat != null && a.lng != null));
      setError(list.length === 0 ? 'No advisors found.' : null);
      setRetryCount(0);
    } catch (e: any) {
      console.error('Error loading advisors:', e);
      const msg = String(e?.message || e);
      const missing = msg.includes('404') || msg.includes('Not Found');
      if (!missing && retryCount < maxRetries) {
        setError(`Unable to load advisor data. Retrying... (${retryCount + 1}/${maxRetries})`);
        setRetryCount(c => c + 1);
        setTimeout(fetchAdvisors, 3000);
      } else {
        setError('Unable to load advisor data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { fetchAdvisors(); }, []);

  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
  if (!MAPBOX_TOKEN) {
    return <div className="h-[600px] flex items-center justify-center">Missing Mapbox token.</div>;
  }

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
      {error && (
        <div className="absolute top-4 left-4 right-4 z-10 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded flex items-center justify-between">
          <p>{error}</p>
          <button onClick={fetchAdvisors} className="inline-flex items-center bg-yellow-100 px-2 py-1 rounded">
            <RefreshCw className="w-4 h-4 mr-1" /> Retry
          </button>
        </div>
      )}
      <Map
        initialViewState={{ longitude: -95.7129, latitude: 37.0902, zoom: 3.5 }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        minZoom={2}
        maxZoom={15}
      >
        <NavigationControl position="top-right" />
        {advisors.map(a => (
          <Marker key={a.id} longitude={a.lng!} latitude={a.lat!} anchor="bottom" onClick={e => {
            e.originalEvent.stopPropagation();
            setSelected(a);
          }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg bg-blue-500 cursor-pointer">
              <MapPin className="w-5 h-5 text-white" />
            </div>
          </Marker>
        ))}
        {selected && (
          <Popup longitude={selected.lng!} latitude={selected.lat!} anchor="bottom" onClose={() => setSelected(null)} closeButton closeOnClick={false}>
            <div className="p-2">
              <h3 className="text-lg font-bold">{selected.name}</h3>
              {selected.professional_title && <p className="text-sm italic mb-1">{selected.professional_title}</p>}
              {selected.military_branch && <p className="text-sm mb-1"><strong>Branch:</strong> {selected.military_branch}</p>}
              {selected.about && <p className="text-sm">{selected.about}</p>}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}

