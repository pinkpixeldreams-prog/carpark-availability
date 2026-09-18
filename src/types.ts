export type VehicleType = 'Car' | 'Motorcycle' | 'Heavy';

export type CarparkAgency = 'HDB' | 'URA' | 'LTA' | 'Commercial';

export type AvailabilityStatus = 'available' | 'limited' | 'full';

export interface VehicleLots {
  type: VehicleType;
  totalLots: number;
  availableLots: number;
}

export interface ParkingRates {
  weekdayDay: string; // e.g. "$0.60 / 30 min" or "$1.20 / 30 min"
  weekdayNight: string; // e.g. "$5.00 night cap (10:30pm - 7am)"
  saturday: string;
  sundayHoliday: string;
  gracePeriodMinutes: number; // usually 15 min in SG
  isCentralArea: boolean;
}

export interface Carpark {
  id: string; // e.g. "HDB-BM29", "MALL-ION"
  code?: string; // Carpark code used on street signage
  name: string;
  agency: CarparkAgency;
  address: string;
  area: string; // e.g. "Orchard", "Marina Bay", "Bugis", "Jurong East", "Tampines"
  latitude: number;
  longitude: number;
  totalLots: number;
  availableLots: number;
  vehicleTypes: VehicleLots[];
  carparkType: 'Multi-Storey' | 'Basement' | 'Surface' | 'Mechanized';
  parkingSystem: 'Electronic Parking (EPS)' | 'Coupon / App';
  rates: ParkingRates;
  heightLimitMeters?: number;
  hasEVCharging?: boolean;
  hasHandicapLots?: boolean;
  lastUpdated: string;
  distanceKm?: number;
}

export type ActiveTab = 'map' | 'list' | 'saved' | 'info';

export interface LocationPreset {
  id: string;
  name: string;
  area: string;
  latitude: number;
  longitude: number;
  icon: string;
}
