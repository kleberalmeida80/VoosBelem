
import React from 'react';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  lastUpdated: Date | null;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, setSearchTerm, lastUpdated }) => {
  return (
    <header className="bg-blue-700 text-white p-4 shadow-md z-30 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-white p-2 rounded-full text-blue-700 shadow-inner">
          <i className="fas fa-plane-departure text-xl"></i>
        </div>
        <div>
          <h1 className="text-xl font-bold leading-none tracking-tight">Voos Belém</h1>
          <p className="text-[10px] text-blue-100 uppercase font-black tracking-widest mt-1">Tempo Real • Val-de-Cans (BEL)</p>
        </div>
      </div>

      <div className="flex-1 w-full max-w-md relative">
        <input 
          type="text" 
          placeholder="Buscar voo, companhia ou cidade..."
          className="w-full py-2.5 px-11 rounded-full text-gray-800 outline-none focus:ring-4 focus:ring-blue-400/50 shadow-sm transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
      </div>

      <div className="text-right hidden md:block">
        <p className="text-[9px] text-blue-200 uppercase font-bold">Última atualização:</p>
        <p className="text-sm font-mono font-bold">
          {lastUpdated ? lastUpdated.toLocaleTimeString('pt-BR') : 'Carregando...'}
        </p>
      </div>
    </header>
  );
};

export default Header;
