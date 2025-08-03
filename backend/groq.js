const Groq = require("groq-sdk");
require("dotenv").config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const groq = new Groq({ apiKey: GROQ_API_KEY });

async function callGroq(prompt) {
  if (!GROQ_API_KEY) return "No Grok API key configured";

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    return response.choices[0]?.message?.content || "No Grok response";
  } catch (error) {
    console.error("Grok API error:", error);
    return `Grok Error: ${error.message || error.toString()}`;
  }
}

module.exports = { callGroq };
