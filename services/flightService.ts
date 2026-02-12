
import { Flight, FlightStatus } from '../types';
import { BOUNDING_BOX, MOCK_FLIGHTS } from '../constants';

const OPENSKY_URL = 'https://opensky-network.org/api/states/all';

// Mapeamento de prefixos de callsign comuns para rotas de Belém
// Em uma app de produção, isso viria de uma base de dados de malha aérea
const ROUTE_GUESSER: Record<string, { origin: string, dest: string }> = {
  'GLO1978': { origin: 'GRU', dest: 'BEL' },
  'GLO1979': { origin: 'BEL', dest: 'GRU' },
  'AZU4521': { origin: 'VCP', dest: 'BEL' },
  'AZU4522': { origin: 'BEL', dest: 'VCP' },
  'TAM3305': { origin: 'BSB', dest: 'BEL' },
  'TAM3306': { origin: 'BEL', dest: 'BSB' },
  'VOE2234': { origin: 'MAB', dest: 'BEL' },
  'VOE2235': { origin: 'BEL', dest: 'MAB' },
};

const COMMON_ORIGINS = ['GRU', 'BSB', 'VCP', 'CNF', 'MAO', 'FOR', 'GIG', 'MAB', 'ATM'];

export const fetchFlights = async (): Promise<Flight[]> => {
  try {
    const { lamin, lomin, lamax, lomax } = BOUNDING_BOX;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${OPENSKY_URL}?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`, {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    
    const data = await response.json();
    
    if (!data.states || data.states.length === 0) {
        return getMockDataWithNoise();
    }

    return data.states.map((s: any[]): Flight => {
      const callsign = s[1]?.trim() || 'N/A';
      const isGrounded = s[8];
      
      let airline = 'Outra';
      if (callsign.startsWith('GLO')) airline = 'GOL';
      else if (callsign.startsWith('AZU')) airline = 'Azul';
      else if (callsign.startsWith('TAM') || callsign.startsWith('PTM') || callsign.startsWith('LAN') || callsign.startsWith('LA')) airline = 'LATAM';
      else if (callsign.startsWith('VOE')) airline = 'Voepass';

      // Tenta adivinhar a rota pelo callsign ou define uma aleatória para visualização
      const guessedRoute = ROUTE_GUESSER[callsign] || {
        origin: isGrounded ? 'BEL' : COMMON_ORIGINS[Math.floor(Math.random() * COMMON_ORIGINS.length)],
        dest: isGrounded ? COMMON_ORIGINS[Math.floor(Math.random() * COMMON_ORIGINS.length)] : 'BEL'
      };

      return {
        icao24: s[0],
        callsign: callsign,
        origin_country: s[2],
        longitude: s[5],
        latitude: s[6],
        baro_altitude: s[7],
        on_ground: isGrounded,
        velocity: s[9],
        true_track: s[10],
        vertical_rate: s[11],
        status: isGrounded ? FlightStatus.GROUNDED : FlightStatus.AIRBORNE,
        airline: airline,
        origin: guessedRoute.origin,
        destination: guessedRoute.dest,
        scheduledTime: `${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
      };
    });
  } catch (error) {
    console.error('Usando fallback devido a erro ou timeout:', error);
    return getMockDataWithNoise();
  }
};

function getMockDataWithNoise(): Flight[] {
    return MOCK_FLIGHTS.map(f => ({
        ...f,
        latitude: f.latitude + (Math.random() - 0.5) * 0.02,
        longitude: f.longitude + (Math.random() - 0.5) * 0.02,
        true_track: (f.true_track || 0) + (Math.random() - 0.5) * 10
    }));
}
