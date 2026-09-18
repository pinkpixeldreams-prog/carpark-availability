import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, X, Navigation, Car, Bike, Truck, RefreshCw } from 'lucide-react';
import { POPULAR_LOCATIONS } from '../data/singaporeCarparks';
import { LocationPreset, VehicleType } from '../types';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedLocation: { name: string; latitude: number; longitude: number };
  onSelectLocationPreset: (preset: LocationPreset) => void;
  selectedVehicleType: VehicleType;
  onVehicleTypeChange: (type: VehicleType) => void;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
  onRefreshData: () => void;
  isRefreshing: boolean;
  totalLotsAvailable: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedLocation,
  onSelectLocationPreset,
  selectedVehicleType,
  onVehicleTypeChange,
  onUseCurrentLocation,
  isLocating,
  onRefreshData,
  isRefreshing,
  totalLotsAvailable,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredPresets = POPULAR_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs z-30 sticky top-0 px-4 py-3">
      <div className="max-w-4xl mx-auto space-y-2.5">
        {/* Top bar with Branding & Live status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-semibold text-slate-900 tracking-tight leading-none">
                  ParkSG Live
                </h1>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Singapore
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Near: <span className="font-medium text-slate-700">{selectedLocation.name}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live refresh simulated button */}
            <button
              id="refresh-carparks-btn"
              onClick={onRefreshData}
              disabled={isRefreshing}
              title="Refresh lot counts"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* GPS Locate Me Button */}
            <button
              id="locate-me-btn"
              onClick={onUseCurrentLocation}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors disabled:opacity-60"
              title="Find parking near my GPS location"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span className="hidden xs:inline">{isLocating ? 'Locating...' : 'Near Me'}</span>
            </button>
          </div>
        </div>

        {/* Search input with suggestions */}
        <div className="relative" ref={dropdownRef}>
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              id="carpark-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Search location (e.g., Orchard, Marina Bay, Tampines, postal code)..."
              className="w-full pl-10 pr-10 py-2 text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                id="clear-search-btn"
                onClick={() => onSearchChange('')}
                className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete / Suggested Singapore Locations Dropdown */}
          {isFocused && filteredPresets.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-64 overflow-y-auto">
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-50 border-b border-slate-100">
                Popular Singapore Destinations
              </div>
              {filteredPresets.map((loc) => (
                <button
                  key={loc.id}
                  id={`preset-${loc.id}`}
                  onClick={() => {
                    onSelectLocationPreset(loc);
                    setIsFocused(false);
                    onSearchChange(loc.name);
                  }}
                  className="w-full text-left px-3.5 py-2.5 text-sm flex items-center justify-between hover:bg-blue-50/70 transition-colors border-b border-slate-100 last:border-0"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{loc.icon}</span>
                    <div>
                      <div className="font-medium text-slate-800">{loc.name}</div>
                      <div className="text-xs text-slate-400">{loc.area} Area</div>
                    </div>
                  </div>
                  <span className="text-xs text-blue-600 font-medium">Select</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Filters: Popular Destinations Pills & Vehicle Type Switch */}
        <div className="flex items-center justify-between gap-2 pt-0.5 overflow-x-auto no-scrollbar">
          {/* Destination Pills */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
              <MapPin className="w-3.5 h-3.5" />
              Quick:
            </span>
            {POPULAR_LOCATIONS.slice(0, 5).map((loc) => {
              const isSelected = selectedLocation.name === loc.name;
              return (
                <button
                  key={loc.id}
                  id={`quick-pill-${loc.id}`}
                  onClick={() => {
                    onSelectLocationPreset(loc);
                    onSearchChange(loc.name);
                  }}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{loc.icon}</span>
                  <span>{loc.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Vehicle Type Switch */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80 shrink-0">
            <button
              id="vehicle-car-btn"
              onClick={() => onVehicleTypeChange('Car')}
              title="Car lots"
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${
                selectedVehicleType === 'Car'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Car</span>
            </button>
            <button
              id="vehicle-motorcycle-btn"
              onClick={() => onVehicleTypeChange('Motorcycle')}
              title="Motorcycle lots"
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${
                selectedVehicleType === 'Motorcycle'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bike</span>
            </button>
            <button
              id="vehicle-heavy-btn"
              onClick={() => onVehicleTypeChange('Heavy')}
              title="Heavy vehicle lots"
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${
                selectedVehicleType === 'Heavy'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Heavy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
