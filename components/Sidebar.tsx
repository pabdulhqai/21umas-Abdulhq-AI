import React from 'react';
import type { ChatSummary } from '../types.ts';
import { DeleteIcon, NewChatIcon, AnnouncementsIcon } from './Icons.tsx';
import ChatListItem from './ChatListItem.tsx';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    chats: ChatSummary[];
    activeChatId: string | null;
    onNewChat: () => void;
    onSelectChat: (id: string) => void;
    onDeleteChat: (id: string) => void;
    onRenameChat: (id: string, newTitle: string) => void;
    onClearAll: () => void;
    currentView: 'chat' | 'announcements';
    setCurrentView: (view: 'chat' | 'announcements') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
    isOpen, 
    setIsOpen, 
    chats, 
    activeChatId, 
    onNewChat, 
    onSelectChat,
    onDeleteChat,
    onRenameChat,
    onClearAll,
    currentView,
    setCurrentView
}) => {

    const handleNewChat = () => {
        setCurrentView('chat');
        onNewChat();
        if (window.innerWidth < 768) {
            setIsOpen(false);
        }
    };

    const handleSelectChat = (id: string) => {
        setCurrentView('chat');
        onSelectChat(id);
         if (window.innerWidth < 768) {
            setIsOpen(false);
        }
    }

    const handleAnnouncementsClick = () => {
        setCurrentView('announcements');
        if (window.innerWidth < 768) {
            setIsOpen(false);
        }
    };

    return (
        <>
            <div className={`
                bg-slate-900 
                h-full 
                flex flex-col
                transition-all duration-300 ease-in-out
                ${isOpen ? 'w-64' : 'w-0'}
                overflow-hidden
                flex-shrink-0
                max-md:absolute max-md:z-20
            `}>
                <div className="p-4 flex-shrink-0 border-b border-slate-800">
                    <button 
                        onClick={handleNewChat}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
                    >
                       <NewChatIcon className="w-5 h-5"/>
                        New Chat
                    </button>
                </div>
                <nav className="flex-1 overflow-y-auto p-2">
                    <button
                        onClick={handleAnnouncementsClick}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors mb-2 ${
                            currentView === 'announcements'
                                ? 'bg-slate-700 text-white'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                        }`}
                    >
                        <AnnouncementsIcon className="w-5 h-5" />
                        <span>Announcements</span>
                    </button>

                    {chats.length > 0 && <div className="px-2 pt-2 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Chats</div>}
                    
                    <div className="space-y-1">
                        {chats.map(chat => (
                            <ChatListItem 
                                key={chat.id}
                                chat={chat}
                                isActive={chat.id === activeChatId && currentView === 'chat'}
                                onSelect={() => handleSelectChat(chat.id)}
                                onDelete={() => onDeleteChat(chat.id)}
                                onRename={onRenameChat}
                            />
                        ))}
                    </div>
                </nav>
                 <footer className="p-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800">
                    <div>
                      <p>Abdulhq v3.5</p>
                      <p>Developed with vision.</p>
                    </div>
                    <button onClick={onClearAll} className="p-2 rounded-full hover:bg-slate-700 transition-colors" title="Delete all chats">
                        <DeleteIcon className="w-5 h-5 text-slate-400" />
                    </button>
                </footer>
            </div>
            {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/50 z-10 md:hidden"></div>}
        </>
    );
};

export default Sidebar;
