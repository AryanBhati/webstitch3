import React from 'react';
import { Search, Filter } from 'lucide-react';
import { destinations, cruiseLines, shipTypes, months } from '../data/cruises';

interface SearchFilters {
  searchText: string;
  destination: string;
  cruiseLine: string;
  shipType: string;
  month: string;
}

interface SearchSectionProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({ filters, onFiltersChange }) => {
  // Handle search submission
  const handleSearch = () => {
    // Trigger search - in real app this would call API
    console.log('Searching with filters:', filters);
  };

  // Handle input changes
  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-lg border border-white/30 shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Filter size={20} />
          Search & Filter Cruises
        </h2>
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Search size={16} />
          Submit
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Text Search */}
        <div className="lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Cruises</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name..."
              value={filters.searchText}
              onChange={(e) => handleInputChange('searchText', e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-white/70 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Destination */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
          <select
            value={filters.destination}
            onChange={(e) => handleInputChange('destination', e.target.value)}
            className="w-full px-3 py-2 bg-white/70 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {destinations.map((dest) => (
              <option key={dest} value={dest}>{dest}</option>
            ))}
          </select>
        </div>

        {/* Cruise Line */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cruise Line</label>
          <select
            value={filters.cruiseLine}
            onChange={(e) => handleInputChange('cruiseLine', e.target.value)}
            className="w-full px-3 py-2 bg-white/70 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {cruiseLines.map((line) => (
              <option key={line} value={line}>{line}</option>
            ))}
          </select>
        </div>

        {/* Ship Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ship Type</label>
          <select
            value={filters.shipType}
            onChange={(e) => handleInputChange('shipType', e.target.value)}
            className="w-full px-3 py-2 bg-white/70 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {shipTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Month / Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
          <select
            value={filters.month}
            onChange={(e) => handleInputChange('month', e.target.value)}
            className="w-full px-3 py-2 bg-white/70 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      <div className="mt-4 flex flex-wrap gap-2">
        {Object.entries(filters).map(([key, value]) => {
          if (value && !value.toString().toLowerCase().includes('all') && value !== '') {
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {key}: {value}
                <button
                  onClick={() => handleInputChange(key as keyof SearchFilters, '')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default SearchSection;