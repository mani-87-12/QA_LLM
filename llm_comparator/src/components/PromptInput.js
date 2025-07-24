import React, { useRef, useState, useEffect } from "react";

const PromptInput = ({
  onSubmit,
  isLoading,
  setPromptFromHistory,
  textareaRef,
}) => {
  const [prompt, setPrompt] = useState("");
  const selectedModels = ["grok", "gemini", "ollama"];

  const handleSubmit = () => {
    if (prompt.trim()) {
      onSubmit(prompt, selectedModels);
      setPrompt("");
    } else {
      alert("Please enter a prompt");
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-t-lg z-10">
      <div className="max-w-3xl mx-auto flex items-center gap-2">
        <textarea
          ref={textareaRef}
          className="flex-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-gray-50"
          rows="1"
          placeholder="Ask a question..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
          disabled={isLoading}
        />
        <button
          className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={handleSubmit}
        >
          ⬆️
        </button>
      </div>
    </div>
  );
};

export default PromptInput;
