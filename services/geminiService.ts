// هذا ملف عميل: يستدعي دوال السيرفليس على نفس الدومين (Vercel)
// يحتفظ بنفس واجهة الدوال المستخدمة في المكوّنات: fetchLatestNews, chatPro, analyzeVision

type AIResult = { text: string, sources?: any[] };

async function safeFetchJson(url: string, init?: RequestInit) {
  const resp = await fetch(url, init);
  const text = await resp.text().catch(() => '');
  try {
    const json = text ? JSON.parse(text) : {};
    if (!resp.ok) throw { status: resp.status, body: json };
    return json;
  } catch (err) {
    // إذا الرد ليس JSON أو فشل، أعِد الخطأ مع نص الرد
    if (!resp.ok) throw { status: resp.status, message: text || 'Request failed' };
    return {};
  }
}

export const geminiService = {
  async fetchLatestNews(): Promise<AIResult> {
    try {
      const json = await safeFetchJson('/api/geminiNews', { method: 'GET' });
      return { text: json.text || '', sources: json.sources || [] };
    } catch (err: any) {
      console.error('fetchLatestNews error:', err);
      return { text: 'فشل تحديث الأخبار تلقائياً.', sources: [] };
    }
  },

  async chatPro(prompt: string, history: any[] = []): Promise<AIResult> {
    try {
      const body = { prompt, history };
      const json = await safeFetchJson('/api/geminiChat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      return { text: json.text || 'لم يتم استلام رد.', sources: json.sources || [] };
    } catch (err: any) {
      console.error('chatPro error:', err);
      return { text: 'حدث خطأ في النظام الذكي.', sources: [] };
    }
  },

  async analyzeVision(imageBuffer: string, prompt: string) {
    try {
      const body = { imageBuffer, mimeType: 'image/jpeg', prompt };
      const json = await safeFetchJson('/api/geminiVision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      return json.text || 'فشل التحليل.';
    } catch (err: any) {
      console.error('analyzeVision error:', err);
      return 'حدث خطأ أثناء تحليل الصورة.';
    }
  }
};
