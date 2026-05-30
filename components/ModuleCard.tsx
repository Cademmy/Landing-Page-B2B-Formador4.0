
import React from 'react';
import { Module } from '../types';

interface ModuleCardProps {
  module: Module;
  onViewDetails: (id: string) => void;
  onBuy: (id: string) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, onViewDetails, onBuy }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full overflow-hidden group">
      <div className="h-40 bg-gradient-to-br from-brand-bright-orange to-brand-vino p-6 flex items-center justify-center relative overflow-hidden">
        <span className="text-6xl relative z-10 group-hover:scale-110 transition-transform">{module.icon}</span>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold text-brand-orange uppercase tracking-widest">{module.duration}</span>
          <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded text-gray-500">{module.modality}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-brand-orange transition-colors">{module.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{module.description}</p>
        
        <div className="mt-auto pt-4 border-t border-gray-50">
          <div className="flex flex-col gap-1.5 mb-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-gray-700">Inversión por Cohorte:</span>
              <span className="font-black text-brand-vino">${module.priceB2B.toLocaleString()} MXN</span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-gray-400 font-semibold uppercase tracking-tight">
              <span>*Grupo de máximo 30 personas*</span>
              <span>100% deducible</span>
            </div>
            
            <details className="mt-1 group/details">
              <summary className="text-[10px] text-gray-400 hover:text-gray-600 cursor-pointer list-none flex items-center gap-1 font-semibold">
                <span className="transition-transform group-open/details:rotate-90">▸</span> Ver referencia individual (B2C)
              </summary>
              <div className="pt-1.5 pb-0.5 px-2 text-[11px] text-gray-500 bg-gray-50 rounded mt-1 flex justify-between items-center">
                <span>Inscripción Individual:</span>
                <span className="font-bold text-gray-700">${module.priceB2C.toLocaleString()} MXN</span>
              </div>
            </details>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button 
              id={`details-${module.id}`}
              onClick={() => onViewDetails(module.id)}
              className="px-4 py-2.5 text-xs font-bold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition uppercase tracking-wider text-center"
            >
              Ficha técnica
            </button>
            <button 
              id={`enroll-${module.id}`}
              onClick={() => onBuy(module.id)}
              className="px-4 py-2.5 text-xs font-bold text-white bg-brand-orange hover:bg-brand-red rounded-lg transition shadow-md shadow-brand-orange/20 uppercase tracking-wider text-center"
            >
              Solicitar propuesta para mi grupo / generación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
