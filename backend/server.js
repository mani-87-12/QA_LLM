const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { callGroq } = require("./groq");
const { callGemini } = require("./gemini");
const { markdownToCleanHtml } = require("./format");
const classifyPromptType = require("./classyfing_prompt");
const { constructEnhancedPrompt } = require("./enhacing_prompt");
const { getEmbedding, calculateCosineSimilarity } =
  require("./embedding_cosine").default;
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.post("/ask", async (req, res) => {
  let { prompt } = req.body;
  console.log(`Received prompt: ${prompt}`);

  if (!prompt || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const cleanedPrompt = prompt.trim();

  const classifiedPrompt = await classifyPromptType(cleanedPrompt);
  console.log(`Classified prompt : ${classifiedPrompt}`);
  const enhancedPrompt = constructEnhancedPrompt(
    cleanedPrompt,
    classifiedPrompt
  );
  console.log(`Enhanced prompt : ${enhancedPrompt}`);

  const [gemini, groq] = await Promise.all([
    callGemini(enhancedPrompt),
    callGroq(enhancedPrompt),
  ]);

  const similarities = [];
  if (gemini && groq) {
    try {
      const geminiEmb = await getEmbedding(gemini);
      const grokEmb = await getEmbedding(groq);

      const similarityScore = calculateCosineSimilarity(geminiEmb, grokEmb);

      similarities.push({
        pair: "gemini-grok",
        score: parseFloat(similarityScore.toFixed(2)),
      });
    } catch (e) {
      console.error("Error calculating Gemini-Grok similarity:", e.message);
      similarities.push({ pair: "gemini-grok", error: e.message });
    }
  }

  const geminiFormattedHtml = markdownToCleanHtml(gemini);
  const groqFormattedHtml = markdownToCleanHtml(groq);

  res.status(200).json({
    gemini: geminiFormattedHtml,
    grok: groqFormattedHtml,
    cosine_similarity: similarities,
  });
});

// const startServer = async () => {
//   try {
//     await getLLMInstance();
//     app.listen(PORT, () => {
//       console.log(`Server running on http://localhost:${PORT}`);
//     });
//   } catch (error) {
//     console.error("Failed to start server:", error);
//     process.exit(1);
//   }
// };

// startServer();

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
