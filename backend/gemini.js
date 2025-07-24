const axios = require("axios");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

async function callGemini(prompt) {
  try {
    const res = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent",
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3 },
      },
      {
        params: { key: GEMINI_API_KEY },
        headers: { "Content-Type": "application/json" },
      }
    );
    return (
      res.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No Gemini response"
    );
    // return 'John McCarthy coined the term "Artificial intelligence" (AI). He did so in 1955, in preparation for the Dartmouth Workshop held in 1956, which is widely considered the founding \
    //   event of the field.';
  } catch (error) {
    console.error("Gemini API error:", error);
    return `Gemini Error: ${error.response?.status || ""} - ${
      error.response?.data?.error?.message || error.message
    }`;
  }
}

module.exports = { callGemini };
