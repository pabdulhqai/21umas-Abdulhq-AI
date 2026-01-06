
import React from 'react';
import { LayoutDashboard, MessageSquare, Microscope, GraduationCap, Search, Menu, X, Radio, Beaker, Zap, ShieldAlert } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const menuItems = [
    { id: 'home', label: 'مركز القيادة', icon: LayoutDashboard },
    { id: 'chat', label: 'مساعد PRO Ultra', icon: MessageSquare },
    { id: 'live', label: 'الاستماع المباشر', icon: Radio },
    { id: 'vision', label: 'مختبر الرؤية', icon: Beaker },
    { id: 'advisor', label: 'المستشار الأكاديمي', icon: GraduationCap },
  ];

  return (
    <div className="flex h-screen bg-[#f1f5f9] font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 right-0 z-50 w-80 bg-emerald-950 text-white transform transition-all duration-700 ease-in-out shadow-[0_0_50px_rgba(0,0,0,0.3)]
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col p-8">
          <div className="flex items-center gap-5 mb-16">
            <div className="bg-white p-2.5 rounded-[1.25rem] shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:rotate-6 transition-transform">
              <img src="https://21umas.edu.ye/wp-content/uploads/2021/08/cropped-LOGO-1-1.png" alt="21UMAS" className="w-12 h-12 object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-black leading-none tracking-tight">21UMAS</h1>
              <p className="text-[9px] text-emerald-400 uppercase tracking-[0.3em] font-black mt-1">Nexus v3 Ultra</p>
            </div>
          </div>

          <nav className="flex-1 space-y-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-5 px-6 py-5 rounded-[1.5rem] transition-all duration-500 group relative overflow-hidden ${
                  activeTab === item.id 
                    ? 'bg-white text-emerald-950 shadow-[0_10px_30px_rgba(0,0,0,0.2)] scale-[1.05]' 
                    : 'hover:bg-white/5 text-emerald-100/60 hover:text-white'
                }`}
              >
                <item.icon size={22} className={`${activeTab === item.id ? 'text-emerald-600' : 'text-emerald-500/50 group-hover:text-emerald-400'} transition-colors`} />
                <span className="font-black text-[13px] tracking-wide">{item.label}</span>
                {activeTab === item.id && <div className="absolute left-0 w-1.5 h-full bg-emerald-600 rounded-r-full"></div>}
              </button>
            ))}
          </nav>

          <div className="mt-auto space-y-4">
            <div className="p-6 bg-emerald-900/40 rounded-[2rem] border border-emerald-800/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                 <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                 <span className="text-[10px] font-black uppercase text-emerald-400">حالة النظام</span>
              </div>
              <p className="text-xs font-bold text-white mb-1">المحرك Pro متصل</p>
              <p className="text-[9px] text-emerald-100/50">تمت المزامنة مع الموقع الرسمي</p>
            </div>
            
            <div className="flex items-center justify-between px-2">
               <span className="text-[10px] text-emerald-100/30 font-bold">© 2025 21UMAS AI</span>
               <ShieldAlert size={14} className="text-emerald-100/20" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-24 bg-white/60 backdrop-blur-xl border-b border-white/40 flex items-center justify-between px-10 shrink-0 z-40">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-white shadow-sm rounded-2xl text-emerald-950">
            <Menu size={28} />
          </button>
          
          <div className="flex items-center gap-6">
             <div className="hidden md:flex flex-col items-end">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">توقيت صنعاء</p>
                <p className="text-sm font-black text-slate-800">{new Date().toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' })}</p>
             </div>
             <div className="h-10 w-[1.5px] bg-slate-200 hidden md:block"></div>
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 p-[1px]">
                   <div className="w-full h-full bg-white rounded-[0.9rem] flex items-center justify-center font-black text-emerald-600">AI</div>
                </div>
                <div className="text-right hidden sm:block">
                   <h2 className="text-sm font-black text-slate-800">بوابة الذكاء الفائق</h2>
                   <p className="text-[10px] text-slate-400 font-bold">21UMAS Official Nexus</p>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col items-end mr-6">
                <p className="text-[9px] font-black text-slate-400 uppercase">تنبيهات حية</p>
                <div className="flex items-center gap-2">
                   <Zap size={14} className="text-amber-500" />
                   <span className="text-xs font-bold text-slate-700">التسجيل متاح حالياً</span>
                </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 cursor-pointer hover:bg-white transition-all">
               <Search size={20} />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 md:p-14 custom-scrollbar relative">
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-emerald-50/50 to-transparent pointer-events-none -z-10"></div>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
