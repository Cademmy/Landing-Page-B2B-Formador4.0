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
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col overflow-hidden border border-gray-100 h-[500px]">
          <div className="bg-brand-orange p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isChatEnabled ? 'bg-green-400' : 'bg-gray-300'}`}></div>
              <span className="font-semibold">Instructor 4.0 AI Support</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
              aria-label="Cerrar chat"
            >
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    message.role === 'user'
                      ? 'bg-brand-orange text-white rounded-tr-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 p-3 rounded-2xl rounded-tl-none animate-pulse">
                  Escribiendo...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-white flex gap-2">
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
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange disabled:cursor-not-allowed disabled:text-gray-400"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!isChatEnabled || loading}
              className="bg-brand-orange text-white p-2 rounded-full hover:bg-brand-red transition disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:bg-gray-300"
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
          className="bg-brand-orange text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200 animate-bounce"
          aria-label="Abrir chat de Instructor 4.0"
        >
          <span className="text-2xl">🤖</span>
        </button>
      )}
    </div>
  );
};

export default AIChat;
