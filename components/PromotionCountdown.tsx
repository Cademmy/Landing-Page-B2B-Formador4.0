import React, { useState, useEffect } from 'react';

// Single VARIABLE to change the deadline (CDMX Timezone -06:00)
export const DEADLINE = "2026-06-15T23:59:59-06:00";
export const DEADLINE_DISPLAY_DATE = "15 de Junio, 2026";

interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  isExpired: boolean;
}

export const PromotionCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    isExpired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(DEADLINE) - +new Date();
      if (difference <= 0) {
        setTimeLeft({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
          isExpired: true,
        });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const m = Math.floor((difference / 1000 / 60) % 60);
      const s = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        days: String(d).padStart(2, '0'),
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0'),
        isExpired: false,
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div id="promocion-certificacion" className="w-full bg-slate-950 border border-slate-800 text-white rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden shadow-2xl">
      {/* Background visual gloss effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-brand-vino/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Promotion details */}
        <div className="lg:max-w-xl text-left">
          <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[9px] font-bold tracking-[0.2em] px-4 py-2 rounded-full uppercase mb-6">
            ✨ PROMOCIÓN DE ALINEACIÓN CORPORATIVA B2B
          </div>
          
          <h3 className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight mb-4">
            Beca de Certificación CONOCER en Ruta Completa
          </h3>

          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 font-semibold">
            Si deseas capacitar a tu equipo con la <span className="text-brand-orange font-bold">Ruta Completa (los 7 microcursos del programa)</span>, bonificamos al 100% el costo del estándar de evaluación.
          </p>

          <ul className="space-y-3 mb-8 text-xs text-gray-400 font-semibold">
            <li className="flex items-start gap-2">
              <span className="text-brand-orange font-bold">✓</span>
              <span><strong>Ahorro Directo:</strong> Bonificación de <strong>$5,000 MXN</strong> (que incluye alineación, plan de evaluación y evaluación formal) por participante.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-orange font-bold">✓</span>
              <span><strong>Único Costo Aplicable:</strong> Se cubre únicamente el costo de emisión oficial del certificado CONOCER de <strong>$1,500 MXN</strong>, pagadero solo de aquellos candidatos dictaminados como <strong>Competentes</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-orange font-bold">✓</span>
              <span><strong>Garantía de Inversión:</strong> Cero riesgo ante auditorías. Solo pagas los certificados gubernamentales de quienes acrediten su estándar.</span>
            </li>
          </ul>

          <p className="text-xs text-gray-500 font-bold">
            ⚠️ Sujeto a disponibilidad de agenda. Válido hasta el <span className="text-brand-orange font-extrabold">{DEADLINE_DISPLAY_DATE}</span> o hasta agotar los cupos del mes de la generación actual.
          </p>
        </div>

        {/* Minimalist Apple-style Countdown Clock */}
        <div className="w-full lg:w-auto shrink-0 bg-white/[0.03] border border-white/5 rounded-3xl p-8 backdrop-blur-sm flex flex-col items-center min-w-[320px]">
          <p className="text-center font-extrabold text-[10px] text-zinc-400 uppercase tracking-widest mb-6">
            {timeLeft.isExpired ? "OFERTA CONCLUIDA" : "TIEMPO RESTANTE DE ESTA CONVOCATORIA"}
          </p>

          <div className="flex gap-4 md:gap-6 justify-center items-center mb-6">
            {/* Days */}
            <div className="flex flex-col items-center">
              <span className="font-mono text-3xl md:text-5xl font-black text-white tracking-tight leading-none">
                {timeLeft.days}
              </span>
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-2">Días</span>
            </div>
            <span className="text-2xl font-mono font-black text-zinc-600 mb-6">:</span>

            {/* Hours */}
            <div className="flex flex-col items-center">
              <span className="font-mono text-3xl md:text-5xl font-black text-white tracking-tight leading-none">
                {timeLeft.hours}
              </span>
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-2">Horas</span>
            </div>
            <span className="text-2xl font-mono font-black text-zinc-600 mb-6">:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <span className="font-mono text-3xl md:text-5xl font-black text-white tracking-tight leading-none">
                {timeLeft.minutes}
              </span>
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-2">Min</span>
            </div>
            <span className="text-2xl font-mono font-black text-zinc-600 mb-6">:</span>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <span className="font-mono text-3xl md:text-5xl font-black text-brand-orange tracking-tight leading-none transition-all duration-100">
                {timeLeft.seconds}
              </span>
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-2">Seg</span>
            </div>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('contact');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full py-4.5 bg-brand-orange hover:bg-brand-red text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl transition shadow-xl shadow-brand-orange/20"
          >
            Asegurar Beca para Mi Grupo
          </button>
        </div>
      </div>

      {/* Micro-legal notice strictly under the block */}
      <div className="border-t border-slate-900 mt-10 pt-6 text-center">
        <p className="text-[10px] text-zinc-500 font-bold">
          “La certificación se obtiene por evaluación; el certificado se emite únicamente si el candidato resulta competente.”
        </p>
      </div>
    </div>
  );
};
