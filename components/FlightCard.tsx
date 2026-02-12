
import React from 'react';
import { Flight, FlightStatus } from '../types';

interface FlightCardProps {
  flight: Flight;
  onClick: (f: Flight) => void;
  isSelected: boolean;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight, onClick, isSelected }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case FlightStatus.AIRBORNE: return 'bg-emerald-500 text-white border-emerald-600';
      case FlightStatus.DELAYED: return 'bg-orange-500 text-white border-orange-600';
      case FlightStatus.CANCELLED: return 'bg-red-500 text-white border-red-600';
      case FlightStatus.SCHEDULED: return 'bg-blue-500 text-white border-blue-600';
      default: return 'bg-gray-500 text-white border-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.toUpperCase();
  };

  return (
    <div 
      onClick={() => onClick(flight)}
      className={`p-5 border-b hover:bg-blue-50/50 cursor-pointer transition-all duration-300 relative ${isSelected ? 'bg-blue-50 border-l-8 border-l-blue-700 shadow-inner scale-[0.98]' : 'bg-white'}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <span className="font-black text-2xl text-blue-950 tracking-tighter leading-none">{flight.callsign}</span>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1.5">{flight.airline}</span>
        </div>
        <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg shadow-sm border-b-2 ${getStatusColor(flight.status)}`}>
          {getStatusLabel(flight.status)}
        </span>
      </div>

      <div className="flex items-center justify-between bg-blue-900/5 p-3 rounded-xl mb-4 border border-blue-900/10">
        <div className="text-center flex-1">
          <p className="text-[8px] text-gray-400 uppercase font-black mb-1">Origem</p>
          <p className="font-black text-blue-900 text-xl leading-none">{flight.origin}</p>
        </div>
        <div className="px-6 flex flex-col items-center">
            <div className="h-0.5 w-12 bg-blue-100 relative">
                <i className="fas fa-plane text-[10px] text-blue-200 absolute -top-1 left-1/2 -translate-x-1/2"></i>
            </div>
        </div>
        <div className="text-center flex-1">
          <p className="text-[8px] text-gray-400 uppercase font-black mb-1">Destino</p>
          <p className="font-black text-blue-900 text-xl leading-none">{flight.destination}</p>
        </div>
      </div>

      <div className="flex justify-between items-center text-[11px] font-bold">
        <div className="flex items-center gap-2 text-gray-500">
          <div className="bg-blue-100 p-1.5 rounded-lg">
            <i className="far fa-clock text-blue-700"></i>
          </div>
          <span>Previsto para: <span className="text-blue-900 font-black">{flight.scheduledTime}</span></span>
        </div>
        {flight.baro_altitude !== null && flight.baro_altitude > 0 && (
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
            <i className="fas fa-angles-up text-[10px]"></i>
            <span className="font-black">{Math.round(flight.baro_altitude * 3.28084).toLocaleString()} pés</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightCard;
