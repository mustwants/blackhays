import React, { useState } from 'react';
import MapExplorer from '../components/MapExplorer';
import Footer from '../components/Footer';
import { MapPin, Search, Filter, Layers, Database, Users, Calendar, Building, Rocket, Brain } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapPage = () => {
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  console.log(
    'MAPBOX_TOKEN? ',
    typeof import.meta.env.VITE_MAPBOX_TOKEN === 'string' &&
      import.meta.env.VITE_MAPBOX_TOKEN.startsWith('pk.')
  );

  return (
    <div className="pt-20 min-h-screen bg-white flex flex-col">
      <div className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Defense Innovation Map</h1>
          <p className="text-gray-300 max-w-3xl">
            Explore the defense innovation ecosystem across the United States. Find advisors, companies,
            consortiums, innovation labs, and upcoming events.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center bg-gray-800 rounded-full py-1 px-3 text-sm">
              <MapPin className="w-4 h-4 mr-1 text-bhred" />
              <span>400+ Locations</span>
            </div>
            <div className="flex items-center bg-gray-800 rounded-full py-1 px-3 text-sm">
              <Search className="w-4 h-4 mr-1 text-bhred" />
              <span>Search & Filter</span>
            </div>
            <div className="flex items-center bg-gray-800 rounded-full py-1 px-3 text-sm">
              <Filter className="w-4 h-4 mr-1 text-bhred" />
              <span>Multiple Categories</span>
            </div>
            <div className="flex items-center bg-gray-800 rounded-full py-1 px-3 text-sm">
              <Layers className="w-4 h-4 mr-1 text-bhred" />
              <span>Detailed Information</span>
            </div>
            <div className="flex items-center bg-gray-800 rounded-full py-1 px-3 text-sm">
              <Database className="w-4 h-4 mr-1 text-bhred" />
              <span>Constantly Updated</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-4 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3">
            <a href="/apply" className="flex items-center px-4 py-2 bg-bhred text-white rounded-lg hover:bg-red-700 transition-colors">
              <Users className="w-4 h-4 mr-2" />
              Add Advisor
            </a>
            <a href="/add-company" className="flex items-center px-4 py-2 bg-bhred text-white rounded-lg hover:bg-red-700 transition-colors">
              <Building className="w-4 h-4 mr-2" />
              Add Company
            </a>
            <a href="/add-consortium" className="flex items-center px-4 py-2 bg-bhred text-white rounded-lg hover:bg-red-700 transition-colors">
              <Rocket className="w-4 h-4 mr-2" />
              Add Consortium
            </a>
            <a href="/add-innovation" className="flex items-center px-4 py-2 bg-bhred text-white rounded-lg hover:bg-red-700 transition-colors">
              <Brain className="w-4 h-4 mr-2" />
              Add Innovation Org/Lab
            </a>
            <a href="/submit-event" className="flex items-center px-4 py-2 bg-bhred text-white rounded-lg hover:bg-red-700 transition-colors">
              <Calendar className="w-4 h-4 mr-2" />
              Add Event
            </a>
          </div>
        </div>
      </div>

      <div className="flex-grow">
        <MapExplorer />
      </div>

      {/* Temporarily disable AdminPanel to avoid password-login errors */}
      <Footer onAdminClick={() => { /* disabled for now */ }} />
    </div>
  );
};

export default MapPage;
