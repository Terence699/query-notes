'use client';

// Define the type for a session object
type Session = {
  id: number;
  title: string;
  created_at: string;
};

function Spinner() {
  return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>;
}

function ErrorIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CloseIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

export default function QASidebar({
  isOpen,
  onClose,
  onLoadSession,
  isSessionLoading,
  sessions,
  isSessionsLoading,
  sessionsError,
  onRetry,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLoadSession: (sessionId: number) => void;
  isSessionLoading: number | null;
  sessions: Session[] | null;
  isSessionsLoading: boolean;
  sessionsError: string | null;
  onRetry: () => void;
}) {

  if (!isOpen) {
    return null;
  }

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-white z-10 flex flex-col transform transition-transform duration-300 ease-in-out">
      <header className="flex-shrink-0 flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-gray-800">Chat History</h3>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200" title="Close History">
          <CloseIcon />
        </button>
      </header>
      <main className="flex-grow p-4 overflow-y-auto">
        {isSessionsLoading ? (
          <div className="flex justify-center items-center h-full"><Spinner /></div>
        ) : sessionsError ? (
          <div className="flex flex-col justify-center items-center h-full text-center text-red-500">
            <ErrorIcon />
            <p className="mt-2">{sessionsError}</p>
            <button
              onClick={onRetry}
              className="mt-4 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : sessions && sessions.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            No history found.
          </div>
        ) : sessions && (
          <ul>
            {sessions.map(session => (
              <li key={session.id} className="mb-2">
                <button
                  onClick={() => onLoadSession(session.id)}
                  disabled={isSessionLoading === session.id}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors flex justify-between items-center disabled:opacity-50"
                >
                  <div>
                    <p className="font-medium text-gray-800 truncate">{session.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(session.created_at).toLocaleString()}
                    </p>
                  </div>
                  {isSessionLoading === session.id && <Spinner />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
} 