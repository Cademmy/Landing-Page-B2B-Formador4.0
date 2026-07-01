
import React from 'react';
import { Module } from '../types';

interface ModuleCardProps {
  module: Module;
  onViewDetails: (id: string) => void;
  onBuy: (id: string) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, onViewDetails, onBuy }) => {
  return (
    <div className="glass-card rounded-[1.75rem] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden group">
      <div className="h-40 bg-white/45 p-6 flex items-center justify-center relative overflow-hidden border-b border-white/80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(245,130,31,0.20),transparent_18rem)]"></div>
        <span className="text-6xl relative z-10 group-hover:scale-110 transition-transform">{module.icon}</span>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold text-brand-orange uppercase tracking-widest">{module.duration}</span>
          <span className="text-xs font-semibold px-2 py-1 bg-white/70 rounded-lg text-brand-slate border border-white">{module.modality}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 text-brand-ink group-hover:text-brand-orange transition-colors">{module.title}</h3>
        <p className="text-brand-slate text-sm mb-4 line-clamp-3 font-medium leading-relaxed">{module.description}</p>
        
        <div className="mt-auto pt-4 border-t border-white/80">
          <div className="flex flex-col gap-1.5 mb-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-brand-slate">Desglose por microcurso:</span>
              <span className="font-black text-brand-ink">${module.priceB2B.toLocaleString()} MXN</span>
            </div>
            <div className="flex flex-wrap justify-between gap-2 text-[10px] text-brand-muted font-semibold uppercase tracking-tight">
              <span>Incluido en paquete institucional</span>
              <span>Disponible por cotización</span>
            </div>
            
            <details className="mt-1 group/details">
              <summary className="text-[10px] text-brand-muted hover:text-brand-ink cursor-pointer list-none flex items-center gap-1 font-semibold">
                <span className="transition-transform group-open/details:rotate-90">▸</span> Ver referencia individual
              </summary>
              <div className="pt-1.5 pb-0.5 px-2 text-[11px] text-brand-muted bg-white/70 rounded-lg mt-1 flex justify-between items-center">
                <span>Inscripción Individual:</span>
                <span className="font-bold text-brand-ink">${module.priceB2C.toLocaleString()} MXN</span>
              </div>
            </details>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button 
              id={`details-${module.id}`}
              onClick={() => onViewDetails(module.id)}
              className="px-4 py-2.5 text-xs font-bold text-brand-ink glass-panel rounded-xl hover:bg-white/80 transition uppercase tracking-wider text-center"
            >
              Ver alcance
            </button>
            <button 
              id={`enroll-${module.id}`}
              onClick={() => onBuy(module.id)}
              className="px-4 py-2.5 text-xs font-bold cademmy-primary rounded-xl transition uppercase tracking-wider text-center leading-tight"
            >
              Solicitar propuesta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
