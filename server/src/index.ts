import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(bodyParser.json());

const PORT = Number(process.env.PORT || 4000);
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: CORS_ORIGIN }));

if (!process.env.GOOGLE_API_KEY) {
  console.warn('WARNING: GOOGLE_API_KEY not set. Set process.env.GOOGLE_API_KEY for production use.');
}

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || '' });

// Optional system instruction can be provided via env
const SYSTEM_INSTRUCTION = process.env.SYSTEM_INSTRUCTION || '';

app.post('/api/news', async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: "استخرج آخر 4 أخبار أو إعلانات رسمية من موقع جامعة 21 سبتمبر (https://21umas.edu.ye/). ركز على الأخبار الحديثة جداً لعام 2024/2025. قم بصياغة النتيجة بتنسيق نصي يتضمن العنوان، التاريخ المختصر، ورابط المصدر إن وجد.",
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: SYSTEM_INSTRUCTION || "أنت محرك جلب بيانات أكاديمي. وظيفتك العثور على أحدث الأخبار من الموقع الرسمي حصراً وتنسيقها بشكل جذاب وقصير."
      },
    });

    res.json({
      text: response.text || "لا توجد أخبار جديدة حالياً.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    });
  } catch (err: any) {
    console.error('Server /api/news error:', err);
    res.status(500).json({ text: 'فشل تحديث الأخبار تلقائياً.', sources: [] });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, history } = req.body || {};
    const contents = [
      ...(history || []),
      { role: 'user', parts: [{ text: prompt || '' }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 32768 }
      },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'مصدر',
      uri: chunk.web?.uri || ''
    })) || [];

    res.json({
      text: response.text || 'لم يتم استلام رد.',
      sources
    });
  } catch (err: any) {
    console.error('Server /api/chat error:', err);
    res.status(500).json({ text: 'حدث خطأ في النظام الذكي.', sources: [] });
  }
});

app.listen(PORT, () => {
  console.log(`Gemini proxy server running on http://localhost:${PORT}`);
});
