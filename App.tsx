import React, { useState, useRef, useCallback } from 'react';
import type { Content, Part } from '@google/genai';
import ChatInterface from './components/ChatInterface.tsx';
import Sidebar from './components/Sidebar.tsx';
import Header from './components/Header.tsx';
import Announcements from './components/Announcements.tsx';
import { useChats } from './hooks/useChats.ts';
import { sendMessageStreamToAI } from './services/geminiService.ts';
import { Sender, type ChatMessage, type ChatMessageFile } from './types.ts';
import { toBase64, generateChatTitle } from './utils.ts';

const App: React.FC = () => {
    const {
        chats,
        activeChatId,
        messages,
        setMessages,
        handleNewChat,
        setActiveChatId,
        handleDeleteChat,
        handleRenameChat,
        handleClearAll,
    } = useChats();

    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
    const [internetAccess, setInternetAccess] = useState(false);
    const [currentView, setCurrentView] = useState<'chat' | 'announcements'>('chat');
    
    const abortControllerRef = useRef<AbortController | null>(null);

    const handleSend = useCallback(async (text: string, file: File | null, baseMessages?: ChatMessage[]) => {
        if ((!text.trim() && !file) || isLoading || !activeChatId) return;

        setIsLoading(true);
        abortControllerRef.current = new AbortController();

        const sourceMessages = baseMessages ?? messages;

        let fileData: ChatMessageFile | undefined = undefined;
        if (file) {
            try {
                const base64Data = await toBase64(file);
                fileData = { name: file.name, type: file.type, base64Data };
            } catch (error) {
                console.error("Error converting file to Base64:", error);
                setIsLoading(false);
                // Optionally show an error message to the user
                return;
            }
        }

        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            text,
            sender: Sender.USER,
            file: fileData,
        };
        
        const updatedMessages = [...sourceMessages, userMessage];
        setMessages(updatedMessages);

        const history: Content[] = updatedMessages
            .filter(msg => msg.id !== 'initial-greeting')
            .map((msg: ChatMessage): Content => {
                const parts: Part[] = [];
                if (msg.text) parts.push({ text: msg.text });
                if (msg.file) {
                    parts.push({ inlineData: { mimeType: msg.file.type, data: msg.file.base64Data } });
                }
                return { role: msg.sender === Sender.USER ? 'user' : 'model', parts };
            }).filter(content => content.parts.length > 0);
        
        const isNewChat = sourceMessages.length <= 1 && sourceMessages[0]?.id === 'initial-greeting';
        
        if (isNewChat && text.trim()) {
            const newTitle = generateChatTitle(text);
            handleRenameChat(activeChatId, newTitle);
        }

        const aiMessageId = `ai-${Date.now() + 1}`;
        const aiMessagePlaceholder: ChatMessage = {
            id: aiMessageId,
            text: '▋',
            sender: Sender.AI,
        };
        setMessages(prev => [...prev, aiMessagePlaceholder]);

        try {
            const stream = await sendMessageStreamToAI(
                history.slice(0, -1), // History does not include the current user message
                text, fileData, internetAccess, abortControllerRef.current.signal
            );

            let fullResponse = "";
            let finalGroundingMetadata = null;

            for await (const chunk of stream) {
                fullResponse += chunk.text;
                finalGroundingMetadata = chunk.groundingMetadata ?? finalGroundingMetadata;
                setMessages(prev => prev.map(msg => 
                    msg.id === aiMessageId ? { ...msg, text: fullResponse + '▋' } : msg
                ));
            }

            setMessages(prev => prev.map(msg => 
                msg.id === aiMessageId ? { ...msg, text: fullResponse, groundingMetadata: finalGroundingMetadata } : msg
            ));
            
        } catch (error: any) {
            if (error.name !== 'AbortError') {
                console.error("Error sending message to AI:", error);
                const errorMessage = "I seem to be encountering a technical difficulty. My apologies. Please try again in a few moments.";
                setMessages(prev => prev.map(msg => msg.id === aiMessageId ? { ...msg, text: errorMessage, sender: Sender.SYSTEM } : msg));
            } else {
                 setMessages(prev => prev.map(msg => 
                    msg.id === aiMessageId ? { ...msg, text: msg.text.replace('▋','') + ' [Stopped]' } : msg
                ));
            }
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    }, [isLoading, activeChatId, messages, internetAccess, setMessages, handleRenameChat]);

    const handleStop = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    };

    const handleDeleteMessage = (messageId: string) => {
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
    };
    
    const handleRegenerate = useCallback(async (aiMessageId: string) => {
        if (isLoading) return;

        const messageIndex = messages.findIndex(msg => msg.id === aiMessageId);
        if (messageIndex === -1) return;

        let lastUserMessageIndex = -1;
        for (let i = messageIndex - 1; i >= 0; i--) {
            if (messages[i].sender === Sender.USER) {
                lastUserMessageIndex = i;
                break;
            }
        }

        if (lastUserMessageIndex === -1) {
            console.error("Cannot regenerate: No preceding user message found in the conversation history.");
            return;
        }

        const userMessageToResend = messages[lastUserMessageIndex];
        const historyToResend = messages.slice(0, lastUserMessageIndex);

        let fileToSend: File | null = null;
        if (userMessageToResend.file) {
            try {
                const res = await fetch(`data:${userMessageToResend.file.type};base64,${userMessageToResend.file.base64Data}`);
                const blob = await res.blob();
                fileToSend = new File([blob], userMessageToResend.file.name, { type: userMessageToResend.file.type });
            } catch (error) {
                console.error("Error reconstructing file for regeneration:", error);
            }
        }

        // Remove the AI message that is being regenerated before resending
        setMessages(prev => prev.filter(msg => msg.id !== aiMessageId));

        await handleSend(userMessageToResend.text, fileToSend, historyToResend);

    }, [messages, isLoading, handleSend, setMessages]);


    return (
        <div className="min-h-screen bg-slate-950 text-white flex font-sans">
            <Sidebar 
                isOpen={isSidebarOpen}
                setIsOpen={setSidebarOpen}
                chats={chats}
                activeChatId={activeChatId}
                onNewChat={handleNewChat}
                onSelectChat={setActiveChatId}
                onDeleteChat={handleDeleteChat}
                onRenameChat={handleRenameChat}
                onClearAll={handleClearAll}
                currentView={currentView}
                setCurrentView={setCurrentView}
            />
            <div className="flex-1 flex flex-col h-screen">
                <Header 
                    isLoading={isLoading}
                    onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
                />
                {currentView === 'chat' ? (
                    <ChatInterface
                        messages={messages}
                        isLoading={isLoading}
                        onSend={handleSend}
                        onDelete={handleDeleteMessage}
                        onRegenerate={handleRegenerate}
                        onStop={handleStop}
                        internetAccess={internetAccess}
                        setInternetAccess={setInternetAccess}
                    />
                ) : (
                    <Announcements />
                )}
            </div>
        </div>
    );
};

export default App;