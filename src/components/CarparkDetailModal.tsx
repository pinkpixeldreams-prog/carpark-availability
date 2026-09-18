import React, { useState } from 'react';
import { Carpark, VehicleType } from '../types';
import { getAvailabilityStatus } from '../data/singaporeCarparks';
import {
  X,
  MapPin,
  Clock,
  Shield,
  Zap,
  Navigation,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  Code2,
  AlertCircle,
  Car,
  Bike,
  Truck,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface CarparkDetailModalProps {
  carpark: Carpark | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  selectedVehicleType: VehicleType;
  onSimulateLotUpdate: (carparkId: string) => void;
  onNavigateToLocation: (lat: number, lng: number) => void;
}

export const CarparkDetailModal: React.FC<CarparkDetailModalProps> = ({
  carpark,
  onClose,
  isSaved,
  onToggleSave,
  selectedVehicleType,
  onSimulateLotUpdate,
  onNavigateToLocation,
}) => {
  const [showApiInfo, setShowApiInfo] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!carpark) return null;

  const currentVehicleLot = carpark.vehicleTypes.find(
    (v) => v.type === selectedVehicleType
  );
  const available = currentVehicleLot
    ? currentVehicleLot.availableLots
    : carpark.availableLots;
  const total = currentVehicleLot
    ? currentVehicleLot.totalLots
    : carpark.totalLots;
  const status = getAvailabilityStatus(available, total);

  const handleUpdate = () => {
    setIsUpdating(true);
    onSimulateLotUpdate(carpark.id);
    setTimeout(() => setIsUpdating(false), 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full sm:max-w-xl max-h-[90vh] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/70">
          <div className="flex-1 pr-3">
            <div className="flex items-center gap-2 flex-wrap mb-1">
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
                <span className="text-xs font-mono font-medium text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded-sm">
                  {carpark.code}
                </span>
              )}
              <span className="text-xs text-slate-500 font-medium">
                {carpark.carparkType} Carpark
              </span>
              {carpark.rates.isCentralArea && (
                <span className="text-[10px] font-semibold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-sm">
                  Central Area Rate
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug">
              {carpark.name}
            </h2>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{carpark.address}</span>
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button
              id="detail-modal-bookmark-btn"
              onClick={() => onToggleSave(carpark.id)}
              className={`p-2 rounded-full border transition-colors ${
                isSaved
                  ? 'bg-amber-50 border-amber-300 text-amber-600'
                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save carpark'}
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 fill-amber-500" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
            <button
              id="detail-modal-close-btn"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Live Lot Availability Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Real-time Availability
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black tracking-tight">{available}</span>
                  <span className="text-sm text-slate-300">
                    / {total} {selectedVehicleType.toLowerCase()} lots
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    status.status === 'available'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : status.status === 'limited'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                  {status.label}
                </span>

                <button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors mt-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isUpdating ? 'animate-spin' : ''}`} />
                  <span>{isUpdating ? 'Polling lot...' : `Updated ${carpark.lastUpdated}`}</span>
                </button>
              </div>
            </div>

            {/* Availability Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  status.status === 'available'
                    ? 'bg-emerald-400'
                    : status.status === 'limited'
                    ? 'bg-amber-400'
                    : 'bg-rose-400'
                }`}
                style={{ width: `${Math.min(100, Math.max(5, status.percentage))}%` }}
              />
            </div>
          </div>

          {/* Vehicle Category Breakdown */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Vehicle Lots Breakdown
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {carpark.vehicleTypes.map((v) => {
                const vStatus = getAvailabilityStatus(v.availableLots, v.totalLots);
                return (
                  <div
                    key={v.type}
                    className={`border rounded-xl p-2.5 ${
                      v.type === selectedVehicleType
                        ? 'border-blue-400 bg-blue-50/50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        {v.type === 'Car' ? (
                          <Car className="w-3.5 h-3.5 text-blue-600" />
                        ) : v.type === 'Motorcycle' ? (
                          <Bike className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Truck className="w-3.5 h-3.5 text-amber-600" />
                        )}
                        {v.type}
                      </span>
                      <span className={`text-[10px] font-bold ${vStatus.badgeText}`}>
                        {vStatus.label}
                      </span>
                    </div>
                    <div className="text-base font-bold text-slate-900">
                      {v.availableLots}{' '}
                      <span className="text-xs font-normal text-slate-400">/ {v.totalLots}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Parking Rates Breakdown */}
          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Singapore Parking Rates
            </h4>

            <div className="space-y-2 text-xs divide-y divide-slate-200/70">
              <div className="pt-1 flex items-start justify-between gap-2">
                <span className="text-slate-500 font-medium">Weekday Daytime:</span>
                <span className="font-semibold text-slate-800 text-right">
                  {carpark.rates.weekdayDay}
                </span>
              </div>
              <div className="pt-2 flex items-start justify-between gap-2">
                <span className="text-slate-500 font-medium">Night Parking Cap:</span>
                <span className="font-semibold text-slate-800 text-right">
                  {carpark.rates.weekdayNight}
                </span>
              </div>
              <div className="pt-2 flex items-start justify-between gap-2">
                <span className="text-slate-500 font-medium">Saturday:</span>
                <span className="font-semibold text-slate-800 text-right">
                  {carpark.rates.saturday}
                </span>
              </div>
              <div className="pt-2 flex items-start justify-between gap-2">
                <span className="text-slate-500 font-medium">Sunday / Public Holiday:</span>
                <span className="font-semibold text-slate-800 text-right">
                  {carpark.rates.sundayHoliday}
                </span>
              </div>
              <div className="pt-2 flex items-start justify-between gap-2">
                <span className="text-slate-500 font-medium">Free Grace Period:</span>
                <span className="font-bold text-emerald-700 text-right">
                  {carpark.rates.gracePeriodMinutes} minutes free
                </span>
              </div>
            </div>
          </div>

          {/* Carpark Amenities & Restrictions */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div className="bg-slate-100/80 p-2.5 rounded-xl border border-slate-200/80">
              <span className="text-[11px] text-slate-400 block">Height Clearance</span>
              <span className="font-semibold text-slate-800">
                {carpark.heightLimitMeters ? `${carpark.heightLimitMeters}m` : 'No clearance limit'}
              </span>
            </div>

            <div className="bg-slate-100/80 p-2.5 rounded-xl border border-slate-200/80">
              <span className="text-[11px] text-slate-400 block">Payment System</span>
              <span className="font-semibold text-slate-800 truncate block">
                {carpark.parkingSystem}
              </span>
            </div>

            <div className="bg-slate-100/80 p-2.5 rounded-xl border border-slate-200/80">
              <span className="text-[11px] text-slate-400 block">EV Charging</span>
              <span
                className={`font-semibold ${
                  carpark.hasEVCharging ? 'text-blue-600' : 'text-slate-500'
                }`}
              >
                {carpark.hasEVCharging ? 'Available (Type 2)' : 'None'}
              </span>
            </div>
          </div>

          {/* API Connection Ready Notice (Collapsible) */}
          <div className="border border-blue-200 bg-blue-50/60 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowApiInfo(!showApiInfo)}
              className="w-full p-3 flex items-center justify-between text-left text-xs font-semibold text-blue-900 hover:bg-blue-100/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-600" />
                <span>API Connection Integration (LTA DataMall & HDB)</span>
              </div>
              {showApiInfo ? (
                <ChevronUp className="w-4 h-4 text-blue-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-blue-600" />
              )}
            </button>

            {showApiInfo && (
              <div className="p-3 pt-0 text-xs text-slate-700 space-y-2 border-t border-blue-200/60 mt-1">
                <p className="text-slate-600 leading-relaxed">
                  The frontend data models match Singapore official real-time APIs:
                </p>
                <ul className="list-disc pl-4 space-y-1 font-mono text-[11px] text-slate-800">
                  <li>
                    <strong>LTA DataMall:</strong>{' '}
                    <code>datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2</code>
                  </li>
                  <li>
                    <strong>GovTech Data.gov.sg:</strong>{' '}
                    <code>api.data.gov.sg/v1/transport/carpark-availability</code>
                  </li>
                </ul>
                <div className="bg-slate-900 text-emerald-400 p-2.5 rounded-lg font-mono text-[10px] overflow-x-auto">
                  {`// Sample Real-time lot mapping:
{
  "carpark_number": "${carpark.code || carpark.id}",
  "total_lots": "${carpark.totalLots}",
  "lots_available": "${carpark.availableLots}",
  "lot_type": "${selectedVehicleType === 'Car' ? 'C' : selectedVehicleType === 'Motorcycle' ? 'Y' : 'H'}"
}`}
                </div>
                <p className="text-[11px] text-slate-500">
                  When you connect your API key or proxy, update the fetch endpoint in{' '}
                  <code className="bg-white px-1 py-0.5 rounded border border-blue-200">
                    src/App.tsx
                  </code>
                  .
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
          <a
            id="modal-navigate-external-btn"
            href={`https://www.google.com/maps/dir/?api=1&destination=${carpark.latitude},${carpark.longitude}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Navigation className="w-4 h-4" />
            Navigate with Google Maps
          </a>
        </div>
      </div>
    </div>
  );
};
