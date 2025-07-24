import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";

import PromptInput from "./components/PromptInput";
import ResponseDisplay from "./components/ResponseDisplay";
import HistorySidebar from "./components/HistorySidebar";

const App = () => {
  const [history, setHistory] = useState([]);
  const [currentChatHistory, setCurrentChatHistory] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const responseEndRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSubmit = async (prompt, selectedModels) => {
    if (!prompt.trim()) return;
    setIsLoading(true);

    const newEntry = {
      prompt,
      responses: {
        grok: selectedModels.includes("grok")
          ? ""
          : "No response (model not selected)",
        gemini: selectedModels.includes("gemini")
          ? ""
          : "No response (model not selected)",
      },
    };

    setHistory((prev) => {
      const copy = [...prev];
      const sessionIdx = copy.findIndex(
        (s) => s.sessionId === currentSessionId
      );

      if (sessionIdx !== -1) {
        const promptExists = copy[sessionIdx].prompts.findIndex(
          (p) => p.prompt === prompt
        );
        if (promptExists === -1) {
          copy[sessionIdx].prompts.push(newEntry);
        }
      } else {
        copy.push({ sessionId: currentSessionId, prompts: [newEntry] });
      }

      return copy;
    });

    setCurrentChatHistory((prev) => {
      const exists = prev.find((p) => p.prompt === prompt);
      return exists ? [...prev] : [...prev, newEntry];
    });

    try {
      const response = await axios.post("http://localhost:5000/ask", {
        prompt,
        models: selectedModels,
      });

      const updatedEntry = {
        ...newEntry,
        responses: {
          ...newEntry.responses,
          ...Object.fromEntries(
            Object.entries(response.data).filter(([model]) =>
              selectedModels.includes(model)
            )
          ),
        },
        similarity: response.data.cosine_similarity,
      };

      setHistory((prev) => {
        const copy = [...prev];
        const sessionIdx = copy.findIndex(
          (s) => s.sessionId === currentSessionId
        );
        if (sessionIdx !== -1) {
          const promptIdx = copy[sessionIdx].prompts.findIndex(
            (p) => p.prompt === prompt
          );
          if (promptIdx !== -1) {
            copy[sessionIdx].prompts[promptIdx] = updatedEntry;
          }
        }
        return copy;
      });

      setCurrentChatHistory((prev) => {
        const copy = [...prev];
        const promptIdx = copy.findIndex((p) => p.prompt === prompt);
        if (promptIdx !== -1) {
          copy[promptIdx] = updatedEntry;
        }
        return copy;
      });
    } catch (err) {
      const errorEntry = {
        ...newEntry,
        responses: Object.fromEntries(
          selectedModels.map((m) => [m, "Error: Failed to fetch response"])
        ),
      };

      setHistory((prev) => {
        const copy = [...prev];
        const sessionIdx = copy.findIndex(
          (s) => s.sessionId === currentSessionId
        );
        if (sessionIdx !== -1) {
          const promptIdx = copy[sessionIdx].prompts.findIndex(
            (p) => p.prompt === prompt
          );
          if (promptIdx !== -1) {
            copy[sessionIdx].prompts[promptIdx] = errorEntry;
          }
        }
        return copy;
      });

      setCurrentChatHistory((prev) => {
        const copy = [...prev];
        const promptIdx = copy.findIndex((p) => p.prompt === prompt);
        if (promptIdx !== -1) {
          copy[promptIdx] = errorEntry;
        }
        return copy;
      });
    }

    setIsLoading(false);
  };

  const handleDelete = useCallback(
    (sessionId, promptIndex) => {
      setHistory((prev) => {
        const copy = [...prev];
        const sessionIdx = copy.findIndex((s) => s.sessionId === sessionId);
        if (sessionIdx !== -1) {
          copy[sessionIdx].prompts.splice(promptIndex, 1);
          if (copy[sessionIdx].prompts.length === 0) copy.splice(sessionIdx, 1);
        }
        return copy;
      });

      if (sessionId === currentSessionId) {
        setCurrentChatHistory((prev) =>
          prev.filter((_, i) => i !== promptIndex)
        );
      }
    },
    [currentSessionId]
  );

  const handleNewChat = () => {
    setCurrentChatHistory([]);
    setCurrentSessionId((id) => id + 1);
    setIsHistoryOpen(false);
    if (textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.dispatchEvent(new Event("input"));
    }
  };

  const setPromptFromHistory = (sessionId) => {
    const session = history.find((s) => s.sessionId === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setCurrentChatHistory([...session.prompts]);
      setIsHistoryOpen(false);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 300);
    }
  };

  useEffect(() => {
    if (responseEndRef.current) {
      responseEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChatHistory]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative">
      <div className="absolute top-4 right-4 group">
        <button
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
        >
          History
        </button>
      </div>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="flex justify-center items-center py-6 px-4 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800">
          LLM Response Comparator
        </h1>
      </div>

      <ResponseDisplay history={currentChatHistory} />
      <div ref={responseEndRef} />
      <PromptInput
        onSubmit={handleSubmit}
        isLoading={isLoading}
        setPromptFromHistory={setPromptFromHistory}
        textareaRef={textareaRef}
      />
      <HistorySidebar
        history={history}
        setPromptFromHistory={setPromptFromHistory}
        isOpen={isHistoryOpen}
        toggleSidebar={() => setIsHistoryOpen(!isHistoryOpen)}
        onDelete={handleDelete}
        onNewChat={handleNewChat}
      />
    </div>
  );
};

export default App;
