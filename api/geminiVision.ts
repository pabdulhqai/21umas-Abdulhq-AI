import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { imageBuffer, mimeType, prompt } = req.body || {};
  if (!imageBuffer) return res.status(400).json({ error: 'Missing imageBuffer (base64)' });

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: imageBuffer, mimeType: mimeType || 'image/jpeg' } },
          { text: `كخبير أكاديمي وطبي في جامعة 21 سبتمبر، حلل هذه الوثيقة/الصورة: ${prompt || ''}` }
        ]
      },
    });

    return res.status(200).json({ text: response.text || '', raw: response });
  } catch (err: any) {
    console.error('Gemini vision error:', err);
    return res.status(500).json({ error: 'Vision analysis failed', detail: err?.message || String(err) });
  }
}
