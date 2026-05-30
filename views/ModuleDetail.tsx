
import React, { useEffect, useState } from 'react';
import { Module } from '../types';

interface ModuleDetailProps {
  module: Module;
  onBack: () => void;
  onEnroll: (id: string) => void;
}

const ModuleDetail: React.FC<ModuleDetailProps> = ({ module, onBack, onEnroll }) => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="animate-in slide-in-from-right duration-500 bg-gray-50 min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <button 
          onClick={onBack}
          className="mb-8 text-gray-500 hover:text-brand-orange flex items-center gap-2 font-bold transition group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Volver al catálogo de especialidades
        </button>
        
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-br from-brand-vino via-brand-orange to-brand-vino p-8 md:p-12 text-white relative overflow-hidden">
             <div className="relative z-10">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-bright-orange/20 backdrop-blur-md rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-white/20">
                 <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                 {module.duration} • {module.modality}
               </div>
               <h1 className="text-3xl md:text-6xl font-bold mb-6 leading-tight tracking-tighter">{module.title}</h1>
               <div className="flex flex-wrap gap-8 items-center border-t border-white/10 pt-8">
                  <div>
                    <p className="text-[10px] opacity-60 uppercase font-bold tracking-widest mb-1">Inversión Individual</p>
                    <p className="text-3xl font-bold">${module.priceB2C.toLocaleString()} <span className="text-xs font-normal opacity-60">MXN</span></p>
                  </div>
                  <div className="h-10 w-px bg-white/10 hidden md:block"></div>
                  <div>
                    <p className="text-[10px] opacity-60 uppercase font-bold tracking-widest mb-1">Fecha Programada</p>
                    <p className="text-lg font-bold">{module.date}</p>
                  </div>
                  <div className="md:ml-auto">
                    <button 
                      onClick={() => onEnroll(module.id)}
                      className="px-6 py-3 bg-white text-brand-vino rounded-xl font-bold text-base hover:bg-brand-yellow/10 transition shadow-lg"
                    >
                      Solicitar propuesta para mi grupo / generación
                    </button>
                  </div>
               </div>
             </div>
             <div className="absolute right-[-5%] bottom-[-10%] opacity-10 text-[350px] leading-none select-none font-bold italic">
               {module.icon}
             </div>
          </div>
          
          <div className="p-8 md:p-16 grid lg:grid-cols-12 gap-16">
            {/* Content Left */}
            <div className="lg:col-span-8 space-y-16">
              
              {/* Objective Section */}
              {module.objective && (
                <section>
                  <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-4">
                    <span className="w-12 h-12 bg-brand-orange/20 text-brand-orange rounded-2xl flex items-center justify-center text-2xl">🎯</span>
                    Objetivo General
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed font-medium italic border-l-4 border-brand-orange pl-6">
                    "{module.objective}"
                  </p>
                </section>
              )}

              {/* Particular Objectives */}
              {module.particularObjectives && (
                <section>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">Objetivos Particulares</h2>
                  <div className="space-y-4">
                    {module.particularObjectives.map((obj, i) => (
                      <div key={i} className="flex gap-4 items-center bg-gray-50 p-5 rounded-2xl border border-gray-100 hover:border-brand-orange/30 transition">
                        <div className="w-8 h-8 bg-white shadow-sm rounded-lg flex items-center justify-center font-bold text-brand-orange shrink-0 text-sm">
                          {i+1}
                        </div>
                        <p className="text-gray-700 font-bold text-sm leading-relaxed">{obj}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Subtopics Schema */}
              {module.subtopics && (
                <section>
                  <h2 className="text-2xl font-bold mb-8 text-gray-900">Estructura del Microcurso</h2>
                  <div className="grid gap-4">
                    {module.subtopics.map((topic, i) => (
                      <div key={i} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <span className="text-brand-bright-orange font-mono">0{i+1}</span> {topic.title}
                          </h3>
                          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                            {topic.items.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-3 text-gray-600 text-sm">
                                <span className="w-1.5 h-1.5 bg-brand-orange/20 border border-brand-orange rounded-full mt-1.5 shrink-0"></span>
                                <span className="font-medium">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Resources & Assessment */}
              <div className="grid md:grid-cols-2 gap-6">
                <section className="p-6 bg-brand-vino/10 rounded-2xl border border-brand-vino/20">
                  <h3 className="font-bold text-brand-vino mb-4 uppercase tracking-widest text-[10px] flex items-center gap-2">
                    <span>🧰</span> Recursos Didácticos
                  </h3>
                  <ul className="space-y-2">
                    {module.resources?.map((res, i) => (
                      <li key={i} className="text-sm text-brand-vino flex items-center gap-2">
                        <span className="w-1 h-1 bg-brand-orange rounded-full"></span>
                        {res}
                      </li>
                    )) || <li className="text-sm opacity-60 italic">Materiales incluidos en plataforma.</li>}
                  </ul>
                </section>
                
                <section className="p-6 bg-green-50 rounded-2xl border border-green-100">
                  <h3 className="font-bold text-green-900 mb-4 uppercase tracking-widest text-[10px] flex items-center gap-2">
                    <span>📊</span> Evaluación
                  </h3>
                  <p className="text-sm text-green-800 leading-relaxed font-medium">
                    {module.assessment || "Evaluación formativa y diagnóstica mediante retos y cuestionarios automatizados."}
                  </p>
                </section>
              </div>

              {/* Methodology */}
              <section className="bg-brand-yellow/10 p-8 rounded-2xl border border-brand-yellow/20">
                <h2 className="text-lg font-bold mb-3 text-brand-vino">Metodología de Trabajo</h2>
                <p className="text-brand-vino text-sm leading-relaxed font-medium">
                  {module.methodology}
                </p>
              </section>

              {/* Certification Clarity Section */}
              <section className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
                <h2 className="text-xl font-bold mb-4 text-blue-900 flex items-center gap-2">
                  <span>ℹ️</span> Claridad sobre la Certificación
                </h2>
                <p className="text-blue-800 text-sm leading-relaxed font-medium mb-4">
                  Este programa está diseñado para que tú o tu organización dejen de depender de la improvisación al capacitar. Al finalizar, los participantes quedan <strong>preparados para avanzar en la ruta formal posterior</strong>.
                </p>
                <div className="bg-white/50 p-4 rounded-xl border border-blue-200">
                  <p className="text-xs text-blue-900 font-bold italic">
                    "Nota importante: El proceso está sujeto a evaluación de competencia. El certificado se emite solo si el candidato resulta competente."
                  </p>
                </div>
              </section>
            </div>
            
            {/* Sidebar Right - Purchase & Custom Quoting Selector */}
            <div className="lg:col-span-4 space-y-6">
              <div className="sticky top-24">
                <div className="bg-gray-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden border border-white/5">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange blur-[80px] opacity-20"></div>
                  
                  <h3 className="text-xl font-bold mb-6 text-center uppercase tracking-wider text-xs text-brand-bright-orange">Opciones de Inversión</h3>
                  
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                    {/* B2C Single Ticket */}
                    <div className="pb-4 border-b border-white/10">
                      <p className="text-[10px] opacity-60 uppercase font-bold tracking-widest mb-1">Ticket Individual B2C</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-white">${module.priceB2C.toLocaleString()}</span>
                        <span className="text-xs text-gray-400 font-medium uppercase">MXN</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">Ideal si solo necesitas capacitar a un colaborador.</p>
                    </div>

                    {/* B2B Group Baseline */}
                    <div>
                      <p className="text-[10px] text-brand-bright-orange uppercase font-bold tracking-widest mb-1">Plan Corporativo B2B</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white">${module.priceB2B.toLocaleString()}</span>
                        <span className="text-xs text-brand-bright-orange font-bold uppercase">MXN</span>
                      </div>
                      <p className="text-[10px] text-green-400 font-semibold mt-1">✓ Incluye Constancias STPS DC-3 • Deducible</p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-start gap-2.5 text-xs text-gray-300 font-medium">
                        <span className="text-green-400 mt-0.5">✓</span>
                        <span>Alineal oficial al estándar nacional EC0217.01</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-xs text-gray-300 font-medium">
                        <span className="text-green-400 mt-0.5">✓</span>
                        <span>Material educativo digital y Banco de Prompts Pro</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-xs text-gray-300 font-medium">
                        <span className="text-green-400 mt-0.5">✓</span>
                        <span>Expediente de evidencias listo para auditorías ISO 9001</span>
                      </div>
                    </div>
                    
                    <button 
                      id={`quote-btn-${module.id}`}
                      onClick={() => onEnroll(module.id)}
                      className="w-full py-4 bg-brand-orange hover:bg-brand-red transition rounded-xl font-bold text-sm uppercase tracking-wider mb-2 shadow-lg shadow-brand-orange/40"
                    >
                      Solicitar Propuesta B2B ➔
                    </button>
                  </div>

                  <p className="text-[9px] text-center opacity-40 uppercase tracking-widest font-bold mt-6">
                    Factura Electrónica SAT • Cumplimiento Normativo
                  </p>
                </div>

                <div className="mt-6 p-6 bg-brand-orange/5 border border-brand-orange/20 rounded-2xl">
                  <h4 className="text-xs font-bold text-brand-orange uppercase tracking-widest mb-3">CONOCER y Certificación (Claridad Corporativa)</h4>
                  <p className="text-[11px] text-gray-700 leading-relaxed mb-3">
                    <strong>Información de Transparencia de Procesos:</strong> La certificación nacional oficial ante el CONOCER (para los estándares EC0217.01 y EC0301) es un proceso 100% formal y opcional. El programa Instructor 4.0 brinda el entrenamiento y la preparación andragógica exhaustiva necesaria.
                  </p>
                  <p className="text-[11px] text-gray-700 leading-relaxed mb-3">
                    El juicio de competencia se realiza mediante una evaluación formal por parte de un evaluador independiente del Organismo Certificador. El certificado con registro SEP se expide únicamente si el candidato resulta evaluado como <strong>Competente</strong>.
                  </p>
                  <div className="space-y-3.5 border-t border-brand-orange/10 pt-3.5">
                    <div>
                      <p className="text-[11px] font-bold text-gray-900">• Costos Sin Promoción (Por persona):</p>
                      <p className="text-[10px] text-gray-500 pl-3 mt-1 leading-normal">
                        - <strong>Evaluación Formal Completa:</strong> $5,000 MXN (incluye alineación final individual, plan de evaluación estructurado y el examen formal). NO es el costo por el portafolio integrado del microcurso.<br/>
                        - <strong>Emisión de Certificado:</strong> $1,500 MXN (se liquida única y exclusivamente al resultar Competente).
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-brand-orange">• Promoción de Ruta Completa:</p>
                      <p className="text-[10px] text-gray-600 pl-3 mt-1 leading-normal font-semibold">
                        Si tu empresa inscribe a su grupo en la <strong>Ruta Completa</strong>, bonificamos en su totalidad el costo de <strong>$5,000 MXN</strong> de la evaluación formal. Solo cubrirán el trámite de emisión de <strong>$1,500 MXN</strong> de aquellos instructores que decidan evaluarse y resulten dictaminados como Competentes.
                      </p>
                    </div>
                    <div className="pt-2 border-t border-gray-150 text-center">
                      <p className="text-[9px] text-gray-400 font-bold italic leading-tight">
                        “La certificación se obtiene por evaluación; el certificado se emite únicamente si el candidato resulta competente.”
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-8 bg-white border-2 border-dashed border-gray-100 rounded-3xl text-center shadow-sm">
                  <p className="text-gray-900 font-bold mb-3 text-sm">¿Necesitas una propuesta in-company?</p>
                  <a 
                    href="mailto:contacto@cademmy.com" 
                    className="inline-block text-brand-orange font-bold text-xs uppercase tracking-wider hover:scale-105 transition-transform border-b-2 border-brand-orange pb-1"
                  >
                    Asesoría de Ventas: contacto@cademmy.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetail;
