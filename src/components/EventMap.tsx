import React, { useMemo, useState } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import { Calendar } from 'lucide-react';
import { LocationService } from '../lib/locationService';
import 'mapbox-gl/dist/mapbox-gl.css';
import { EventInfo } from './EventDetailModal';

interface Props {
  events: EventInfo[];
  onSelectEvent: (event: EventInfo) => void;
}

const EventMap: React.FC<Props> = ({ events, onSelectEvent }) => {
  const [viewState, setViewState] = useState({
    longitude: -95.7129,
    latitude: 37.0902,
    zoom: 3.5,
  });

  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  const eventsWithCoords = useMemo(
    () =>
      events.map((e) => ({
        ...e,
        coords: LocationService.getCoordinatesFromAddress(e.location),
      })),
    [events]
  );

  if (!MAPBOX_TOKEN) {
    return (
      <div className="relative w-full h-[600px] bg-bhgray-100 rounded-lg flex items-center justify-center">
        <p className="text-red-600">Map configuration error. Please contact support.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        minZoom={2}
        maxZoom={15}
      >
        <NavigationControl position="top-right" />
        {eventsWithCoords.map((event) => (
          <Marker
            key={event.id}
            longitude={event.coords.lng}
            latitude={event.coords.lat}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              onSelectEvent(event);
            }}
          >
            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg transform hover:scale-110 transition-transform cursor-pointer">
              <Calendar className="w-4 h-4" />
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
};

export default EventMap;
