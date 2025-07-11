import React, { useRef, useEffect } from 'react';
import type { ChatMessage } from '../types.ts';
import { SUGGESTED_PROMPTS } from '../constants.ts';
import Message from './Message.tsx';
import MessageInput from './MessageInput.tsx';

interface ChatInterfaceProps {
    messages: ChatMessage[];
    isLoading: boolean;
    onSend: (text: string, file: File | null) => void;
    onDelete: (messageId: string) => void;
    onRegenerate: (messageId: string) => void;
    onStop: () => void;
    internetAccess: boolean;
    setInternetAccess: (value: boolean) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isLoading, onSend, onDelete, onRegenerate, onStop, internetAccess, setInternetAccess }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    const handlePromptClick = (prompt: string) => {
        onSend(prompt, null);
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-800">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map(msg => (
                    <Message key={msg.id} message={msg} onDelete={onDelete} onRegenerate={onRegenerate} />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {messages.length <= 1 && !isLoading && (
                <div className="px-6 pb-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        {SUGGESTED_PROMPTS.map(prompt => (
                            <button key={prompt} onClick={() => handlePromptClick(prompt)} className="text-left p-4 bg-slate-900/50 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors duration-200">
                                <p className="font-semibold text-slate-200 mb-1">{prompt.split('?')[0]}?</p>
                                <p className="text-slate-400">{prompt.split(' ')[0]} a specific question...</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <MessageInput 
                isLoading={isLoading}
                onSend={onSend}
                onStop={onStop}
                internetAccess={internetAccess}
                setInternetAccess={setInternetAccess}
            />
        </div>
    );
};

export default ChatInterface;