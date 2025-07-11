import React, { useState, useRef, useEffect } from 'react';
import { AttachmentIcon, CloseIcon, GlobeIcon, StopIcon, SendIcon } from './Icons.tsx';

interface MessageInputProps {
    isLoading: boolean;
    onSend: (text: string, file: File | null) => void;
    onStop: () => void;
    internetAccess: boolean;
    setInternetAccess: (value: boolean) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ isLoading, onSend, onStop, internetAccess, setInternetAccess }) => {
    const [input, setInput] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${scrollHeight}px`;
        }
    }, [input]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            if (selectedFile.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFilePreview(reader.result as string);
                };
                reader.readAsDataURL(selectedFile);
            } else {
                setFilePreview(null);
            }
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setFilePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSendClick = () => {
        if (isLoading || (!input.trim() && !file)) return;
        onSend(input, file);
        setInput('');
        handleRemoveFile();
        textareaRef.current?.focus();
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendClick();
        }
    };

    return (
        <div className="p-4 pt-2 border-t border-slate-700 bg-slate-800">
            {isLoading && (
                <div className="flex justify-center mb-2">
                    <button onClick={onStop} className="flex items-center gap-2 px-4 py-2 text-sm bg-rose-600 hover:bg-rose-700 rounded-full transition-colors text-white">
                        <StopIcon />
                        Stop Generating
                    </button>
                </div>
            )}
            {file && (
                <div className="bg-slate-700/50 p-2 rounded-md mb-2 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 overflow-hidden">
                        {filePreview ? (
                            <img src={filePreview} alt="Preview" className="w-10 h-10 rounded object-cover" />
                        ) : (
                            <div className="w-10 h-10 rounded bg-slate-600 flex items-center justify-center">
                                <AttachmentIcon className="w-5 h-5 text-slate-300" />
                            </div>
                        )}
                        <span className="text-slate-300 truncate">{file.name}</span>
                    </div>
                    <button onClick={handleRemoveFile} className="p-1 rounded-full hover:bg-slate-600">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>
            )}
            <div className="bg-slate-700 rounded-xl p-2 flex items-end w-full">
                <button
                    onClick={() => setInternetAccess(!internetAccess)}
                    className="p-3 rounded-full hover:bg-slate-600 transition-colors self-center"
                    aria-label="Toggle internet access"
                    title="Toggle Google Search"
                >
                    <GlobeIcon className={internetAccess ? 'text-cyan-400' : 'text-slate-400'} />
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="p-3 rounded-full hover:bg-slate-600 transition-colors self-center" aria-label="Attach file">
                    <AttachmentIcon className="text-slate-400" />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/png,image/jpeg,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    capture="environment"
                />
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask Abdulhq, or attach a file..."
                    rows={1}
                    className="flex-grow bg-transparent focus:outline-none resize-none text-slate-200 placeholder-slate-400 px-2 self-center max-h-36"
                    disabled={isLoading}
                />
                <button
                    onClick={handleSendClick}
                    disabled={isLoading || (!input.trim() && !file)}
                    className="w-10 h-10 flex items-center justify-center bg-cyan-500 hover:bg-cyan-600 rounded-full disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200 shrink-0 self-end"
                    aria-label="Send message"
                >
                    <SendIcon />
                </button>
            </div>
        </div>
    );
};

export default MessageInput;