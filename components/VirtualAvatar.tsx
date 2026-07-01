import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const fullText =
  'Soy Kai, guía digital de Cademmy. Te explico cómo Instructor 4.0 ayuda a estandarizar instructores internos, documentar evidencias por participante y usar IA con criterios para acelerar la planeación sin perder control. La ruta CONOCER es opcional y se obtiene mediante evaluación formal independiente.';

const spokenText =
  'Hola, soy Kai, guía digital de Cádemmy. Instructor cuatro punto cero ayuda a que tus instructores internos trabajen con un método común, evidencias claras y apoyo de inteligencia artificial con criterios. La certificación conocer es opcional y se obtiene por evaluación independiente. Agenda una sesión y revisamos el alcance ideal para tu cohorte.';

const voiceScore = (voice: SpeechSynthesisVoice) => {
  const name = voice.name.toLowerCase();
  const lang = voice.lang.toLowerCase();
  let score = 0;

  if (lang.startsWith('es')) score += 40;
  if (lang.includes('mx')) score += 30;
  if (lang.includes('us')) score += 12;
  if (name.includes('premium')) score += 28;
  if (name.includes('natural')) score += 28;
  if (name.includes('neural')) score += 26;
  if (name.includes('enhanced')) score += 18;
  if (name.includes('google')) score += 14;
  if (name.includes('microsoft')) score += 12;
  if (['paulina', 'dalia', 'sabina', 'monica', 'helena', 'paloma', 'shelley'].some(token => name.includes(token))) score += 8;
  if (name.includes('compact')) score -= 12;

  return score;
};

const isBrandAppropriateVoice = (voice: SpeechSynthesisVoice) => {
  const name = voice.name.toLowerCase();
  return !['grandma', 'grandpa', 'rocko'].some(token => name.includes(token));
};

const chooseVoice = (voices: SpeechSynthesisVoice[], selectedVoiceName: string) => {
  if (selectedVoiceName !== 'auto') {
    return voices.find(voice => voice.name === selectedVoiceName) ?? null;
  }

  return voices
    .filter(voice => voice.lang.toLowerCase().startsWith('es') && isBrandAppropriateVoice(voice))
    .sort((a, b) => voiceScore(b) - voiceScore(a))[0] ?? null;
};

