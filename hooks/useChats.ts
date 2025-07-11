import { useState, useEffect, useCallback } from 'react';
import useLocalStorageState from './useLocalStorageState.ts';
import { LOCAL_STORAGE_KEYS, GREETING_MESSAGE } from '../constants.ts';
import type { ChatSummary, ChatMessage } from '../types.ts';

export const useChats = () => {
    const [chats, setChats] = useLocalStorageState<ChatSummary[]>(LOCAL_STORAGE_KEYS.CHATS, []);
    const [activeChatId, setActiveChatId] = useLocalStorageState<string | null>(LOCAL_STORAGE_KEYS.ACTIVE_CHAT_ID, null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    // Effect to initialize or set the very first chat
    useEffect(() => {
        if (chats.length === 0) {
            handleNewChat();
        } else if (!activeChatId || !chats.some(c => c.id === activeChatId)) {
            setActiveChatId(chats[0]?.id ?? null);
        }
    }, []); 

    // Load messages for the active chat from localStorage
    useEffect(() => {
        if (!activeChatId) {
            setMessages([]);
            return;
        };

        try {
            const savedMessages = localStorage.getItem(`${LOCAL_STORAGE_KEYS.MESSAGES_PREFIX}${activeChatId}`);
            setMessages(savedMessages ? JSON.parse(savedMessages) : [{ ...GREETING_MESSAGE, id: `ai-${Date.now()}` }]);
        } catch (error) {
            console.error(`Failed to load messages for chat ${activeChatId}:`, error);
            setMessages([{ ...GREETING_MESSAGE, id: `ai-${Date.now()}` }]);
        }
    }, [activeChatId]);

    // Save messages to localStorage whenever they change for the active chat
    useEffect(() => {
        if (activeChatId && messages.length > 0) {
            localStorage.setItem(`${LOCAL_STORAGE_KEYS.MESSAGES_PREFIX}${activeChatId}`, JSON.stringify(messages));
        } else if (activeChatId && messages.length === 0) {
             // If messages are cleared, remove from storage
            localStorage.removeItem(`${LOCAL_STORAGE_KEYS.MESSAGES_PREFIX}${activeChatId}`);
        }
    }, [messages, activeChatId]);
    
    const handleNewChat = useCallback(() => {
        const newChatId = `chat-${Date.now()}`;
        const newChat: ChatSummary = { id: newChatId, title: 'New Conversation', createdAt: Date.now() };
        setChats(prev => [newChat, ...prev]);
        setActiveChatId(newChatId);
    }, [setChats, setActiveChatId]);

    const handleDeleteChat = useCallback((chatId: string) => {
        if (!window.confirm("Are you sure you want to delete this conversation?")) return;
        
        const remainingChats = chats.filter(c => c.id !== chatId);
        setChats(remainingChats);
        localStorage.removeItem(`${LOCAL_STORAGE_KEYS.MESSAGES_PREFIX}${chatId}`);
        
        if (activeChatId === chatId) {
            if (remainingChats.length > 0) {
                setActiveChatId(remainingChats[0].id);
            } else {
                handleNewChat();
            }
        }
    }, [chats, activeChatId, setChats, setActiveChatId, handleNewChat]);

    const handleRenameChat = useCallback((chatId: string, newTitle: string) => {
        setChats(prev => prev.map(c => c.id === chatId ? { ...c, title: newTitle } : c));
    }, [setChats]);

    const handleClearAll = useCallback(() => {
        if (window.confirm("Are you sure you want to delete ALL chat history? This cannot be undone.")) {
            chats.forEach(chat => {
                localStorage.removeItem(`${LOCAL_STORAGE_KEYS.MESSAGES_PREFIX}${chat.id}`);
            });
            setChats([]);
            setActiveChatId(null);
            handleNewChat();
        }
    }, [chats, setChats, setActiveChatId, handleNewChat]);

    return {
        chats,
        activeChatId,
        messages,
        setMessages,
        handleNewChat,
        setActiveChatId,
        handleDeleteChat,
        handleRenameChat,
        handleClearAll,
    };
};
