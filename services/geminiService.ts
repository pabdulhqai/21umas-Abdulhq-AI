
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async fetchLatestNews() {
    try {
      // استخدام Gemini 3 Pro لجلب الأخبار الحية وتنسيقها كـ JSON
      const response = await this.ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: "استخرج آخر 4 أخبار أو إعلانات رسمية من موقع جامعة 21 سبتمبر (https://21umas.edu.ye/). ركز على الأخبار الحديثة جداً لعام 2024/2025. قم بصياغة النتيجة بتنسيق نصي يتضمن العنوان، التاريخ المختصر، ورابط المصدر إن وجد.",
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: "أنت محرك جلب بيانات أكاديمي. وظيفتك العثور على أحدث الأخبار من الموقع الرسمي حصراً وتنسيقها بشكل جذاب وقصير."
        },
      });

      return {
        text: response.text || "لا توجد أخبار جديدة حالياً.",
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
      };
    } catch (error) {
      console.error("News Fetch Error:", error);
      return { text: "فشل تحديث الأخبار تلقائياً.", sources: [] };
    }
  }

  async chatPro(prompt: string, history: any[] = []) {
    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: prompt }] }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingBudget: 32768 }
        },
      });

      return {
        text: response.text || "لم يتم استلام رد.",
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
          title: chunk.web?.title || "مصدر أكاديمي",
          uri: chunk.web?.uri || ""
        })) || []
      };
    } catch (error) {
      return { text: "حدث خطأ في النظام الذكي.", sources: [] };
    }
  }

  async analyzeVision(imageBuffer: string, prompt: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: imageBuffer, mimeType: 'image/jpeg' } },
            { text: `كخبير أكاديمي وطبي في جامعة 21 سبتمبر، حلل هذه الوثيقة/الصورة: ${prompt}` }
          ]
        },
      });
      return response.text || "فشل التحليل.";
    } catch (error) {
      return "حدث خطأ أثناء تحليل الصورة.";
    }
  }
}

export const geminiService = new GeminiService();
