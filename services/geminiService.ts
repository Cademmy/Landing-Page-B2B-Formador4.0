export const getGeminiChatResponse = async (userMessage: string, context: string) => {
  const endpoint = import.meta.env.VITE_GEMINI_CHAT_ENDPOINT;

  if (!endpoint) {
    return "El asistente de IA se activará cuando el endpoint seguro de chat esté configurado. Mientras tanto, puedes agendar una sesión de diagnóstico para revisar tus retos de capacitación, tamaño de grupo y ruta recomendada.";
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: userMessage,
      context,
    }),
  });

  if (!response.ok) {
    throw new Error(`Chat endpoint failed with status ${response.status}`);
  }

  const payload: unknown = await response.json();

  if (
    payload &&
    typeof payload === "object" &&
    "text" in payload &&
    typeof payload.text === "string"
  ) {
    return payload.text;
  }

  throw new Error("Chat endpoint response must include a text field.");
};
