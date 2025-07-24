import React from 'react';

const HistorySidebar = ({ history, setPromptFromHistory, isOpen, toggleSidebar, onDelete, onNewChat }) => {
  return (
    <div className={`fixed top-0 right-0 h-full bg-white w-80 shadow-lg transform ${
      isOpen ? "translate-x-0" : "translate-x-full"
    } transition-transform duration-300 ease-in-out z-20`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Search History</h2>
          <div className="flex items-center gap-2">
            <button
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              onClick={onNewChat}
            >
              ＋
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800" onClick={toggleSidebar}>
              ✖
            </button>
          </div>
        </div>
        {history.length === 0 ? (
          <p className="text-gray-600">No searches yet</p>
        ) : (
          <ul className="space-y-4">
            {history.map((session, sessionIndex) => (
              <li key={session.sessionId} className="border-b pb-2">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Session {sessionIndex + 1}
                </h3>
                <ul className="space-y-2">
                  {session.prompts.map(({ prompt }, promptIndex) => (
                    <li key={promptIndex} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                      <span
                          className="truncate cursor-pointer"
                          onClick={() => setPromptFromHistory(session.sessionId)}
                      >
                        {prompt}
                      </span>

                      <button
                        className="text-red-500"
                        onClick={() => onDelete(session.sessionId, promptIndex)}
                      >
                        🗑
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HistorySidebar;
