
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
    const interval = setInterval(loadData, 15000); // Atualizar a cada 15 segundos
    return () => clearInterval(interval);
  }, [loadData]);

  const uniqueCities = useMemo(() => {
    const cities = new Set<string>();
    flights.forEach(f => {
      if (f.origin !== 'BEL' && f.origin !== '---' && f.origin !== 'N/A') cities.add(f.origin);
      if (f.destination !== 'BEL' && f.destination !== '---' && f.destination !== 'N/A') cities.add(f.destination);
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

  return (
    <div className="flex flex-col h-screen app-container overflow-hidden bg-slate-100">
      <Header 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        lastUpdated={lastUpdated} 
      />

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Barra Lateral / Lista de Voos */}
        <div className="sidebar-container w-full md:w-[400px] flex flex-col bg-white shadow-2xl z-20 overflow-hidden border-r border-slate-200">
          <div className="flex border-b border-slate-100">
            <button 
              onClick={() => setActiveTab(FlightTab.ARRIVALS)}
              className={`flex-1 py-4 font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === FlightTab.ARRIVALS ? 'text-blue-700 border-b-4 border-blue-700 bg-blue-50/40' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <i className="fas fa-plane-arrival mr-2"></i> Chegadas
            </button>
            <button 
              onClick={() => setActiveTab(FlightTab.DEPARTURES)}
              className={`flex-1 py-4 font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === FlightTab.DEPARTURES ? 'text-blue-700 border-b-4 border-blue-700 bg-blue-50/40' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <i className="fas fa-plane-departure mr-2"></i> Saídas
            </button>
          </div>

          <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex flex-col gap-4">
            <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase border-2 transition-all ${statusFilter === 'all' ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105' : 'bg-white text-slate-500 border-slate-200'}`}
              >
                Todos
              </button>
              {[FlightStatus.AIRBORNE, FlightStatus.GROUNDED].map(status => (
                  <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase border-2 transition-all ${statusFilter === status ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105' : 'bg-white text-slate-500 border-slate-200'}`}
                  >
                      {status}
                  </button>
              ))}
            </div>
            
            <div className="relative group">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-1 mb-1 block tracking-tighter">Conexão por Cidade</label>
              <select 
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full text-xs font-bold p-3 rounded-xl border-2 border-slate-200 bg-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 appearance-none transition-all"
              >
                <option value="all">Todas as Cidades</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <i className="fas fa-chevron-down absolute right-4 bottom-3.5 text-blue-500 group-focus-within:rotate-180 transition-transform"></i>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide bg-slate-50/30">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4 p-10 text-center">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-100 border-t-blue-600"></div>
                  <i className="fas fa-satellite-dish absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600"></i>
                </div>
                <div>
                  <p className="text-slate-800 font-black text-sm uppercase tracking-tight">Sincronizando Radar</p>
                  <p className="text-slate-400 text-[10px] mt-1">Conectando aos receptores ADS-B...</p>
                </div>
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
              <div className="p-16 text-center">
                <div className="bg-slate-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
                  <i className="fas fa-plane-slash text-slate-300 text-3xl"></i>
                </div>
                <p className="text-slate-700 font-black text-sm">Sem voos no momento</p>
                <p className="text-slate-400 text-xs mt-2 px-6">Não detectamos tráfego aéreo com os filtros selecionados.</p>
              </div>
            )}
          </div>
        </div>

        {/* Mapa em Tempo Real */}
        <div className="map-container flex-1 relative bg-slate-200">
          <FlightMap 
            flights={flights} 
            selectedFlight={selectedFlight}
            onMarkerClick={setSelectedFlight}
          />
          
          <div className="absolute bottom-6 left-6 md:left-auto md:right-6 bg-white/95 backdrop-blur-xl p-5 rounded-3xl shadow-2xl z-[1000] text-[11px] text-slate-800 border border-white font-black space-y-4 min-w-[200px] pointer-events-none">
            <p className="text-[9px] text-blue-700 uppercase tracking-[0.2em] border-b border-slate-100 pb-3 mb-1">Legenda Técnica</p>
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                <i className="fas fa-plane-arrival text-[10px]"></i>
              </div>
              <span className="tracking-tight">Chegando em Belém</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                <i className="fas fa-plane-departure text-[10px]"></i>
              </div>
              <span className="tracking-tight">Saindo de Belém</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-xl bg-slate-400 flex items-center justify-center text-white shadow-md">
                <i className="fas fa-plane text-[10px]"></i>
              </div>
              <span className="tracking-tight text-slate-500">No Solo / Outros</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-100 py-2.5 px-8 text-[10px] font-black text-slate-400 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
            <i className="fas fa-shield-halved text-blue-500"></i>
            <span className="uppercase tracking-widest">Protocolo ADS-B Ativo</span>
        </div>
        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="uppercase tracking-tighter">Live BEL</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
