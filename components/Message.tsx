import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage, Sender } from '../types.ts';
import { UserIcon, DeleteIcon, RegenerateIcon, GlobeIcon, CopyIcon } from './Icons.tsx';

interface MessageProps {
  message: ChatMessage;
  onDelete: (messageId: string) => void;
  onRegenerate: (messageId: string) => void;
}

const Message: React.FC<MessageProps> = ({ message, onDelete, onRegenerate }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isAI = message.sender === Sender.AI;

  const handleCopy = () => {
      navigator.clipboard.writeText(message.text).catch(err => console.error('Failed to copy text: ', err));
  }

  const markdownStyles = `prose prose-invert prose-sm max-w-none 
                         prose-p:text-slate-200 prose-headings:text-white 
                         prose-strong:text-white prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                         prose-ul:list-disc prose-ol:list-decimal
                         prose-li:text-slate-300
                         prose-pre:bg-slate-800/50 prose-pre:p-4 prose-pre:rounded-lg
                         prose-code:text-cyan-300 prose-code:font-mono prose-code:before:content-[''] prose-code:after:content-['']`;

  const renderFilePreview = () => {
    if (!message.file) return null;
    const src = `data:${message.file.type};base64,${message.file.base64Data}`;
    return (
      <div className="mt-2">
        <img 
          src={src} 
          alt={message.file.name} 
          className="max-w-xs max-h-48 rounded-lg border-2 border-slate-500 cursor-pointer"
          onClick={() => window.open(src, '_blank')}
        />
      </div>
    );
  };
  
  const renderGroundingSources = () => {
    if (!message.groundingMetadata || message.groundingMetadata.length === 0) return null;
    
    return (
        <div className="mt-4 pt-3 border-t border-slate-600/50">
           <h4 className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-2">
             <GlobeIcon className="w-4 h-4" />
             Sources
           </h4>
           <ul className="space-y-1">
             {message.groundingMetadata.map((chunk: any, index: number) => (
                chunk.web && (
                     <li key={index} className="text-xs">
                         <a 
                             href={chunk.web.uri}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="text-cyan-400 hover:underline truncate block"
                             title={chunk.web.title}
                          >
                            {chunk.web.title || chunk.web.uri}
                         </a>
                     </li>
                )
             ))}
           </ul>
        </div>
    )
  };

  const MessageActions: React.FC<{ messageId: string; isAI: boolean }> = ({ messageId, isAI }) => (
    <div className={`flex items-center gap-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        {isAI && (
             <button onClick={handleCopy} className="p-1.5 rounded-full text-slate-400 hover:bg-slate-500/50 hover:text-slate-200" aria-label="Copy message">
                <CopyIcon className="w-4 h-4" />
            </button>
        )}
        {isAI && message.id !== 'initial-greeting' && (
            <button onClick={() => onRegenerate(messageId)} className="p-1.5 rounded-full text-slate-400 hover:bg-slate-500/50 hover:text-slate-200" aria-label="Regenerate response">
                <RegenerateIcon className="w-4 h-4" />
            </button>
        )}
        {message.id !== 'initial-greeting' && (
          <button onClick={() => onDelete(messageId)} className="p-1.5 rounded-full text-slate-400 hover:bg-slate-500/50 hover:text-slate-200" aria-label="Delete message">
              <DeleteIcon className="w-4 h-4" />
          </button>
        )}
    </div>
  );

  if (isAI) {
    return (
      <div 
        className="group flex items-start space-x-3" 
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
          <p className="text-white font-bold text-lg">A</p>
        </div>
        <div className="flex-1">
            <div className="p-4 bg-slate-700 rounded-lg rounded-tl-none max-w-3xl">
               <div className={markdownStyles}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.text}
                    </ReactMarkdown>
               </div>
               {renderGroundingSources()}
            </div>
        </div>
        <MessageActions messageId={message.id} isAI={true} />
      </div>
    );
  }

  return (
    <div 
        className="group flex items-start justify-end space-x-3"
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
    >
        <MessageActions messageId={message.id} isAI={false} />
      <div className="p-4 bg-blue-600 rounded-lg rounded-br-none max-w-3xl order-1">
        {message.file && renderFilePreview()}
        {message.text && <p className={`text-slate-50 text-sm whitespace-pre-wrap ${message.file ? 'mt-2' : ''}`}>{message.text}</p>}
      </div>
       <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md order-2">
        <UserIcon />
      </div>
    </div>
  );
};

export default Message;