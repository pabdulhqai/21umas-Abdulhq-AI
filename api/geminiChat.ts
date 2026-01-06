import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt, history } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: [
        ...(history || []),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: 'أنت مساعد أكاديمي ومهني لجامعة 21 سبتمبر. قدّم إجابات دقيقة ومختصرة واذكر المراجع إن وُجدت.',
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });

    const text = response.text || '';
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'مصدر',
      uri: chunk.web?.uri || ''
    })) || [];

    return res.status(200).json({ text, sources });
  } catch (err: any) {
    console.error('Gemini chat error:', err);
    return res.status(500).json({ error: 'Internal AI error', detail: err?.message || String(err) });
  }
}
