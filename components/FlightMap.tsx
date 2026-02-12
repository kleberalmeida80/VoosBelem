
import React, { useEffect, useRef } from 'react';
import { Flight } from '../types';
import { BELEM_COORDS } from '../constants';

declare const L: any;

interface FlightMapProps {
  flights: Flight[];
  selectedFlight: Flight | null;
  onMarkerClick: (f: Flight) => void;
}

const FlightMap: React.FC<FlightMapProps> = ({ flights, selectedFlight, onMarkerClick }) => {
  const mapRef = useRef<any | null>(null);
  const markersRef = useRef<Record<string, any>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current, {
        zoomControl: false
    }).setView(BELEM_COORDS, 10);

    L.control.zoom({ position: 'topright' }).addTo(mapRef.current);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(mapRef.current);

    const airportIcon = L.divIcon({
        html: '<div class="bg-white p-1 rounded-full shadow-lg border-2 border-blue-800 flex items-center justify-center animate-pulse"><i class="fas fa-tower-observation text-blue-800 text-lg"></i></div>',
        className: 'custom-airport-icon',
        iconSize: [34, 34],
        iconAnchor: [17, 17]
    });
    
    L.marker(BELEM_COORDS, { icon: airportIcon, zIndexOffset: 1000 }).addTo(mapRef.current)
        .bindPopup('<div class="font-bold text-blue-900">Aeroporto de Belém (BEL)</div><div class="text-[10px] text-gray-500">Val-de-Cans • SBEG</div>');

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const currentIcaos = flights.map(f => f.icao24);
    
    Object.keys(markersRef.current).forEach(icao => {
      if (!currentIcaos.includes(icao)) {
        markersRef.current[icao].remove();
        delete markersRef.current[icao];
      }
    });

    flights.forEach(flight => {
      const { icao24, latitude, longitude, true_track, callsign, on_ground, destination, origin } = flight;
      
      if (latitude === null || longitude === null) return;

      const rotation = true_track || 0;
      
      let colorClass = 'text-gray-400';
      if (!on_ground) {
        if (destination === 'BEL') {
          colorClass = 'text-emerald-500';
        } else if (origin === 'BEL') {
          colorClass = 'text-orange-500';
        } else {
          colorClass = 'text-blue-500';
        }
      }
      
      const planeIcon = L.divIcon({
        html: `<div style="transform: rotate(${rotation}deg)" class="custom-plane-icon transition-all duration-1000">
                <i class="fas fa-plane ${colorClass} text-3xl drop-shadow-xl"></i>
               </div>`,
        className: 'plane-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      if (markersRef.current[icao24]) {
        markersRef.current[icao24].setLatLng([latitude, longitude]);
        markersRef.current[icao24].setIcon(planeIcon);
      } else {
        const marker = L.marker([latitude, longitude], { 
            icon: planeIcon,
            zIndexOffset: on_ground ? 0 : 500 
        })
          .addTo(mapRef.current!)
          .on('click', () => onMarkerClick(flight));
        
        marker.bindTooltip(`<b>${callsign}</b>`, { 
            permanent: false, 
            direction: 'top',
            offset: [0, -12],
            className: 'font-bold rounded-lg border-none shadow-lg'
        });
        markersRef.current[icao24] = marker;
      }
    });
  }, [flights, onMarkerClick]);

  useEffect(() => {
    if (selectedFlight && mapRef.current) {
      mapRef.current.panTo([selectedFlight.latitude, selectedFlight.longitude]);
      if (markersRef.current[selectedFlight.icao24]) {
          const f = selectedFlight;
          const content = `
            <div class="p-3 min-w-[180px] font-sans">
                <div class="flex items-center justify-between border-b pb-2 mb-3">
                    <h3 class="font-black text-blue-900 text-xl">${f.callsign}</h3>
                    <span class="text-[9px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase">${f.airline}</span>
                </div>
                <div class="space-y-2 text-xs text-gray-700">
                    <div class="flex justify-between items-center"><span class="text-gray-400 font-bold uppercase text-[9px]">Altitude</span> <b class="text-blue-900">${f.baro_altitude ? Math.round(f.baro_altitude * 3.28084).toLocaleString() + ' pés' : 'No Solo'}</b></div>
                    <div class="flex justify-between items-center"><span class="text-gray-400 font-bold uppercase text-[9px]">Velocidade</span> <b class="text-blue-900">${f.velocity ? Math.round(f.velocity * 1.94384) + ' nós' : '---'}</b></div>
                    <div class="flex justify-between items-center"><span class="text-gray-400 font-bold uppercase text-[9px]">Rumo</span> <b class="text-blue-900">${Math.round(f.true_track || 0)}°</b></div>
                    
                    <div class="mt-4 pt-3 border-t-2 border-dashed border-gray-100 flex justify-between items-center gap-4">
                        <div class="text-center">
                            <p class="text-[8px] uppercase font-black text-gray-400 mb-0.5">Origem</p>
                            <p class="font-black text-blue-900 text-lg leading-tight">${f.origin}</p>
                        </div>
                        <div class="bg-gray-50 rounded-full p-1.5 shadow-inner">
                            <i class="fas fa-arrow-right text-blue-200 text-[10px]"></i>
                        </div>
                        <div class="text-center">
                            <p class="text-[8px] uppercase font-black text-gray-400 mb-0.5">Destino</p>
                            <p class="font-black text-blue-900 text-lg leading-tight">${f.destination}</p>
                        </div>
                    </div>
                </div>
            </div>
          `;
          markersRef.current[f.icao24].bindPopup(content, { maxWidth: 220 }).openPopup();
      }
    }
  }, [selectedFlight]);

  return <div ref={containerRef} className="h-full w-full" />;
};

export default FlightMap;
