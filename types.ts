
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
  status: 'Em Voo' | 'Programado' | 'Atrasado' | 'Cancelado' | 'No Solo';
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
  AIRBORNE = 'Em Voo',
  SCHEDULED = 'Programado',
  DELAYED = 'Atrasado',
  CANCELLED = 'Cancelado',
  GROUNDED = 'No Solo'
}
