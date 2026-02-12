
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import FlightCard from './components/FlightCard';
import FlightMap from './components/FlightMap';
import { Flight, FlightTab, FlightStatus } from './types';
import { fetchFlights } from './services/flightService';

const App: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FlightTab>(FlightTab.ARRIVALS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');

  const loadData = useCallback(async () => {
    const data = await fetchFlights();
    setFlights(data);
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [loadData]);

  const uniqueCities = useMemo(() => {
    const cities = new Set<string>();
    flights.forEach(f => {
      if (f.origin !== 'BEL' && f.origin !== '---') cities.add(f.origin);
      if (f.destination !== 'BEL' && f.destination !== '---') cities.add(f.destination);
    });
    return Array.from(cities).sort();
  }, [flights]);

  const filteredFlights = useMemo(() => {
    return flights.filter(f => {
      const matchesSearch = 
        f.callsign.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.destination.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTab = activeTab === FlightTab.ARRIVALS 
        ? f.destination === 'BEL'
        : f.origin === 'BEL';

      const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
      const matchesCity = cityFilter === 'all' || f.origin === cityFilter || f.destination === cityFilter;

      return matchesSearch && matchesStatus && matchesCity && matchesTab;
    });
  }, [flights, searchTerm, activeTab, statusFilter, cityFilter]);

  const getStatusLabel = (status: string) => {
    if (status === 'all') return 'Todos os Status';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="flex flex-col h-screen app-container overflow-hidden">
      <Header 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        lastUpdated={lastUpdated} 
      />

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-[400px] flex flex-col bg-white shadow-2xl z-20 overflow-hidden">
          <div className="flex border-b">
            <button 
              onClick={() => setActiveTab(FlightTab.ARRIVALS)}
              className={`flex-1 py-4 font-black text-xs uppercase tracking-widest transition-all ${activeTab === FlightTab.ARRIVALS ? 'text-blue-700 border-b-4 border-blue-700 bg-blue-50/50' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <i className="fas fa-plane-arrival mr-2"></i> Chegadas
            </button>
            <button 
              onClick={() => setActiveTab(FlightTab.DEPARTURES)}
              className={`flex-1 py-4 font-black text-xs uppercase tracking-widest transition-all ${activeTab === FlightTab.DEPARTURES ? 'text-blue-700 border-b-4 border-blue-700 bg-blue-50/50' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <i className="fas fa-plane-departure mr-2"></i> Saídas
            </button>
          </div>

          <div className="p-3 bg-gray-50 border-b flex flex-col gap-3">
            <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide pb-1">
              {['all', FlightStatus.AIRBORNE, FlightStatus.GROUNDED].map(status => (
                  <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border-2 transition-all ${statusFilter === status ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105' : 'bg-white text-gray-500 border-gray-200 hover:border-blue-200'}`}
                  >
                      {getStatusLabel(status)}
                  </button>
              ))}
            </div>
            
            <div className="relative">
              <label className="text-[9px] font-black uppercase text-gray-400 ml-1 mb-1 block">Filtrar por Cidade</label>
              <select 
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full text-xs font-bold p-2.5 rounded-lg border-2 border-gray-200 bg-white outline-none focus:border-blue-500 appearance-none transition-colors"
              >
                <option value="all">Todas as Cidades</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <i className="fas fa-location-dot absolute right-3 bottom-3 text-blue-400"></i>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-700"></div>
                <p className="text-gray-500 font-bold text-sm animate-pulse">Sincronizando radares...</p>
              </div>
            ) : filteredFlights.length > 0 ? (
              filteredFlights.map(flight => (
                <FlightCard 
                  key={flight.icao24} 
                  flight={flight} 
                  onClick={setSelectedFlight}
                  isSelected={selectedFlight?.icao24 === flight.icao24}
                />
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-plane-slash text-gray-300 text-2xl"></i>
                </div>
                <p className="text-gray-600 font-bold text-sm">Nenhum voo encontrado</p>
                <p className="text-gray-400 text-xs mt-1">Tente ajustar seus filtros ou busca.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 relative map-container">
          <FlightMap 
            flights={flights} 
            selectedFlight={selectedFlight}
            onMarkerClick={setSelectedFlight}
          />
          
          <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl z-[1000] text-[11px] text-gray-800 border border-white/50 font-black space-y-3 min-w-[180px]">
            <p className="text-[9px] text-blue-600 uppercase tracking-widest border-b pb-2 mb-2">Legenda do Radar</p>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <i className="fas fa-plane-arrival text-[9px]"></i>
              </div>
              <span>Chegando em Belém</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-lg bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-200">
                <i className="fas fa-plane-departure text-[9px]"></i>
              </div>
              <span>Saindo de Belém</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-lg bg-gray-400 flex items-center justify-center text-white shadow-md">
                <i className="fas fa-plane text-[9px]"></i>
              </div>
              <span>Em Solo / Outros</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t py-2 px-6 text-[10px] font-bold text-gray-400 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
            <i className="fas fa-satellite"></i>
            <span>Rede OpenSky Network</span>
        </div>
        <div className="flex items-center gap-2 text-emerald-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Transmissão em tempo real</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
