
import React, { useState } from 'react';
import Layout from './components/Layout';
import ChatAssistant from './components/ChatAssistant';
import VisionTool from './components/VisionTool';
import LiveAssistant from './components/LiveAssistant';
import NewsHub from './components/NewsHub';
import { UNIVERSITY_CONFIG } from './constants';
import { Search, GraduationCap, Building, Users, ArrowUpRight, BookOpen, Stethoscope, Sparkles, Zap } from 'lucide-react';

const DashboardHome: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative">
        <div className="relative z-10">
          <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full w-fit mb-4 border border-emerald-200">
            <Sparkles size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">الجيل الثالث v3.0 Ultra</span>
          </div>
          <h2 className="text-5xl font-black text-slate-900 mb-4 leading-tight">
            مستقبل الطب <br /> يكتمل هنا بـ <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">AI Nexus</span>
          </h2>
          <p className="text-slate-500 font-medium max-w-lg text-lg">
            منصتك الذكية المتكاملة للوصول الفوري لأخبار الجامعة، التحليلات الطبية، والإرشاد الأكاديمي المتقدم.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
           <button className="flex flex-col items-center justify-center p-6 glass rounded-3xl hover:bg-emerald-600 hover:text-white transition-all group border-none shadow-xl">
              <Zap className="mb-2 text-emerald-500 group-hover:text-white" />
              <span className="text-xs font-black">القبول الفوري</span>
           </button>
           <button className="flex flex-col items-center justify-center p-6 glass rounded-3xl hover:bg-blue-600 hover:text-white transition-all group border-none shadow-xl">
              <BookOpen className="mb-2 text-blue-500 group-hover:text-white" />
              <span className="text-xs font-black">المكتبة الرقمية</span>
           </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'دقة المحرك الذكي', value: '99.8%', icon: Sparkles, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'تحديثات الموقع', value: 'بث حي مباشر', icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'الأبحاث المدعومة', value: 'تغطية عالمية', icon: Search, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'سرعة الاستجابة', value: '< 0.5s', icon: Stethoscope, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="glass p-8 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all border-none group cursor-default">
            <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <stat.icon size={28} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Grid: News Hub & Special Call to Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
           <NewsHub />
        </div>

        <div className="space-y-6">
          <div className="medical-gradient text-white rounded-[3rem] p-10 shadow-2xl flex flex-col justify-between group overflow-hidden relative min-h-[400px]">
             <div className="relative z-10">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-8">
                   <GraduationCap size={40} />
                </div>
                <h3 className="text-3xl font-black mb-6 leading-tight">بوابة التميز <br /> الأكاديمي 2025</h3>
                <p className="text-emerald-50 mb-10 font-medium leading-relaxed opacity-90">
                  انطلق الآن مع المساعد الصوتي المتقدم، المبرمج لخدمة طلاب جامعة 21 سبتمبر حصرياً.
                </p>
             </div>
             <button className="relative z-10 w-full py-5 bg-white text-emerald-900 rounded-[1.5rem] font-black hover:bg-emerald-50 transition-all shadow-2xl active:scale-95">
                ابدأ رحلتك الآن
             </button>
             <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-400/20 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000"></div>
          </div>

          <div className="glass rounded-[2rem] p-6 border-none shadow-lg">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                   <Users size={20} />
                </div>
                <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase">مجتمع الطلاب</p>
                   <p className="text-sm font-black text-slate-700">أكثر من 15,000 طالب</p>
                </div>
             </div>
             <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[85%] rounded-full animate-pulse"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'chat': return <ChatAssistant />;
      case 'live': return <LiveAssistant />;
      case 'vision': return <VisionTool />;
      case 'advisor': return <div className="text-center p-20 glass rounded-3xl text-slate-400 font-bold">نظام الإرشاد المتقدم v3 Ultra قيد التحميل...</div>;
      default: return <DashboardHome />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
