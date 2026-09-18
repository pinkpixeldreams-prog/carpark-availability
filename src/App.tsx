/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  INITIAL_CARPARKS,
  POPULAR_LOCATIONS,
  calculateDistanceKm,
} from './data/singaporeCarparks';
import { Carpark, LocationPreset, VehicleType, ActiveTab } from './types';
import { SearchBar } from './components/SearchBar';
import { MapView } from './components/MapView';
import { CarparkList } from './components/CarparkList';
import { SavedView } from './components/SavedView';
import { RatesInfoView } from './components/RatesInfoView';
import { BottomNavigation } from './components/BottomNavigation';
import { CarparkDetailModal } from './components/CarparkDetailModal';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export default function App() {
  // Current active navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('map');

  // Selected vehicle type: Car, Motorcycle, Heavy
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType>('Car');

  // Search and location state (default to Orchard Road)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    latitude: number;
    longitude: number;
  }>({
    name: 'Orchard Road',
    latitude: 1.3048,
    longitude: 103.8318,
  });

  // Carparks list state with real-time updates
  const [carparks, setCarparks] = useState<Carpark[]>(INITIAL_CARPARKS);
  const [selectedCarpark, setSelectedCarpark] = useState<Carpark | null>(INITIAL_CARPARKS[0]);
  const [detailModalCarpark, setDetailModalCarpark] = useState<Carpark | null>(null);

  // Saved/Bookmarked carparks
  const [savedCarparkIds, setSavedCarparkIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('parksg_saved_carparks');
      return stored ? JSON.parse(stored) : ['MALL-ION', 'HDB-BUGIS-ALB'];
    } catch {
      return ['MALL-ION', 'HDB-BUGIS-ALB'];
    }
  });

  // Loading states
  const [isLocating, setIsLocating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Persist saved IDs
  useEffect(() => {
    try {
      localStorage.setItem('parksg_saved_carparks', JSON.stringify(savedCarparkIds));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [savedCarparkIds]);

  // Recalculate distances from current selected location
  const carparksWithDistance = useMemo(() => {
    return carparks.map((cp) => {
      const distance = calculateDistanceKm(
        selectedLocation.latitude,
        selectedLocation.longitude,
        cp.latitude,
        cp.longitude
      );
      return {
        ...cp,
        distanceKm: distance,
      };
    });
  }, [carparks, selectedLocation]);

  // Filtered carparks based on search query
  const filteredCarparks = useMemo(() => {
    if (!searchQuery.trim()) {
      return carparksWithDistance;
    }
    const query = searchQuery.toLowerCase().trim();
    return carparksWithDistance.filter(
      (cp) =>
        cp.name.toLowerCase().includes(query) ||
        cp.address.toLowerCase().includes(query) ||
        cp.area.toLowerCase().includes(query) ||
        (cp.code && cp.code.toLowerCase().includes(query))
    );
  }, [carparksWithDistance, searchQuery]);

  // Toggle save carpark
  const handleToggleSave = (id: string) => {
    setSavedCarparkIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from saved lots', 'info');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Saved for quick access', 'success');
        return [...prev, id];
      }
    });
  };

  // Handle Preset selection
  const handleSelectPreset = (preset: LocationPreset) => {
    setSelectedLocation({
      name: preset.name,
      latitude: preset.latitude,
      longitude: preset.longitude,
    });
    setSearchQuery('');
    showToast(`Centered near ${preset.name}`, 'info');

    // Auto select closest carpark
    const sorted = [...carparks].sort((a, b) => {
      const distA = calculateDistanceKm(preset.latitude, preset.longitude, a.latitude, a.longitude);
      const distB = calculateDistanceKm(preset.latitude, preset.longitude, b.latitude, b.longitude);
      return distA - distB;
    });
    if (sorted.length > 0) {
      setSelectedCarpark(sorted[0]);
    }
  };

  // Locate User GPS
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'warning');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;

        // Check if user is roughly within Singapore bounds
        const isSingapore =
          latitude >= 1.15 && latitude <= 1.5 && longitude >= 103.55 && longitude <= 104.1;

        if (isSingapore) {
          setSelectedLocation({
            name: 'My GPS Location',
            latitude,
            longitude,
          });
          showToast('Located your position in Singapore!', 'success');
        } else {
          // Fallback to Central Singapore
          setSelectedLocation({
            name: 'Downtown Singapore (GPS outside SG)',
            latitude: 1.2838,
            longitude: 103.8591,
          });
          showToast('GPS is outside SG; centered on Marina Bay', 'info');
        }
      },
      (error) => {
        setIsLocating(false);
        showToast('Could not access location. Defaulting to Central SG', 'warning');
        setSelectedLocation({
          name: 'Central Singapore',
          latitude: 1.3048,
          longitude: 103.8318,
        });
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Simulate Real-Time Lot Updates (Cars entering & leaving)
  const handleRefreshData = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setCarparks((prev) =>
        prev.map((cp) => {
          // fluctuate availability by -3 to +3 lots (bounded between 0 and totalLots)
          const delta = Math.floor(Math.random() * 7) - 3;
          const newAvailable = Math.max(0, Math.min(cp.totalLots, cp.availableLots + delta));

          const updatedVehicles = cp.vehicleTypes.map((v) => {
            const vDelta = Math.floor(Math.random() * 5) - 2;
            return {
              ...v,
              availableLots: Math.max(0, Math.min(v.totalLots, v.availableLots + vDelta)),
            };
          });

          return {
            ...cp,
            availableLots: newAvailable,
            vehicleTypes: updatedVehicles,
            lastUpdated: 'Just now',
          };
        })
      );
      setIsRefreshing(false);
      showToast('Live lot availability refreshed!', 'success');
    }, 600);
  }, []);

  // Update specific carpark simulated lots
  const handleSimulateLotUpdate = (carparkId: string) => {
    setCarparks((prev) =>
      prev.map((cp) => {
        if (cp.id !== carparkId) return cp;
        const delta = Math.floor(Math.random() * 5) - 2;
        const newAvailable = Math.max(0, Math.min(cp.totalLots, cp.availableLots + delta));
        return {
          ...cp,
          availableLots: newAvailable,
          lastUpdated: 'Just now',
        };
      })
    );
  };

  // Switch to map and focus on carpark
  const handleSwitchToMap = (carpark: Carpark) => {
    setSelectedCarpark(carpark);
    setActiveTab('map');
  };

  // Recenter map
  const handleRecenter = () => {
    showToast(`Centered map on ${selectedLocation.name}`, 'info');
  };

  // Saved carparks list
  const savedCarparks = useMemo(() => {
    return carparksWithDistance.filter((cp) => savedCarparkIds.includes(cp.id));
  }, [carparksWithDistance, savedCarparkIds]);

  const totalLotsAvailable = useMemo(() => {
    return carparks.reduce((acc, cp) => acc + cp.availableLots, 0);
  }, [carparks]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white pb-20">
      {/* Sticky Top Header & Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedLocation={selectedLocation}
        onSelectLocationPreset={handleSelectPreset}
        selectedVehicleType={selectedVehicleType}
        onVehicleTypeChange={setSelectedVehicleType}
        onUseCurrentLocation={handleUseCurrentLocation}
        isLocating={isLocating}
        onRefreshData={handleRefreshData}
        isRefreshing={isRefreshing}
        totalLotsAvailable={totalLotsAvailable}
      />

      {/* Main Content Area based on Active Tab */}
      <main className="flex-1 relative">
        {activeTab === 'map' && (
          <MapView
            carparks={filteredCarparks}
            selectedCarpark={selectedCarpark}
            onSelectCarpark={setSelectedCarpark}
            onViewDetails={(cp) => setDetailModalCarpark(cp)}
            selectedLocation={selectedLocation}
            vehicleType={selectedVehicleType}
            onRecenter={handleRecenter}
          />
        )}

        {activeTab === 'list' && (
          <CarparkList
            carparks={filteredCarparks}
            selectedVehicleType={selectedVehicleType}
            savedCarparkIds={savedCarparkIds}
            onToggleSave={handleToggleSave}
            onSelectCarpark={setSelectedCarpark}
            onViewDetails={(cp) => setDetailModalCarpark(cp)}
            onSwitchToMap={handleSwitchToMap}
            selectedLocationName={selectedLocation.name}
          />
        )}

        {activeTab === 'saved' && (
          <SavedView
            savedCarparks={savedCarparks}
            onRemoveSave={handleToggleSave}
            onSelectCarpark={setSelectedCarpark}
            onViewDetails={(cp) => setDetailModalCarpark(cp)}
            onSwitchToMap={handleSwitchToMap}
            selectedVehicleType={selectedVehicleType}
          />
        )}

        {activeTab === 'info' && <RatesInfoView />}
      </main>

      {/* Carpark Detail Modal Drawer */}
      <CarparkDetailModal
        carpark={detailModalCarpark}
        onClose={() => setDetailModalCarpark(null)}
        isSaved={detailModalCarpark ? savedCarparkIds.includes(detailModalCarpark.id) : false}
        onToggleSave={handleToggleSave}
        selectedVehicleType={selectedVehicleType}
        onSimulateLotUpdate={handleSimulateLotUpdate}
        onNavigateToLocation={(lat, lng) => {
          window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
        }}
      />

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div
          id="app-toast-message"
          className="fixed top-20 right-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div
            className={`px-3.5 py-2 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2 backdrop-blur-md ${
              toastMessage.type === 'success'
                ? 'bg-emerald-900/90 text-white border-emerald-700'
                : toastMessage.type === 'warning'
                ? 'bg-amber-900/90 text-white border-amber-700'
                : 'bg-slate-900/90 text-white border-slate-700'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Info className="w-4 h-4 text-blue-400" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={savedCarparks.length}
        nearbyCount={filteredCarparks.length}
      />
    </div>
  );
}
