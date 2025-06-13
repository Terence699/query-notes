'use client';

import { useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- Icon Components ---
function CloseIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

function SendIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
        </svg>
    )
}

function TypingIndicator() {
    return (
        <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse [animation-delay:0.1s]"></div>
            <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse [animation-delay:0.2s]"></div>
        </div>
    )
}
// --- End of Icon Components ---

export default function QAPanel({ isOpen, onClose, noteId }: { isOpen: boolean; onClose: () => void; noteId: number; }) {
    const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
        api: '/api/chat',
        body: { noteId },
        // Clear messages when a new chat starts
        onFinish: () => {
            // This space can be used for any logic after a response is fully received.
        },
        onError: (err) => {
            console.error(err);
            // Optionally, add a custom error message to the chat
        }
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Clear chat history when panel opens
    useEffect(() => {
        if (isOpen) {
            setMessages([]);
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen, setMessages]);

    if (!isOpen) return null;

    return (
        <div className="fixed top-0 right-0 w-96 h-screen bg-white shadow-2xl border-l-2 border-gray-300 flex flex-col z-50">
            <header className="flex-shrink-0 flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-800">Ask about this note</h3>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200" title="Close"><CloseIcon /></button>
            </header>
            
            <main className="flex-grow p-4 overflow-y-auto bg-white">
                {messages.length === 0 ? (
                     <div className="flex items-center justify-center h-full text-gray-500 text-center">
                        <div>
                            <p className="mb-2">I can answer any questions about this note.</p>
                            <p className="text-sm text-gray-400">e.g., &quot;What is the main topic?&quot;</p>
                        </div>
                    </div>
                ) : (
                    messages.map((m) => (
                        <div key={m.id} className={`mb-4 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`prose prose-sm max-w-xs inline-block p-3 rounded-2xl ${m.role === 'user' ? 'bg-blue-600 text-white prose-invert' : 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {m.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    ))
                )}
                 {isLoading && messages[messages.length - 1]?.role === 'user' && (
                    <div className="mb-4 flex justify-start">
                        <div className="max-w-xs inline-block p-3 rounded-2xl bg-gray-100 text-gray-800 border border-gray-200">
                           <TypingIndicator/>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </main>

            <footer className="border-t border-gray-200 p-4 bg-gray-50 flex-shrink-0">
                <form onSubmit={handleSubmit} className="flex items-center gap-3">
                    <input
                        ref={inputRef}
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask a question..."
                        disabled={isLoading}
                        className="flex-grow w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoComplete="off"
                    />
                    <button type="submit" disabled={isLoading || !input} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
                        <SendIcon />
                    </button>
                </form>
            </footer>
        </div>
    );
} 