const VirtualAvatar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showText, setShowText] = useState(false);
  const [dismissedIntro, setDismissedIntro] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState('auto');
  const [voiceSpeedState, setVoiceSpeedState] = useState(0.76);

  const updateVoiceList = () => {
    if (!('speechSynthesis' in window)) return;

    const spanishVoices = window.speechSynthesis
      .getVoices()
      .filter(voice => voice.lang.toLowerCase().startsWith('es') && isBrandAppropriateVoice(voice))
      .sort((a, b) => voiceScore(b) - voiceScore(a));

    setAvailableVoices(spanishVoices);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(true), 2200);

    updateVoiceList();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoiceList;
    }

    return () => {
      window.clearTimeout(timer);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = (voiceName = selectedVoiceName, speed = voiceSpeedState) => {
    if (!('speechSynthesis' in window)) {
      setShowText(true);
      return;
    }

    window.speechSynthesis.cancel();

    window.setTimeout(() => {
      const voices = window.speechSynthesis.getVoices();
      const bestVoice = chooseVoice(voices, voiceName);
      const utterance = new SpeechSynthesisUtterance(spokenText);

      if (bestVoice) {
        utterance.voice = bestVoice;
        utterance.lang = bestVoice.lang;
      } else {
        utterance.lang = 'es-MX';
      }

      utterance.rate = speed;
      utterance.pitch = 0.86;
      utterance.volume = 0.9;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setShowText(true);
        setDismissedIntro(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        window.setTimeout(() => setShowText(false), 7000);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setShowText(true);
      };

      window.speechSynthesis.speak(utterance);
    }, 120);
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
      <AnimatePresence>
        {isVisible && !isSpeaking && !dismissedIntro && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            className="pointer-events-auto glass-card rounded-full px-3 py-2"
          >
            <button
              id="close-avatar-intro"
              onClick={(event) => {
                event.stopPropagation();
                setDismissedIntro(true);
              }}
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] text-brand-muted shadow transition hover:text-brand-ink"
              title="Cerrar sugerencia"
            >
              x
            </button>

            <button
              onClick={() => speak()}
              className="inline-flex items-center gap-2 rounded-full bg-brand-ink px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-black"
            >
              <span className="h-2 w-2 rounded-full bg-brand-certification"></span>
              Conoce a Kai
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showText && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            className="pointer-events-auto glass-card flex max-w-xs flex-col gap-3 rounded-[1.5rem] p-4 sm:max-w-md"
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/80 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white/80">
                  <img src="/kai-cademmy-mascot.png" alt="Kai, guía digital de Cademmy" className="h-9 w-9 object-contain" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-orange">
                    Kai · Guía Cademmy
                  </p>
                  <p className="text-xs font-bold text-brand-muted">
                    {isSpeaking ? 'Reproduciendo resumen' : 'Resumen disponible'}
                  </p>
                </div>
              </div>

              <button
                onClick={stopSpeaking}
                className="rounded-full bg-white/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-brand-slate transition hover:text-brand-orange"
              >
                Silenciar
              </button>
            </div>

            <p className="custom-scrollbar max-h-[128px] overflow-y-auto pr-2 text-sm font-medium leading-relaxed text-brand-slate">
              {fullText}
            </p>

            <div className="rounded-2xl bg-white/60 p-3">
              <div className="mb-2 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.18em] text-brand-muted">
                <span>Voz local temporal</span>
                <span>{voiceSpeedState.toFixed(2)}x</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={selectedVoiceName}
                  onChange={(event) => {
                    const voiceName = event.target.value;
                    setSelectedVoiceName(voiceName);
                    if (isSpeaking) speak(voiceName, voiceSpeedState);
                  }}
                  className="rounded-xl border border-white bg-white px-2 py-2 text-[10px] font-bold text-brand-slate outline-none focus:border-brand-orange"
                >
                  <option value="auto">Menos robótica disponible</option>
                  {availableVoices.map(voice => (
                    <option key={`${voice.name}-${voice.lang}`} value={voice.name}>
                      {voice.name.replace('Google', 'G.').replace('Microsoft', 'MS.')} ({voice.lang})
                    </option>
                  ))}
                </select>

                <input
                  type="range"
                  min="0.68"
                  max="0.98"
                  step="0.03"
                  value={voiceSpeedState}
                  onChange={(event) => {
                    const speed = Number(event.target.value);
                    setVoiceSpeedState(speed);
                    if (isSpeaking) speak(selectedVoiceName, speed);
                  }}
                  className="w-full accent-brand-orange"
                  aria-label="Velocidad de voz"
                />
              </div>
              <p className="mt-2 text-[10px] font-semibold leading-relaxed text-brand-muted">
                La voz local depende de Chrome/macOS. Para una voz realmente Cademmy, conviene conectar un motor neural por backend.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="pointer-events-auto relative"
          >
            {isSpeaking && (
              <motion.div
                animate={{ scale: [1, 1.22, 1], opacity: [0.25, 0.5, 0.25] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-[1.65rem] bg-brand-orange blur-2xl"
              />
            )}

            <motion.button
              id="interactive-mascot-avatar"
              onClick={isSpeaking ? stopSpeaking : () => speak()}
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut' }}
              className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-[0_20px_50px_rgba(23,23,35,0.22)] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-brand-orange/20 focus:outline-none sm:h-28 sm:w-28"
              title={isSpeaking ? 'Silenciar explicación' : 'Escuchar explicación de la ruta'}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_32%_18%,rgba(255,255,255,0.95),transparent_3.2rem),radial-gradient(circle_at_68%_82%,rgba(245,130,31,0.18),transparent_4.4rem)]"></div>
              <img
                src="/kai-cademmy-mascot.png"
                alt="Kai, guía digital de Cademmy"
                className="relative z-10 h-[6.6rem] w-[6.6rem] object-contain drop-shadow-[0_12px_18px_rgba(23,23,35,0.22)] transition duration-300 group-hover:scale-105 sm:h-[7.7rem] sm:w-[7.7rem]"
                draggable={false}
              />

              <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 items-end gap-1">
                {[0, 1, 2].map(index => (
                  <motion.span
                    key={index}
                    animate={isSpeaking ? { height: [5, 14, 7, 12, 5] } : { height: [5, 7, 5] }}
                    transition={{ repeat: Infinity, duration: 0.65 + index * 0.08, delay: index * 0.08 }}
                    className="w-1 rounded-full bg-brand-orange"
                  />
                ))}
              </div>

              <span className="absolute right-2 top-2 z-20 rounded-full bg-brand-ink px-2 py-1 text-[9px] font-black text-white shadow-lg">
                Kai
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VirtualAvatar;
