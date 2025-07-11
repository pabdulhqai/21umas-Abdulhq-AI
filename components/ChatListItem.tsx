import React, { useState, useRef, useEffect } from 'react';
import type { ChatSummary } from '../types.ts';
import { DeleteIcon, EditIcon, CheckIcon } from './Icons.tsx';

interface ChatListItemProps {
    chat: ChatSummary;
    isActive: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onRename: (id: string, newTitle: string) => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ chat, isActive, onSelect, onDelete, onRename }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(chat.title);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);
    
     useEffect(() => {
        if (!isEditing) {
            setTitle(chat.title);
        }
    }, [chat.title, isEditing]);


    const handleRename = () => {
        if (title.trim()) {
            onRename(chat.id, title.trim());
        } else {
            setTitle(chat.title);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleRename();
        } else if (e.key === 'Escape') {
            setTitle(chat.title);
            setIsEditing(false);
        }
    };

    return (
        <div 
            className={`
                group flex items-center justify-between p-2 rounded-lg cursor-pointer
                transition-colors duration-200
                ${isActive ? 'bg-slate-700' : 'hover:bg-slate-800'}
            `}
            onClick={() => !isEditing && onSelect()}
        >
            {isEditing ? (
                <input
                    ref={inputRef}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleRename}
                    onKeyDown={handleKeyDown}
                    className="bg-transparent text-sm w-full outline-none ring-1 ring-cyan-500 rounded px-1 py-0.5"
                />
            ) : (
                <p className="text-sm truncate text-slate-300">{title}</p>
            )}

            <div className={`flex items-center ${isEditing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                {isEditing ? (
                    <button onClick={handleRename} className="p-1 rounded hover:bg-slate-600">
                        <CheckIcon className="w-4 h-4 text-green-400" />
                    </button>
                ) : (
                    <>
                        <button onClick={() => setIsEditing(true)} className="p-1 rounded hover:bg-slate-600">
                            <EditIcon className="w-4 h-4 text-slate-400" />
                        </button>
                         <button onClick={onDelete} className="p-1 rounded hover:bg-slate-600">
                            <DeleteIcon className="w-4 h-4 text-slate-400" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatListItem;