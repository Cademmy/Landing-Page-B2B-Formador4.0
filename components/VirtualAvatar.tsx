import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const VirtualAvatar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showText, setShowText] = useState(false);
  const [dismissedIntro, setDismissedIntro] = useState(false);

  // States for advanced voice tuning and custom browser speech-engines
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('auto');
  const [voiceSpeedState, setVoiceSpeedState] = useState<number>(0.90);

  const fullText = "Hola, un gusto saludarte. Soy el facilitador virtual de Cademmy para Capacitación y L&D Corporativo. Estoy aquí para explicarte cómo el sistema Instructor 4.0 aporta gobernanza y ROI a tu organización. Ayudamos a tus ingenieros y expertos técnicos de planta a transformarse en instructores de alto rendimiento, fusionando Inteligencia Artificial con los estándares nacionales oficiales de la SEP y el CONOCER (EC0217.01 y EC0301). Esto institucionaliza el know-how del negocio y blinda tus auditorías de calidad ante la STPS u organismos ISO 9001 con portafolios de evidencias digitales generados en segundos. Nuestro programa modular consta de 7 microcursos prácticos diseñados para no interrumpir la productividad de tus células operativas, incluyendo la entrega de constancias STPS DC-3 deducibles. Sobre la acreditación nacional CONOCER: garantizamos una sólida preparación andragógica; el juicio formal de competencia se realiza al finalizar la ruta y el pago del certificado oficial se liquida únicamente cuando el candidato resulta dictaminado como Competente. Esto garantiza al 100% tu inversión. ¿Te gustaría agendar una llamada diagnóstica de 15 minutos con nuestros especialistas para diseñar una propuesta in-company a la medida de tu empresa? Estoy listo para apoyarte.";

  // Phonetically-tuned version for 10x more natural neural voice pronunciation in Spanish (avoids raw reading of abbreviations and slashes)
  const spokenText = "Hola, un gusto saludarte. Soy el facilitador virtual de Cádemmy para Capacitación y Desarrollo Corporativo. Estoy aquí para explicarte cómo el sistema Instructor cuatro punto cero aporta gobernanza y retorno de inversión a tu organización. Ayudamos a tus ingenieros y expertos técnicos de planta a transformarse en instructores de alto rendimiento, fusionando Inteligencia Artificial con los estándares nacionales oficiales de la Secretaría de Educación Pública y el conocer. Esto institucionaliza el saber hacer del negocio y blinda tus de auditorías de calidad ante la Secretaría del Trabajo o sistemas de calidad con portafolios de evidencias digitales generados en segundos. Nuestro programa modular consta de siete clases prácticas diseñadas para no interrumpir la productividad de tus equipos, incluyendo la entrega de constancias deducibles por parte de la Secretaría del Trabajo. En la acreditación oficial de conocer, garantizamos una sólida preparación; la evaluación ocurre al finalizar la ruta y el pago del certificado oficial se liquida únicamente cuando el candidato resulta dictaminado competente. ¿Te gustaría agendar una llamada de quince minutos para diseñar una propuesta a la medida de tu empresa? Haz clic en agendar sesión. Estoy listo para ayudarte.";

  const updateVoiceList = () => {
    if ('speechSynthesis' in window) {
      const allVoices = window.speechSynthesis.getVoices();
      // Filter for Spanish voices to avoid showing non-applicable speech engines
      const spanish = allVoices.filter(v => v.lang.toLowerCase().startsWith('es'));
      setAvailableVoices(spanish);
    }
  };

  useEffect(() => {
    // Delay appearance to let the page load smoothly
    const timer = setTimeout(() => setIsVisible(true), 2500);
    
    if ('speechSynthesis' in window) {
      updateVoiceList();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoiceList;
      }
    }

    return () => {
      clearTimeout(timer);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = (voiceName = selectedVoiceName, speed = voiceSpeedState) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      // Short delay to ensure cancellation goes through
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(spokenText);
        const voices = window.speechSynthesis.getVoices();
        const spanishVoices = voices.filter(v => v.lang.toLowerCase().startsWith('es'));
        
        let bestVoice = null;
        if (voiceName !== 'auto') {
          bestVoice = voices.find(v => v.name === voiceName) || null;
        }

        if (!bestVoice && spanishVoices.length > 0) {
          // Prioritize Mexican Spanish (es-MX)
          const mxVoices = spanishVoices.filter(v => v.lang.toLowerCase().includes('mx'));
          
          bestVoice = mxVoices.find(v => v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('premium')) ||
                      mxVoices.find(v => v.name.toLowerCase().includes('neural')) ||
                      mxVoices.find(v => v.name.toLowerCase().includes('google')) ||
                      mxVoices.find(v => v.name.toLowerCase().includes('sabina') || v.name.toLowerCase().includes('yolanda') || v.name.toLowerCase().includes('microsoft')) ||
                      mxVoices[0];
                      
          if (!bestVoice) {
            bestVoice = spanishVoices.find(v => v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('premium')) ||
                        spanishVoices.find(v => v.name.toLowerCase().includes('neural')) ||
                        spanishVoices.find(v => v.name.toLowerCase().includes('google')) ||
                        spanishVoices.find(v => v.name.toLowerCase().includes('sabina') || v.name.toLowerCase().includes('helena') || v.name.toLowerCase().includes('microsoft')) ||
                        spanishVoices[0];
          }
        }
        
        if (bestVoice) {
          utterance.voice = bestVoice;
          console.log("Selected voice for Mascot:", bestVoice.name, bestVoice.lang);
        }
        
        utterance.lang = bestVoice ? bestVoice.lang : 'es-MX';
        
        // Pacing & Tone is adjusted for a premium, non-robotic flow (speed 0.90 defaults to very natural human breathing speed)
        utterance.rate = speed; 
        utterance.pitch = 1.0; // Professional, grounded and steady tone (avoids synthetic high-pitched peaks)

        utterance.onstart = () => {
          setIsSpeaking(true);
          setShowText(true);
          setDismissedIntro(true); // Auto hide intro note once they listen
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          // Keep text visible for a bit after talking, then slide out
          setTimeout(() => setShowText(false), 6000);
        };

        utterance.onerror = (event) => {
          console.error('SpeechSynthesis error:', event);
          setIsSpeaking(false);
          setShowText(false);
        };

        window.speechSynthesis.speak(utterance);
      }, 100);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setShowText(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[70] flex flex-col items-start gap-3 pointer-events-none">
      {/* Upper Speech Bubble & Transcript System - Repositioned to left side to avoid blocking */}
      <AnimatePresence>
        {/* Intro Suggestion Bubble */}
        {isVisible && !isSpeaking && !dismissedIntro && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            className="pointer-events-auto bg-brand-vino text-white p-4.5 rounded-2xl shadow-2xl border border-white/10 max-w-xs relative flex flex-col gap-2"
          >
            {/* Close Suggestion Button */}
            <button 
              id="close-avatar-intro"
              onClick={(e) => {
                e.stopPropagation();
                setDismissedIntro(true);
              }}
              className="absolute top-2.5 right-2.5 w-5 h-5 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
              title="Cerrar sugerencia"
            >
              ✕
            </button>
            
            <div className="pr-5">
              <p className="text-xs font-black text-brand-bright-orange uppercase tracking-wider mb-1">¿Te explico el programa? 🤖</p>
              <p className="text-xs font-semibold text-gray-100 leading-relaxed">
                ¡Hola! Haz clic en mí para que te cuente cómo funciona la ruta de certificación corporativa y auditoría STPS.
              </p>
            </div>
            
            {/* Audio Indicator Badge */}
            <div className="flex items-center gap-1.5 text-[10px] text-brand-bright-orange font-bold uppercase tracking-wider pt-1 self-start">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
              Escuchar facilitador IA
            </div>
            
            {/* Speech bubble arrow at the bottom pointing to the avatar */}
            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-brand-vino rotate-x-0 rotate-45 border-r border-b border-white/10"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* Active Transcription Panel */}
        {showText && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="bg-white p-5 rounded-3xl shadow-2xl border border-gray-100 max-w-xs sm:max-w-md pointer-events-auto flex flex-col gap-3"
          >
            <div className="flex justify-between items-center border-b border-gray-50 pb-2">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-brand-orange animate-ping" />
                <span className="text-[10px] font-black text-brand-vino uppercase tracking-widest">Facilitador Virtual Activo</span>
              </div>
              <button 
                onClick={stopSpeaking}
                className="text-xs font-bold text-gray-400 hover:text-brand-orange transition-colors uppercase tracking-wider"
              >
                Silenciar
              </button>
            </div>
            
            <div className="relative">
              <p className="text-xs text-gray-600 leading-relaxed font-semibold max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
                {fullText}
              </p>
            </div>

            {/* Premium Accessibility & Calibration Controls for voice engine */}
            <div className="flex flex-col gap-2 bg-gray-50 border border-gray-100 p-2.5 rounded-xl text-[10px] text-gray-500 font-bold">
              <div className="flex justify-between items-center text-[9px] uppercase tracking-wider text-gray-400">
                <span>Personalización de Tono y Voz</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px]">Motor de voz (TTS):</span>
                  <select 
                    value={selectedVoiceName}
                    onChange={(e) => {
                      const vName = e.target.value;
                      setSelectedVoiceName(vName);
                      if (isSpeaking) {
                        speak(vName, voiceSpeedState);
                      }
                    }}
                    className="bg-white border border-gray-200 rounded px-1 py-0.5 text-[9px] text-gray-700 font-semibold outline-none focus:border-brand-orange"
                  >
                    <option value="auto">Garantizar natural (Búsqueda inteligente)</option>
                    {availableVoices.map((v, i) => (
                      <option key={i} value={v.name}>
                        {v.name.replace("Google", "G.").replace("Microsoft", "MS.").replace("es-", "").replace("es_", "").trim()}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1 justify-center">
                  <div className="flex justify-between text-[9px]">
                    <span>Velocidad:</span>
                    <span>{voiceSpeedState.toFixed(2)}x</span>
                  </div>
                  <input 
                    type="range"
                    min="0.75"
                    max="1.15"
                    step="0.05"
                    value={voiceSpeedState}
                    onChange={(e) => {
                      const speed = parseFloat(e.target.value);
                      setVoiceSpeedState(speed);
                      if (isSpeaking) {
                        speak(selectedVoiceName, speed);
                      }
                    }}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-1 border-t border-gray-50">
              <button 
                onClick={stopSpeaking}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold rounded-lg uppercase tracking-wider transition"
              >
                Entendido
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Mascot Avatar Trigger */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="pointer-events-auto relative"
          >
            {/* Glowing ripple when speaking */}
            {isSpeaking && (
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                className="absolute inset-0 bg-brand-orange rounded-full blur-2xl"
              />
            )}

            {/* Subtle Bobbing/Floating Animation for organic life-like look */}
            <motion.div
              animate={{ 
                y: [0, -6, 0],
                rotate: [-1, 1, -1]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 4, 
                ease: "easeInOut" 
              }}
            >
              <button
                id="interactive-mascot-avatar"
                onClick={isSpeaking ? stopSpeaking : speak}
                className="relative bg-white p-0 rounded-full shadow-2xl border-4 border-brand-orange overflow-hidden w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center transition-all hover:scale-110 hover:border-brand-vino active:scale-95 group focus:outline-none"
                title={isSpeaking ? "Silenciar explicación" : "Escuchar explicación de la ruta"}
              >
                {/* Ultra-cute futuristic robot SVG */}
                <svg viewBox="0 0 100 100" className="w-[96%] h-[96%] bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 rounded-full">
                  <defs>
                    {/* Metallic white helmet gradient */}
                    <linearGradient id="metalHelm" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="60%" stopColor="#E2E8F0" />
                      <stop offset="100%" stopColor="#CBD5E1" />
                    </linearGradient>
                    {/* Neon Orange glow gradient */}
                    <radialGradient id="neonOrange" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FFF7ED" />
                      <stop offset="30%" stopColor="#FFA500" />
                      <stop offset="100%" stopColor="#EA580C" />
                    </radialGradient>
                    {/* Visor deep screen gradient */}
                    <linearGradient id="visorScreen" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#0F172A" />
                      <stop offset="100%" stopColor="#1E293B" />
                    </linearGradient>
                    {/* Golden halo or highlight */}
                    <linearGradient id="goldCap" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#D97706" />
                    </linearGradient>
                  </defs>

                  {/* Robot Outer Ears (Glowing Antennas) */}
                  {/* Left Ear */}
                  <path 
                    d="M 16,36 L 6,18 L 30,28 Z" 
                    fill="url(#goldCap)" 
                    stroke="#431407" 
                    strokeWidth="1.5"
                    strokeLinejoin="round" 
                  />
                  <circle cx="6" cy="18" r="4.5" fill="#F97316" className="animate-pulse" />
                  
                  {/* Right Ear */}
                  <path 
                    d="M 84,36 L 94,18 L 70,28 Z" 
                    fill="url(#goldCap)" 
                    stroke="#431407" 
                    strokeWidth="1.5"
                    strokeLinejoin="round" 
                  />
                  <circle cx="94" cy="18" r="4.5" fill="#F97316" className="animate-pulse" />

                  {/* Neck joint */}
                  <rect x="44" y="80" width="12" height="10" rx="3" fill="#475569" stroke="#1E293B" strokeWidth="1" />
                  <line x1="44" y1="85" x2="56" y2="85" stroke="#334155" strokeWidth="2" />

                  {/* Robot Head Helmet Shell */}
                  <rect x="14" y="26" width="72" height="60" rx="28" fill="url(#metalHelm)" stroke="#475569" strokeWidth="2" />

                  {/* Sleek Inner Dark Screen Visor */}
                  <rect x="22" y="36" width="56" height="40" rx="16" fill="url(#visorScreen)" stroke="#020617" strokeWidth="1.5" />

                  {/* Glass Glare Arch Reflection (Top-left of Screen) */}
                  <path d="M 24,42 Q 50,33 76,42 Q 50,37 24,42 Z" fill="#FFFFFF" opacity="0.12" />

                  {/* Glowing Cheek Soft Lights (Blush) */}
                  <circle cx="31" cy="62" r="4.5" fill="#F43F5E" opacity="0.4" />
                  <circle cx="69" cy="62" r="4.5" fill="#F43F5E" opacity="0.4" />

                  {/* Reactive Intelligent Eyes (glowing LEDs) */}
                  <g>
                    {/* Blinking Left Eye */}
                    <motion.ellipse 
                      cx="38" 
                      cy="51" 
                      rx="5"
                      ry="5"
                      fill="#F97316"
                      animate={isSpeaking ? {
                        ry: [5, 1, 5, 5, 5],
                        scaleY: [1, 1, 0.1, 1, 1]
                      } : {
                        scaleY: [1, 1, 1, 0.1, 1, 1, 1]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: isSpeaking ? 2.5 : 4.5,
                        times: [0, 0.4, 0.5, 0.6, 1]
                      }}
                      style={{ filter: 'drop-shadow(0px 0px 3px rgba(249, 115, 22, 0.85))' }}
                    />
                    {/* Highlight inside left eye */}
                    <circle cx="36.5" cy="49.5" r="1.5" fill="#FFFFFF" opacity="0.9" />

                    {/* Blinking Right Eye */}
                    <motion.ellipse 
                      cx="62" 
                      cy="51" 
                      rx="5"
                      ry="5"
                      fill="#F97316"
                      animate={isSpeaking ? {
                        ry: [5, 1, 5, 5, 5],
                        scaleY: [1, 1, 0.1, 1, 1]
                      } : {
                        scaleY: [1, 1, 1, 0.1, 1, 1, 1]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: isSpeaking ? 2.5 : 4.5,
                        times: [0, 0.4, 0.5, 0.6, 1]
                      }}
                      style={{ filter: 'drop-shadow(0px 0px 3px rgba(249, 115, 22, 0.85))' }}
                    />
                    {/* Highlight inside right eye */}
                    <circle cx="60.5" cy="49.5" r="1.5" fill="#FFFFFF" opacity="0.9" />
                  </g>

                  {/* Mouth and Soundwave LED system */}
                  {isSpeaking ? (
                    /* High-tech Dancing Frequency Analyzer Bars when speaking */
                    <g fill="#FFA500" opacity="0.95">
                      <motion.rect 
                        x="42" y="60" width="3.5" height="6" rx="1.5"
                        animate={{ height: [6, 14, 4, 12, 6], y: [60, 56, 61, 57, 60] }}
                        transition={{ repeat: Infinity, duration: 0.45 }}
                      />
                      <motion.rect 
                        x="47" y="58" width="3.5" height="10" rx="1.5"
                        animate={{ height: [10, 18, 6, 15, 10], y: [58, 54, 60, 55, 58] }}
                        transition={{ repeat: Infinity, duration: 0.35, delay: 0.1 }}
                      />
                      <motion.rect 
                        x="52" y="59" width="3.5" height="8" rx="1.5"
                        animate={{ height: [8, 16, 5, 13, 8], y: [59, 55, 60, 56, 59] }}
                        transition={{ repeat: Infinity, duration: 0.4, delay: 0.05 }}
                      />
                      <motion.rect 
                        x="57" y="61" width="3.5" height="5" rx="1.5"
                        animate={{ height: [5, 11, 4, 9, 5], y: [61, 58, 61, 59, 61] }}
                        transition={{ repeat: Infinity, duration: 0.48 }}
                      />
                    </g>
                  ) : (
                    /* Gentle Glowing Smile on screen when resting */
                    <path 
                      key="rest-smile"
                      d="M 43,62 Q 50,68 57,62" 
                      fill="none" 
                      stroke="#F97316" 
                      strokeWidth="2.5" 
                      strokeLinecap="round"
                      style={{ filter: 'drop-shadow(0px 0px 2px rgba(249, 115, 22, 0.7))' }}
                    />
                  )}

                  {/* Tiny Grad Cap (Mascot Teacher / Facilitator touch!) */}
                  <g transform="translate(37, 7)">
                    {/* Graduation mortarboard tile */}
                    <polygon points="13,2 26,8 13,14 0,8" fill="url(#goldCap)" stroke="#431407" strokeWidth="1" />
                    {/* Base cap block */}
                    <path d="M 5,8 L 5,12 Q 13,15 21,12 L 21,8 Z" fill="#D97706" />
                    {/* Tiny tassel */}
                    <line x1="26" y1="8" x2="28" y2="13" stroke="#F97316" strokeWidth="1" />
                    <circle cx="28" cy="13.5" r="1.5" fill="#F59E0B" />
                  </g>
                </svg>

                {/* Compact Interactive HUD overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/95 p-2 rounded-full shadow-lg border border-gray-100 flex items-center justify-center">
                    {isSpeaking ? (
                      <div className="w-3.5 h-3.5 bg-brand-orange rounded-sm" />
                    ) : (
                      <svg className="w-5 h-5 text-brand-orange fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VirtualAvatar;
