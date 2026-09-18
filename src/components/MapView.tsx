import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Carpark, VehicleType } from '../types';
import { getAvailabilityStatus } from '../data/singaporeCarparks';
import { Navigation, Compass, ExternalLink, Info, ShieldCheck, Zap } from 'lucide-react';

interface MapViewProps {
  carparks: Carpark[];
  selectedCarpark: Carpark | null;
  onSelectCarpark: (carpark: Carpark) => void;
  onViewDetails: (carpark: Carpark) => void;
  selectedLocation: { name: string; latitude: number; longitude: number };
  vehicleType: VehicleType;
  onRecenter: () => void;
}

export const MapView: React.FC<MapViewProps> = ({
  carparks,
  selectedCarpark,
  onSelectCarpark,
  onViewDetails,
  selectedLocation,
  vehicleType,
  onRecenter,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const locationMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [selectedLocation.latitude, selectedLocation.longitude],
      zoom: 14,
      zoomControl: false,
    });

    // High quality OpenStreetMap tiles with English labels
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Zoom control at top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center when selectedLocation changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(
      [selectedLocation.latitude, selectedLocation.longitude],
      14,
      { duration: 1.2 }
    );

    // Update or create searched location pin
    if (locationMarkerRef.current) {
      locationMarkerRef.current.setLatLng([
        selectedLocation.latitude,
        selectedLocation.longitude,
      ]);
    } else {
      const locationIcon = L.divIcon({
        className: 'custom-location-pin',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-6 h-6 rounded-full bg-blue-500/30 animate-ping absolute"></div>
            <div class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md relative z-10"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      locationMarkerRef.current = L.marker(
        [selectedLocation.latitude, selectedLocation.longitude],
        { icon: locationIcon, zIndexOffset: 1000 }
      )
        .addTo(mapInstanceRef.current)
        .bindPopup(
          `<div class="text-xs font-semibold text-slate-800">📍 ${selectedLocation.name}</div>`
        );
    }
  }, [selectedLocation]);

  // Render Carpark Markers
  useEffect(() => {
    if (!markersLayerRef.current || !mapInstanceRef.current) return;

    markersLayerRef.current.clearLayers();

    carparks.forEach((carpark) => {
      // Get lot count for chosen vehicle type
      const vLots = carpark.vehicleTypes.find((v) => v.type === vehicleType);
      const available = vLots ? vLots.availableLots : carpark.availableLots;
      const total = vLots ? vLots.totalLots : carpark.totalLots;
      const status = getAvailabilityStatus(available, total);

      const isSelected = selectedCarpark?.id === carpark.id;

      // Custom marker pill with availability color
      const markerHtml = `
        <div class="group cursor-pointer transition-transform duration-150 ${
          isSelected ? 'scale-125 z-50' : 'hover:scale-110'
        }">
          <div class="flex items-center gap-1.5 px-2 py-1 rounded-full shadow-md text-xs font-bold border ${
            isSelected
              ? 'ring-2 ring-blue-600 ring-offset-2 border-slate-900 bg-slate-900 text-white'
              : status.status === 'available'
              ? 'bg-emerald-600 text-white border-emerald-700'
              : status.status === 'limited'
              ? 'bg-amber-500 text-white border-amber-600'
              : 'bg-rose-600 text-white border-rose-700'
          }">
            <span class="w-2 h-2 rounded-full ${
              status.status === 'available'
                ? 'bg-emerald-200'
                : status.status === 'limited'
                ? 'bg-amber-100'
                : 'bg-rose-200'
            } animate-pulse"></span>
            <span>${available}</span>
          </div>
          <div class="w-1.5 h-1.5 bg-slate-800 mx-auto rounded-full -mt-0.5 shadow-xs opacity-70"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-carpark-pin',
        html: markerHtml,
        iconSize: [48, 28],
        iconAnchor: [24, 28],
      });

      const marker = L.marker([carpark.latitude, carpark.longitude], {
        icon: customIcon,
        zIndexOffset: isSelected ? 500 : 100,
      });

      marker.on('click', () => {
        onSelectCarpark(carpark);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo([carpark.latitude, carpark.longitude], {
            animate: true,
          });
        }
      });

      marker.addTo(markersLayerRef.current!);
    });
  }, [carparks, selectedCarpark, vehicleType, onSelectCarpark]);

  // Center on selected carpark if selected
  useEffect(() => {
    if (selectedCarpark && mapInstanceRef.current) {
      mapInstanceRef.current.panTo(
        [selectedCarpark.latitude, selectedCarpark.longitude],
        { animate: true }
      );
    }
  }, [selectedCarpark]);

  return (
    <div className="relative w-full h-[calc(100vh-185px)] min-h-[420px] bg-slate-100 overflow-hidden">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Map Floating Overlays: Quick Legend & Controls */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        {/* Availability Legend Chip */}
        <div className="bg-white/90 backdrop-blur-md rounded-xl p-2.5 shadow-md border border-slate-200/80 text-xs flex items-center gap-3">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Lots Status:
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs"></span>
            <span className="text-slate-700 font-medium">&gt;30 Free</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs"></span>
            <span className="text-slate-700 font-medium">6-30 Free</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs"></span>
            <span className="text-slate-700 font-medium">&le;5 Full</span>
          </div>
        </div>
      </div>

      {/* Floating Re-center button */}
      <div className="absolute bottom-24 right-4 z-20 flex flex-col gap-2">
        <button
          id="map-recenter-btn"
          onClick={onRecenter}
          className="p-3 bg-white text-slate-700 hover:text-blue-600 rounded-full shadow-lg border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
          title="Recenter map to searched location"
        >
          <Compass className="w-5 h-5" />
        </button>
      </div>

      {/* Floating Selected Carpark Quick Card (Bottom Sheet Card) */}
      {selectedCarpark && (
        <div className="absolute bottom-4 left-4 right-4 max-w-xl mx-auto z-20 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      selectedCarpark.agency === 'HDB'
                        ? 'bg-blue-100 text-blue-800'
                        : selectedCarpark.agency === 'URA'
                        ? 'bg-teal-100 text-teal-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {selectedCarpark.agency}
                  </span>
                  {selectedCarpark.code && (
                    <span className="text-xs font-mono font-medium text-slate-500">
                      Code: {selectedCarpark.code}
                    </span>
                  )}
                  {selectedCarpark.rates.isCentralArea && (
                    <span className="text-[10px] font-medium bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-sm">
                      Central Area
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                  {selectedCarpark.name}
                </h3>
                <p className="text-xs text-slate-500 truncate max-w-xs sm:max-w-md">
                  {selectedCarpark.address}
                </p>
              </div>

              {/* Lot Count Box */}
              {(() => {
                const vLots = selectedCarpark.vehicleTypes.find(
                  (v) => v.type === vehicleType
                );
                const available = vLots ? vLots.availableLots : selectedCarpark.availableLots;
                const total = vLots ? vLots.totalLots : selectedCarpark.totalLots;
                const status = getAvailabilityStatus(available, total);

                return (
                  <div
                    className={`text-right px-3 py-1.5 rounded-xl border ${status.badgeBg}`}
                  >
                    <div className="text-xl font-extrabold tracking-tight leading-none text-slate-900">
                      {available}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      of {total} {vehicleType.toLowerCase()} lots
                    </div>
                    <div className={`text-[10px] font-bold mt-0.5 ${status.badgeText}`}>
                      {status.label}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Quick Specs Row */}
            <div className="grid grid-cols-3 gap-2 py-2.5 my-2.5 border-y border-slate-100 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 block">Distance</span>
                <span className="font-semibold text-slate-800">
                  {selectedCarpark.distanceKm !== undefined
                    ? `${selectedCarpark.distanceKm} km`
                    : '--'}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Day Rate</span>
                <span className="font-semibold text-slate-800 truncate block">
                  {selectedCarpark.rates.weekdayDay.split('(')[0]}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Grace Period</span>
                <span className="font-semibold text-emerald-600">
                  {selectedCarpark.rates.gracePeriodMinutes} mins free
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                id="view-carpark-rates-btn"
                onClick={() => onViewDetails(selectedCarpark)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
              >
                <Info className="w-3.5 h-3.5 text-slate-600" />
                Full Rates & Details
              </button>
              <a
                id="directions-carpark-link"
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCarpark.latitude},${selectedCarpark.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                Navigate (Google Maps)
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
