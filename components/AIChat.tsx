import React, { useEffect, useRef, useState } from 'react';
import { getGeminiChatResponse } from '../services/geminiService';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

interface AIChatProps {
  context: string;
}

const AIChat: React.FC<AIChatProps> = ({ context }) => {
  const isChatEnabled = Boolean(import.meta.env.VITE_GEMINI_CHAT_ENDPOINT);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: isChatEnabled
        ? '¡Hola! Soy tu asistente de Instructor 4.0. ¿En qué puedo ayudarte hoy?'
        : 'El asistente de IA estará disponible próximamente. Mientras tanto, puedes agendar una sesión de diagnóstico para revisar tus retos de capacitación y recibir una propuesta a la medida.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!isChatEnabled || !input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const response = await getGeminiChatResponse(userText, context);
      setMessages(prev => [...prev, { role: 'ai', text: response || 'Sin respuesta' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Hubo un error contactando a la IA.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="glass-card rounded-[1.75rem] shadow-2xl w-80 sm:w-96 flex flex-col overflow-hidden h-[500px]">
          <div className="bg-brand-ink p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-2xl bg-white flex items-center justify-center">
                <img src="/isologotipo vertical.jpeg" alt="Cademmy" className="h-8 w-8 object-contain" />
              </div>
              <div>
                <span className="block text-sm font-black">Asistente Cademmy</span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/60">
                  <span className={`w-2 h-2 rounded-full ${isChatEnabled ? 'bg-brand-certification' : 'bg-brand-muted'}`}></span>
                  {isChatEnabled ? 'IA activa' : 'Agenda recomendada'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white"
              aria-label="Cerrar chat"
            >
              x
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-brand-soft/60">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    message.role === 'user'
                      ? 'cademmy-primary rounded-tr-none'
                      : 'bg-white/90 text-brand-slate border border-white rounded-tl-none shadow-sm'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/80 text-brand-slate p-3 rounded-2xl rounded-tl-none animate-pulse">
                  Escribiendo...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/80 bg-white/80 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={event => setInput(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter') {
                  handleSend();
                }
              }}
              placeholder={
                isChatEnabled
                  ? 'Escribe tu duda...'
                  : 'Asistente IA no configurado'
              }
              disabled={!isChatEnabled || loading}
              className="flex-1 bg-brand-soft rounded-full px-4 py-2 text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-orange disabled:cursor-not-allowed disabled:text-brand-muted"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!isChatEnabled || loading}
              className="cademmy-primary p-2 rounded-full transition disabled:cursor-not-allowed disabled:bg-brand-muted-bg disabled:text-brand-muted disabled:hover:bg-brand-muted-bg disabled:shadow-none"
              aria-label={isChatEnabled ? 'Enviar mensaje' : 'Asistente IA no configurado'}
            >
              ➔
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="glass-card group relative w-16 h-16 rounded-[1.35rem] shadow-2xl flex items-center justify-center hover:-translate-y-1 transition duration-200"
          aria-label="Abrir chat de Instructor 4.0"
        >
          <span className="absolute inset-0 rounded-[1.35rem] bg-[radial-gradient(circle_at_35%_25%,rgba(245,130,31,0.22),transparent_3.8rem)]"></span>
          <img src="/isologotipo vertical.jpeg" alt="" className="relative h-11 w-11 object-contain" />
          <span className="absolute -right-1 -top-1 rounded-full bg-brand-ink px-1.5 py-0.5 text-[9px] font-black text-white">
            Chat
          </span>
        </button>
      )}
    </div>
  );
};

export default AIChat;
