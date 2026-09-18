import React from 'react';
import { Carpark, VehicleType } from '../types';
import { getAvailabilityStatus } from '../data/singaporeCarparks';
import { Bookmark, MapPin, Trash2, ChevronRight, Navigation, Car } from 'lucide-react';

interface SavedViewProps {
  savedCarparks: Carpark[];
  onRemoveSave: (id: string) => void;
  onSelectCarpark: (carpark: Carpark) => void;
  onViewDetails: (carpark: Carpark) => void;
  onSwitchToMap: (carpark: Carpark) => void;
  selectedVehicleType: VehicleType;
}

export const SavedView: React.FC<SavedViewProps> = ({
  savedCarparks,
  onRemoveSave,
  onSelectCarpark,
  onViewDetails,
  onSwitchToMap,
  selectedVehicleType,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500" />
            Saved Carparks
          </h2>
          <p className="text-xs text-slate-500">
            Quick lot availability check for your daily commute and regular destinations.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
          {savedCarparks.length} Saved
        </span>
      </div>

      {savedCarparks.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No saved carparks yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Bookmark your home HDB carpark, office parking, or frequent shopping malls by clicking
            the bookmark icon in the Map or List view.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {savedCarparks.map((carpark) => {
            const vLots = carpark.vehicleTypes.find((v) => v.type === selectedVehicleType);
            const available = vLots ? vLots.availableLots : carpark.availableLots;
            const total = vLots ? vLots.totalLots : carpark.totalLots;
            const status = getAvailabilityStatus(available, total);

            return (
              <div
                key={carpark.id}
                id={`saved-card-${carpark.id.toLowerCase()}`}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
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
                        <span className="text-xs font-mono text-slate-500">
                          {carpark.code}
                        </span>
                      )}
                    </div>

                    <button
                      id={`remove-saved-${carpark.id.toLowerCase()}`}
                      onClick={() => onRemoveSave(carpark.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3
                    onClick={() => onViewDetails(carpark)}
                    className="text-base font-bold text-slate-900 mt-2 hover:text-blue-600 cursor-pointer transition-colors leading-tight"
                  >
                    {carpark.name}
                  </h3>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{carpark.address}</p>

                  {/* Lots pill */}
                  <div className="mt-3 flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold border ${status.badgeBg} ${status.badgeText}`}
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

                    <div className="text-right">
                      <span className="text-base font-black text-slate-900">{available}</span>
                      <span className="text-xs text-slate-500"> / {total} lots</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 truncate font-medium">
                    {carpark.rates.weekdayDay.split('(')[0]}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSwitchToMap(carpark)}
                      className="px-2.5 py-1 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-colors"
                    >
                      Map
                    </button>
                    <button
                      onClick={() => onViewDetails(carpark)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg transition-colors"
                    >
                      Details
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
