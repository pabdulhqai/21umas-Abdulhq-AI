// Simple Vercel /api/news serverless function (Node.js)
const { GoogleGenAI } = require('@google/genai');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ text: 'Method Not Allowed' });
  }

  const apiKey = process.env.GOOGLE_API_KEY || '';
  if (!apiKey) {
    console.error('GOOGLE_API_KEY not set');
    return res.status(500).json({ text: 'فشل تحديث الأخبار تلقائياً.', sources: [] });
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: "استخرج آخر 4 أخبار أو إعلانات رسمية من موقع جامعة 21 سبتمبر (https://21umas.edu.ye/). ركز على الأخبار الحديثة جداً لعام 2024/2025. قم بصياغة النتيجة بتنسيق نصي يتضمن العنوان، التاريخ المختصر، ورابط المصدر إن وجد.",
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: process.env.SYSTEM_INSTRUCTION || "أنت محرك جلب بيانات أكاديمي."
      }
    });

    return res.status(200).json({
      text: response.text || "لا توجد أخبار جديدة حالياً.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    });
  } catch (err) {
    console.error('API /news error:', err);
    return res.status(500).json({ text: 'فشل تحديث الأخبار تلقائياً.', sources: [] });
  }
};
