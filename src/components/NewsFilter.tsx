import React from 'react';
import { Search, Filter, Clock } from 'lucide-react';

interface NewsFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedSource: string;
  setSelectedSource: (source: string) => void;
  sources: string[];
  timeFrame: string;
  setTimeFrame: (timeFrame: string) => void;
}

const NewsFilter: React.FC<NewsFilterProps> = ({
  searchTerm,
  setSearchTerm,
  selectedSource,
  setSelectedSource,
  sources,
  timeFrame,
  setTimeFrame
}) => {
  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search defense news..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-bhred focus:border-bhred"
            />
          </div>

          {/* Source Filter */}
          <div className="relative w-full md:w-auto">
            <div className="flex items-center">
              <Filter className="w-5 h-5 text-gray-400 mr-2" />
              <select
                value={selectedSource}
                onChange={e => setSelectedSource(e.target.value)}
                className="pl-2 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-bhred focus:border-bhred appearance-none"
              >
                <option value="">All Sources</option>
                {sources.map(source => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Time Filter */}
          <div className="relative w-full md:w-auto">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-400 mr-2" />
              <select
                value={timeFrame}
                onChange={e => setTimeFrame(e.target.value)}
                className="pl-2 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-bhred focus:border-bhred appearance-none"
              >
                <option value="all">All Time</option>
                <option value="day">Last 24 Hours</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsFilter;