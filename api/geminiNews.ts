import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  // Accept GET or POST. Simpler: GET triggers news fetch.
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: "استخرج آخر 4 أخبار أو إعلانات رسمية من موقع جامعة 21 سبتمبر (https://21umas.edu.ye/). ركز على الأخبار الحديثة لعام 2024/2025. أعدّ النتيجة كنص يحتوي العنوان، تاريخ مختصر، ورابط المصدر إن وجد.",
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "أنت محرك جلب بيانات أكاديمي. وظيفتك العثور على أحدث الأخبار من الموقع الرسمي حصراً وتنسيقها بشكل جذاب وقصير."
      },
    });

    const text = response.text || 'لا توجد أخبار جديدة حالياً.';
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return res.status(200).json({ text, sources });
  } catch (err: any) {
    console.error('Gemini news error:', err);
    return res.status(500).json({ error: 'Failed to fetch news', detail: err?.message || String(err) });
  }
}
