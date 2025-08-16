// src/components/ConsultantMap.tsx
import React from 'react';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl';
import { MapPin, RefreshCw } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

import { advisorService, Advisor } from '../services/advisors';
import { isConnected } from '../lib/supabaseClient';

export default function ConsultantMap() {
  const [selectedAdvisor, setSelectedAdvisor] = React.useState<Advisor | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [viewState, setViewState] = React.useState({
    longitude: -95.7129,
    latitude: 37.0902,
    zoom: 3.5,
  });
  const [advisors, setAdvisors] = React.useState<Advisor[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [retryCount, setRetryCount] = React.useState(0);
  const maxRetries = 3;
  const [mapLoaded, setMapLoaded] = React.useState(false);

  const fetchAdvisors = async () => {
    try {
      setLoading(true);

      if (!isConnected) {
        setError('Database connection unavailable. Please try again later.');
        return;
      }

      const data = await advisorService.getApprovedAdvisors();
      setAdvisors(data);
      setError(data.length === 0 ? 'No advisors found. Please check back later.' : null);
      setRetryCount(0);
    } catch (err) {
      console.error('Error loading advisors:', err);
      if (retryCount < maxRetries) {
        setError(`Unable to load advisor data. Retrying... (${retryCount + 1}/${maxRetries})`);
        setRetryCount((prev) => prev + 1);
        setTimeout(fetchAdvisors, 3000);
      } else {
        setError('Unable to load advisor data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAdvisors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
  if (!MAPBOX_TOKEN) {
    return (
      <div className="relative w-full h-[600px] bg-bhgray-100 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-red-600">Map configuration error. Please contact support.</p>
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
            <button onClick={() => setError(null)} className="text-yellow-600 hover:text-yellow-800">
              <span className="sr-only">Dismiss</span>×
            </button>
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
        onLoad={() => setMapLoaded(true)}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        minZoom={2}
        maxZoom={15}
      >
        <NavigationControl position="top-right" />

        {mapLoaded &&
          advisors
            .filter((a) => Array.isArray(a.location) && a.location.length === 2)
            .map((advisor) => {
              const [lng, lat] = advisor.location as [number, number];
              return (
                <Marker
                  key={advisor.id}
                  longitude={lng}
                  latitude={lat}
                  anchor="bottom"
                  onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    setSelectedAdvisor(advisor);
                  }}
                >
                  <div className="relative group cursor-pointer">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform shadow-lg bg-blue-500">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap bg-black/75 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {advisor.name}
                    </div>
                  </div>
                </Marker>
              );
            })}

        {selectedAdvisor && Array.isArray(selectedAdvisor.location) && (
          <Popup
            longitude={(selectedAdvisor.location as [number, number])[0]}
            latitude={(selectedAdvisor.location as [number, number])[1]}
            anchor="bottom"
            onClose={() => setSelectedAdvisor(null)}
            closeButton
            closeOnClick={false}
            className="max-w-sm"
          >
            <div className="p-2">
              <h3 className="text-lg font-bold text-bhgray-900">{selectedAdvisor.name}</h3>
              {selectedAdvisor.professional_title && (
                <p className="text-sm text-bhgray-600 italic mb-2">
                  {selectedAdvisor.professional_title}
                </p>
              )}
              {selectedAdvisor.military_branch && (
                <p className="text-sm text-bhgray-600 mb-2">
                  <strong>Branch:</strong> {selectedAdvisor.military_branch}
                </p>
              )}
              <p className="text-sm text-bhgray-700 line-clamp-3">{selectedAdvisor.about}</p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}


