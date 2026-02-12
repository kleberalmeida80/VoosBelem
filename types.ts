
export interface Flight {
  icao24: string;
  callsign: string;
  origin_country: string;
  longitude: number;
  latitude: number;
  baro_altitude: number | null;
  on_ground: boolean;
  velocity: number | null;
  true_track: number | null;
  vertical_rate: number | null;
  status: 'no ar' | 'programado' | 'atrasado' | 'cancelado' | 'em solo';
  airline: string;
  origin: string;
  destination: string;
  scheduledTime?: string;
}

export enum FlightTab {
  ARRIVALS = 'arrivals',
  DEPARTURES = 'departures'
}

export enum FlightStatus {
  AIRBORNE = 'no ar',
  SCHEDULED = 'programado',
  DELAYED = 'atrasado',
  CANCELLED = 'cancelado',
  GROUNDED = 'em solo'
}
