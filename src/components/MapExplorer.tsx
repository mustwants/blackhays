import React, { useState, useEffect, useRef } from 'react';
import Map, { Marker, Popup, NavigationControl, ScaleControl, Source, Layer } from 'react-map-gl';
import { Search, Filter, Layers, MapPin, Users, Building, Rocket, Calendar, Lightbulb } from 'lucide-react';
import { mapService, type MapEntity } from '../services/mapService';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapExplorer {
  id: string;
  name: string;
  type: 'advisor' | 'company' | 'consortium' | 'innovation' | 'event';
  description?: string;
  location: [number, number];
  address?: string;
  website?: string;
  details?: Record<string, any>;
}

const typeIcons = {
  advisor: Users,
  company: Building,
  consortium: Rocket,
  innovation: Lightbulb,
  event: Calendar,
};

const typeColors = {
  advisor: '#3b82f6', // blue
  company: '#16a34a', // green
  consortium: '#9333ea', // purple
  innovation: '#f59e0b', // amber
  event: '#ef4444', // red
};

const MapExplorer = () => {
  const [entities, setEntities] = useState<MapEntity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<MapEntity | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewState, setViewState] = useState({
    longitude: -95.7129,
    latitude: 37.0902,
    zoom: 3.5
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    advisor: true,
    company: true,
    consortium: true,
    innovation: true,
    event: true
  });
  const [showFilters, setShowFilters] = useState(false);

  const mapRef = useRef(null);
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setLoading(true);
        const data = await mapService.getAllEntities();
        setEntities(data);
        if (data.length === 0) {
          setError('No locations found. Please check back later.');
        }
      } catch (err) {
        console.error('Error loading map data:', err);
        setError('Unable to load map data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  // Filter entities based on search and filters
  const filteredEntities = entities.filter(entity => {
    if (!filters[entity.type]) return false;
    if (searchTerm && !entity.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const toggleFilter = (type: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-red-600">Map configuration error. Please contact support.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-13rem)]">
      {/* Search and Filter Controls */}
      <div className="absolute top-4 left-4 z-10 w-80 bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search the map..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-bhred focus:border-bhred"
            />
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-gray-700 hover:text-bhred"
            >
              <Filter className="w-4 h-4 mr-1" />
              Filters
            </button>
          </div>
          
          {showFilters && (
            <div className="bg-gray-50 p-3 rounded-lg mt-2 space-y-2">
              <div className="text-sm font-medium text-gray-700 mb-2">Show on map:</div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(filters).map(([type, enabled]) => {
                  const Icon = typeIcons[type as keyof typeof typeIcons];
                  return (
                    <button
                      key={type}
                      onClick={() => toggleFilter(type as keyof typeof filters)}
                      className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                        enabled 
                          ? `bg-${type === 'advisor' ? 'blue' : type === 'company' ? 'green' : type === 'consortium' ? 'purple' : type === 'innovation' ? 'amber' : 'red'}-100 text-${type === 'advisor' ? 'blue' : type === 'company' ? 'green' : type === 'consortium' ? 'purple' : type === 'innovation' ? 'amber' : 'red'}-800 border border-${type === 'advisor' ? 'blue' : type === 'company' ? 'green' : type === 'consortium' ? 'purple' : type === 'innovation' ? 'amber' : 'red'}-200`
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="w-4 h-4 mr-2" />
                        <span className="capitalize">{type}s</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="absolute top-4 left-4 right-4 z-10 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bhred"></div>
            <p className="mt-2">Loading map data...</p>
          </div>
        </div>
      )}

      <Map
        {...viewState}
        ref={mapRef}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        minZoom={2}
        maxZoom={15}
      >
        <NavigationControl position="top-right" />
        <ScaleControl position="bottom-right" />

        {filteredEntities.map(entity => (
          <Marker
            key={entity.id}
            longitude={entity.location[0]}
            latitude={entity.location[1]}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setSelectedEntity(entity);
            }}
          >
            <div className="relative group cursor-pointer">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform shadow-lg"
                style={{ backgroundColor: typeColors[entity.type] }}
              >
                {React.createElement(typeIcons[entity.type], { 
                  className: "w-5 h-5 text-white"
                })}
              </div>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap bg-black bg-opacity-75 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {entity.name}
              </div>
            </div>
          </Marker>
        ))}

        {selectedEntity && (
          <Popup
            longitude={selectedEntity.location[0]}
            latitude={selectedEntity.location[1]}
            anchor="bottom"
            onClose={() => setSelectedEntity(null)}
            closeButton={true}
            closeOnClick={false}
            className="max-w-sm"
          >
            <div className="p-3">
              <h3 className="text-lg font-bold text-bhgray-900">{selectedEntity.name}</h3>
              <p className="text-sm text-gray-600 capitalize mb-2">{selectedEntity.type}</p>
              {selectedEntity.description && (
                <p className="text-sm text-gray-700 mb-2">{selectedEntity.description}</p>
              )}
              {selectedEntity.website && (
                <a
                  href={selectedEntity.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-bhred hover:text-red-700"
                >
                  Visit Website
                </a>
              )}
            </div>
          </Popup>
        )}
      </Map>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-white p-3 rounded-lg shadow-lg">
        <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <Layers className="w-4 h-4 mr-2" />
          Map Legend
        </div>
        <div className="space-y-2">
          {Object.entries(typeIcons).map(([type]) => (
            <div key={type} className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: typeColors[type as keyof typeof typeColors] }}
              ></div>
              <span className="text-xs text-gray-600 capitalize">{type}s</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapExplorer;