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
    // return 'The term "Artificial Intelligence" (AI) was coined by John McCarthy, an American computer scientist and cognitive scientist. \
    // McCarthy first used the term in 1956, at the Dartmouth Summer Research Project on Artificial Intelligence. \
    // He is often credited with coining the term and organizing the first workshop on AI.';
  } catch (error) {
    console.error("Grok API error:", error);
    return `Grok Error: ${error.message || error.toString()}`;
  }
}

module.exports = { callGroq };
