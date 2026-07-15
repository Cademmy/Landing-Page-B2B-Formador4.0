
import React, { useState, useEffect } from 'react';
import Home from './views/Home';
import ModuleDetail from './views/ModuleDetail';
import AIChat from './components/AIChat';
import HubSpotForm from './components/HubSpotForm';
import { MODULES } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<{ type: 'home' | 'detail', moduleId?: string }>({ type: 'home' });
  const [showLegal, setShowLegal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showStripeSimulation, setShowStripeSimulation] = useState({ show: false, enrollId: '' });

  const selectedModule = MODULES.find(m => m.id === currentView.moduleId);

  const handleBooking = () => {
    // Abrir el link de Microsoft Bookings
    window.open('https://outlook.office.com/book/Capacitacin@cademmy.com/?ismsaljsauthenabled', '_blank');
    // También navegar a la sección de contacto por si el popup es bloqueado
    navigateTo('contact');
    setIsMenuOpen(false);
  };

  const handleEnroll = (id: string) => {
    setShowStripeSimulation({ show: true, enrollId: id });
    setIsMenuOpen(false);
  };

  const getEnrollmentDetails = () => {
    const id = showStripeSimulation.enrollId;
    if (!id) return { requirement: '', price: '' };

    if (id === 'plan-iniciador') {
      return {
        requirement: 'Plan Iniciador B2B - Proyecto Piloto',
        price: '$7,990 MXN + IVA / instructor · 34 horas de curso'
      };
    }
    if (id === 'plan-equipos') {
      return {
        requirement: 'Plan Ruta Unificada - Escalamiento de Equipos B2B',
        price: '$67,660 MXN / ruta corporativa total'
      };
    }
    if (id === 'plan-enterprise') {
      return {
        requirement: 'Plan In-Company Enterprise B2B (Custom)',
        price: 'Bajo cotización / Tarifa acordada'
      };
    }
    if (id === 'full') {
      return {
        requirement: 'Instructor 4.0 - Ruta Completa (7 Microcursos)',
        price: '$67,660 MXN (B2B Corporativo) / $12,240 MXN (B2C Individual)'
      };
    }

    const mod = MODULES.find(m => m.id === id);
    if (mod) {
      return {
        requirement: `Microcurso: ${mod.title}`,
        price: `$${mod.priceB2B.toLocaleString()} MXN (Plan Corporativo B2B) / $${mod.priceB2C.toLocaleString()} MXN (Individual B2C)`
      };
    }

    return {
      requirement: id,
      price: 'A convenir'
    };
  };

  const { requirement, price } = getEnrollmentDetails();

  const navigateTo = (sectionId: string) => {
    setIsMenuOpen(false);
    if (currentView.type !== 'home') {
      setCurrentView({ type: 'home' });
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const contextForAI = currentView.type === 'detail' && selectedModule
    ? `Microcurso actual: ${selectedModule.title}. ID: ${selectedModule.id}. Objetivo general: ${selectedModule.objective}. Temario: ${JSON.stringify(selectedModule.subtopics)}. Inversión Individual: $${selectedModule.priceB2C} MXN. Inversión Corporativa B2B de grupo: $${selectedModule.priceB2B} MXN. Nota de transparencia: Instructor 4.0 ayuda a estandarizar capacitación, generar instrumentos y preparar evidencia; no garantiza certificación ni cumplimiento automático.`
    : `Página principal de Instructor 4.0 como sistema de gobernanza de capacitación corporativa. El objetivo es estandarizar instructores internos, generar método común, instrumentos de evaluación, portafolios de evidencia e IA con criterios. La ruta opcional a certificación CONOCER EC0217.01 y EC0301 depende de evaluación formal independiente y dictamen competente.`;

  const getStripePrice = () => {
    if (showStripeSimulation.enrollId === 'full') {
      return 12240;
    }
    const mod = MODULES.find(m => m.id === showStripeSimulation.enrollId);
    if (!mod) return 0;
    return mod.priceB2C;
  };

  return (
    <div className="min-h-screen relative cademmy-page-bg">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => {
              setCurrentView({ type: 'home' });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img src="/cademmy-isologotipo-vertical.jpeg" alt="CADEMMY" className="h-16 w-auto" referrerPolicy="no-referrer" />
          </div>
          
          <div className="hidden md:flex items-center gap-2 glass-panel rounded-full px-3 py-2">
            <button onClick={() => navigateTo('pain-points')} className="px-4 py-2 rounded-full text-[13px] font-bold text-brand-slate hover:text-brand-ink hover:bg-white/70 transition">DIAGNÓSTICO</button>
            <button onClick={() => navigateTo('how-it-works')} className="px-4 py-2 rounded-full text-[13px] font-bold text-brand-slate hover:text-brand-ink hover:bg-white/70 transition">SISTEMA</button>
            <button onClick={() => navigateTo('modules')} className="px-4 py-2 rounded-full text-[13px] font-bold text-brand-slate hover:text-brand-ink hover:bg-white/70 transition">RUTA MODULAR</button>
            <button onClick={() => navigateTo('benefits')} className="px-4 py-2 rounded-full text-[13px] font-bold text-brand-slate hover:text-brand-ink hover:bg-white/70 transition">BENEFICIOS</button>
            <button onClick={() => navigateTo('faq')} className="px-4 py-2 rounded-full text-[13px] font-bold text-brand-slate hover:text-brand-ink hover:bg-white/70 transition">PREGUNTAS FRECUENTES</button>
            <button 
              onClick={handleBooking}
              className="px-5 py-2.5 cademmy-primary rounded-full text-[13px] font-bold transition"
            >
              DIAGNÓSTICO EJECUTIVO
            </button>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-brand-ink p-2 glass-panel rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {isMenuOpen ? <line x1="18" y1="6" x2="6" y2="18" /> : <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-brand-soft pt-24 animate-in slide-in-from-top duration-300 md:hidden">
          <div className="flex flex-col items-center gap-8 p-10">
            <button onClick={() => navigateTo('pain-points')} className="text-2xl font-bold text-brand-ink">DIAGNÓSTICO</button>
            <button onClick={() => navigateTo('how-it-works')} className="text-2xl font-bold text-brand-ink">SISTEMA</button>
            <button onClick={() => navigateTo('modules')} className="text-2xl font-bold text-brand-ink">RUTA MODULAR</button>
            <button onClick={() => navigateTo('benefits')} className="text-2xl font-bold text-brand-ink">BENEFICIOS</button>
            <button onClick={() => navigateTo('faq')} className="text-2xl font-bold text-brand-ink">PREGUNTAS FRECUENTES</button>
            <button 
              onClick={handleBooking}
              className="w-full py-5 cademmy-primary rounded-2xl font-bold text-xl"
            >
              DIAGNÓSTICO EJECUTIVO
            </button>
          </div>
        </div>
      )}

      <main>
        {currentView.type === 'home' ? (
          <Home 
            onModuleClick={(id) => setCurrentView({ type: 'detail', moduleId: id })}
            onFullCourseClick={(planId) => handleEnroll(planId || 'full')}
            onBookingClick={handleBooking}
          />
        ) : (
          selectedModule && (
            <ModuleDetail 
              module={selectedModule} 
              onBack={() => setCurrentView({ type: 'home' })}
              onEnroll={handleEnroll}
            />
          )
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/70 backdrop-blur-xl py-20 border-t border-white/70">
        <div className="container mx-auto px-6 text-center md:text-left">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6 justify-center md:justify-start">
                <img src="/cademmy-isologotipo-vertical.jpeg" alt="CADEMMY LEARNING" className="h-14 w-auto" referrerPolicy="no-referrer" />
              </div>
              <p className="text-brand-muted max-w-sm mx-auto md:mx-0 mb-6 leading-relaxed font-medium">
                Sistema de gobernanza para estandarizar capacitación corporativa, documentar evidencia y profesionalizar instructores internos con IA aplicada bajo criterios.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-brand-ink mb-6 uppercase tracking-widest text-xs">Contacto Rápido</h4>
              <ul className="space-y-4 text-sm text-brand-muted font-bold">
                <li>+52 55 5293 9203</li>
                <li>contacto@cademmy.com</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-brand-ink mb-6 uppercase tracking-widest text-xs">Información Legal</h4>
              <ul className="space-y-2 text-sm text-brand-muted">
                <li><button onClick={() => setShowLegal(true)} className="hover:text-brand-orange transition font-bold">Aviso de Privacidad</button></li>
                <li><button onClick={() => setShowLegal(true)} className="hover:text-brand-orange transition font-bold">Términos de Servicio</button></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-brand-muted-bg text-center text-[10px] text-brand-muted font-bold uppercase tracking-[0.3em]">
            <p>© 2026 CADEMMY LEARNING SAS. TODOS LOS DERECHOS RESERVADOS.</p>
          </div>
        </div>
      </footer>

      {/* Enrollment Modal (HubSpot Form) */}
      {showStripeSimulation.show && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-[2rem] w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in duration-300 relative overflow-hidden">
             
             {/* Dynamic Selection Header */}
             <div className="px-6 py-5 bg-slate-50 border-b border-gray-100 flex items-center justify-between shrink-0">
               <div>
                 <span className="text-[9px] font-bold text-brand-orange uppercase tracking-[0.2em] block mb-1">
                   REQUERIMIENTO SELECCIONADO
                 </span>
                 <h3 className="text-base font-black text-gray-900 tracking-tight leading-tight">
                   {requirement || "Instructor 4.0"}
                 </h3>
                 {price && (
                   <p className="text-xs text-gray-500 font-semibold mt-1">
                     Inversión: <span className="text-brand-orange font-bold font-mono">{price}</span>
                   </p>
                 )}
               </div>
               <button 
                 onClick={() => setShowStripeSimulation({ show: false, enrollId: '' })} 
                 className="text-gray-400 hover:text-gray-950 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
               >
                 ✕
               </button>
             </div>
             
             {/* Scrollable Form Body */}
             <div className="flex-1 overflow-y-auto p-4 md:p-6">
               <HubSpotForm requirement={requirement} price={price} />
             </div>
             
             {/* Fixed Footer */}
             <div className="px-6 py-4 bg-slate-50 border-t border-gray-100 flex items-center justify-between shrink-0">
               <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                 🔒 Transmisión de Datos Segura (SSL)
               </span>
               <button 
                 onClick={() => setShowStripeSimulation({ show: false, enrollId: '' })}
                 className="text-xs text-gray-500 hover:text-brand-orange font-bold uppercase tracking-widest transition"
               >
                 Cerrar y Regresar
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Legal Modal */}
      {showLegal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl p-10 max-w-4xl w-full relative">
            <button onClick={() => setShowLegal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 text-xl">✕</button>
            <h2 className="text-2xl font-bold mb-6">Aviso de Privacidad</h2>
            <div className="prose prose-sm max-h-[60vh] overflow-y-auto pr-6 text-gray-600 mb-6 font-medium leading-relaxed">
              <p className="mb-4"><strong>Cademmy Learning SAS</strong>, responsable de la seguridad de sus datos, aplica lineamientos para proteger su información conforme a la Ley Federal de Protección de Datos Personales.</p>
              
              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-2">Ruta a Certificación</h3>
              <p className="mb-4">La participación en los programas de capacitación de Cademmy prepara al candidato para los estándares de competencia (EC0217.01 / EC0301), pero <strong>no otorga automáticamente la declaración de "competente"</strong>. El certificado oficial de CONOCER se emite únicamente tras una evaluación formal exitosa donde el candidato resulte competente.</p>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-2">Finalidades</h3>
              <p className="mb-4">Seguimiento a consultas, controles estadísticos, publicidad y prospección comercial.</p>
              <p className="mb-4">Para ejercer sus derechos ARCO, contacte a <strong>mauvaldes@cademmy.com</strong>.</p>
            </div>
            <button 
              onClick={() => setShowLegal(false)}
              className="px-8 py-3 bg-brand-orange text-white rounded-xl font-bold"
            >
              ENTENDIDO
            </button>
          </div>
        </div>
      )}

      <AIChat context={contextForAI} />
    </div>
  );
};

export default App;
