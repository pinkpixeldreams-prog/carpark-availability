import React, { useState, useMemo } from 'react';
import { Carpark, VehicleType, CarparkAgency } from '../types';
import { getAvailabilityStatus } from '../data/singaporeCarparks';
import {
  MapPin,
  Clock,
  Zap,
  ArrowUpDown,
  Filter,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  ExternalLink,
  Shield,
  Layers,
} from 'lucide-react';

interface CarparkListProps {
  carparks: Carpark[];
  selectedVehicleType: VehicleType;
  savedCarparkIds: string[];
  onToggleSave: (id: string) => void;
  onSelectCarpark: (carpark: Carpark) => void;
  onViewDetails: (carpark: Carpark) => void;
  onSwitchToMap: (carpark: Carpark) => void;
  selectedLocationName: string;
}

export const CarparkList: React.FC<CarparkListProps> = ({
  carparks,
  selectedVehicleType,
  savedCarparkIds,
  onToggleSave,
  onSelectCarpark,
  onViewDetails,
  onSwitchToMap,
  selectedLocationName,
}) => {
  const [selectedAgency, setSelectedAgency] = useState<string>('ALL');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [onlyEV, setOnlyEV] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'distance' | 'availability' | 'price'>('distance');

  // Filter and sort carparks
  const processedCarparks = useMemo(() => {
    return carparks
      .filter((cp) => {
        if (selectedAgency !== 'ALL' && cp.agency !== selectedAgency) return false;
        if (onlyEV && !cp.hasEVCharging) return false;

        const vLots = cp.vehicleTypes.find((v) => v.type === selectedVehicleType);
        const available = vLots ? vLots.availableLots : cp.availableLots;
        if (onlyAvailable && available <= 5) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'distance') {
          return (a.distanceKm ?? 999) - (b.distanceKm ?? 999);
        }
        if (sortBy === 'availability') {
          const aLots =
            a.vehicleTypes.find((v) => v.type === selectedVehicleType)?.availableLots ??
            a.availableLots;
          const bLots =
            b.vehicleTypes.find((v) => v.type === selectedVehicleType)?.availableLots ??
            b.availableLots;
          return bLots - aLots;
        }
        if (sortBy === 'price') {
          // Central area or commercial usually more expensive
          const aPrice = a.rates.isCentralArea ? 1 : 0;
          const bPrice = b.rates.isCentralArea ? 1 : 0;
          return aPrice - bPrice;
        }
        return 0;
      });
  }, [carparks, selectedAgency, onlyAvailable, onlyEV, sortBy, selectedVehicleType]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
      {/* Header & Quick stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Nearby Parking Lots
          </h2>
          <p className="text-xs text-slate-500">
            Found <span className="font-semibold text-slate-800">{processedCarparks.length}</span>{' '}
            carparks near <span className="font-medium text-slate-700">{selectedLocationName}</span>
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500">Sort:</span>
          <select
            id="sort-carparks-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="distance">Nearest Distance</option>
            <option value="availability">Most Lots Available</option>
            <option value="price">HDB / Budget Friendly</option>
          </select>
        </div>
      </div>

      {/* Filter Row: Agencies & Chips */}
      <div className="space-y-2">
        {/* Agency Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {[
            { id: 'ALL', label: 'All Operators' },
            { id: 'HDB', label: 'HDB Carparks' },
            { id: 'Commercial', label: 'Malls & Plazas' },
            { id: 'URA', label: 'URA Street Lots' },
          ].map((tab) => (
            <button
              key={tab.id}
              id={`filter-agency-${tab.id.toLowerCase()}`}
              onClick={() => setSelectedAgency(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedAgency === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Extra toggles: Only Available Lots & EV Charging */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <button
            id="filter-only-available-btn"
            onClick={() => setOnlyAvailable(!onlyAvailable)}
            className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors flex items-center gap-1.5 ${
              onlyAvailable
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                onlyAvailable ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            ></span>
            Only Available Lots (&gt;5)
          </button>

          <button
            id="filter-only-ev-btn"
            onClick={() => setOnlyEV(!onlyEV)}
            className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors flex items-center gap-1.5 ${
              onlyEV
                ? 'bg-blue-50 text-blue-800 border-blue-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Zap className={`w-3 h-3 ${onlyEV ? 'text-blue-600' : 'text-slate-400'}`} />
            EV Charging Available
          </button>
        </div>
      </div>

      {/* List of Carparks */}
      {processedCarparks.length === 0 ? (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mx-auto text-slate-400">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">No carparks match current filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your agency filters, clearing &quot;Only Available Lots&quot;, or searching for another Singapore location.
          </p>
          <button
            onClick={() => {
              setSelectedAgency('ALL');
              setOnlyAvailable(false);
              setOnlyEV(false);
            }}
            className="px-3 py-1.5 bg-white border border-slate-300 text-xs font-medium rounded-lg hover:bg-slate-100 text-slate-700 mt-2 shadow-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {processedCarparks.map((carpark) => {
            const isSaved = savedCarparkIds.includes(carpark.id);
            const vLots = carpark.vehicleTypes.find((v) => v.type === selectedVehicleType);
            const available = vLots ? vLots.availableLots : carpark.availableLots;
            const total = vLots ? vLots.totalLots : carpark.totalLots;
            const status = getAvailabilityStatus(available, total);

            // Driving and walking time estimates
            const dist = carpark.distanceKm ?? 0.5;
            const driveMins = Math.max(1, Math.round(dist * 2.5));
            const walkMins = Math.max(1, Math.round(dist * 13));

            return (
              <div
                key={carpark.id}
                id={`carpark-card-${carpark.id.toLowerCase()}`}
                className="bg-white border border-slate-200 hover:border-blue-400/80 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all group"
              >
                {/* Header row: Agency, Name, Distance, Bookmark */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          carpark.agency === 'HDB'
                            ? 'bg-blue-100 text-blue-800'
                            : carpark.agency === 'URA'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {carpark.agency}
                      </span>
                      {carpark.code && (
                        <span className="text-xs font-mono font-medium text-slate-500">
                          {carpark.code}
                        </span>
                      )}
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">{carpark.carparkType}</span>
                    </div>

                    <h3
                      onClick={() => onViewDetails(carpark)}
                      className="text-base font-bold text-slate-900 mt-1 cursor-pointer hover:text-blue-600 transition-colors leading-snug truncate"
                    >
                      {carpark.name}
                    </h3>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{carpark.address}</p>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    id={`bookmark-btn-${carpark.id.toLowerCase()}`}
                    onClick={() => onToggleSave(carpark.id)}
                    className={`p-2 rounded-xl border transition-colors ${
                      isSaved
                        ? 'bg-amber-50 border-amber-300 text-amber-600'
                        : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                    }`}
                    title={isSaved ? 'Remove from saved' : 'Save for quick access'}
                    aria-label={isSaved ? 'Remove from saved' : 'Save for quick access'}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-600" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Real-time Availability Bar & Lot Count */}
                <div className="mt-3.5 bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${status.badgeBg} ${status.badgeText}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            status.status === 'available'
                              ? 'bg-emerald-500'
                              : status.status === 'limited'
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                        ></span>
                        {status.label}
                      </span>
                      <span className="text-xs text-slate-400">
                        Updated {carpark.lastUpdated}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                        {available}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {' '}/ {total} {selectedVehicleType.toLowerCase()} lots
                      </span>
                    </div>
                  </div>

                  {/* Progress bar visualizer */}
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        status.status === 'available'
                          ? 'bg-emerald-500'
                          : status.status === 'limited'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(5, status.percentage))}%` }}
                    />
                  </div>
                </div>

                {/* Rates & Distance Snapshot */}
                <div className="flex items-center justify-between flex-wrap gap-2 mt-3 pt-2 text-xs text-slate-600 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 font-semibold text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>{carpark.distanceKm} km</span>
                      <span className="text-slate-400 font-normal">
                        (~{driveMins}m drive, {walkMins}m walk)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-sm font-medium text-slate-700">
                      {carpark.rates.weekdayDay.split('(')[0]}
                    </span>
                    <span className="text-emerald-700 font-medium">
                      {carpark.rates.gracePeriodMinutes}m grace
                    </span>
                  </div>
                </div>

                {/* Features & Actions Bar */}
                <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {carpark.hasEVCharging && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                        <Zap className="w-3 h-3" />
                        EV Charger
                      </span>
                    )}
                    {carpark.heightLimitMeters && (
                      <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        Max {carpark.heightLimitMeters}m
                      </span>
                    )}
                    <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      EPS
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id={`view-map-btn-${carpark.id.toLowerCase()}`}
                      onClick={() => onSwitchToMap(carpark)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      View on Map
                    </button>
                    <button
                      id={`view-details-btn-${carpark.id.toLowerCase()}`}
                      onClick={() => onViewDetails(carpark)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                    >
                      Details & Rates
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
