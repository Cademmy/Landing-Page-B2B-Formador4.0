<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Landing B2B Formador 4.0

Landing page de Instructor/Formador 4.0 para captación B2B corporativa.

View your app in AI Studio: https://ai.studio/apps/b91ad062-d75e-4e6b-9203-9a2084c8eb5e

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local`.
3. Optional: set `VITE_GEMINI_CHAT_ENDPOINT` to a secure backend endpoint for the AI chat.
4. Run the app: `npm run dev`

## Production Build

- Type-check: `npm run lint`
- Build: `npm run build`
- Preview build locally: `npm run preview`

## AI Chat Configuration

Do not expose a Gemini API key in the browser bundle. The frontend calls `VITE_GEMINI_CHAT_ENDPOINT` when it is configured, sending:

```json
{
  "message": "User question",
  "context": "Current page/module context"
}
```

The endpoint should return:

```json
{
  "text": "Assistant response"
}
```

If `VITE_GEMINI_CHAT_ENDPOINT` is not set, the landing page still works and the chat shows a safe fallback message.
