// Simple Vercel /api/chat serverless function (Node.js)
const { GoogleGenAI } = require('@google/genai');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ text: 'Method Not Allowed' });
  }

  const apiKey = process.env.GOOGLE_API_KEY || '';
  if (!apiKey) {
    console.error('GOOGLE_API_KEY not set');
    return res.status(500).json({ text: 'حدث خطأ في النظام الذكي.', sources: [] });
  }

  const { prompt = '', history = [] } = req.body || {};
  const ai = new GoogleGenAI({ apiKey });

  try {
    const contents = [
      ...(history || []),
      { role: 'user', parts: [{ text: prompt }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents,
      config: {
        systemInstruction: process.env.SYSTEM_INSTRUCTION || '',
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
      title: chunk.web?.title || 'مصدر',
      uri: chunk.web?.uri || ''
    })) || [];

    return res.status(200).json({
      text: response.text || 'لم يتم استلام رد.',
      sources
    });
  } catch (err) {
    console.error('API /chat error:', err);
    return res.status(500).json({ text: 'حدث خطأ في النظام الذكي.', sources: [] });
  }
};
