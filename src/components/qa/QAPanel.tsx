'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat, type Message } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import QASidebar from './QASidebar';

// --- Types ---
type Session = {
  id: number;
  title: string;
  created_at: string;
};

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

function HistoryIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
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

function CenteredSpinner() {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
    );
}
// --- End of Icon Components ---

export default function QAPanel({ isOpen, onClose, noteId }: { isOpen: boolean; onClose: () => void; noteId: number; }) {
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [isHistoryOpen, setHistoryOpen] = useState(false);
    // State to manage loading of historical messages
    const [isHistoryLoading, setHistoryLoading] = useState(false);
    const [loadingSessionId, setLoadingSessionId] = useState<number | null>(null);
    // Temporary state to hold incoming session data to avoid race conditions with useChat hook
    const [initialSession, setInitialSession] = useState<{ id: number; messages: Message[] } | null>(null);

    // State for pre-fetching and caching the sessions list
    const [sessions, setSessions] = useState<Session[] | null>(null);
    const [isFetchingSessions, setIsFetchingSessions] = useState(false);
    const [sessionsError, setSessionsError] = useState<string | null>(null);

    const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, error } = useChat({
        id: sessionId?.toString() ?? undefined, // Use sessionId to manage chat history
        api: '/api/chat', // Use the API route
        body: { 
            noteId, 
            sessionId,
        },
        onError: (err) => {
            console.error(err);
            // Optionally add a user-facing error message
        }
    });

    // Effect to pre-fetch sessions when the panel is opened or noteId changes
    useEffect(() => {
        // Only fetch if the panel is open and we don't have sessions yet for this note
        if (isOpen && sessions === null && !isFetchingSessions) {
            setIsFetchingSessions(true);
            setSessionsError(null);
            
            fetch(`/api/sessions?noteId=${noteId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        setSessionsError(data.error);
                    } else {
                        setSessions(data.sessions || []);
                    }
                })
                .catch(err => {
                    console.error('Failed to pre-fetch sessions:', err);
                    setSessionsError('Failed to load chat history.');
                })
                .finally(() => {
                    setIsFetchingSessions(false);
                });
        }
        // Reset sessions if the noteId changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, noteId]);

    // Effect to reset sessions when panel closes or note changes
    useEffect(() => {
      if (!isOpen) {
        setSessions(null);
      }
    }, [isOpen]);

    // Effect to safely load historical messages when a session is selected
    useEffect(() => {
        if (initialSession) {
            setSessionId(initialSession.id);
            setMessages(initialSession.messages);
            setInitialSession(null); // Reset after loading
        }
    }, [initialSession, setMessages]);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when panel opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    const handleNewChat = () => {
        setMessages([]);
        setSessionId(null);
        setHistoryOpen(false); // Close history panel if open
    }

    // Wrapper for handleSubmit to invalidate session cache on new chat
    const customHandleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (sessionId === null) {
            setSessions(null); // Invalidate cache
        }
        handleSubmit(e);
    };

    const handleLoadSession = async (newSessionId: number) => {
        setHistoryLoading(true);
        setLoadingSessionId(newSessionId);
        setHistoryOpen(false);

        try {
            const response = await fetch(`/api/messages?sessionId=${newSessionId}`);
            const data = await response.json();

            if (data.error) {
                // You might want to display this error more gracefully
                alert(`Error loading session: ${data.error}`);
            } else {
                // Use the initialSession pattern to avoid race conditions
                setInitialSession({ id: newSessionId, messages: data.messages || [] });
            }
        } catch (err) {
            console.error('Failed to fetch messages:', err);
            alert('Failed to load chat messages. Please try again.');
        } finally {
            setHistoryLoading(false);
            setLoadingSessionId(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed top-0 right-0 w-96 h-screen bg-white shadow-2xl border-l-2 border-gray-300 flex flex-col z-50">
            <QASidebar
                isOpen={isHistoryOpen}
                onClose={() => setHistoryOpen(false)}
                onLoadSession={handleLoadSession}
                isSessionLoading={loadingSessionId}
                sessions={sessions}
                isSessionsLoading={isFetchingSessions}
                sessionsError={sessionsError}
                onRetry={() => setSessions(null)} // Pass retry handler
            />
            <header className="flex-shrink-0 flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-800">Ask about this note</h3>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200" title="Close"><CloseIcon /></button>
            </header>
            
            <main className="flex-grow p-4 overflow-y-auto bg-white">
                {isHistoryLoading ? (
                    <CenteredSpinner />
                ) : messages.length === 0 ? (
                     <div className="flex items-center justify-center h-full text-gray-500 text-center">
                        <div>
                            <p className="mb-2">I can answer any questions about this note.</p>
                            <p className="text-sm text-gray-400">e.g., &quot;What is the main topic?&quot;</p>
                        </div>
                    </div>
                ) : (
                    messages.map((m, index) => (
                        <div key={m.id || `msg-${index}`} className={`mb-4 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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
                {error && (
                  <div className="mb-4 flex justify-start">
                      <div className="max-w-xs inline-block p-3 rounded-2xl bg-red-100 text-red-700 border border-red-200">
                         <p><strong>Error:</strong> {error.message}</p>
                      </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
            </main>

            <footer className="border-t border-gray-200 p-4 bg-gray-50 flex-shrink-0">
                <form onSubmit={customHandleSubmit} className="flex items-center gap-3">
                    <button type="button" onClick={() => setHistoryOpen(!isHistoryOpen)} className="p-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors" title="History">
                        <HistoryIcon />
                    </button>
                    <button type="button" onClick={handleNewChat} className="p-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-blue-600" title="New Chat">
                        <PlusIcon />
                    </button>
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