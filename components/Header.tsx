import React from 'react';

interface HeaderProps {
    isLoading: boolean;
    onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoading, onToggleSidebar }) => {
    return (
        <header className="p-4 border-b border-slate-700 flex items-center justify-between shrink-0 h-[73px]">
            <div className="flex items-center space-x-3">
                <button onClick={onToggleSidebar} className="p-2 rounded-full hover:bg-slate-700 transition-colors md:hidden" aria-label="Toggle sidebar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-slate-300"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        A
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-100">Abdulhq v3.5</h1>
                        <p className="text-sm text-cyan-400 flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-400 animate-pulse' : 'bg-green-400'}`}></span>
                            {isLoading ? 'Generating...' : 'Online'}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;