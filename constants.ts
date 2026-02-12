
import { Flight } from './types';

export const BELEM_COORDS: [number, number] = [-1.3792, -48.4763];

export const BOUNDING_BOX = {
  lamin: -2.5,  // Sul
  lomin: -50.0, // Oeste
  lamax: -0.5,  // Norte
  lomax: -47.0  // Leste
};

export const MOCK_FLIGHTS: Flight[] = [
  {
    icao24: 'a1b2c3',
    callsign: 'GLO1978',
    origin_country: 'Brazil',
    latitude: -1.3784,
    longitude: -48.4762,
    baro_altitude: 10668,
    on_ground: false,
    velocity: 230,
    true_track: 45,
    vertical_rate: 0,
    status: 'no ar',
    airline: 'GOL',
    origin: 'GRU',
    destination: 'BEL',
    scheduledTime: '14:30'
  },
  {
    icao24: 'd4e5f6',
    callsign: 'AZU4521',
    origin_country: 'Brazil',
    latitude: -1.4201,
    longitude: -48.5103,
    baro_altitude: 0,
    on_ground: true,
    velocity: 0,
    true_track: 180,
    vertical_rate: 0,
    status: 'em solo',
    airline: 'Azul',
    origin: 'BEL',
    destination: 'VCP',
    scheduledTime: '15:15'
  },
  {
    icao24: 'g7h8i9',
    callsign: 'TAM3305',
    origin_country: 'Brazil',
    latitude: -1.1550,
    longitude: -48.2901,
    baro_altitude: 11000,
    on_ground: false,
    velocity: 240,
    true_track: 210,
    vertical_rate: -5,
    status: 'no ar',
    airline: 'LATAM',
    origin: 'BSB',
    destination: 'BEL',
    scheduledTime: '16:00'
  },
  {
    icao24: 'j0k1l2',
    callsign: 'VOE2234',
    origin_country: 'Brazil',
    latitude: -1.3850,
    longitude: -48.4801,
    baro_altitude: 500,
    on_ground: false,
    velocity: 120,
    true_track: 60,
    vertical_rate: -2,
    status: 'no ar',
    airline: 'Voepass',
    origin: 'MAB',
    destination: 'BEL',
    scheduledTime: '17:10'
  }
];

export const AIRLINE_LOGOS: Record<string, string> = {
  'GOL': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Logo_GOL.svg/2560px-Logo_GOL.svg.png',
  'Azul': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Logo_Azul_Linhas_A%C3%A9reas_Brasileiras.svg/1200px-Logo_Azul_Linhas_A%C3%A9reas_Brasileiras.svg.png',
  'LATAM': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/LATAM_Airlines_logo_2014.svg/2560px-LATAM_Airlines_logo_2014.svg.png'
};
