export class GeminiService {
  async fetchLatestNews() {
    try {
      const res = await fetch('/api/news', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) {
        console.error('fetchLatestNews failed', await res.text());
        return { text: 'فشل تحديث الأخبار تلقائياً.', sources: [] };
      }
      return await res.json();
    } catch (error) {
      console.error('fetchLatestNews Error:', error);
      return { text: 'فشل تحديث الأخبار تلقائياً.', sources: [] };
    }
  }

  async chatPro(prompt: string, history: any[] = []) {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, history })
      });
      if (!res.ok) {
        const body = await res.text();
        console.error('chatPro failed', body);
        return { text: 'حدث خطأ في النظام الذكي.', sources: [] };
      }
      return await res.json();
    } catch (error) {
      console.error('chatPro Error:', error);
      return { text: 'حدث خطأ في النظام الذكي.', sources: [] };
    }
  }
}

export const geminiService = new GeminiService();
