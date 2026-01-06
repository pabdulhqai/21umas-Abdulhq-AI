
import React, { useEffect, useState } from 'react';
import { geminiService } from '../services/geminiService';
import { Newspaper, RefreshCw, ExternalLink, Calendar } from 'lucide-react';

const NewsHub: React.FC = () => {
  const [news, setNews] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const loadNews = async () => {
    setLoading(true);
    const result = await geminiService.fetchLatestNews();
    setNews(result.text);
    setLoading(false);
  };

  useEffect(() => {
    loadNews();
  }, []);

  return (
    <div className="glass rounded-[2.5rem] p-8 border-none relative overflow-hidden shadow-2xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
            <Newspaper size={24} />
          </div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">نبض الجامعة الحي</h3>
        </div>
        <button 
          onClick={loadNews}
          className={`p-2 hover:bg-slate-100 rounded-xl transition-all ${loading ? 'animate-spin' : ''}`}
        >
          <RefreshCw size={20} className="text-slate-400" />
        </button>
      </div>

      <div className="flex-1 relative z-10 custom-scrollbar overflow-y-auto">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse flex gap-4 p-4 rounded-2xl bg-white/50">
                <div className="w-16 h-16 bg-slate-200 rounded-xl shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
              </div>
            ))}
            <p className="text-center text-xs text-emerald-600 font-bold">جاري الاتصال بالموقع الرسمي للجامعة...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-white/40 p-6 rounded-3xl border border-white">
              {news}
            </div>
            <div className="flex items-center justify-center gap-2 py-4">
               <Calendar size={14} className="text-emerald-500" />
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">محدث تلقائياً من 21umas.edu.ye</span>
            </div>
          </div>
        )}
      </div>

      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
         <Newspaper size={200} />
      </div>
    </div>
  );
};

export default NewsHub;
