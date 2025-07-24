const axios = require("axios");

const callOllama = async (enhancedPrompt) => {
  try {
    const ollamaApiUrl = "http://localhost:11434/api/generate";

    const ollamaModel = "phi3";

    const payload = {
      model: ollamaModel,
      prompt: enhancedPrompt,
      stream: false,
      options: { temperature: 0.1 },
    };

    const response = await axios.post(ollamaApiUrl, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data.response;
  } catch (err) {
    console.error(`Error communicating with Ollama: ${err.message}`);
    throw new Error("Failed to get response from Ollama.");
  }
};

module.exports = callOllama;
